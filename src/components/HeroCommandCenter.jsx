import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function HeroCommandCenter() {
  const { t, lang } = useLanguage();
  const [activeItem, setActiveItem] = useState(0);

  const feedItems = [
    {
      time: '19:24:02',
      badge: 'POS AUTO-INGEST',
      color: '#FFE135',
      text: lang === 'vi' 
        ? 'POS #04: Doanh thu bán lẻ +1.450.000đ → Tự động ghi Sổ S1-HKD (Doanh thu)' 
        : 'POS Terminal #04: +1,450,000 VND logged into Ledger S1 (Revenue)'
    },
    {
      time: '19:24:06',
      badge: 'DECREE 123',
      color: '#4ade80',
      text: lang === 'vi' 
        ? 'Hóa đơn điện tử #008491 → Khớp mã xác thực cơ quan thuế (Hợp lệ 100%)' 
        : 'E-Invoice #008491 reconciled against Tax Authority portal (100% Valid)'
    },
    {
      time: '19:24:11',
      badge: 'VISIONCORE OCR',
      color: '#818cf8',
      text: lang === 'vi' 
        ? 'VisionCore OCR: Trích xuất biên lai nhập hàng kho vận trong 0.84s (Độ khớp 99.8%)' 
        : 'VisionCore OCR: Processed warehouse receipt in 0.84s (99.8% precision)'
    },
    {
      time: '19:24:16',
      badge: 'CIRCULAR 88',
      color: '#38bdf8',
      text: lang === 'vi' 
        ? 'Cân đối Sổ tiền mặt (S4-HKD) & Sổ tiền gửi (S5-HKD) → Khớp dòng tiền thực tế' 
        : 'Reconciled Cash (S4-HKD) & Bank (S5-HKD) ledgers with active cashflow'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveItem((prev) => (prev + 1) % feedItems.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-command-center glass-panel">
      {/* Window Header */}
      <div className="hcc-header">
        <div className="hcc-dots">
          <span className="hcc-dot hcc-dot-red"></span>
          <span className="hcc-dot hcc-dot-yellow"></span>
          <span className="hcc-dot hcc-dot-green"></span>
        </div>
        <div className="hcc-title">
          <span>{t('mockup.title')}</span>
        </div>
        <div className="hcc-status">
          <span className="hcc-status-beacon"></span>
          <span>{t('mockup.status')}</span>
        </div>
      </div>

      {/* Window Body */}
      <div className="hcc-body">
        {/* Left Column: Live Terminal Feed */}
        <div className="hcc-feed">
          <div className="hcc-feed-header">
            <span className="hcc-feed-dot"></span>
            <span>{t('mockup.terminalFeed')}</span>
          </div>

          <div className="hcc-feed-list">
            {feedItems.map((item, idx) => (
              <div 
                key={idx} 
                className={`hcc-feed-row ${idx === activeItem ? 'hcc-feed-row-active' : ''}`}
              >
                <span className="hcc-feed-time">[{item.time}]</span>
                <span 
                  className="hcc-feed-badge" 
                  style={{ borderColor: item.color, color: item.color }}
                >
                  {item.badge}
                </span>
                <span className="hcc-feed-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Compliance Telemetry */}
        <div className="hcc-metrics-widget">
          <div className="hcc-metric-box">
            <span className="hcc-metric-num">100%</span>
            <span className="hcc-metric-title">{t('mockup.complianceScore')}</span>
            <span className="hcc-metric-sub">{t('mockup.auditReady')}</span>
          </div>

          <div className="hcc-ledger-bars">
            <div className="hcc-bar-row">
              <span>Sổ Doanh Thu (S1-HKD)</span>
              <div className="hcc-progress-bar"><div className="hcc-progress-fill" style={{ width: '100%' }}></div></div>
            </div>
            <div className="hcc-bar-row">
              <span>Sổ Chi Phí (S3-HKD)</span>
              <div className="hcc-progress-bar"><div className="hcc-progress-fill" style={{ width: '100%' }}></div></div>
            </div>
            <div className="hcc-bar-row">
              <span>Đối Chiếu NĐ 123 HĐĐT</span>
              <div className="hcc-progress-bar"><div className="hcc-progress-fill hcc-progress-accent" style={{ width: '100%' }}></div></div>
            </div>
          </div>

          <div className="hcc-hash-badge">
            <span>HASH: 0x89e2...f48a [E2EE VERIFIED]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
