// Vercel Serverless Function: Live Bank Transfer Webhook Endpoint
// Compatible with SePay.vn, Casso.vn, and Vietnamese Open Banking Webhooks

// In-memory buffer of recent transactions for live streaming
let globalTransactions = global.__asoTransactions || [];
global.__asoTransactions = globalTransactions;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-SePay-Signature, X-Casso-Signature, X-Signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Health check & retrieve recent live transactions
  if (req.method === 'GET') {
    const { accountNumber } = req.query;
    let filtered = global.__asoTransactions || [];
    if (accountNumber) {
      filtered = filtered.filter(tx => tx.accountNumber === accountNumber || tx.sender_account === accountNumber);
    }
    return res.status(200).json({
      status: 'active',
      service: 'Archonic A-So Live Ingestion Webhook',
      timestamp: new Date().toISOString(),
      count: filtered.length,
      transactions: filtered.slice(0, 30)
    });
  }

  // POST: Ingest live transaction from SePay / Casso / Bank
  if (req.method === 'POST') {
    try {
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

      // Smart classification for tax compliance
      const lowerContent = content.toLowerCase();
      const isInternalKeyword = /(noi bo|chuyen khoan noi bo|rut tien|nop tien|vay|tra no|hoan tien|sua chua|von chu so huu|nap tien|chuyen tien cho)/.test(lowerContent);
      const isTaxable = amount < 20000000 && !isInternalKeyword;

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
        overrideReason: isInternalKeyword ? 'Phát hiện từ khóa dòng tiền nội bộ (Không tính thuế)' : null
      };

      // Push to in-memory transaction buffer (limit to 100 items)
      global.__asoTransactions.unshift(newTx);
      if (global.__asoTransactions.length > 100) {
        global.__asoTransactions.pop();
      }

      // Real-time broadcast to connected client dashboards via Server-Sent Events (SSE)
      const cleanAccount = String(accountNumber).replace(/[^a-zA-Z0-9]/g, '');
      try {
        const payloadStr = JSON.stringify(newTx);
        await Promise.allSettled([
          fetch(`https://ntfy.sh/aso_live_${cleanAccount}`, {
            method: 'POST',
            body: payloadStr
          }),
          fetch('https://ntfy.sh/aso_live_global', {
            method: 'POST',
            body: payloadStr
          })
        ]);
      } catch (broadcastErr) {
        console.warn('[SSE BROADCAST WARNING]', broadcastErr.message);
      }

      console.log(`[LIVE WEBHOOK] Ingested +${amount}đ for account ${accountNumber} | Ref: ${referenceNo}`);

      return res.status(200).json({
        success: true,
        message: 'Live transaction ingested successfully into Archonic A-So S1-HKD ledger',
        transaction: newTx
      });
    } catch (err) {
      console.error('[WEBHOOK ERROR]', err);
      return res.status(500).json({ error: 'Failed to process webhook', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
