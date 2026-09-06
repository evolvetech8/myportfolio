// Vercel Serverless Function: Poll Live Transactions

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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
