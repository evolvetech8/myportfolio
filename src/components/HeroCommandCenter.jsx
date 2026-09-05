import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ShoppingCartIcon, FileTextIcon, QrCodeIcon, LandmarkIcon, DownloadIcon, CheckCircleIcon } from './Icons';

export default function HeroCommandCenter() {
  const { t } = useLanguage();
  const [activeItem, setActiveItem] = useState(0);

  const feedItems = [
    {
      id: 'item1',
      icon: <ShoppingCartIcon size={18} color="#FF8A00" />,
      iconBg: 'rgba(255, 109, 0, 0.12)',
      tagColor: '#FFA100',
      tagBg: 'rgba(255, 161, 0, 0.12)',
      borderAccent: 'rgba(255, 109, 0, 0.45)'
    },
    {
      id: 'item2',
      icon: <FileTextIcon size={18} color="#4ade80" />,
      iconBg: 'rgba(74, 222, 128, 0.12)',
      tagColor: '#4ade80',
      tagBg: 'rgba(74, 222, 128, 0.12)',
      borderAccent: 'rgba(74, 222, 128, 0.45)'
    },
    {
      id: 'item3',
      icon: <QrCodeIcon size={18} color="#38bdf8" />,
      iconBg: 'rgba(56, 189, 248, 0.12)',
      tagColor: '#38bdf8',
      tagBg: 'rgba(56, 189, 248, 0.12)',
      borderAccent: 'rgba(56, 189, 248, 0.45)'
    },
    {
      id: 'item4',
      icon: <LandmarkIcon size={18} color="#a78bfa" />,
      iconBg: 'rgba(167, 139, 250, 0.12)',
      tagColor: '#a78bfa',
      tagBg: 'rgba(167, 139, 250, 0.12)',
      borderAccent: 'rgba(167, 139, 250, 0.45)'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveItem((prev) => (prev + 1) % feedItems.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [feedItems.length]);

  return (
    <div className="hero-command-center glass-panel">
      {/* SaaS App Header */}
      <div className="hcc-header">
        <div className="hcc-dots">
          <span className="hcc-dot hcc-dot-red"></span>
          <span className="hcc-dot hcc-dot-yellow"></span>
          <span className="hcc-dot hcc-dot-green"></span>
        </div>
        <div className="hcc-title-wrap">
          <span className="hcc-app-badge">{t('mockup.windowTitle')}</span>
          <span className="hcc-store-context">{t('mockup.storeContext')}</span>
        </div>
        <div className="hcc-status">
          <span className="hcc-status-beacon"></span>
          <span>{t('mockup.status')}</span>
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="hcc-body">
        {/* Left Column: Live Accounting & Activity Stream */}
        <div className="hcc-feed">
          <div className="hcc-feed-header">
            <div className="hcc-feed-header-left">
              <span className="hcc-feed-dot"></span>
              <span className="hcc-feed-heading">{t('mockup.feedHeader')}</span>
            </div>
            <span className="hcc-feed-badge-live">{t('mockup.feedLiveBadge')}</span>
          </div>

          <div className="hcc-feed-list">
            {feedItems.map((item, idx) => (
              <div 
                key={item.id} 
                className={`hcc-feed-card ${idx === activeItem ? 'hcc-feed-card-active' : ''}`}
                style={idx === activeItem ? { borderColor: item.borderAccent } : {}}
              >
                <div className="hcc-card-icon" style={{ background: item.iconBg }}>
                  {item.icon}
                </div>
                <div className="hcc-card-content">
                  <div className="hcc-card-top-row">
                    <span className="hcc-card-title">{t(`mockup.${item.id}.title`)}</span>
                    <span className="hcc-card-amount">{t(`mockup.${item.id}.amount`)}</span>
                  </div>
                  <div className="hcc-card-bottom-row">
                    <span className="hcc-card-desc">{t(`mockup.${item.id}.desc`)}</span>
                  </div>
                </div>
                <div className="hcc-card-meta">
                  <span 
                    className="hcc-status-pill"
                    style={{ color: item.tagColor, background: item.tagBg }}
                  >
                    {t(`mockup.${item.id}.tag`)}
                  </span>
                  <span className="hcc-card-time">{t(`mockup.${item.id}.time`)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Financial Health & Tax Audit Readiness */}
        <div className="hcc-metrics-widget">
          <div className="hcc-audit-card">
            <div className="hcc-audit-top">
              <span className="hcc-audit-score">100%</span>
              <div className="hcc-audit-badge-wrap">
                <CheckCircleIcon size={15} color="#4ade80" />
                <span>{t('mockup.complianceScore')}</span>
              </div>
            </div>
            <span className="hcc-audit-sub">{t('mockup.auditReady')}</span>
            
            <button className="hcc-export-action-btn" type="button">
              <DownloadIcon size={14} color="#ffffff" />
              <span>{t('mockup.exportBtn')}</span>
            </button>
          </div>

          <div className="hcc-ledger-bars">
            <span className="hcc-ledger-section-title">{t('mockup.ledgerProgressTitle')}</span>
            
            <div className="hcc-bar-row">
              <div className="hcc-bar-labels">
                <span>{t('mockup.ledger1')}</span>
                <span className="hcc-bar-status-text">{t('mockup.ledger1Status')}</span>
              </div>
              <div className="hcc-progress-bar"><div className="hcc-progress-fill" style={{ width: '100%' }}></div></div>
            </div>

            <div className="hcc-bar-row">
              <div className="hcc-bar-labels">
                <span>{t('mockup.ledger2')}</span>
                <span className="hcc-bar-status-text">{t('mockup.ledger2Status')}</span>
              </div>
              <div className="hcc-progress-bar"><div className="hcc-progress-fill" style={{ width: '100%' }}></div></div>
            </div>

            <div className="hcc-bar-row">
              <div className="hcc-bar-labels">
                <span>{t('mockup.ledger3')}</span>
                <span className="hcc-bar-status-text">{t('mockup.ledger3Status')}</span>
              </div>
              <div className="hcc-progress-bar"><div className="hcc-progress-fill hcc-progress-accent" style={{ width: '100%' }}></div></div>
            </div>
          </div>

          <div className="hcc-security-note">
            <CheckCircleIcon size={14} color="#4ade80" />
            <span>{t('mockup.securityReassurance')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
