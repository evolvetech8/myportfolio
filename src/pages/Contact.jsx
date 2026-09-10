import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { PhoneIcon, MailIcon, GlobeIcon, CheckCircleIcon, ArrowRightIcon } from '../components/Icons';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || (!formData.phone.trim() && !formData.email.trim())) {
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <section className="contact-page">
      <h1 className="page-title">{t('contact.title')}</h1>
      <p className="contact-subtitle">{t('contact.subtitle')}</p>

      <div className="contact-grid">
        <div className="contact-form glass-panel">
          {isSubmitted ? (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(0, 245, 212, 0.1)',
                border: '1px solid rgba(0, 245, 212, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircleIcon size={28} color="#00f5d4" />
              </div>

              <h3 style={{ margin: '0 0 10px', fontSize: '20px', color: '#fff' }}>
                Đã Nhận Yêu Cầu Tư Vấn Thành Công!
              </h3>
              <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                Cảm ơn <strong>{formData.name}</strong>. Đội ngũ chuyên viên thuế và kỹ thuật A-Sổ đã tiếp nhận thông tin và sẽ chủ động liên hệ qua điện thoại/Zalo trong vòng 15 phút.
              </p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://zalo.me/0353600900"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#00f5d4',
                    color: '#05101a',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <PhoneIcon size={14} />
                  <span>Mở Chat Zalo Ngay (0353.600.900)</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', phone: '', email: '', message: '' });
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#cbd5e1',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Gửi Yêu Cầu Khác
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('contact.name')} *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Họ và tên kế toán viên / Đại lý thuế / Chủ hộ" 
                />
              </div>

              <div className="form-group">
                <label>Số Điện Thoại / Zalo *</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0988 123 456" 
                />
              </div>

              <div className="form-group">
                <label>{t('contact.email')}</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@ketoan.vn" 
                />
              </div>

              <div className="form-group">
                <label>{t('contact.message')} *</label>
                <textarea 
                  rows={4} 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Nhu cầu tư vấn: Gói dùng thử 30 ngày, tích hợp VietQR, di cư từ MISA, hoặc hợp đồng Enterprise..."
                />
              </div>

              <button type="submit" className="nano-button" style={{ width: '100%', cursor: 'pointer' }}>
                <span>{t('contact.send')}</span>
              </button>
            </form>
          )}
        </div>

        <div className="contact-info glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <PhoneIcon size={18} color="var(--archonic-orange)" />
            <h3 style={{ margin: 0 }}>{t('contact.phone')} &amp; Hotline Zalo 24/7</h3>
          </div>
          <p style={{ color: 'var(--archonic-orange)', fontSize: '24px', fontWeight: 'bold', margin: '0 0 20px' }}>
            <a href="tel:0353600900" style={{ color: 'inherit' }}>0353 600 900</a>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <MailIcon size={18} color="var(--archonic-amber)" />
            <h3 style={{ margin: 0 }}>{t('contact.emailLabel')}</h3>
          </div>
          <p style={{ color: 'var(--archonic-amber)', fontSize: '16px', margin: '0 0 20px' }}>
            <a href="mailto:archonic88@gmail.com" style={{ color: 'inherit' }}>archonic88@gmail.com</a>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <GlobeIcon size={18} color="#00f5d4" />
            <h3 style={{ margin: 0 }}>Cổng Thông Tin Trực Tuyến</h3>
          </div>
          <p style={{ color: '#00f5d4', fontSize: '16px', margin: '0 0 24px' }}>
            evolvetech.biz.vn
          </p>

          <div style={{
            padding: '14px',
            borderRadius: '10px',
            background: 'rgba(255, 161, 0, 0.08)',
            border: '1px solid rgba(255, 161, 0, 0.25)',
            fontSize: '12px',
            color: '#cbd5e1',
            lineHeight: '1.5'
          }}>
            <strong style={{ color: '#FFA100', display: 'block', marginBottom: '4px' }}>
              Chương Trình Đối Tác Thiết Kế (Design Partner):
            </strong>
            Miễn phí 3 tháng đầu gói Pro Studio cho 10 đại lý thuế đầu tiên hỗ trợ phản hồi nghiệp vụ Thông tư 152/2025/TT-BTC.
          </div>
        </div>
      </div>
    </section>
  );
}
