import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.9,
  stagger = 0,
  className = '',
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    let fromState = {};
    switch (variant) {
      case 'fade-up':
        fromState = { opacity: 0, y: 60 };
        break;
      case 'fade-left':
        fromState = { opacity: 0, x: -60 };
        break;
      case 'fade-right':
        fromState = { opacity: 0, x: 60 };
        break;
      case 'scale-in':
        fromState = { opacity: 0, scale: 0.85 };
        break;
      case 'blur-in':
        fromState = { opacity: 0, filter: 'blur(12px)' };
        break;
      default:
        fromState = { opacity: 0, y: 60 };
    }

    const toState = {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    };

    if (stagger > 0) {
      toState.stagger = stagger;
    }

    const target = stagger > 0 ? ref.current.children : ref.current;
    
    const animation = gsap.fromTo(target, fromState, toState);

    return () => {
      if (animation.scrollTrigger) {
        animation.scrollTrigger.kill();
      }
      animation.kill();
    };
  }, [variant, delay, duration, stagger]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </div>
  );
}
