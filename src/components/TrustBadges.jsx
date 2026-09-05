import { useLanguage } from '../i18n/LanguageContext';
import { ShieldIcon, FileTextIcon, LockIcon, CloudIcon } from './Icons';

export default function TrustBadges() {
  const { t } = useLanguage();

  const badges = [
    { icon: <ShieldIcon size={15} color="#FF7A00" />, text: t('trust.badge1') },
    { icon: <FileTextIcon size={15} color="#4ade80" />, text: t('trust.badge2') },
    { icon: <LockIcon size={15} color="#38bdf8" />, text: t('trust.badge3') },
    { icon: <CloudIcon size={15} color="#818cf8" />, text: t('trust.badge4') },
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
