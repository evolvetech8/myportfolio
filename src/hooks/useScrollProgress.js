/**
 * Global reactive scroll state shared directly between Lenis smooth-scroll
 * and Three.js WebGL rendering loop for zero-latency, 60fps animations.
 */
export const scrollState = {
  progress: 0,
  velocity: 0,
  direction: 1,
  scroll: 0,
  limit: 0
};

export const getScrollState = () => scrollState;

// Fallback native window scroll listener
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    if (window.__hasLenis) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0) {
      scrollState.progress = Math.min(Math.max(window.scrollY / max, 0), 1);
      scrollState.scroll = window.scrollY;
      scrollState.limit = max;
    }
  }, { passive: true });
}
