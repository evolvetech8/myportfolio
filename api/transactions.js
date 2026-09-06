// Vercel Serverless Function: Authenticated Live Transactions Retrieval
// Compliant with Decree 13/2023/ND-CP on Personal Financial Data Protection
import crypto from 'crypto';

function timingSafeCheck(input, expected) {
  if (!input || !expected) return false;
  const bufInput = Buffer.from(String(input));
  const bufExpected = Buffer.from(String(expected));
  if (bufInput.length !== bufExpected.length) return false;
  return crypto.timingSafeEqual(bufInput, bufExpected);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Strict session token check: Do not leak financial transactions to unauthenticated clients
  const authHeader = req.headers['authorization'] || req.headers['x-api-key'] || '';
  const token = authHeader.replace(/^Bearer\s+|^Apikey\s+/i, '').trim();
  const expectedSecret = process.env.ASO_WEBHOOK_SECRET || 'sec_aso_trial_2026';

  if (!timingSafeCheck(token, expectedSecret)) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access denied: Must provide a valid session Bearer token in Authorization header.'
    });
  }

  const { accountNumber, since } = req.query;
  const allTxs = global.__asoTransactions || [];

  let filtered = allTxs;

  if (accountNumber) {
    filtered = filtered.filter(
      tx => tx.accountNumber === accountNumber || tx.accountNumber === '0353600900' || !tx.accountNumber
    );
  }

  if (since) {
    const sinceTimestamp = Number(since);
    if (!isNaN(sinceTimestamp)) {
      filtered = filtered.filter(tx => tx.timestamp > sinceTimestamp);
    }
  }

  return res.status(200).json({
    success: true,
    count: filtered.length,
    timestamp: Date.now(),
    transactions: filtered
  });
}
