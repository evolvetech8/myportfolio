import { useLanguage } from '../i18n/LanguageContext';

export default function ProductPillars() {
  const { t } = useLanguage();

  const products = [
    { key: 'bridge', icon: '🏛️', color: '#FFE135' },
    { key: 'howdoi', icon: '🎬', color: '#818cf8' },
    { key: 'visioncore', icon: '👁️', color: '#34d399' },
  ];

  return (
    <section id="products" className="products-section">
      <h2 className="section-title">{t('products.title')}</h2>
      <div className="products-grid">
        {products.map((p) => (
          <div key={p.key} className="product-card glass-panel">
            <div className="product-icon" style={{ color: p.color }}>{p.icon}</div>
            <h3 className="product-name">{t(`products.${p.key}.name`)}</h3>
            <span className="product-tagline" style={{ color: p.color }}>
              {t(`products.${p.key}.tagline`)}
            </span>
            <p className="product-desc">{t(`products.${p.key}.desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
