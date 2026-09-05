import { useLanguage } from '../i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { GlobeIcon } from './Icons';

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">EVOLVETECH</Link>
        <div className="navbar-links">
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/contact">{t('nav.contact')}</Link>
          <button className="lang-toggle" onClick={toggleLang} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GlobeIcon size={13} color="currentColor" />
            <span>{lang === 'vi' ? 'EN' : 'VI'}</span>
          </button>
          <Link to="/contact" className="nano-button">{t('nav.demo')}</Link>
        </div>
      </div>
    </nav>
  );
}
