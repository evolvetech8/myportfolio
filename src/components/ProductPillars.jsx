import { useLanguage } from '../i18n/LanguageContext';
import { LandmarkIcon, VideoIcon, ScanIcon } from './Icons';

export default function ProductPillars() {
  const { t } = useLanguage();

  return (
    <section id="products" className="products-section">
      <h2 className="section-title">{t('products.title')}</h2>
      
      <div className="products-grid">
        {/* Card 1: Archonic Bridge */}
        <div className="product-card glass-panel">
          <div className="product-card-top">
            <div className="product-icon" style={{ color: '#FFE135' }}>
              <LandmarkIcon size={32} color="#FFE135" />
            </div>
            <span className="product-pill" style={{ borderColor: 'rgba(255, 225, 53, 0.4)', color: '#FFE135' }}>
              {t('products.bridge.tag')}
            </span>
          </div>
          
          <h3 className="product-name">{t('products.bridge.name')}</h3>
          <span className="product-tagline" style={{ color: '#FFE135' }}>
            {t('products.bridge.tagline')}
          </span>
          <p className="product-desc">{t('products.bridge.desc')}</p>

          {/* Micro-UI Preview: Ledger Reconciliation */}
          <div className="product-micro-ui">
            <div className="micro-header">
              <span className="micro-dot-green"></span>
              <span>Hóa Đơn Điện Tử ➔ Sổ S1-HKD</span>
            </div>
            <div className="micro-data-row">
              <span className="micro-data-key">HĐĐT #004928</span>
              <span className="micro-data-val">2.850.000đ</span>
              <span className="micro-status-tag">ĐÃ ĐỐI CHIẾU</span>
            </div>
            <div className="micro-data-row">
              <span className="micro-data-key">Sổ Quỹ Tiền Mặt</span>
              <span className="micro-data-val">Khớp 100%</span>
              <span className="micro-status-tag">TT88 HỢP LỆ</span>
            </div>
          </div>
        </div>

        {/* Card 2: HowDoI */}
        <div className="product-card glass-panel">
          <div className="product-card-top">
            <div className="product-icon" style={{ color: '#818cf8' }}>
              <VideoIcon size={32} color="#818cf8" />
            </div>
            <span className="product-pill" style={{ borderColor: 'rgba(129, 140, 248, 0.4)', color: '#818cf8' }}>
              {t('products.howdoi.tag')}
            </span>
          </div>

          <h3 className="product-name">{t('products.howdoi.name')}</h3>
          <span className="product-tagline" style={{ color: '#818cf8' }}>
            {t('products.howdoi.tagline')}
          </span>
          <p className="product-desc">{t('products.howdoi.desc')}</p>

          {/* Micro-UI Preview: AI Video Pipeline */}
          <div className="product-micro-ui">
            <div className="micro-header">
              <span className="micro-dot-purple"></span>
              <span>AI Multi-Channel Rendering Engine</span>
            </div>
            <div className="micro-progress-container">
              <div className="micro-progress-label">
                <span>Prompt to 4K Video Pipeline</span>
                <span style={{ color: '#818cf8' }}>Active (100%)</span>
              </div>
              <div className="micro-bar"><div className="micro-bar-fill-purple"></div></div>
            </div>
            <div className="micro-tags-row">
              <span>#TikTok</span>
              <span>#Reels</span>
              <span>#YouTubeShorts</span>
              <span className="micro-tag-auto">AUTO-POST</span>
            </div>
          </div>
        </div>

        {/* Card 3: VisionCore */}
        <div className="product-card glass-panel">
          <div className="product-card-top">
            <div className="product-icon" style={{ color: '#34d399' }}>
              <ScanIcon size={32} color="#34d399" />
            </div>
            <span className="product-pill" style={{ borderColor: 'rgba(52, 211, 153, 0.4)', color: '#34d399' }}>
              {t('products.visioncore.tag')}
            </span>
          </div>

          <h3 className="product-name">{t('products.visioncore.name')}</h3>
          <span className="product-tagline" style={{ color: '#34d399' }}>
            {t('products.visioncore.tagline')}
          </span>
          <p className="product-desc">{t('products.visioncore.desc')}</p>

          {/* Micro-UI Preview: Laser Scanning Beam */}
          <div className="product-micro-ui micro-scanner-card">
            <div className="micro-scanner-beam"></div>
            <div className="micro-header">
              <span className="micro-dot-green"></span>
              <span>VisionCore Edge OCR Engine (Air-Gapped)</span>
            </div>
            <div className="micro-data-row">
              <span className="micro-data-key">Thời gian trích xuất:</span>
              <span className="micro-data-val" style={{ color: '#34d399', fontWeight: 800 }}>0.82 giây</span>
            </div>
            <div className="micro-data-row">
              <span className="micro-data-key">Độ chính xác OCR:</span>
              <span className="micro-data-val" style={{ color: '#34d399', fontWeight: 800 }}>99.82%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
