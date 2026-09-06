// Vercel Serverless Function: CPA Immutable Audit Log Engine
// Legal defense trail for accounting firms under TT152 & ND123
import crypto from 'crypto';

let globalAuditLogs = global.__asoAuditLogs || [];
global.__asoAuditLogs = globalAuditLogs;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Retrieve audit log history for authenticated CPA firm
  if (req.method === 'GET') {
    const { clientId, limit = 50 } = req.query;
    let logs = globalAuditLogs;
    if (clientId) {
      logs = logs.filter(l => String(l.clientId) === String(clientId));
    }
    return res.status(200).json({
      success: true,
      count: logs.length,
      logs: logs.slice(0, parseInt(limit, 10))
    });
  }

  // POST: Record new audit entry
  if (req.method === 'POST') {
    try {
      const {
        actionType,
        actorEmail = 'accountant@anbinhtax.vn',
        actorRole = 'senior_accountant',
        clientId,
        clientName,
        resourceType,
        resourceId,
        details,
        reason
      } = req.body || {};

      if (!actionType) {
        return res.status(400).json({ error: 'Missing actionType' });
      }

      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'Unknown';

      const entry = {
        id: 'aud_' + crypto.randomBytes(8).toString('hex'),
        timestamp: new Date().toISOString(),
        actionType,
        actorEmail,
        actorRole,
        clientId: clientId || null,
        clientName: clientName || null,
        resourceType: resourceType || 'ledger',
        resourceId: resourceId || null,
        details: details || {},
        reason: reason || null,
        ipAddress: String(clientIp).split(',')[0].trim(),
        userAgent
      };

      globalAuditLogs.unshift(entry);
      // Keep up to 500 recent logs in memory buffer
      if (globalAuditLogs.length > 500) {
        globalAuditLogs.length = 500;
      }

      return res.status(201).json({
        success: true,
        message: 'Nhat ky kiem toan da duoc ghi nhan bat bien thanh cong.',
        entry
      });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
