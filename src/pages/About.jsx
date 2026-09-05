import { useLanguage } from '../i18n/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <section className="about-page">
      <h1 className="page-title">{t('about.title')}</h1>

      <div className="about-grid">
        <div className="about-card glass-panel">
          <h3 className="about-card-title">{t('about.mission')}</h3>
          <p>{t('about.missionText')}</p>
        </div>
        <div className="about-card glass-panel">
          <h3 className="about-card-title">{t('about.vision')}</h3>
          <p>{t('about.visionText')}</p>
        </div>
        <div className="about-card glass-panel">
          <h3 className="about-card-title">{t('about.approach')}</h3>
          <p>{t('about.approachText')}</p>
        </div>
      </div>
    </section>
  );
}
