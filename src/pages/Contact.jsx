import { useLanguage } from '../i18n/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();

  return (
    <section className="contact-page">
      <h1 className="page-title">{t('contact.title')}</h1>
      <p className="contact-subtitle">{t('contact.subtitle')}</p>

      <div className="contact-grid">
        <form className="contact-form glass-panel" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>{t('contact.name')}</label>
            <input type="text" placeholder={t('contact.name')} />
          </div>
          <div className="form-group">
            <label>{t('contact.email')}</label>
            <input type="email" placeholder={t('contact.email')} />
          </div>
          <div className="form-group">
            <label>{t('contact.message')}</label>
            <textarea rows={5} placeholder={t('contact.message')}></textarea>
          </div>
          <button type="submit" className="nano-button">{t('contact.send')}</button>
        </form>

        <div className="contact-info glass-panel">
          <h3>{t('contact.phone')}</h3>
          <p style={{ color: 'var(--archonic-orange)', fontSize: '24px', fontWeight: 'bold' }}>0353600900</p>
          <h3>{t('contact.emailLabel')}</h3>
          <p style={{ color: 'var(--archonic-amber)', fontSize: '18px' }}>evolvetech8@gmail.com</p>
          <h3>Website</h3>
          <p style={{ color: 'var(--archonic-amber)', fontSize: '18px' }}>evolvetech.biz.vn</p>
        </div>
      </div>
    </section>
  );
}
