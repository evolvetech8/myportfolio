// Vercel Serverless Function: Authenticated Read-Only Ledger for Client Portal
// Strictly compliant with Circular 152/2025/TT-BTC & Decree 70/2025/ND-CP
import crypto from 'crypto';

function verifyScopedToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signature] = parts;
  const secret = process.env.PORTAL_JWT_SECRET || 'sec_portal_jwt_2026_evolvetech';
  const expectedSignature = crypto.createHmac('sha256', secret).update(`${headerB64}.${payloadB64}`).digest('base64url');

  if (signature.length !== expectedSignature.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const payload = verifyScopedToken(token);

  if (!payload || payload.scope !== 'client_read_only') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Yeu cau dang nhap xac thuc qua ma OTP tren Cong thong tin chu ho.'
    });
  }

  const { clientId } = req.query;
  if (clientId && String(clientId) !== String(payload.clientId)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Token khong co quyen truy cap ho kinh doanh nay.'
    });
  }

  // Return read-only data for the authenticated client
  return res.status(200).json({
    success: true,
    clientId: payload.clientId,
    regulatoryStandard: 'TT152/2025/TT-BTC & ND70/2025/ND-CP',
    cpaFirm: {
      name: 'Dai ly thue & Dich vu ke toan An Binh',
      license: 'DLT-HN-2024-889',
      chiefAccountant: 'Nguyen Van An (CPA Vietnam #1892)'
    },
    clientInfo: {
      name: 'Tiem Ca Phe & Banh Moc',
      taxCode: '0109887766-001',
      regime: 'Nhom 2 - S2a-HKD (Ke khai don gian)',
      annualRevenueYtd: 842000000,
      estimatedTaxYtd: 12630000,
      invoicesIssuedCount: 142,
      nd70ThresholdRatio: 0.842,
      isNd70MandatorySoon: true
    },
    books: [
      { code: 'S2a-HKD', name: 'So chi tiet doanh thu theo ty le % thue', status: 'LOCKED_VALIDATED' },
      { code: 'S1-TIEN', name: 'Nhat ky dong tien VietQR va tien gui ngan hang', status: 'MATCHED_100' }
    ],
    timestamp: new Date().toISOString()
  });
}
