import Pricing from '../components/Pricing';

export default function PricingPage() {
  return (
    <div className="pricing-page-wrapper" style={{ paddingTop: '130px' }}>
      <Pricing isStandalone={true} />
    </div>
  );
}
