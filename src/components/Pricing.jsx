import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ShieldIcon, SparklesIcon, LockIcon, ArrowRightIcon, CheckIcon } from './Icons';
import VietQRCheckoutModal from './VietQRCheckoutModal';

export default function Pricing({ isStandalone = false }) {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [openFaq, setOpenFaq] = useState(null);

  // VietQR Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState('pro_studio');
  const [isTrialMode, setIsTrialMode] = useState(false);

  const openCheckout = (planId, trial = false) => {
    if (planId === 'enterprise') {
      alert('Quý công ty vui lòng liên hệ hotline 0903-xxx-xxx hoặc gửi email tới contact@evolvetech.biz.vn để nhận hợp đồng riêng cho quy mô trên 200 HKD.');
      return;
    }
    setCheckoutPlan(planId);
    setIsTrialMode(trial);
    setIsCheckoutOpen(true);
  };

  const tiers = [
    {
      id: 'starter',
      name: 'Khởi Nghiệp',
      target: 'Kế toán dịch vụ tự do (dạng Chị Hương)',
      monthlyPrice: '490.000',
      annualPrice: '4.900.000',
      annualSavingsCallout: 'Hoặc 4.900.000đ/năm - tiết kiệm 980k',
      annualBadgeBg: 'rgba(244, 63, 94, 0.12)',
      annualBadgeColor: '#fb7185',
      annualBadgeBorder: 'rgba(244, 63, 94, 0.3)',
      capacity: 'Tối đa 15 hộ kinh doanh',
      isPopular: false,
      ctaText: 'Dùng thử 30 ngày miễn phí',
      features: [
        'Sổ S1a-HKD và S2a-HKD tự động lập',
        'Đối soát VietQR thời gian thực (MB, VCB, TCB)',
        'Nhập sao kê CSV cho các ngân hàng khác',
        'Cổng khách hàng OTP qua Zalo ZNS',
        'Lịch cảnh báo hạn kê khai quý',
        '1 tài khoản kế toán'
      ]
    },
    {
      id: 'pro_studio',
      name: 'Pro Studio',
      target: 'Đại lý thuế 3-8 người (dạng Anh Tuấn)',
      monthlyPrice: '1.490.000',
      annualPrice: '14.900.000',
      annualSavingsCallout: 'Hoặc 14.900.000đ/năm - tiết kiệm 2,98 triệu',
      annualBadgeBg: 'rgba(56, 189, 248, 0.12)',
      annualBadgeColor: '#38bdf8',
      annualBadgeBorder: 'rgba(56, 189, 248, 0.3)',
      capacity: 'Tối đa 50 hộ kinh doanh',
      isPopular: true,
      badge: 'Phổ biến nhất',
      ctaText: 'Dùng thử 14 ngày miễn phí',
      features: [
        'Mọi tính năng gói Khởi Nghiệp',
        'Bộ 4 sổ TT152 Nhóm 3 (S2b, S2c, S2d, S2e)',
        'Tối đa 5 tài khoản kế toán viên',
        'Phân quyền vai trò (chủ, senior, junior)',
        'Nhật ký kiểm toán đầy đủ (audit log)',
        'Thao tác hàng loạt (khoá sổ, xuất báo cáo)',
        'Nhập dữ liệu di cư từ MISA và Excel'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Firm',
      target: 'Công ty dịch vụ kế toán quy mô lớn',
      monthlyPrice: '2.990.000',
      annualPrice: '29.900.000',
      annualSavingsCallout: 'Hoặc 29.900.000đ/năm - tiết kiệm 5,98 triệu',
      annualBadgeBg: 'rgba(245, 158, 11, 0.12)',
      annualBadgeColor: '#fbbf24',
      annualBadgeBorder: 'rgba(245, 158, 11, 0.3)',
      capacity: 'Tối đa 200 hộ kinh doanh',
      isPopular: false,
      ctaText: 'Liên hệ tư vấn',
      features: [
        'Mọi tính năng gói Pro Studio',
        'Không giới hạn tài khoản kế toán viên',
        'Hỗ trợ ưu tiên qua Zalo trong giờ hành chính',
        'Onboarding trực tiếp cho đội ngũ',
        'Phụ phí 20k/hộ khi vượt ngưỡng 200',
        'Cam kết uptime 99% giờ hành chính Việt Nam'
      ]
    }
  ];

  const faqs = [
    {
      q: 'Tại sao A-Sổ giúp đại lý thuế tiết kiệm 40% chi phí so với MISA?',
      a: 'MISA tính phí bản quyền theo từng nhân viên sử dụng và phụ phí từng chứng từ hóa đơn. A-Sổ tính phí trọn gói theo danh mục hộ kinh doanh (tối đa 15 hộ ở gói Khởi Nghiệp và 50 hộ ở gói Pro Studio), cho phép phân quyền nhiều kế toán viên cùng làm việc mà không phát sinh thêm phí.'
    },
    {
      q: 'Hộ kinh doanh của tôi có phải mua phần mềm riêng không?',
      a: 'Hoàn toàn không. Kế toán viên mua bản quyền A-Sổ và được cấp sẵn Cổng tra cứu Zalo Mobile miễn phí cho toàn bộ chủ hộ. Chủ hộ đăng nhập bằng mã OTP điện thoại, tự tra cứu số liệu mà không cần tải thêm ứng dụng hay trả thêm tiền.'
    },
    {
      q: 'Dữ liệu giữa các đại lý thuế có được bảo mật độc lập không?',
      a: 'Tuyệt đối an toàn. Hệ thống A-Sổ áp dụng chính sách Row Level Security (RLS) ở tầng cơ sở dữ liệu PostgreSQL. Mọi truy vấn bắt buộc gắn liền với mã định danh đại lý thuế (firm_id), tuân thủ nghiêm ngặt Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.'
    },
    {
      q: 'Hết thời gian dùng thử nếu tôi chưa gia hạn thì dữ liệu có bị xóa không?',
      a: 'Dữ liệu được lưu trữ an toàn trong 30 ngày sau khi hết hạn để bạn có thể kích hoạt lại bất kỳ lúc nào. Ngoài ra, bạn luôn có thể xuất toàn bộ bộ sổ kế toán Excel chuẩn mẫu Bộ Tài Chính (S1a-HKD, S2a-HKD) về máy tính cá nhân.'
    }
  ];

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section className={`pricing-section ${isStandalone ? 'pricing-standalone' : ''}`} id="pricing">
      <div className="pricing-inner">
        {/* Section Header */}
        <div className="pricing-header">
          <span className="hero-pre" style={{ margin: '0 auto 16px', display: 'inline-block' }}>
            BẢNG GIÁ DỊCH VỤ CPA STUDIO
          </span>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            Đầu Tư Tinh Gọn Cho Kế Toán Dịch Vụ
          </h2>
          <p className="pricing-subtitle">
            Tự động hóa sổ sách cho 15 - 200 hộ kinh doanh. Chuẩn Thông tư 152 &amp; Nghị định 70. Tiết kiệm 40% chi phí so với phần mềm truyền thống.
          </p>
        </div>

        {/* Billing Toggle (Monthly vs. Annual - 10 Months) */}
        <div className="billing-toggle-container">
          <div className="billing-toggle-pill glass-panel">
            <button
              type="button"
              className={`billing-toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              <span>Thanh Toán Hàng Tháng</span>
            </button>
            <button
              type="button"
              className={`billing-toggle-btn ${billingCycle === 'annual' ? 'active' : ''}`}
              onClick={() => setBillingCycle('annual')}
            >
              <span>Thanh Toán Năm (10 Tháng)</span>
              <span className="save-badge">Tặng 2 Tháng</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-grid" style={{ marginBottom: '24px' }}>
          {tiers.map((tier) => {
            const price = billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice;
            const billedUnit = billingCycle === 'annual' ? '/năm' : '/tháng';

            return (
              <div
                key={tier.id}
                className={`pricing-card glass-panel ${tier.isPopular ? 'pricing-card-popular' : ''}`}
              >
                {tier.isPopular && (
                  <div className="popular-ribbon">
                    <span>PHỔ BIẾN NHẤT</span>
                  </div>
                )}

                <div className="pricing-card-header">
                  <h3 className="tier-name">{tier.name}</h3>
                  <p className="tier-target">{tier.target}</p>
                </div>

                <div className="pricing-card-price">
                  <div className="price-row">
                    <span className="price-currency">{price}đ</span>
                    <span className="price-unit">{billedUnit}</span>
                  </div>
                </div>

                {/* Annual Savings Callout Badge (Matches Screenshot) */}
                <div style={{
                  background: tier.annualBadgeBg,
                  border: `1px solid ${tier.annualBadgeBorder}`,
                  color: tier.annualBadgeColor,
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
                  <span>{tier.annualSavingsCallout}</span>
                </div>

                {/* Capacity */}
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
                  marginBottom: '18px'
                }}>
                  <span>{tier.capacity}</span>
                </div>

                <div className="tier-cta-wrap">
                  <button
                    type="button"
                    onClick={() => openCheckout(tier.id, tier.id !== 'enterprise')}
                    className={`tier-cta-btn ${tier.isPopular ? 'nano-button' : 'tier-cta-secondary'}`}
                  >
                    {tier.ctaText}
                  </button>
                </div>

                <div className="tier-divider"></div>

                <ul className="tier-features-list">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="tier-feature-item">
                      <CheckCircleIcon size={16} color={tier.isPopular ? '#38bdf8' : '#00f5d4'} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Design Partner Program Callout Banner (Matches Screenshot) */}
        <div style={{
          background: 'rgba(56, 189, 248, 0.05)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          padding: '16px 22px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <SparklesIcon size={18} color="#38bdf8" />
            <strong style={{ fontSize: '14px', color: '#fff' }}>Chương trình Đối Tác Sáng Lập (Design Partner Program)</strong>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
            10 kế toán đầu tiên đăng ký nhận Pro Studio miễn phí 6 tháng, đổi lại phản hồi hàng tuần và quyền trích dẫn khi A-Sổ ra mắt chính thức. Sau kỳ ưu đãi hưởng giảm 40% năm đầu.
          </p>
        </div>

        {/* Policy Footnotes */}
        <div style={{
          fontSize: '11px',
          color: '#94a3b8',
          lineHeight: '1.7',
          marginBottom: '36px',
          borderLeft: '2px solid rgba(0, 245, 212, 0.4)',
          paddingLeft: '14px'
        }}>
          <div>• Giá đã bao gồm 8% VAT. Xuất hoá đơn điện tử VAT cho công ty dịch vụ kế toán mỗi kỳ thanh toán.</div>
          <div>• Không bao gồm dịch vụ HĐĐT-MTT theo NĐ 70/2025 (đăng ký riêng qua đối tác meInvoice, EasyInvoice hoặc VNPT).</div>
          <div>• <strong>Ân hạn 7 ngày:</strong> Không tạm khóa tài khoản ngay lập tức khi chậm nộp tiền để đảm bảo tiến độ báo cáo thuế cho khách hàng.</div>
          <div>• <strong>Chính sách hoàn tiền:</strong> Hoàn 100% trong 7 ngày đầu tiên nếu không hài lòng. Không hoàn tiền cho tháng dở dang.</div>
          <div>• <strong>Gói Khởi Tạo Chuyên Nghiệp (Concierge Setup):</strong> Tùy chọn 500.000đ để đội ngũ kỹ thuật A-Sổ trực tiếp hỗ trợ di cư 10 hộ đầu tiên từ MISA/Excel.</div>
        </div>

        {/* Pricing FAQ */}
        <div className="pricing-faq-wrap">
          <h3 className="faq-heading">Giải Đáp Thắc Mắc Kế Toán Dịch Vụ</h3>
          <div className="faq-list">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`faq-item glass-panel ${isOpen ? 'faq-item-open' : ''}`}
                  onClick={() => toggleFaq(idx)}
                >
                  <div className="faq-question">
                    <span>{faq.q}</span>
                    <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                  </div>
                  {isOpen && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic VietQR Checkout Modal */}
      <VietQRCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={checkoutPlan}
        billingCycle={billingCycle}
        isTrial={isTrialMode}
      />
    </section>
  );
}
