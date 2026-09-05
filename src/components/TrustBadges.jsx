import { useLanguage } from '../i18n/LanguageContext';

export default function TrustBadges() {
  const { t } = useLanguage();

  const badges = [
    { icon: '🛡️', text: t('trust.badge1'), highlight: 'TT88' },
    { icon: '📄', text: t('trust.badge2'), highlight: 'NĐ123' },
    { icon: '🔒', text: t('trust.badge3'), highlight: 'AES-256' },
    { icon: '☁️', text: t('trust.badge4'), highlight: '99.9%' },
  ];

  return (
    <div className="trust-strip">
      <div className="trust-strip-inner">
        {badges.map((b, idx) => (
          <div key={idx} className="trust-badge glass-panel">
            <span className="trust-badge-icon">{b.icon}</span>
            <span className="trust-badge-text">{b.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
