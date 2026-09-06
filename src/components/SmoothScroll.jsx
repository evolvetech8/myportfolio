import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollState } from '../hooks/useScrollProgress';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children, enabled = true }) {
  useEffect(() => {
    if (!enabled) {
      if (typeof window !== 'undefined') window.__hasLenis = false;
      return;
    }

    if (typeof window !== 'undefined') window.__hasLenis = true;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      scrollState.progress = e.progress;
      scrollState.velocity = Math.abs(e.velocity);
      scrollState.direction = e.direction;
      scrollState.scroll = e.scroll;
      scrollState.limit = e.limit;
    });

    const update = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (typeof window !== 'undefined') window.__hasLenis = false;
      lenis.destroy();
      gsap.ticker.remove(update);
    };
  }, [enabled]);

  return <>{children}</>;
}
