import { useLanguage } from '../i18n/LanguageContext';
import { ShieldIcon, FileTextIcon, CheckCircleIcon } from './Icons';

export default function TrustBadges() {
  const { t } = useLanguage();

  return (
    <div className="hero-trust-bar">
      <div className="hero-trust-pill">
        <ShieldIcon size={16} color="#FFA100" />
        <span>{t('trust.badge1')}</span>
      </div>
      <span className="hero-trust-divider">•</span>
      <div className="hero-trust-pill">
        <FileTextIcon size={16} color="#4ade80" />
        <span>{t('trust.badge2')}</span>
      </div>
    </div>
  );
}

