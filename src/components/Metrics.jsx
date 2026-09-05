import { useLanguage } from '../i18n/LanguageContext';

export default function Metrics() {
  const { t } = useLanguage();

  const stats = ['stat1', 'stat2', 'stat3', 'stat4'];

  return (
    <section className="metrics-section">
      <h2 className="section-title">{t('metrics.title')}</h2>
      <div className="metrics-grid">
        {stats.map((s) => (
          <div key={s} className="metric-card glass-panel">
            <span className="metric-value">{t(`metrics.${s}.value`)}</span>
            <span className="metric-label">{t(`metrics.${s}.label`)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
