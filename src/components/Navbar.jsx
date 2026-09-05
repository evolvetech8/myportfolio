import { useLanguage } from '../i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { GlobeIcon } from './Icons';

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/logo.png" 
            alt="Archonic Logo" 
            style={{ width: '34px', height: '34px', objectFit: 'contain' }} 
          />
          <span style={{ 
            fontWeight: 900, 
            letterSpacing: '1.5px',
            background: 'linear-gradient(135deg, #FFA100 0%, #FF6D00 60%, #EA391B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            ARCHONIC
          </span>
        </Link>
        <div className="navbar-links">
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/pricing">{t('nav.pricing')}</Link>
          <Link to="/contact">{t('nav.contact')}</Link>
          <button className="lang-toggle" onClick={toggleLang} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GlobeIcon size={13} color="currentColor" />
            <span>{lang === 'vi' ? 'EN' : 'VI'}</span>
          </button>
          <Link to="/trial" className="nano-button">{t('nav.demo')}</Link>
        </div>
      </div>
    </nav>
  );
}
