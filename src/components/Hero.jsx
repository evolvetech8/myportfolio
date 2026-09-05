import { useLanguage } from '../i18n/LanguageContext';
import { Link } from 'react-router-dom';
import TrustBadges from './TrustBadges';
import HeroCommandCenter from './HeroCommandCenter';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero">
      {/* Dynamic Ambient Aurora Background Glows */}
      <div className="hero-aurora-glow hero-glow-1" aria-hidden="true"></div>
      <div className="hero-aurora-glow hero-glow-2" aria-hidden="true"></div>

      <div className="hero-inner">
        <span className="hero-pre">{t('hero.pre')}</span>
        <h1 className="hero-title">{t('hero.title')}</h1>
        <p className="hero-subtitle">{t('hero.subtitle')}</p>
        <div className="hero-ctas">
          <Link to="/contact" className="nano-button">{t('hero.cta')}</Link>
          <a href="#products" className="hero-cta-secondary">{t('hero.cta2')}</a>
        </div>

        {/* Regulatory & Enterprise Trust Badges */}
        <TrustBadges />

        {/* Live Interactive Command Center Mockup */}
        <HeroCommandCenter />
      </div>
    </section>
  );
}
