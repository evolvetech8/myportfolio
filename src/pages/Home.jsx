import Hero from '../components/Hero';
import ProductPillars from '../components/ProductPillars';
import TaxSavingsCalculator from '../components/TaxSavingsCalculator';
import Pricing from '../components/Pricing';
import Metrics from '../components/Metrics';

export default function Home() {
  return (
    <>
      <Hero />
      <ProductPillars />
      <TaxSavingsCalculator />
      <Pricing />
      <Metrics />
    </>
  );
}
