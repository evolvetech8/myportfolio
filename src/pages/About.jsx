import { useLanguage } from '../i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { 
  LandmarkIcon, 
  SparklesIcon, 
  ShieldIcon, 
  CloudIcon, 
  LockIcon, 
  CheckCircleIcon
} from '../components/Icons';

export default function About() {
  const { lang, t } = useLanguage();
  const isEn = lang === 'en';

  return (
    <section className="about-page">
      {/* Dynamic Ambient Background Glows */}
      <div className="about-aurora-glow about-glow-1" aria-hidden="true"></div>
      <div className="about-aurora-glow about-glow-2" aria-hidden="true"></div>

      {/* Hero Header of About Page */}
      <div className="about-hero-header">
        <div className="about-pre-badge">
          <SparklesIcon size={14} color="#FFA100" />
          <span>{isEn ? 'ARCHONIC ENTERPRISE FINTECH & AI' : 'HẠ TẦNG TÀI CHÍNH & THUẾ THẾ HỆ MỚI'}</span>
        </div>
        <h1 className="about-main-title">
          {isEn
            ? 'Pioneering Autonomous Financial Infrastructure for Emerging Asia'
            : 'Kiến Tạo Hạ Tầng Sổ Thuế Số & Kỹ Thuật Tự Trị Cho Doanh Nghiệp'}
        </h1>
        <p className="about-lead-desc">
          {isEn
            ? 'Archonic transforms regulatory tax complexities into seamless, zero-touch automation. Through our flagship A-Sổ platform, we empower millions of businesses to achieve 100% tax compliance with zero manual data entry.'
            : 'Archonic chuyển hóa những rào cản phức tạp về kế toán thuế thành chu trình tự động hóa không chạm. Thông qua nền tảng cờ đầu A-Sổ, chúng tôi giải phóng hàng triệu cơ sở kinh doanh khỏi áp lực ghi sổ thủ công, đảm bảo 100% chuẩn mực pháp lý.'}
        </p>
      </div>

      {/* Metrics Bento Bar */}
      <div className="about-metrics-bar">
        <div className="about-metric-card glass-panel">
          <div className="about-metric-num">100%</div>
          <div className="about-metric-label">{isEn ? 'Regulatory Compliance' : 'Chuẩn Hóa Pháp Lý'}</div>
          <div className="about-metric-sub">{isEn ? 'Circular 88 (7/7) & Decree 123' : 'Thông tư 88 (7/7 Sổ) & NĐ 123'}</div>
        </div>
        <div className="about-metric-card glass-panel">
          <div className="about-metric-num">&lt; 1.2s</div>
          <div className="about-metric-label">{isEn ? 'Ledger Sync Latency' : 'Tốc Độ Ghi Sổ Tức Thì'}</div>
          <div className="about-metric-sub">{isEn ? 'Real-time VietQR & POS matching' : 'Hút giao dịch VietQR & POS tự động'}</div>
        </div>
        <div className="about-metric-card glass-panel">
          <div className="about-metric-num">99.98%</div>
          <div className="about-metric-label">{isEn ? 'Cloud Infrastructure SLA' : 'Độ Sẵn Sàng Điện Toán'}</div>
          <div className="about-metric-sub">{isEn ? 'Google Cloud Run self-healing' : 'Hạ tầng đám mây tự phục hồi'}</div>
        </div>
        <div className="about-metric-card glass-panel">
          <div className="about-metric-num">E2EE</div>
          <div className="about-metric-label">{isEn ? 'Bank-Grade Security' : 'Bảo Mật Cấp Ngân Hàng'}</div>
          <div className="about-metric-sub">{isEn ? 'AES-256 multi-layer encryption' : 'Mã hóa đa tầng AES-256 độc lập'}</div>
        </div>
      </div>

      {/* Bento Grid: 3 Pillars with rich visual depth */}
      <div className="about-bento-grid">
        {/* Bento 1: Mission */}
        <div className="about-bento-card bento-mission glass-panel">
          <div className="bento-card-top">
            <div className="bento-icon-circle icon-orange">
              <LandmarkIcon size={24} color="#FF6D00" />
            </div>
            <span className="bento-badge">{isEn ? 'FOUNDING MISSION' : 'SỨ MỆNH CÔNG NGHỆ'}</span>
          </div>

          <h2 className="bento-title">
            {isEn
              ? 'Democratizing Institutional-Grade Financial Infrastructure'
              : 'Đưa Công Nghệ Tài Chính Chuẩn Mực Doanh Nghiệp Đến Từng Hộ Kinh Doanh'}
          </h2>
          <p className="bento-text">
            {t('about.missionText')}
          </p>

          <div className="bento-feature-checklist">
            <div className="checklist-item">
              <CheckCircleIcon size={16} color="#4ade80" />
              <span>{isEn ? 'Automated generation of all 7 Circular 88 mandatory books' : 'Tự động lập và đối soát 7/7 loại sổ kế toán Thông tư 88'}</span>
            </div>
            <div className="checklist-item">
              <CheckCircleIcon size={16} color="#4ade80" />
              <span>{isEn ? 'Instant e-invoice validation with General Department of Taxation' : 'Xác thực hóa đơn điện tử Nghị định 123 trực tiếp với Cổng Thuế'}</span>
            </div>
            <div className="checklist-item">
              <CheckCircleIcon size={16} color="#4ade80" />
              <span>{isEn ? 'Eliminating 95% of manual bookkeeping and spreadsheet errors' : 'Triệt tiêu 95% thời gian gõ sổ tay và rủi ro phạt sai lệch'}</span>
            </div>
          </div>
        </div>

        {/* Bento 2: Vision & Roadmap */}
        <div className="about-bento-card bento-vision glass-panel">
          <div className="bento-card-top">
            <div className="bento-icon-circle icon-amber">
              <SparklesIcon size={22} color="#FFA100" />
            </div>
            <span className="bento-badge badge-gold">{isEn ? 'TARGET HORIZON' : 'TẦM NHÌN 2026 - 2030'}</span>
          </div>

          <h2 className="bento-title">
            {isEn ? 'Forbes Asia 100 to Watch Aspirations' : 'Tiên Phong Hạ Tầng Sổ Thuế Số Khu Vực'}
          </h2>
          <p className="bento-text">
            {t('about.visionText')}
          </p>

          {/* Interactive Roadmap Milestones */}
          <div className="bento-roadmap">
            <div className="roadmap-step">
              <div className="step-bullet active"></div>
              <div className="step-body">
                <span className="step-year">2026</span>
                <span className="step-detail">{isEn ? 'Launch A-Sổ nationwide, serving 50,000+ retail merchants' : 'Phát hành A-Sổ toàn quốc, phục vụ 50.000+ hộ kinh doanh chuyển đổi số'}</span>
              </div>
            </div>
            <div className="roadmap-step">
              <div className="step-bullet"></div>
              <div className="step-body">
                <span className="step-year">2027</span>
                <span className="step-detail">{isEn ? 'Open Banking direct API & AI predictive tax anomaly engine' : 'Tích hợp Open Banking API & AI phát hiện bất thường trước thanh tra thuế'}</span>
              </div>
            </div>
            <div className="roadmap-step">
              <div className="step-bullet"></div>
              <div className="step-body">
                <span className="step-year">2028 - 2030</span>
                <span className="step-detail">{isEn ? 'Regional Southeast Asia expansion for micro-business compliance' : 'Mở rộng hạ tầng số hóa thuế cho thị trường Đông Nam Á'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento 3: AI-Native & Autonomous Architecture */}
        <div className="about-bento-card bento-architecture glass-panel">
          <div className="bento-card-top">
            <div className="bento-icon-circle icon-purple">
              <CloudIcon size={22} color="#818cf8" />
            </div>
            <span className="bento-badge badge-purple">{isEn ? 'ENGINEERING PHILOSOPHY' : 'KIẾN TRÚC AI-NATIVE & TỰ TRỊ'}</span>
          </div>

          <div className="architecture-split">
            <div className="arch-text-col">
              <h2 className="bento-title">
                {isEn ? 'Autonomous Software Studio & Self-Healing Architecture' : 'Vận Hành Kỹ Thuật Tự Phục Hồi & Bảo Mật Tuyệt Đối'}
              </h2>
              <p className="bento-text">
                {t('about.approachText')}
              </p>
              
              <div className="arch-highlights-row">
                <div className="arch-pill">
                  <LockIcon size={14} color="#4ade80" />
                  <span>{isEn ? 'Multi-tenant Data Isolation' : 'Cách ly dữ liệu đa người thuê'}</span>
                </div>
                <div className="arch-pill">
                  <ShieldIcon size={14} color="#FFA100" />
                  <span>{isEn ? 'Zero-Knowledge Ledger Storage' : 'Lưu trữ sổ sách chuẩn mật'}</span>
                </div>
              </div>
            </div>

            <div className="arch-tech-stack-box">
              <span className="stack-box-title">{isEn ? 'CORE TECHNOLOGY STACK' : 'HẠ TẦNG KỸ THUẬT NỀN TẢNG'}</span>
              <div className="tech-tags-grid">
                <span className="tech-tag">Google Cloud Run</span>
                <span className="tech-tag">PostgreSQL Financial Engine</span>
                <span className="tech-tag">AES-256 E2EE</span>
                <span className="tech-tag">Napas 247 VietQR API</span>
                <span className="tech-tag">Vision AI OCR Parser</span>
                <span className="tech-tag">Docker Microservices</span>
                <span className="tech-tag">Automated CI/CD Test Pipelines</span>
                <span className="tech-tag">TLS 1.3 Strict Transport</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Principles Section */}
      <div className="about-principles-section">
        <h2 className="principles-heading">
          {isEn ? '3 Core Pillars Guiding Archonic Engineering' : '3 Giá Trị Cốt Lõi Định Hình Sản Phẩm Archonic'}
        </h2>
        <div className="principles-grid">
          <div className="principle-card glass-panel">
            <div className="principle-num">01</div>
            <h3 className="principle-title">{isEn ? 'Zero-Touch Automation' : 'Tự Động Hóa Không Chạm'}</h3>
            <p className="principle-desc">
              {isEn
                ? 'Computers excel at repetitive, error-prone tasks. We automate all bank transaction ingestion and ledger balancing so business owners never touch spreadsheets.'
                : 'Máy tính giải quyết xuất sắc các việc lặp lại và dễ sai sót. A-Sổ tự động kết nối tài khoản và đồng bộ sổ sách để chủ hộ kinh doanh không cần chạm vào bảng tính.'}
            </p>
          </div>
          <div className="principle-card glass-panel">
            <div className="principle-num">02</div>
            <h3 className="principle-title">{isEn ? 'Absolute Regulatory Rigor' : 'Pháp Lý Chuẩn Mực Tuyệt Đối'}</h3>
            <p className="principle-desc">
              {isEn
                ? 'We strictly comply with Ministry of Finance guidelines (Circular 152/2025 & Decree 123). Every ledger generated is 100% valid for tax audits and inspections.'
                : 'Chúng tôi bám sát nghiêm ngặt các văn bản pháp quy mới nhất của Bộ Tài Chính (Thông tư 152/2025/TT-BTC & Nghị định 123). Mọi biểu mẫu kết xuất đều đạt chuẩn 100% sẵn sàng cho kỳ thanh tra thuế.'}
            </p>
          </div>
          <div className="principle-card glass-panel">
            <div className="principle-num">03</div>
            <h3 className="principle-title">{isEn ? 'Bank-Grade Data Privacy' : 'Bảo Mật Độc Lập Cấp Ngân Hàng'}</h3>
            <p className="principle-desc">
              {isEn
                ? 'Your revenue and transaction data belongs solely to you. We employ end-to-end encryption and multi-region backups with guaranteed 99.98% uptime.'
                : 'Dữ liệu doanh thu và giao dịch là tài sản tối mật của khách hàng. Chúng tôi áp dụng mã hóa E2EE, phân quyền đa tầng và tự động sao lưu định kỳ đa vùng an toàn.'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Conversion CTA Banner */}
      <div className="about-cta-banner glass-panel">
        <div className="cta-banner-content">
          <span className="cta-banner-badge">{isEn ? 'START MODERNIZING TODAY' : 'BẮT ĐẦU CHUYỂN ĐỔI SỐ SỔ THUẾ'}</span>
          <h2 className="cta-banner-title">
            {isEn ? 'Ready to Experience Zero-Touch Tax Accounting?' : 'Sẵn Sàng Trải Nghiệm Kỷ Nguyên Tự Động Hóa Kế Toán Thuế?'}
          </h2>
          <p className="cta-banner-desc">
            {isEn
              ? 'Join forward-thinking retail owners and SMEs modernizing with A-Sổ. Start your 14-day risk-free trial today.'
              : 'Đồng hành cùng hàng ngàn hộ kinh doanh và SME tiên phong chuẩn hóa sổ sách với A-Sổ. Dùng thử 14 ngày miễn phí ngay hôm nay.'}
          </p>
          <div className="cta-banner-actions">
            <Link to="/pricing" className="nano-button cta-primary-btn">
              {isEn ? 'Start 14-Day Free Trial' : 'Bắt Đầu Dùng Thử 14 Ngày (0đ)'}
            </Link>
            <Link to="/contact" className="cta-secondary-btn">
              {isEn ? 'Contact Engineering Team' : 'Liên Hệ Đội Ngũ Kỹ Thuật'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
