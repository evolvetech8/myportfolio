import { useLanguage } from '../i18n/LanguageContext';
import { PhoneIcon, MailIcon, GlobeIcon } from './Icons';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">EVOLVETECH</span>
          <p className="footer-tagline">{t('footer.tagline')}</p>
        </div>
        <div className="footer-contact">
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneIcon size={14} color="#FFE135" />
            <span>0353600900</span>
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MailIcon size={14} color="#FFE135" />
            <span>evolvetech8@gmail.com</span>
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GlobeIcon size={14} color="#FFE135" />
            <span>evolvetech.biz.vn</span>
          </p>
        </div>
      </div>
      <p className="footer-rights">{t('footer.rights')}</p>
    </footer>
  );
}
