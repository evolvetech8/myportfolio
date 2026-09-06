import { useState } from 'react';
import { 
  BuildingIcon, 
  CloseIcon, 
  CheckCircleIcon, 
  QrCodeIcon, 
  ShieldIcon, 
  CheckIcon,
  ArrowRightIcon,
  SparklesIcon
} from './Icons';

export default function CpaBillingModal({ isOpen, onClose, currentPlan = 'starter', onUpgradeSuccess }) {
  const [selectedPlan, setSelectedPlan] = useState('pro_studio');
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly' | 'annual' (20% discount)
  const [showQrStep, setShowQrStep] = useState(false);
  const [needVatInvoice, setNeedVatInvoice] = useState(true);
  const [isPaid, setIsPaid] = useState(false);

  const [vatDetails, setVatDetails] = useState({
    companyName: 'Công Ty TNHH Dịch Vụ Thuế & Kế Toán An Bình',
    taxCode: '0108998877',
    address: 'Số 45 Đường Hoàng Cầu, Quận Đống Đa, TP. Hà Nội',
    invoiceEmail: 'ketoan@anbinhtax.vn'
  });

  if (!isOpen) return null;

  const plans = [
    {
      id: 'starter',
      name: 'Gói Khởi Nghiệp (Starter)',
      limit: 'Tối đa 15 Hộ Kinh Doanh',
      monthlyPrice: 490000,
      annualPrice: 390000, // per month billed annually
      features: [
        'Đầy đủ biểu mẫu TT152 (S1a, S2a)',
        'Cảnh báo ngưỡng 1 tỷ Nghị định 70',
        'Nạp sao kê CSV 5 ngân hàng lớn',
        '1 Tài khoản Kế toán chính',
        'Hỗ trợ kỹ thuật giờ hành chính'
      ]
    },
    {
      id: 'pro_studio',
      name: 'Gói Chuyên Nghiệp (Pro Studio)',
      badge: 'Khuyên Dùng Cho Đại Lý Thuế',
      limit: 'Tối đa 50 Hộ Kinh Doanh',
      monthlyPrice: 1490000,
      annualPrice: 1190000,
      features: [
        'Mọi tính năng gói Starter',
        'Thao tác hàng loạt (Bulk Lock, Bulk Export)',
        'Cổng xem báo cáo cho chủ hộ (Portal OTP)',
        'Công cụ di cư dữ liệu MISA & Excel 1-click',
        '3 Tài khoản phân quyền RBAC (Chủ & Kế toán)',
        'Xuất hóa đơn VAT điện tử doanh nghiệp'
      ]
    },
    {
      id: 'enterprise',
      name: 'Gói Công Ty (Enterprise Firm)',
      limit: 'Không giới hạn Hộ Kinh Doanh',
      monthlyPrice: 2990000,
      annualPrice: 2390000,
      features: [
        'Mọi tính năng gói Pro Studio',
        'Không giới hạn số lượng hộ kinh doanh',
        'Không giới hạn số nhân sự kế toán viên',
        'Nhật ký kiểm toán bảo mật bất biến nâng cao',
        'Đầu mối kỹ thuật hỗ trợ riêng biệt 24/7',
        'Ký cam kết bảo mật NDA dữ liệu theo NĐ 13'
      ]
    }
  ];

  const currentSelectedPlan = plans.find(p => p.id === selectedPlan) || plans[1];
  const monthlyRate = billingCycle === 'annual' ? currentSelectedPlan.annualPrice : currentSelectedPlan.monthlyPrice;
  const totalAmount = billingCycle === 'annual' ? monthlyRate * 12 : monthlyRate;

  const fmtCurrency = (val) => new Intl.NumberFormat('vi-VN').format(val) + 'đ';

  const handleSimulatePayment = () => {
    setIsPaid(true);
    setTimeout(() => {
      if (onUpgradeSuccess) {
        onUpgradeSuccess(selectedPlan);
      }
      onClose();
      setIsPaid(false);
      setShowQrStep(false);
    }, 1500);
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
        maxWidth: '950px',
        maxHeight: '92vh',
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
              <BuildingIcon size={20} color="#00f5d4" />
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                Đăng Ký Bản Quyền CPA Studio (A-Sổ Kế Toán)
              </h2>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Trang bị cho đội ngũ kế toán công cụ quản trị 20 - 100 hộ kinh doanh chuẩn Thông tư 152 & Nghị định 70.
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

        {!showQrStep ? (
          <div style={{ padding: '24px' }}>
            {/* Billing cycle switch */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '30px',
                padding: '4px',
                display: 'inline-flex'
              }}>
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  style={{
                    padding: '6px 18px',
                    borderRadius: '24px',
                    background: billingCycle === 'monthly' ? '#00f5d4' : 'transparent',
                    color: billingCycle === 'monthly' ? '#05101a' : '#cbd5e1',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Thanh Toán Hàng Tháng
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  style={{
                    padding: '6px 18px',
                    borderRadius: '24px',
                    background: billingCycle === 'annual' ? '#00f5d4' : 'transparent',
                    color: billingCycle === 'annual' ? '#05101a' : '#cbd5e1',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Thanh Toán Năm</span>
                  <span style={{
                    fontSize: '10px',
                    background: billingCycle === 'annual' ? '#05101a' : 'rgba(0, 245, 212, 0.2)',
                    color: billingCycle === 'annual' ? '#00f5d4' : '#00f5d4',
                    padding: '1px 6px',
                    borderRadius: '10px'
                  }}>
                    Tiết kiệm 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {plans.map(p => {
                const isCurrent = p.id === selectedPlan;
                const price = billingCycle === 'annual' ? p.annualPrice : p.monthlyPrice;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    style={{
                      borderRadius: '12px',
                      background: isCurrent ? 'rgba(0, 245, 212, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                      border: isCurrent ? '2px solid #00f5d4' : '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative'
                    }}
                  >
                    {p.badge && (
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#00f5d4',
                        color: '#05101a',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 10px',
                        borderRadius: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {p.badge}
                      </div>
                    )}

                    <h3 style={{ margin: '0 0 6px', fontSize: '15px', color: '#fff', fontWeight: 700 }}>
                      {p.name}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#00f5d4', fontWeight: 600, marginBottom: '16px' }}>
                      {p.limit}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>
                        {fmtCurrency(price)}
                      </span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}> / tháng</span>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', flex: 1 }}>
                      {p.features.map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#cbd5e1', marginBottom: '8px' }}>
                          <CheckIcon size={14} color="#00f5d4" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        background: isCurrent ? '#00f5d4' : 'rgba(255, 255, 255, 0.06)',
                        color: isCurrent ? '#05101a' : '#cbd5e1',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {isCurrent ? 'Đang Chọn Gói Này' : 'Chọn Gói'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* VAT Invoice Checkbox & Inputs */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                <input
                  type="checkbox"
                  checked={needVatInvoice}
                  onChange={(e) => setNeedVatInvoice(e.target.checked)}
                />
                <span>Yêu cầu xuất Hóa đơn điện tử VAT (GTGT) cho Công ty Dịch vụ Kế toán</span>
              </label>

              {needVatInvoice && (
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tên đơn vị mua hàng:</span>
                    <input
                      type="text"
                      value={vatDetails.companyName}
                      onChange={(e) => setVatDetails({ ...vatDetails, companyName: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#152238', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Mã số thuế:</span>
                    <input
                      type="text"
                      value={vatDetails.taxCode}
                      onChange={(e) => setVatDetails({ ...vatDetails, taxCode: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#152238', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Tổng cộng thanh toán ({billingCycle === 'annual' ? '12 tháng' : '1 tháng'}):</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#00f5d4' }}>{fmtCurrency(totalAmount)}</div>
              </div>
              <button
                type="button"
                onClick={() => setShowQrStep(true)}
                style={{
                  background: '#00f5d4',
                  color: '#05101a',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 28px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Tiếp Tục Thanh Toán VietQR</span>
                <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: VietQR Payment Step */
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '18px', color: '#fff' }}>
              Quét Mã VietQR Napas247 Kích Hoạt Bản Quyền Tự Động
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#94a3b8' }}>
              Hệ thống tự động kích hoạt gói {currentSelectedPlan.name} ngay khi nhận được tín hiệu chuyển khoản.
            </p>

            {/* Simulated VietQR Card */}
            <div style={{
              display: 'inline-block',
              background: '#fff',
              padding: '20px',
              borderRadius: '16px',
              color: '#05101a',
              marginBottom: '20px',
              boxShadow: '0 8px 32px rgba(0, 245, 212, 0.25)'
            }}>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#003366', marginBottom: '8px' }}>
                VIETQR - NAPAS 247
              </div>
              <div style={{
                width: '180px',
                height: '180px',
                margin: '0 auto 12px',
                border: '2px dashed #003366',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
                borderRadius: '8px'
              }}>
                <QrCodeIcon size={120} color="#003366" />
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Quét bằng App Ngân Hàng</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{fmtCurrency(totalAmount)}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Nội dung: <strong style={{ color: '#003366' }}>CPA ANBINH {currentSelectedPlan.id.toUpperCase()}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowQrStep(false)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#cbd5e1',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Quay Lại Chọn Gói
              </button>
              <button
                type="button"
                onClick={handleSimulatePayment}
                style={{
                  background: '#00f5d4',
                  color: '#05101a',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircleIcon size={16} />
                <span>{isPaid ? 'Đang Kích Hoạt Tài Khoản...' : 'Xác Nhận Đã Chuyển Tiền (Mô Phỏng Webhook)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
