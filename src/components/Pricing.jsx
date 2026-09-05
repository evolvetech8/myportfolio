import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CheckCircleIcon, ShieldIcon, SparklesIcon, LockIcon } from './Icons';
import VietQRCheckoutModal from './VietQRCheckoutModal';

export default function Pricing({ isStandalone = false }) {
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState('annual'); // 'annual' | 'monthly'
  const [openFaq, setOpenFaq] = useState(null);

  // VietQR Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState('pro');
  const [isTrialMode, setIsTrialMode] = useState(false);

  const openCheckout = (planId, trial = false) => {
    setCheckoutPlan(planId);
    setIsTrialMode(trial);
    setIsCheckoutOpen(true);
  };

  const tiers = [
    {
      id: 'starter',
      isPopular: false,
      badgeColor: '#FFA100',
      badgeBg: 'rgba(255, 161, 0, 0.12)',
      features: [
        t('pricing.starter.features.0'),
        t('pricing.starter.features.1'),
        t('pricing.starter.features.2'),
        t('pricing.starter.features.3'),
        t('pricing.starter.features.4'),
      ]
    },
    {
      id: 'pro',
      isPopular: true,
      badgeColor: '#FF6D00',
      badgeBg: 'rgba(255, 109, 0, 0.15)',
      features: [
        t('pricing.pro.features.0'),
        t('pricing.pro.features.1'),
        t('pricing.pro.features.2'),
        t('pricing.pro.features.3'),
        t('pricing.pro.features.4'),
        t('pricing.pro.features.5'),
      ]
    },
    {
      id: 'advanced',
      isPopular: false,
      badgeColor: '#818cf8',
      badgeBg: 'rgba(129, 140, 248, 0.12)',
      features: [
        t('pricing.advanced.features.0'),
        t('pricing.advanced.features.1'),
        t('pricing.advanced.features.2'),
        t('pricing.advanced.features.3'),
        t('pricing.advanced.features.4'),
        t('pricing.advanced.features.5'),
      ]
    }
  ];

  const faqs = ['q1', 'q2', 'q3', 'q4'];

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section className={`pricing-section ${isStandalone ? 'pricing-standalone' : ''}`} id="pricing">
      <div className="pricing-inner">
        {/* Section Header */}
        <div className="pricing-header">
          <span className="hero-pre" style={{ margin: '0 auto 16px', display: 'inline-block' }}>
            {t('pricing.title')}
          </span>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            {t('pricing.title')}
          </h2>
          <p className="pricing-subtitle">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Freemium Hook: 14-Day Free Trial Banner */}
        <div className="pricing-trial-hook glass-panel">
          <div className="trial-hook-content">
            <div className="trial-hook-badge">
              <SparklesIcon size={16} color="#FFA100" />
              <span>{t('pricing.trialBannerTitle')}</span>
            </div>
            <p className="trial-hook-desc">{t('pricing.trialBannerDesc')}</p>
          </div>
          <button
            type="button"
            className="nano-button trial-hook-cta"
            onClick={() => openCheckout('pro', true)}
          >
            {t('pricing.trialCta')}
          </button>
        </div>

        {/* Billing Toggle (Monthly vs. Annual) */}
        <div className="billing-toggle-container">
          <div className="billing-toggle-pill glass-panel">
            <button
              type="button"
              className={`billing-toggle-btn ${billingCycle === 'annual' ? 'active' : ''}`}
              onClick={() => setBillingCycle('annual')}
            >
              <span>{t('pricing.billingAnnual')}</span>
              <span className="save-badge">{t('pricing.saveBadge')}</span>
            </button>
            <button
              type="button"
              className={`billing-toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              <span>{t('pricing.billingMonthly')}</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-grid">
          {tiers.map((tier) => {
            const price = billingCycle === 'annual' 
              ? t(`pricing.${tier.id}.priceAnnual`) 
              : t(`pricing.${tier.id}.priceMonthly`);
            const billedText = billingCycle === 'annual'
              ? t(`pricing.${tier.id}.billedAnnualText`)
              : t(`pricing.${tier.id}.billedMonthlyText`);
            const monthlyBaseline = t(`pricing.${tier.id}.priceMonthly`);

            return (
              <div
                key={tier.id}
                className={`pricing-card glass-panel ${tier.isPopular ? 'pricing-card-popular' : ''}`}
              >
                {tier.isPopular && (
                  <div className="popular-ribbon">
                    <span>{t('pricing.pro.badge')}</span>
                  </div>
                )}

                <div className="pricing-card-header">
                  {!tier.isPopular && (
                    <span 
                      className="tier-badge"
                      style={{ color: tier.badgeColor, background: tier.badgeBg }}
                    >
                      {t(`pricing.${tier.id}.badge`)}
                    </span>
                  )}
                  <h3 className="tier-name">{t(`pricing.${tier.id}.name`)}</h3>
                  <p className="tier-target">{t(`pricing.${tier.id}.target`)}</p>
                </div>

                <div className="pricing-card-price">
                  <div className="price-row">
                    {billingCycle === 'annual' && (
                      <span className="price-original">
                        {monthlyBaseline}đ
                      </span>
                    )}
                    <span className="price-currency">{price}</span>
                    <span className="price-unit">{t('pricing.monthUnit')}</span>
                  </div>
                  <span className="price-billed-sub">{billedText}</span>
                </div>

                <p className="tier-desc">{t(`pricing.${tier.id}.desc`)}</p>

                <div className="tier-cta-wrap">
                  <button
                    type="button"
                    onClick={() => openCheckout(tier.id, false)}
                    className={`tier-cta-btn ${tier.isPopular ? 'nano-button' : 'tier-cta-secondary'}`}
                  >
                    {t(`pricing.${tier.id}.cta`)}
                  </button>
                </div>

                <div className="tier-divider"></div>

                <ul className="tier-features-list">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="tier-feature-item">
                      <CheckCircleIcon size={16} color={tier.isPopular ? '#FF7A00' : '#4ade80'} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Guarantees Trust Strip */}
        <div className="pricing-guarantees glass-panel">
          <div className="guarantee-item">
            <CheckCircleIcon size={16} color="#4ade80" />
            <span>{t('pricing.guarantees.item1')}</span>
          </div>
          <div className="guarantee-item">
            <ShieldIcon size={16} color="#FFA100" />
            <span>{t('pricing.guarantees.item2')}</span>
          </div>
          <div className="guarantee-item">
            <LockIcon size={16} color="#38bdf8" />
            <span>{t('pricing.guarantees.item3')}</span>
          </div>
          <div className="guarantee-item">
            <SparklesIcon size={16} color="#a78bfa" />
            <span>{t('pricing.guarantees.item4')}</span>
          </div>
        </div>

        {/* Pricing FAQ */}
        <div className="pricing-faq-wrap">
          <h3 className="faq-heading">{t('pricing.faq.title')}</h3>
          <div className="faq-list">
            {faqs.map((faqKey, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={faqKey} 
                  className={`faq-item glass-panel ${isOpen ? 'faq-item-open' : ''}`}
                  onClick={() => toggleFaq(idx)}
                >
                  <div className="faq-question">
                    <span>{t(`pricing.faq.${faqKey}`)}</span>
                    <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                  </div>
                  {isOpen && (
                    <div className="faq-answer">
                      <p>{t(`pricing.faq.a${idx + 1}`)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic VietQR Checkout Modal */}
      <VietQRCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={checkoutPlan}
        billingCycle={billingCycle}
        isTrial={isTrialMode}
      />
    </section>
  );
}
