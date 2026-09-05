import { useLanguage } from '../i18n/LanguageContext';

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
          <p>📞 0353600900</p>
          <p>✉️ evolvetech8@gmail.com</p>
          <p>🌐 evolvetech.biz.vn</p>
        </div>
      </div>
      <p className="footer-rights">{t('footer.rights')}</p>
    </footer>
  );
}
