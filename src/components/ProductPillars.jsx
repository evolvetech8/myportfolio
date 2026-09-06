import { useLanguage } from '../i18n/LanguageContext';
import { LandmarkIcon, FileTextIcon, LockIcon } from './Icons';

export default function ProductPillars() {
  const { t } = useLanguage();

  return (
    <section id="products" className="products-section">
      <h2 className="section-title">{t('products.title')}</h2>
      
      <div className="products-grid">
        {/* Module 1: Sổ Kế Toán Thông Tư 152 */}
        <div className="product-card glass-panel">
          <div className="product-card-top">
            <div className="product-icon" style={{ color: '#FF7A00' }}>
              <LandmarkIcon size={32} color="#FF7A00" />
            </div>
            <span className="product-pill" style={{ borderColor: 'rgba(255, 122, 0, 0.4)', color: '#FF7A00' }}>
              {t('products.module1.tag')}
            </span>
          </div>
          
          <h3 className="product-name">{t('products.module1.name')}</h3>
          <span className="product-tagline" style={{ color: '#FF7A00' }}>
            {t('products.module1.tagline')}
          </span>
          <p className="product-desc">{t('products.module1.desc')}</p>

          {/* Micro-UI: 7 Ledgers Breakdown */}
          <div className="product-micro-ui">
            <div className="micro-header">
              <span className="micro-dot-green"></span>
              <span>Sổ Kế Toán Thông Tư 152 (S1a, S2b, S2c)</span>
            </div>
            <div className="micro-data-row">
              <span className="micro-data-key">Sổ Doanh Thu (S1a)</span>
              <span className="micro-data-val">Tự động kết chuyển</span>
              <span className="micro-status-tag">HOÀN TẤT</span>
            </div>
            <div className="micro-data-row">
              <span className="micro-data-key">Sổ Hàng Hóa & CP (S2b, S2c)</span>
              <span className="micro-data-val">Khớp 100% hóa đơn</span>
              <span className="micro-status-tag">TT152 HỢP LỆ</span>
            </div>
          </div>
        </div>

        {/* Module 2: Đối Chiếu Hóa Đơn NĐ123 */}
        <div className="product-card glass-panel">
          <div className="product-card-top">
            <div className="product-icon" style={{ color: '#FF7A00' }}>
              <FileTextIcon size={32} color="#FF7A00" />
            </div>
            <span className="product-pill" style={{ borderColor: 'rgba(255, 122, 0, 0.4)', color: '#FF7A00' }}>
              {t('products.module2.tag')}
            </span>
          </div>

          <h3 className="product-name">{t('products.module2.name')}</h3>
          <span className="product-tagline" style={{ color: '#FF7A00' }}>
            {t('products.module2.tagline')}
          </span>
          <p className="product-desc">{t('products.module2.desc')}</p>

          {/* Micro-UI: E-Invoice Matching */}
          <div className="product-micro-ui">
            <div className="micro-header">
              <span className="micro-dot-green"></span>
              <span>Đồng Bộ Cổng Hóa Đơn Tổng Cục Thuế</span>
            </div>
            <div className="micro-data-row">
              <span className="micro-data-key">HĐĐT Đầu Vào/Ra</span>
              <span className="micro-data-val">Tự động đối chiếu</span>
              <span className="micro-status-tag">NĐ 123 CHUẨN</span>
            </div>
            <div className="micro-data-row">
              <span className="micro-data-key">Mã Cơ Quan Thuế</span>
              <span className="micro-data-val">Xác thực tức thời</span>
              <span className="micro-status-tag">KHÔNG LỖI</span>
            </div>
          </div>
        </div>

        {/* Module 3: Tích Hợp Dòng Tiền & POS */}
        <div className="product-card glass-panel">
          <div className="product-card-top">
            <div className="product-icon" style={{ color: '#FF7A00' }}>
              <LockIcon size={32} color="#FF7A00" />
            </div>
            <span className="product-pill" style={{ borderColor: 'rgba(255, 122, 0, 0.4)', color: '#FF7A00' }}>
              {t('products.module3.tag')}
            </span>
          </div>

          <h3 className="product-name">{t('products.module3.name')}</h3>
          <span className="product-tagline" style={{ color: '#FF7A00' }}>
            {t('products.module3.tagline')}
          </span>
          <p className="product-desc">{t('products.module3.desc')}</p>

          {/* Micro-UI: Cashflow & POS Bridge */}
          <div className="product-micro-ui">
            <div className="micro-header">
              <span className="micro-dot-green"></span>
              <span>Cầu Nối POS & Chuyển Khoản Ngân Hàng</span>
            </div>
            <div className="micro-data-row">
              <span className="micro-data-key">Thiết Bị POS / VietQR</span>
              <span className="micro-data-val">Ghi nhận thời gian thực</span>
              <span className="micro-status-tag">E2EE AN TOÀN</span>
            </div>
            <div className="micro-data-row">
              <span className="micro-data-key">Sổ Quỹ Tiền Mặt (S4)</span>
              <span className="micro-data-val">Khớp dòng tiền 100%</span>
              <span className="micro-status-tag">SẴN SÀNG</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
