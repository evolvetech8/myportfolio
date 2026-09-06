import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CheckCircleIcon, CloseIcon, ShieldIcon, SparklesIcon, QrCodeIcon, LockIcon } from './Icons';

export default function VietQRCheckoutModal({
  isOpen,
  onClose,
  selectedPlan = 'pro',
  billingCycle = 'annual',
  isTrial = false
}) {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState(1); // 1: Info, 2: VietQR, 3: Success
  const [isTrialMode, setIsTrialMode] = useState(isTrial);
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);

  useEffect(() => {
    setIsTrialMode(isTrial);
    setStep(1);
    setIsSimulatingWebhook(false);
  }, [isTrial, selectedPlan, billingCycle, isOpen]);

  if (!isOpen) return null;

  // Pricing calculations (Aligned with CPA Studio: 490k / 1.49M / 2.99M)
  const priceMap = {
    starter: { annual: 4900000, monthly: 490000, code: 'START', name: 'Khởi Nghiệp' },
    pro: { annual: 14900000, monthly: 1490000, code: 'PRO', name: 'Pro Studio' },
    pro_studio: { annual: 14900000, monthly: 1490000, code: 'PRO', name: 'Pro Studio' },
    enterprise: { annual: 29900000, monthly: 2990000, code: 'ENT', name: 'Enterprise Firm' },
    advanced: { annual: 29900000, monthly: 2990000, code: 'ENT', name: 'Enterprise Firm' }
  };

  const currentPlanMeta = priceMap[selectedPlan] || priceMap.pro;
  const rawAmount = billingCycle === 'annual' ? currentPlanMeta.annual : currentPlanMeta.monthly;
  const formattedAmount = isTrialMode ? '0' : new Intl.NumberFormat('vi-VN').format(rawAmount);

  // Transfer syntax: e.g., ASO PRO 0912345678
  const cleanPhone = phone.replace(/[^0-9]/g, '') || '0988123456';
  const transferSyntax = `ASO ${currentPlanMeta.code} ${cleanPhone}`;

  // VietQR Dynamic Image URL (Vietcombank 0353600900)
  const vietQrUrl = isTrialMode
    ? `https://img.vietqr.io/image/970436-0353600900-compact2.png?amount=0&addInfo=${encodeURIComponent(`ASO TRIAL ${cleanPhone}`)}&accountName=CONG%20TY%20TNHH%20ARCHONIC`
    : `https://img.vietqr.io/image/970436-0353600900-compact2.png?amount=${rawAmount}&addInfo=${encodeURIComponent(transferSyntax)}&accountName=CONG%20TY%20TNHH%20ARCHONIC`;

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleNextToQR = (e) => {
    e.preventDefault();
    if (isTrialMode) {
      // Direct activation for 30-day trial
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleConfirmPaid = () => {
    setIsSimulatingWebhook(true);
    setTimeout(() => {
      setIsSimulatingWebhook(false);
      setStep(3);
    }, 1800);
  };

  return (
    <div className="vietqr-modal-overlay" onClick={onClose}>
      <div className="vietqr-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Modal Close Button */}
        <button className="vietqr-close-btn" onClick={onClose} type="button">
          <CloseIcon size={18} color="#ffffff" />
        </button>

        {/* Modal Header */}
        <div className="vietqr-modal-header">
          <div className="vietqr-badge-strip">
            <span className="vietqr-brand-pill">VietQR • Napas 247</span>
            <span className="vietqr-instant-pill">TỰ ĐỘNG KÍCH HOẠT WEBHOOK</span>
          </div>
          <h3 className="vietqr-modal-title">
            {isTrialMode ? t('pricing.checkout.trialModeTitle') : t('pricing.checkout.modalTitle')}
          </h3>
          <p className="vietqr-modal-sub">
            {isTrialMode ? t('pricing.checkout.trialModeDesc') : t('pricing.checkout.modalSubtitle')}
          </p>
        </div>

        {/* STEP 1: Registration Form */}
        {step === 1 && (
          <form className="vietqr-step1-form" onSubmit={handleNextToQR}>
            <div className="vietqr-plan-summary">
              <div className="plan-summary-left">
                <span className="summary-plan-name">{t(`pricing.${selectedPlan}.name`)}</span>
                <span className="summary-cycle">
                  {billingCycle === 'annual' ? t('pricing.billingAnnual') : t('pricing.billingMonthly')}
                </span>
              </div>
              <div className="plan-summary-right">
                <span className="summary-price">{formattedAmount}đ</span>
                {billingCycle === 'annual' && !isTrialMode && (
                  <span className="save-badge" style={{ marginLeft: '6px' }}>
                    {t('pricing.saveBadge')}
                  </span>
                )}
              </div>
            </div>

            {/* Trial vs Immediate Purchase Toggle in Modal */}
            <div className="vietqr-mode-switch">
              <button
                type="button"
                className={`mode-btn ${!isTrialMode ? 'active' : ''}`}
                onClick={() => setIsTrialMode(false)}
              >
                <span>Thanh Toán Kích Hoạt Ngay</span>
              </button>
              <button
                type="button"
                className={`mode-btn ${isTrialMode ? 'active' : ''}`}
                onClick={() => setIsTrialMode(true)}
              >
                <span>Dùng Thử 30 Ngày (0đ)</span>
              </button>
            </div>

            <div className="vietqr-field-group">
              <label className="vietqr-label">{t('pricing.checkout.businessName')} *</label>
              <input
                type="text"
                required
                className="vietqr-input"
                placeholder={t('pricing.checkout.businessNamePlaceholder')}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div className="vietqr-field-group">
              <label className="vietqr-label">{t('pricing.checkout.phone')} *</label>
              <input
                type="tel"
                required
                className="vietqr-input"
                placeholder={t('pricing.checkout.phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="vietqr-field-group">
              <label className="vietqr-label">{t('pricing.checkout.email')}</label>
              <input
                type="email"
                className="vietqr-input"
                placeholder={t('pricing.checkout.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="nano-button vietqr-submit-btn">
              {isTrialMode 
                ? t('pricing.checkout.activateTrialBtn') 
                : t('pricing.checkout.nextBtn')}
            </button>
          </form>
        )}

        {/* STEP 2: VietQR Payment Authorization */}
        {step === 2 && (
          <div className="vietqr-step2-wrap">
            <div className="vietqr-split">
              {/* QR Image Column */}
              <div className="vietqr-image-col">
                <div className="vietqr-frame">
                  <img
                    src={vietQrUrl}
                    alt="VietQR Payment Code"
                    className="vietqr-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="vietqr-fallback" style={{ display: 'none' }}>
                    <QrCodeIcon size={48} color="#FF6D00" />
                    <span>Quét mã VietQR chuyển khoản</span>
                  </div>
                </div>
                <span className="vietqr-scan-hint">
                  Mở ứng dụng ngân hàng hoặc Momo/ZaloPay để quét
                </span>
              </div>

              {/* Bank Details Column */}
              <div className="vietqr-details-col">
                <div className="vietqr-info-row">
                  <span className="info-label">{t('pricing.checkout.bankLabel')}</span>
                  <span className="info-value">{t('pricing.checkout.bankName')}</span>
                </div>

                <div className="vietqr-info-row">
                  <span className="info-label">{t('pricing.checkout.accountNumber')}</span>
                  <div className="info-val-copy">
                    <span className="info-value highlight-num">
                      {t('pricing.checkout.accountNumberVal')}
                    </span>
                    <button
                      type="button"
                      className="copy-pill-btn"
                      onClick={() => copyToClipboard('0353600900', 'acc')}
                    >
                      {copiedField === 'acc' ? t('pricing.checkout.copiedBtn') : t('pricing.checkout.copyBtn')}
                    </button>
                  </div>
                </div>

                <div className="vietqr-info-row">
                  <span className="info-label">{t('pricing.checkout.accountHolder')}</span>
                  <span className="info-value">{t('pricing.checkout.accountHolderVal')}</span>
                </div>

                <div className="vietqr-info-row">
                  <span className="info-label">{t('pricing.checkout.amount')}</span>
                  <div className="info-val-copy">
                    <span className="info-value highlight-amount">{formattedAmount} đ</span>
                    <button
                      type="button"
                      className="copy-pill-btn"
                      onClick={() => copyToClipboard(rawAmount.toString(), 'amt')}
                    >
                      {copiedField === 'amt' ? t('pricing.checkout.copiedBtn') : t('pricing.checkout.copyBtn')}
                    </button>
                  </div>
                </div>

                <div className="vietqr-info-row syntax-row">
                  <span className="info-label">{t('pricing.checkout.transferContent')}</span>
                  <div className="info-val-copy">
                    <span className="info-value highlight-syntax">{transferSyntax}</span>
                    <button
                      type="button"
                      className="copy-pill-btn syntax-copy"
                      onClick={() => copyToClipboard(transferSyntax, 'syntax')}
                    >
                      {copiedField === 'syntax' ? t('pricing.checkout.copiedBtn') : t('pricing.checkout.copyBtn')}
                    </button>
                  </div>
                </div>

                {/* Webhook Listener Status */}
                <div className="vietqr-webhook-status">
                  <span className="webhook-beacon"></span>
                  <div className="webhook-text">
                    <span className="webhook-title">{t('pricing.checkout.waitingWebhook')}</span>
                    <span className="webhook-sub">{t('pricing.checkout.webhookNote')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="nano-button confirm-paid-btn"
                  onClick={handleConfirmPaid}
                  disabled={isSimulatingWebhook}
                >
                  {isSimulatingWebhook ? 'Đang xác thực giao dịch...' : t('pricing.checkout.confirmPaidBtn')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 3 && (
          <div className="vietqr-success-wrap">
            <div className="success-icon-box">
              <CheckCircleIcon size={48} color="#4ade80" />
            </div>
            <h4 className="success-heading">{t('pricing.checkout.successTitle')}</h4>
            <p className="success-desc">{t('pricing.checkout.successDesc')}</p>

            <div className="success-order-box glass-panel">
              <div className="order-row">
                <span>Gói đăng ký:</span>
                <strong>{t(`pricing.${selectedPlan}.name`)}</strong>
              </div>
              <div className="order-row">
                <span>Số điện thoại:</span>
                <strong>{phone || '0988123456'}</strong>
              </div>
              <div className="order-row">
                <span>Trạng thái:</span>
                <span className="order-status-badge">
                  <span className="order-status-dot"></span>
                  <span>ĐÃ KÍCH HOẠT THÀNH CÔNG</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              className="nano-button success-action-btn"
              onClick={onClose}
            >
              {t('pricing.checkout.openDashboardBtn')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
