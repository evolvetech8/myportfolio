import { useLanguage } from '../i18n/LanguageContext';
import { PhoneIcon, MailIcon, GlobeIcon } from './Icons';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <img 
              src="/logo.png" 
              alt="Archonic Logo" 
              style={{ width: '28px', height: '28px', objectFit: 'contain' }} 
            />
            <span style={{ 
              fontSize: '20px', 
              fontWeight: 900, 
              letterSpacing: '1px',
              background: 'linear-gradient(135deg, #FFA100 0%, #FF6D00 60%, #EA391B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ARCHONIC
            </span>
          </div>
          <p className="footer-tagline">{t('footer.tagline')}</p>
        </div>
        <div className="footer-contact">
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneIcon size={14} color="#FF7A00" />
            <span>0353600900</span>
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MailIcon size={14} color="#FF7A00" />
            <span>archonic88@gmail.com</span>
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GlobeIcon size={14} color="#FF7A00" />
            <span>evolvetech.biz.vn</span>
          </p>
        </div>
      </div>
      <p className="footer-rights">{t('footer.rights')}</p>
    </footer>
  );
}
