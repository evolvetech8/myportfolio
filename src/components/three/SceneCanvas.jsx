import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import ParticleField from './ParticleField';
import VesperOrb from './VesperOrb';

const checkWebGLSupport = () => {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

const SceneContent = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const reqRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (!reqRef.current) {
        reqRef.current = requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const currentProgress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
          setProgress(currentProgress);
          reqRef.current = null;
        });
      }
    };

    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Solid deep space background color */}
      <color attach="background" args={['#030306']} />
      
      {/* Soft ambient light */}
      <ambientLight intensity={0.4} />

      {/* Floating deep space bokeh dots */}
      <ParticleField scrollProgress={progress} />

      {/* The Vesper Wavy Particle Torus Ribbon */}
      <VesperOrb scrollProgress={progress} />
    </>
  );
};

const SceneCanvasComponent = () => {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  if (!hasWebGL) {
    return (
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundColor: '#030306', 
          zIndex: 0 
        }} 
      />
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        backgroundColor: '#030306',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7.0], fov: 45 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: false, // Opaque WebGL canvas prevents browser compositor whiteout!
          powerPreference: 'high-performance',
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SceneCanvasComponent;
