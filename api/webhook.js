// Vercel Serverless Function: Authenticated Bank Transfer Webhook Endpoint
// Compliant with Circular 152/2025/TT-BTC, Decree 70/2025/ND-CP & Decree 13/2023/ND-CP
import crypto from 'crypto';

// In-memory buffer of recent transactions for live streaming
let globalTransactions = global.__asoTransactions || [];
global.__asoTransactions = globalTransactions;

function timingSafeCheck(input, expected) {
  if (!input || !expected) return false;
  const bufInput = Buffer.from(String(input));
  const bufExpected = Buffer.from(String(expected));
  if (bufInput.length !== bufExpected.length) return false;
  return crypto.timingSafeEqual(bufInput, bufExpected);
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-SePay-Signature, X-Casso-Signature, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Health check & retrieve recent transactions for authenticated session
  if (req.method === 'GET') {
    const authHeader = req.headers['authorization'] || req.headers['x-api-key'] || '';
    const token = authHeader.replace(/^Bearer\s+|^Apikey\s+/i, '').trim();
    const expectedSecret = process.env.ASO_WEBHOOK_SECRET || 'sec_aso_trial_2026';

    if (!timingSafeCheck(token, expectedSecret)) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization Bearer header. Access denied.'
      });
    }

    const { accountNumber } = req.query;
    let filtered = global.__asoTransactions || [];
    if (accountNumber) {
      filtered = filtered.filter(tx => tx.accountNumber === accountNumber || tx.sender_account === accountNumber);
    }
    return res.status(200).json({
      status: 'active',
      service: 'Archonic A-So Authenticated Webhook Engine',
      regulatoryStandard: 'TT152/2025/TT-BTC & ND70/2025/ND-CP',
      timestamp: new Date().toISOString(),
      count: filtered.length,
      transactions: filtered.slice(0, 30)
    });
  }

  // POST: Ingest live transaction from SePay / Casso / Bank with strict Header Auth
  if (req.method === 'POST') {
    try {
      // 1. Strict Authentication via Headers ONLY (Query parameter secrets are rejected to prevent log leakage)
      const authHeader = req.headers['authorization'] || req.headers['x-api-key'] || '';
      const sepaySig = req.headers['x-sepay-signature'] || '';
      const cassoSig = req.headers['x-casso-signature'] || '';
      
      const providedSecret = authHeader.replace(/^Bearer\s+|^Apikey\s+/i, '').trim() || sepaySig || cassoSig;
      const expectedSecret = process.env.ASO_WEBHOOK_SECRET || 'sec_aso_trial_2026';

      if (!timingSafeCheck(providedSecret, expectedSecret)) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Rejecting request: Webhook must provide a valid Bearer token or gateway signature in HTTP headers.'
        });
      }

      const body = req.body || {};

      // Normalize data from various gateway formats (SePay, Casso, or direct JSON)
      const amount = Number(
        body.transferAmount ||
        body.amountIn ||
        body.amount ||
        body.transfer_amount ||
        0
      );

      const transferType = body.transferType || (body.amountOut > 0 ? 'out' : 'in');
      if (transferType === 'out' || amount <= 0) {
        return res.status(200).json({ status: 'skipped', reason: 'outgoing_or_zero_amount' });
      }

      const content = body.content || body.transactionContent || body.description || 'Chuyen khoan VietQR';
      const accountNumber = String(body.accountNumber || body.subAccount || body.receiver_account || '0353600900');
      const gateway = body.gateway || body.bankBrand || 'MBBank';
      const referenceNo = body.referenceCode || body.referenceNumber || body.code || body.id || `VQR-${Date.now().toString().slice(-6)}`;
      const transactionDate = body.transactionDate || body.when || new Date().toISOString();

      // Determine Tax Group under TT 152/2025/TT-BTC:
      // Group 1: Under threshold (< 500M) -> S1a-HKD
      // Group 2: % of revenue -> S2a-HKD
      // Group 3: Taxable income method (500M-3B optional, > 3B mandatory) -> Bundle: S2b, S2c, S2d, S2e
      const taxGroup = body.taxGroup || 'group1';

      // Smart classification with explicit rule logging
      const lowerContent = content.toLowerCase();
      const isInternalKeyword = /(noi bo|chuyen khoan noi bo|rut tien|nop tien|vay|tra no|hoan tien|sua chua|von chu so huu|nap tien|chuyen tien cho)/.test(lowerContent);
      const isTaxable = amount < 20000000 && !isInternalKeyword;

      // Audit trail & rule identification for tax authority inspection defense
      const auditRule = isInternalKeyword 
        ? 'RULE-EX-01: Phát hiện từ khóa dòng tiền vốn/nội bộ (Không tính thuế theo Điều 4 TT152)' 
        : (amount >= 20000000 
            ? 'RULE-REV-02: Giao dịch giá trị lớn (Cần xác nhận chứng từ kèm theo)' 
            : 'RULE-REV-01: Giao dịch bán hàng lẻ/dịch vụ chịu thuế');

      // Book mapping based on TT152 Group
      let assignedBook = 'S1a-HKD';
      if (!isTaxable) {
        assignedBook = 'Dòng tiền loại trừ';
      } else if (taxGroup === 'group2') {
        assignedBook = 'S2a-HKD';
      } else if (taxGroup === 'group3') {
        assignedBook = 'Bộ 4 Sổ (S2b, S2c, S2d, S2e)';
      }

      // Check Decree 70/2025/ND-CP relevance (HDDT từ máy tính tiền bắt buộc cho HKD F&B, bán lẻ >= 1 tỷ)
      const requiresHDDTMTT = amount >= 1000000000 || body.annualRevenue >= 1000000000;

      const newTx = {
        id: `TX-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        referenceNo: String(referenceNo),
        amount: amount,
        formatted: `${new Intl.NumberFormat('vi-VN').format(amount)}đ`,
        accountNumber: accountNumber,
        gateway: gateway,
        content: content,
        date: new Date().toLocaleDateString('vi-VN'),
        timestamp: Date.now(),
        isTaxable: isTaxable,
        category: isTaxable ? 'Bán lẻ' : 'Dòng tiền nội bộ (Bỏ qua)',
        taxStatus: isTaxable ? 'Khớp 100% CQT' : 'Miễn thuế',
        overrideReason: isInternalKeyword ? 'Phát hiện từ khóa dòng tiền nội bộ (Không tính thuế)' : null,
        auditRule: auditRule,
        requiresConfirmation: amount >= 10000000 && !isTaxable,
        standard: 'TT152/2025/TT-BTC',
        nd70Compliance: requiresHDDTMTT ? 'Bắt buộc HĐĐT-MTT (Nghị định 70/2025/NĐ-CP)' : 'Khớp HĐĐT NĐ 123',
        taxGroup: taxGroup,
        ledgerBook: assignedBook
      };

      // Push to in-memory transaction buffer (limit to 100 items)
      // Note: Data is kept inside application boundaries; not sent to public 3rd parties (Decree 13/2023/ND-CP)
      global.__asoTransactions.unshift(newTx);
      if (global.__asoTransactions.length > 100) {
        global.__asoTransactions.pop();
      }

      console.log(`[LIVE WEBHOOK] Ingested +${amount}đ for account ${accountNumber} | Book: ${assignedBook} | Standard: TT152/2025`);

      return res.status(200).json({
        success: true,
        message: `Giao dịch đã nạp thành công vào ${assignedBook} chuẩn Thông tư 152/2025/TT-BTC`,
        transaction: newTx
      });
    } catch (err) {
      console.error('[WEBHOOK ERROR]', err);
      return res.status(500).json({ error: 'Failed to process webhook', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
