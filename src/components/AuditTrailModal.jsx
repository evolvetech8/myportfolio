import { useState } from 'react';
import { 
  ShieldIcon, 
  CloseIcon, 
  LockIcon, 
  RefreshCwIcon, 
  DownloadCloudIcon,
  FilterIcon,
  CheckIcon
} from './Icons';

export default function AuditTrailModal({ isOpen, onClose }) {
  const [filterAction, setFilterAction] = useState('all');

  // Pre-seeded immutable audit log records representing legal liability defense
  const initialLogs = [
    {
      id: 'aud_8f9a2b1c',
      timestamp: '2026-09-06 10:30:15',
      actorEmail: 'nguyenvanan.cpa@anbinhtax.vn',
      actorRole: 'Kế toán trưởng (Firm Owner)',
      actionType: 'PERIOD_LOCK',
      actionTitle: 'Khóa Sổ Kế Toán Quý 1/2026',
      clientName: 'Tiệm Cà Phê & Bánh Mộc',
      mst: '0109887766-001',
      details: 'Khóa 42 giao dịch VietQR đã đối soát 100% với HĐĐT MTT (NĐ 70/2025). Doanh thu lũy kế: 842.000.000đ.',
      ip: '118.70.124.89'
    },
    {
      id: 'aud_7e8d1a0b',
      timestamp: '2026-09-06 09:15:42',
      actorEmail: 'lethithu.cpa@anbinhtax.vn',
      actorRole: 'Kế toán viên chính (Senior)',
      actionType: 'TAX_OVERRIDE',
      actionTitle: 'Điều Chỉnh Phân Loại Thuế (Tax Shield)',
      clientName: 'Đại Lý Sơn & Vật Liệu Minh Hải',
      mst: '0108776655',
      details: 'Chuyển giao dịch 35.000.000đ từ doanh thu chịu thuế sang dòng tiền nội bộ (RULE-EX-01). Đã đính kèm ủy nhiệm chi nạp vốn lưu động.',
      ip: '118.70.124.92'
    },
    {
      id: 'aud_6d7c0f9a',
      timestamp: '2026-09-05 16:45:10',
      actorEmail: 'nguyenvanan.cpa@anbinhtax.vn',
      actorRole: 'Kế toán trưởng (Firm Owner)',
      actionType: 'BULK_TT152_EXPORT',
      actionTitle: 'Xuất Hàng Loạt Bộ Sổ TT152 (Excel Mẫu BTC)',
      clientName: '14 Hộ Kinh Doanh F&B',
      mst: 'Đa mã số thuế',
      details: 'Đóng gói 14 tệp S2a-HKD theo Thông tư 152/2025/TT-BTC chuẩn bị nộp tờ khai Quý 1/2026.',
      ip: '118.70.124.89'
    },
    {
      id: 'aud_5c6b9e8f',
      timestamp: '2026-09-05 14:20:00',
      actorEmail: 'tranvanduc@anbinhtax.vn',
      actorRole: 'Trợ lý kế toán (Junior)',
      actionType: 'BANK_STATEMENT_UPLOADED',
      actionTitle: 'Nạp Sao Kê Ngân Hàng MBBank',
      clientName: 'Tiệm Tạp Hóa & Bách Hóa Cô Hoa',
      mst: '0107665544',
      details: 'Nạp tệp CSV MBBank tháng 08/2026 gồm 128 dòng giao dịch. Tự động nhận diện 115 giao dịch doanh thu bán lẻ.',
      ip: '118.70.124.95'
    }
  ];

  if (!isOpen) return null;

  const filteredLogs = filterAction === 'all' 
    ? initialLogs 
    : initialLogs.filter(l => l.actionType === filterAction);

  return (
    <div className="cpa-modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="cpa-modal-card" style={{
        background: '#0e1626',
        border: '1px solid rgba(0, 245, 212, 0.3)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
        color: '#f0f4f8',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldIcon size={20} color="#00f5d4" />
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                Nhật Ký Kiểm Toán Bất Biến (Audit Trail & Legal Liability Defense)
              </h2>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Lưu vết thời gian thực mọi tác vụ can thiệp số liệu, khóa sổ và phân loại thuế phục vụ giải trình với Cơ quan Thuế.
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Filter bar */}
        <div style={{
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FilterIcon size={14} color="#00f5d4" />
            <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Lọc theo hành vi:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              style={{
                background: '#152238',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              <option value="all">Tất Cả Hành Vi (All Actions)</option>
              <option value="PERIOD_LOCK">Khóa Sổ Kế Toán (Period Lock)</option>
              <option value="TAX_OVERRIDE">Điều Chỉnh Phân Loại Thuế</option>
              <option value="BULK_TT152_EXPORT">Xuất Biểu Mẫu Hàng Loạt</option>
              <option value="BANK_STATEMENT_UPLOADED">Nạp Sao Kê Ngân Hàng</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => alert('Đã trích xuất tệp nhật ký kiểm toán định dạng CSV kèm chữ ký số xác thực.')}
              style={{
                background: 'rgba(0, 245, 212, 0.1)',
                color: '#00f5d4',
                border: '1px solid rgba(0, 245, 212, 0.3)',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <DownloadCloudIcon size={13} />
              <span>Trích Xuất Báo Cáo Ký Số (CSV)</span>
            </button>
          </div>
        </div>

        {/* Audit Log Entries List */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredLogs.map(log => (
              <div key={log.id} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                padding: '16px',
                transition: 'border 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: log.actionType === 'PERIOD_LOCK' ? 'rgba(0, 245, 212, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                        color: log.actionType === 'PERIOD_LOCK' ? '#00f5d4' : '#38bdf8'
                      }}>
                        {log.actionType}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                        {log.actionTitle}
                      </h4>
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                      Đối tượng: <strong style={{ color: '#fff' }}>{log.clientName}</strong> (MST: {log.mst})
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '11px', color: '#94a3b8' }}>
                    <div style={{ fontFamily: 'monospace' }}>{log.timestamp}</div>
                    <div style={{ color: '#64748b' }}>IP: {log.ip}</div>
                  </div>
                </div>

                <p style={{ margin: '8px 0', fontSize: '13px', color: '#e2e8f0', lineHeight: '1.5', background: 'rgba(0, 0, 0, 0.2)', padding: '10px 12px', borderRadius: '6px' }}>
                  {log.details}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94a3b8', paddingTop: '4px' }}>
                  <div>
                    Người thực hiện: <span style={{ color: '#00f5d4', fontWeight: 600 }}>{log.actorEmail}</span> ({log.actorRole})
                  </div>
                  <div style={{ fontFamily: 'monospace', color: '#64748b' }}>
                    Hash: SHA256:{log.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(5, 10, 20, 0.5)',
          fontSize: '12px',
          color: '#94a3b8'
        }}>
          <div>
            Chính sách bất biến: Dữ liệu nhật ký được bảo vệ chống xóa / chỉnh sửa ở tầng PostgreSQL RLS.
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#00f5d4',
              color: '#05101a',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 16px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Đóng Cửa Sổ
          </button>
        </div>
      </div>
    </div>
  );
}
