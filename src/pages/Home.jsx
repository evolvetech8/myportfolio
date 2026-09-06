import Hero from '../components/Hero';
import ProductPillars from '../components/ProductPillars';
import TaxSavingsCalculator from '../components/TaxSavingsCalculator';
import Pricing from '../components/Pricing';
import Metrics from '../components/Metrics';
import { ScrollReveal } from '../components/ScrollReveal';

export default function Home() {
  return (
    <>
      <ScrollReveal variant="blur-in" duration={1.2}>
        <Hero />
      </ScrollReveal>

      <ScrollReveal variant="fade-up" stagger={0.15}>
        <ProductPillars />
      </ScrollReveal>

      <ScrollReveal variant="scale-in">
        <TaxSavingsCalculator />
      </ScrollReveal>

      <ScrollReveal variant="fade-up" stagger={0.15}>
        <Pricing />
      </ScrollReveal>

      <ScrollReveal variant="fade-up">
        <Metrics />
      </ScrollReveal>
    </>
  );
}
