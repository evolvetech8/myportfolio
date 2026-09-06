import { useState, useEffect, useRef } from 'react';

const scrollState = {
  progress: 0,
  velocity: 0,
  direction: 1
};

export const getScrollState = () => scrollState;

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const reqRef = useRef(null);
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const lastTime = useRef(typeof performance !== 'undefined' ? performance.now() : 0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (!reqRef.current) {
        reqRef.current = requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const currentProgress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
          
          const now = performance.now();
          const dt = now - lastTime.current || 16.66;
          const dy = scrollY - lastScrollY.current;
          
          scrollState.progress = currentProgress;
          scrollState.velocity = Math.abs(dy / dt) * 1000;
          scrollState.direction = dy > 0 ? 1 : dy < 0 ? -1 : scrollState.direction;
          
          setProgress(currentProgress);
          
          lastScrollY.current = scrollY;
          lastTime.current = now;
          reqRef.current = null;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  return progress;
};
