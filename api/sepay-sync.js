// Vercel Serverless Function: Proxy SePay Open Banking API (Bypasses browser CORS)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.headers.authorization || req.query.token || req.body?.apiToken;
  const accountNumber = req.query.accountNumber || req.body?.accountNumber;
  const limit = req.query.limit || req.body?.limit || 20;

  if (!token) {
    return res.status(400).json({ error: 'Missing SePay API Token. Please provide Bearer token in Authorization header or body.' });
  }

  const cleanToken = token.replace('Bearer ', '').trim();

  try {
    const url = `https://my.sepay.vn/userapi/transactions/list?limit=${limit}${accountNumber ? `&account_number=${accountNumber}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'SePay API error',
        status: response.status,
        details: errorText
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('[SEPAY SYNC ERROR]', err);
    return res.status(500).json({ error: 'Failed to communicate with SePay Open Banking API', details: err.message });
  }
}
