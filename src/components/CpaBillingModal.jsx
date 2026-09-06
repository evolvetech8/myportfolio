import { useState } from 'react';
import { 
  BuildingIcon, 
  CloseIcon, 
  CheckCircleIcon, 
  QrCodeIcon, 
  ShieldIcon, 
  CheckIcon,
  ArrowRightIcon,
  SparklesIcon,
  PhoneIcon,
  FileTextIcon
} from './Icons';

export default function CpaBillingModal({ isOpen, onClose, currentPlan = 'starter', onUpgradeSuccess }) {
  const [selectedPlan, setSelectedPlan] = useState('pro_studio');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [paymentMethod, setPaymentMethod] = useState('vietqr'); // 'vietqr' | 'bank_transfer'
  const [addConciergeSetup, setAddConciergeSetup] = useState(false);
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
      name: 'Khởi Nghiệp',
      subtitle: 'Kế toán dịch vụ tự do (dạng Chị Hương)',
      limit: 'Tối đa 15 hộ kinh doanh',
      monthlyPrice: 490000,
      annualPrice: 4900000,
      annualSavingsVnd: '980k',
      annualSavingsCallout: 'Hoặc 4.900.000đ/năm - tiết kiệm 980k',
      badgeBg: 'rgba(244, 63, 94, 0.12)',
      badgeColor: '#fb7185',
      badgeBorder: 'rgba(244, 63, 94, 0.3)',
      features: [
        'Sổ S1a-HKD và S2a-HKD tự động lập',
        'Đối soát VietQR thời gian thực (MB, VCB, TCB)',
        'Nhập sao kê CSV cho các ngân hàng khác',
        'Cổng khách hàng OTP qua Zalo ZNS',
        'Lịch cảnh báo hạn kê khai quý',
        '1 tài khoản kế toán'
      ],
      ctaText: 'Dùng thử 30 ngày miễn phí',
      trialDuration: '30 ngày'
    },
    {
      id: 'pro_studio',
      name: 'Pro Studio',
      badge: 'Phổ biến nhất',
      subtitle: 'Đại lý thuế 3-8 người (dạng Anh Tuấn)',
      limit: 'Tối đa 50 hộ kinh doanh',
      monthlyPrice: 1490000,
      annualPrice: 14900000,
      annualSavingsVnd: '2,98 triệu',
      annualSavingsCallout: 'Hoặc 14.900.000đ/năm - tiết kiệm 2,98 triệu',
      badgeBg: 'rgba(56, 189, 248, 0.12)',
      badgeColor: '#38bdf8',
      badgeBorder: 'rgba(56, 189, 248, 0.3)',
      features: [
        'Mọi tính năng gói Khởi Nghiệp',
        'Bộ 4 sổ TT152 Nhóm 3 (S2b, S2c, S2d, S2e)',
        'Tối đa 5 tài khoản kế toán viên',
        'Phân quyền vai trò (chủ, senior, junior)',
        'Nhật ký kiểm toán đầy đủ (audit log)',
        'Thao tác hàng loạt (khoá sổ, xuất báo cáo)',
        'Nhập dữ liệu di cư từ MISA và Excel'
      ],
      ctaText: 'Dùng thử 30 ngày miễn phí',
      trialDuration: '30 ngày'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Firm',
      subtitle: 'Công ty dịch vụ kế toán quy mô lớn',
      limit: 'Tối đa 200 hộ kinh doanh',
      monthlyPrice: 2990000,
      annualPrice: 29900000,
      annualSavingsVnd: '5,98 triệu',
      annualSavingsCallout: 'Hoặc 29.900.000đ/năm - tiết kiệm 5,98 triệu',
      badgeBg: 'rgba(245, 158, 11, 0.12)',
      badgeColor: '#fbbf24',
      badgeBorder: 'rgba(245, 158, 11, 0.3)',
      features: [
        'Mọi tính năng gói Pro Studio',
        'Không giới hạn tài khoản kế toán viên',
        'Hỗ trợ ưu tiên qua Zalo trong giờ hành chính',
        'Onboarding trực tiếp cho đội ngũ',
        'Phụ phí 20k/hộ khi vượt ngưỡng 200',
        'Cam kết uptime 99% giờ hành chính Việt Nam'
      ],
      ctaText: 'Liên hệ tư vấn',
      trialDuration: 'Tư vấn theo quy mô'
    }
  ];

  const currentSelectedPlan = plans.find(p => p.id === selectedPlan) || plans[1];
  const basePrice = billingCycle === 'annual' ? currentSelectedPlan.annualPrice : currentSelectedPlan.monthlyPrice;
  const conciergeFee = addConciergeSetup ? 500000 : 0;
  const totalAmount = basePrice + conciergeFee;

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
        maxWidth: '1020px',
        maxHeight: '94vh',
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
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BuildingIcon size={20} color="#00f5d4" />
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                Bảng Giá Bản Quyền A-Sổ (CPA Studio)
              </h2>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Tự động hóa sổ sách cho hộ kinh doanh chuẩn Thông tư 152 &amp; Nghị định 70. Tiết kiệm 40% chi phí so với MISA.
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
            {/* Billing Cycle Switcher */}
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
                    padding: '6px 20px',
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
                    padding: '6px 20px',
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
                  <span>Thanh Toán Năm (10 Tháng)</span>
                  <span style={{
                    fontSize: '10px',
                    background: billingCycle === 'annual' ? '#05101a' : 'rgba(0, 245, 212, 0.2)',
                    color: billingCycle === 'annual' ? '#00f5d4' : '#00f5d4',
                    padding: '1px 8px',
                    borderRadius: '10px',
                    fontWeight: 800
                  }}>
                    Tặng 2 Tháng
                  </span>
                </button>
              </div>
            </div>

            {/* 3 Pricing Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {plans.map(p => {
                const isCurrent = p.id === selectedPlan;
                const displayPrice = billingCycle === 'annual' ? p.annualPrice : p.monthlyPrice;
                const periodLabel = billingCycle === 'annual' ? '/năm' : '/tháng';

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    style={{
                      borderRadius: '14px',
                      background: isCurrent ? 'rgba(0, 245, 212, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                      border: isCurrent ? '2px solid #00f5d4' : '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '22px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      boxShadow: isCurrent ? '0 12px 30px rgba(0, 245, 212, 0.1)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Top Popular Ribbon */}
                    {p.badge && (
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                        color: '#38bdf8',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 10px',
                        borderRadius: '12px'
                      }}>
                        {p.badge}
                      </div>
                    )}

                    <h3 style={{ margin: '0 0 4px', fontSize: '18px', color: '#fff', fontWeight: 800 }}>
                      {p.name}
                    </h3>
                    <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#94a3b8' }}>
                      {p.subtitle}
                    </p>

                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>
                        {fmtCurrency(displayPrice)}
                      </span>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}> {periodLabel}</span>
                    </div>

                    {/* Annual Savings Callout Badge */}
                    <div style={{
                      background: p.badgeBg,
                      border: '1px solid ' + p.badgeBorder,
                      color: p.badgeColor,
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ fontWeight: 800 }}>•</span>
                      <span>{p.annualSavingsCallout}</span>
                    </div>

                    {/* Capacity Indicator */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#00f5d4',
                      padding: '8px 0',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      marginBottom: '16px'
                    }}>
                      <span>{p.limit}</span>
                    </div>

                    {/* Feature Bullet Points */}
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', flex: 1 }}>
                      {p.features.map((feat, idx) => (
                        <li key={idx} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          fontSize: '12px',
                          color: '#cbd5e1',
                          marginBottom: '9px',
                          lineHeight: '1.4'
                        }}>
                          <CheckIcon size={14} color="#00f5d4" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlan(p.id);
                        if (p.id === 'enterprise') {
                          alert('Quý công ty vui lòng liên hệ hotline 0903-xxx-xxx hoặc gửi email tới contact@evolvetech.biz.vn để nhận hợp đồng riêng cho quy mô trên 200 HKD.');
                        } else {
                          setShowQrStep(true);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '11px',
                        borderRadius: '8px',
                        background: isCurrent ? '#00f5d4' : 'rgba(255, 255, 255, 0.06)',
                        color: isCurrent ? '#05101a' : '#cbd5e1',
                        border: isCurrent ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {p.ctaText}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Design Partner Program Box */}
            <div style={{
              background: 'rgba(56, 189, 248, 0.05)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <SparklesIcon size={16} color="#38bdf8" />
                <strong style={{ fontSize: '13px', color: '#fff' }}>Chương trình Đối Tác Sáng Lập (Design Partner Program)</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
                10 kế toán đầu tiên đăng ký nhận Pro Studio miễn phí 6 tháng, đổi lại phản hồi hàng tuần và quyền trích dẫn khi A-Sổ ra mắt chính thức. Sau kỳ ưu đãi hưởng giảm 40% năm đầu.
              </p>
            </div>

            {/* Concierge Setup Add-on & VAT Section */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '20px'
            }}>
              {/* Concierge Setup Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#fff', marginBottom: '14px' }}>
                <input
                  type="checkbox"
                  checked={addConciergeSetup}
                  onChange={(e) => setAddConciergeSetup(e.target.checked)}
                />
                <div>
                  <span style={{ fontWeight: 700 }}>Gói Khởi Tạo Chuyên Nghiệp (Concierge Setup): +500.000đ</span>
                  <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                    Chuyên viên kỹ thuật A-Sổ trực tiếp hỗ trợ bóc tách và di cư 10 khách hàng đầu tiên từ MISA / Excel vào hệ thống.
                  </span>
                </div>
              </label>

              {/* VAT Invoice Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#fff' }}>
                <input
                  type="checkbox"
                  checked={needVatInvoice}
                  onChange={(e) => setNeedVatInvoice(e.target.checked)}
                />
                <span>Yêu cầu xuất Hóa đơn điện tử VAT (GTGT 8%) cho Công ty Dịch vụ Kế toán</span>
              </label>

              {needVatInvoice && (
                <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tên công ty / đơn vị:</span>
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
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Email nhận HĐĐT:</span>
                    <input
                      type="email"
                      value={vatDetails.invoiceEmail}
                      onChange={(e) => setVatDetails({ ...vatDetails, invoiceEmail: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#152238', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Policy Notes & Guarantees */}
            <div style={{
              fontSize: '11px',
              color: '#94a3b8',
              lineHeight: '1.6',
              marginBottom: '20px',
              borderLeft: '2px solid rgba(0, 245, 212, 0.4)',
              paddingLeft: '12px'
            }}>
              <div>• Giá đã bao gồm 8% VAT. Xuất hoá đơn điện tử VAT cho công ty dịch vụ kế toán mỗi kỳ thanh toán.</div>
              <div>• Không bao gồm dịch vụ HĐĐT-MTT theo NĐ 70/2025 (đăng ký riêng qua đối tác meInvoice, EasyInvoice hoặc VNPT).</div>
              <div>• <strong>Ân hạn 7 ngày:</strong> Không tạm khóa dịch vụ ngay lập tức khi chậm nộp tiền để đảm bảo tiến độ báo cáo thuế cho khách hàng.</div>
              <div>• <strong>Chính sách hoàn tiền:</strong> Hoàn 100% trong 7 ngày đầu tiên nếu không hài lòng. Không hoàn tiền cho tháng dở dang.</div>
            </div>

            {/* Total Bar & Next Step CTA */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '16px'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Tổng cộng ({billingCycle === 'annual' ? '12 tháng (tặng 2 tháng)' : '1 tháng'}
                  {addConciergeSetup ? ' + Khởi tạo 500k' : ''}):
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#00f5d4' }}>
                  {fmtCurrency(totalAmount)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (onUpgradeSuccess) {
                      onUpgradeSuccess(selectedPlan);
                    }
                    onClose();
                  }}
                  style={{
                    background: 'rgba(0, 245, 212, 0.12)',
                    color: '#00f5d4',
                    border: '1px solid #00f5d4',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <SparklesIcon size={15} color="#00f5d4" />
                  <span>Kích Hoạt Dùng Thử 30 Ngày (0đ)</span>
                </button>
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
          </div>
        ) : (
          /* Step 2: Payment Execution (VietQR or Bank Transfer) */
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '18px', color: '#fff' }}>
              Thanh Toán Gói {currentSelectedPlan.name} ({billingCycle === 'annual' ? '12 Tháng' : '1 Tháng'})
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#94a3b8' }}>
              Hệ thống tự động kích hoạt tài khoản hoặc hỗ trợ đối soát thủ công theo quý kèm ủy nhiệm chi.
            </p>

            {/* Payment Method Selector */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('vietqr')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: paymentMethod === 'vietqr' ? 'rgba(0, 245, 212, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'vietqr' ? '1px solid #00f5d4' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: paymentMethod === 'vietqr' ? '#00f5d4' : '#cbd5e1',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Quét Mã VietQR Napas247 (Tự Động)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: paymentMethod === 'bank_transfer' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: paymentMethod === 'bank_transfer' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: paymentMethod === 'bank_transfer' ? '#38bdf8' : '#cbd5e1',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Chuyển Khoản Ngân Hàng / Hóa Đơn Quý
              </button>
            </div>

            {paymentMethod === 'vietqr' ? (
              /* Simulated VietQR Card */
              <div style={{
                display: 'inline-block',
                background: '#fff',
                padding: '20px',
                borderRadius: '16px',
                color: '#05101a',
                marginBottom: '20px',
                boxShadow: '0 8px 32px rgba(0, 245, 212, 0.25)',
                maxWidth: '320px'
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
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#003366' }}>{fmtCurrency(totalAmount)}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                  Nội dung: <strong style={{ color: '#003366' }}>ASO {currentSelectedPlan.id.toUpperCase()} 0108998877</strong>
                </div>
              </div>
            ) : (
              /* Bank Transfer Manual Reconciliation Card */
              <div style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '24px',
                borderRadius: '16px',
                color: '#cbd5e1',
                marginBottom: '20px',
                textAlign: 'left',
                maxWidth: '480px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', marginBottom: '12px' }}>
                  Thông Tin Tài Khoản Thanh Toán Doanh Nghiệp:
                </div>
                <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                  <div>• Ngân hàng: <strong>Vietcombank (VCB) - Chi nhánh TP.HCM</strong></div>
                  <div>• Số tài khoản: <strong style={{ color: '#00f5d4' }}>0071001234567</strong></div>
                  <div>• Đơn vị thụ hưởng: <strong>CÔNG TY TNHH EVOLVETECH VIỆT NAM</strong></div>
                  <div>• Số tiền: <strong style={{ color: '#fff', fontSize: '14px' }}>{fmtCurrency(totalAmount)}</strong></div>
                  <div>• Nội dung chuyển khoản: <strong style={{ color: '#fbbf24' }}>ASO {currentSelectedPlan.id.toUpperCase()} MST {vatDetails.taxCode}</strong></div>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
                  Hóa đơn điện tử VAT sẽ được gửi tự động qua email <strong>{vatDetails.invoiceEmail}</strong> sau khi kế toán A-Sổ đối soát ủy nhiệm chi trong 2 giờ làm việc.
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
                <span>{isPaid ? 'Đang Kích Hoạt Bản Quyền...' : 'Xác Nhận Đã Chuyển Tiền (Mô Phỏng Webhook)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
