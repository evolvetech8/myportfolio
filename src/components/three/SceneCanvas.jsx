import React, { Suspense, useState, useEffect } from 'react';
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
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
      <ParticleField />

      {/* The Vesper Wavy Particle Torus Ribbon (reads scrollState directly in useFrame) */}
      <VesperOrb />
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
          alpha: false,
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
