import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ParticleField — Subtle Cosmic Bokeh Dots (Vesper Aesthetic)
 * ~260 soft, out-of-focus background particles floating in the deep void.
 */
const ParticleField = ({ scrollProgress = 0 }) => {
  const pointsRef = useRef();
  const particleCount = 260;

  // Soft circular bokeh texture
  const circleTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  const [positions, colors, scales] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const sc = new Float32Array(particleCount);

    const cTeal = new THREE.Color('#2dd4bf');
    const cViolet = new THREE.Color('#8b5cf6');
    const cWhite = new THREE.Color('#e2e8f0');
    const tempColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      // Distribute in a wide frustum volume behind the main subject
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = -2.0 - Math.random() * 8; // deeper into the screen

      const rand = Math.random();
      if (rand < 0.45) {
        tempColor.copy(cViolet);
      } else if (rand < 0.8) {
        tempColor.copy(cTeal);
      } else {
        tempColor.copy(cWhite);
      }

      col[i * 3] = tempColor.r;
      col[i * 3 + 1] = tempColor.g;
      col[i * 3 + 2] = tempColor.b;

      sc[i] = 0.5 + Math.random() * 1.5;
    }

    return [pos, col, sc];
  }, [particleCount]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();

    // Gentle organic floating motion
    pointsRef.current.rotation.y = time * 0.01 + scrollProgress * 0.15;
    pointsRef.current.position.y = Math.sin(time * 0.2) * 0.2 - scrollProgress * 1.0;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={circleTexture}
        vertexColors
        transparent
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        size={0.065}
      />
    </points>
  );
};

export default ParticleField;
