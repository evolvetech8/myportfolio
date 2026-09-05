import { useLanguage } from '../i18n/LanguageContext';
import { LockIcon, CloudIcon, ShieldIcon, CheckCircleIcon } from './Icons';

export default function Metrics() {
  const { t } = useLanguage();

  const stats = ['stat1', 'stat2', 'stat3', 'stat4'];

  const infraItems = [
    {
      icon: <LockIcon size={20} color="#38bdf8" />,
      title: t('trust.infra1'),
      sub: t('trust.infra1Sub')
    },
    {
      icon: <CloudIcon size={20} color="#FFA100" />,
      title: t('trust.infra2'),
      sub: t('trust.infra2Sub')
    },
    {
      icon: <ShieldIcon size={20} color="#4ade80" />,
      title: t('trust.infra3'),
      sub: t('trust.infra3Sub')
    },
    {
      icon: <CheckCircleIcon size={20} color="#818cf8" />,
      title: t('trust.infra4'),
      sub: t('trust.infra4Sub')
    }
  ];

  return (
    <section className="metrics-section">
      <h2 className="section-title">{t('metrics.title')}</h2>
      
      {/* 4 Authoritative Metric Pillars */}
      <div className="metrics-grid">
        {stats.map((s) => (
          <div key={s} className="metric-card glass-panel">
            <span className="metric-value">{t(`metrics.${s}.value`)}</span>
            <span className="metric-label">{t(`metrics.${s}.label`)}</span>
          </div>
        ))}
      </div>

      {/* Relocated Enterprise Infrastructure & Security Strip */}
      <div className="metrics-infra-box glass-panel">
        <div className="metrics-infra-header">
          <span className="infra-beacon"></span>
          <span className="metrics-infra-title">{t('trust.infraTitle')}</span>
        </div>
        <div className="metrics-infra-grid">
          {infraItems.map((item, idx) => (
            <div key={idx} className="metrics-infra-item">
              <div className="metrics-infra-icon-wrap">{item.icon}</div>
              <div className="metrics-infra-text">
                <span className="metrics-infra-name">{item.title}</span>
                <span className="metrics-infra-desc">{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

