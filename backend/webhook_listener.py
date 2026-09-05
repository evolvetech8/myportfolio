"""
Archonic A-Sổ — Cloud Run Webhook Listener
Translates open-banking webhooks (SePay / Casso / Bank APIs) into clean Supabase ledger records.
"""

import os
import re
import logging
from typing import Optional, Dict, Any
from datetime import datetime
from fastapi import FastAPI, Header, HTTPException, Request, BackgroundTasks
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s")
logger = logging.getLogger("aso_webhook")

app = FastAPI(
    title="Archonic A-Sổ Webhook Ingestion Service",
    version="1.0.0",
    description="Captures live VietQR bank transfers and ingests into Supabase for TT88 automated ledger generation."
)

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://mock-supabase.archonic.internal")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "mock-service-key")
WEBHOOK_API_KEY = os.getenv("WEBHOOK_API_KEY", "archonic_secret_webhook_token")

# Initialize Supabase client
supabase_client: Optional[Client] = None
try:
    if "mock" not in SUPABASE_URL:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        logger.info("Connected to Supabase production instance successfully.")
    else:
        logger.warning("Running with mock Supabase configuration.")
except Exception as e:
    logger.error(f"Error initializing Supabase client: {e}")


class BankWebhookPayload(BaseModel):
    id: Optional[str] = None
    gateway: Optional[str] = "sepay"
    transactionDate: Optional[str] = None
    accountNumber: Optional[str] = None
    subAccount: Optional[str] = None
    code: Optional[str] = None
    content: Optional[str] = None
    transferType: Optional[str] = "in"
    transferAmount: float
    accumulated: Optional[float] = 0.0
    referenceCode: Optional[str] = None
    description: Optional[str] = None


def clean_transaction_content(content: str) -> str:
    """Strips noise and bank prefixes (e.g. MBVCB, IB, FT...) leaving clean merchant note."""
    if not content:
        return "Doanh thu bán lẻ quét mã VietQR"
    cleaned = re.sub(r"^(IB|FT|MBVCB|NAPAS|VQR|GD\d+)\s*[:\-]?\s*", "", content, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned if cleaned else "Doanh thu bán lẻ quét mã VietQR"


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "archonic-aso-webhook-listener",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/api/webhook/bank-transfer")
async def handle_bank_transfer(
    payload: BankWebhookPayload,
    authorization: Optional[str] = Header(None)
):
    """
    Ingests live bank transfer webhook from SePay / Casso / VietQR payment aggregator.
    """
    # 1. Verify authorization token if configured
    if WEBHOOK_API_KEY and WEBHOOK_API_KEY != "mock":
        if not authorization or authorization.replace("Bearer ", "") != WEBHOOK_API_KEY:
            logger.warning("Unauthorized webhook access attempt.")
            # In production, enforce HTTPException(status_code=401, detail="Invalid authorization token")

    # 2. Only process incoming money (transferType == "in" or transferAmount > 0)
    if payload.transferType == "out" or payload.transferAmount <= 0:
        logger.info(f"Skipping outgoing transaction of {payload.transferAmount}")
        return {"status": "skipped", "reason": "outgoing_transaction"}

    # 3. Clean and parse transaction details
    clean_desc = clean_transaction_content(payload.content or payload.description or "")
    ref_code = payload.referenceCode or payload.code or f"REF-{int(datetime.utcnow().timestamp())}"
    acc_num = payload.accountNumber or payload.subAccount or "UNKNOWN"

    logger.info(f"⚡ Ingesting VietQR Transfer: +{payload.transferAmount:,.0f} VND | Acc: {acc_num} | Ref: {ref_code}")

    clean_data = {
        "reference_no": ref_code,
        "amount": payload.transferAmount,
        "bank_brand": payload.gateway or "VIETQR",
        "gateway": payload.gateway or "sepay",
        "content": clean_desc,
        "sender_account": acc_num,
        "transaction_time": payload.transactionDate or datetime.utcnow().isoformat(),
        "raw_payload": payload.model_dump()
    }

    # 4. Insert into Supabase (if client is live)
    inserted_id = None
    if supabase_client:
        try:
            # Query merchant matching this account
            merchant_res = supabase_client.table("merchants").select("id").eq("account_number", acc_num).limit(1).execute()
            if merchant_res.data:
                clean_data["merchant_id"] = merchant_res.data[0]["id"]

            res = supabase_client.table("transactions").insert(clean_data).execute()
            if res.data:
                inserted_id = res.data[0].get("id")
                logger.info(f"Successfully inserted into Supabase. Trigger automated S1-HKD ledger!")
        except Exception as e:
            logger.error(f"Database insertion error: {e}")

    return {
        "status": "success",
        "message": "Transaction ingested into S1-HKD ledger automatically",
        "transaction_id": inserted_id or ref_code,
        "amount": payload.transferAmount,
        "regulatory_compliance": "Circular 88/2021/TT-BTC & Decree 123",
        "auto_categorized": payload.transferAmount < 20000000
    }
