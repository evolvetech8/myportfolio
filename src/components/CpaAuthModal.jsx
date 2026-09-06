import { useState, useEffect } from 'react';
import { 
  BuildingIcon, 
  CloseIcon, 
  LockIcon, 
  UsersIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  ShieldIcon,
  SparklesIcon
} from './Icons';

export default function CpaAuthModal({ 
  isOpen, 
  onClose, 
  currentRole, 
  onRoleChange, 
  onLoginSuccess,
  initialMode = 'login'
}) {
  const [authMode, setAuthMode] = useState(initialMode); // 'login' | 'register' | 'forgot'

  useEffect(() => {
    if (isOpen && initialMode) {
      setAuthMode(initialMode);
    }
  }, [isOpen, initialMode]);
  const [formData, setFormData] = useState({
    firmName: 'Đại lý thuế & Dịch vụ kế toán An Bình',
    taxCode: '0108998877',
    representative: 'Nguyễn Văn An',
    email: 'nguyenvanan.cpa@anbinhtax.vn',
    phone: '0912889977',
    password: 'password123',
    confirmPassword: 'password123',
    role: currentRole || 'firm_owner'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotice('');

    setTimeout(() => {
      setIsSubmitting(false);
      if (authMode === 'forgot') {
        setNotice('Đã gửi đường dẫn đặt lại mật khẩu bảo mật tới email của bạn.');
        return;
      }
      if (onLoginSuccess) {
        onLoginSuccess({
          email: formData.email,
          firmName: formData.firmName,
          role: formData.role,
          isTrial: authMode === 'register',
          trialDays: authMode === 'register' ? 30 : undefined
        });
      }
      if (onRoleChange) {
        onRoleChange(formData.role);
      }
      onClose();
    }, 800);
  };

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
        maxWidth: '520px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BuildingIcon size={20} color="#00f5d4" />
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#fff' }}>
              {authMode === 'login' ? 'Đăng Nhập Đại Lý Kế Toán' : authMode === 'register' ? 'Đăng Ký Tài Khoản CPA Firm (Dùng Thử 30 Ngày)' : 'Khôi Phục Mật Khẩu'}
            </h2>
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

        {/* Mode Selector Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setNotice(''); }}
            style={{
              flex: 1,
              padding: '12px',
              background: 'none',
              border: 'none',
              borderBottom: authMode === 'login' ? '2px solid #00f5d4' : 'none',
              color: authMode === 'login' ? '#00f5d4' : '#94a3b8',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setNotice(''); }}
            style={{
              flex: 1,
              padding: '12px',
              background: 'none',
              border: 'none',
              borderBottom: authMode === 'register' ? '2px solid #00f5d4' : 'none',
              color: authMode === 'register' ? '#00f5d4' : '#94a3b8',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Đăng Ký Mới (30 Ngày Miễn Phí)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {notice && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(0, 245, 212, 0.1)',
              border: '1px solid rgba(0, 245, 212, 0.3)',
              borderRadius: '8px',
              color: '#00f5d4',
              fontSize: '12px',
              marginBottom: '16px'
            }}>
              {notice}
            </div>
          )}

          {authMode === 'register' && (
            <>
              <div style={{
                background: 'rgba(0, 245, 212, 0.08)',
                border: '1px solid rgba(0, 245, 212, 0.3)',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <SparklesIcon size={18} color="#00f5d4" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#00f5d4' }}>
                    Dùng Thử 30 Ngày Miễn Phí (Trọn Vẹn Chu Kỳ Kế Toán Tháng)
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px', lineHeight: 1.4 }}>
                    Kích hoạt ngay không cần thẻ tín dụng. Trọn quyền lập sổ S1a/S2a Thông tư 152/2025/TT-BTC, hút sao kê VietQR tự động và xuất dữ liệu báo cáo thuế.
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Tên Công Ty Dịch Vụ Kế Toán / Đại Lý Thuế:
                </label>
                <input
                  type="text"
                  required
                  value={formData.firmName}
                  onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#152238',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Ví dụ: Đại lý thuế An Bình"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Mã Số Thuế Doanh Nghiệp:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.taxCode}
                    onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#152238',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="0108998877"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Người Đại Diện Pháp Luật:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.representative}
                    onChange={(e) => setFormData({ ...formData, representative: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#152238',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Nguyễn Văn An"
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Email Công Việc (Work Email):
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: '#152238',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
              placeholder="accountant@anbinhtax.vn"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>
                Mật Khẩu Truy Cập:
              </label>
              {authMode === 'login' && (
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#00f5d4',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Quên mật khẩu?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: '#152238',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Role Simulation Switcher for Demo / RBAC Proof */}
          <div style={{
            background: 'rgba(0, 245, 212, 0.04)',
            border: '1px solid rgba(0, 245, 212, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#00f5d4', marginBottom: '6px' }}>
              <UsersIcon size={14} />
              <span>Phân Quyền Nội Bộ (Role-Based Access Control - RBAC):</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {[
                { id: 'firm_owner', label: 'Chủ Đại Lý (Owner)', desc: 'Toàn quyền, thanh toán, khóa sổ' },
                { id: 'senior_accountant', label: 'Kế Toán Chính (Senior)', desc: 'Khóa sổ, đổi chế độ thuế' },
                { id: 'junior_accountant', label: 'Trợ Lý (Junior)', desc: 'Chỉ nạp sao kê & đối soát' }
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r.id })}
                  style={{
                    padding: '8px 6px',
                    borderRadius: '6px',
                    background: formData.role === r.id ? 'rgba(0, 245, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: formData.role === r.id ? '1px solid #00f5d4' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: formData.role === r.id ? '#00f5d4' : '#cbd5e1',
                    fontSize: '11px',
                    fontWeight: formData.role === r.id ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div>{r.label}</div>
                  <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: '#00f5d4',
              color: '#05101a',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: isSubmitting ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <LockIcon size={16} />
            <span>
              {isSubmitting 
                ? 'Đang Xác Thực...' 
                : authMode === 'login' 
                  ? 'Đăng Nhập Vào Không Gian Kế Toán' 
                  : authMode === 'register' 
                    ? 'Đăng Ký & Kích Hoạt 30 Ngày Dùng Thử Miễn Phí' 
                    : 'Gửi Hướng Dẫn Khôi Phục'}
            </span>
          </button>
        </form>

        {/* Footer info */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(5, 10, 20, 0.5)',
          fontSize: '11px',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <ShieldIcon size={13} color="#00f5d4" />
          <span>Bảo mật phiên đăng nhập qua Supabase Auth & JWT. Mã hóa 2 lớp.</span>
        </div>
      </div>
    </div>
  );
}
