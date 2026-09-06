import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ParticleField — Cosmic Mint & Violet Stardust (Vesper Aesthetic)
 * 7,000 gentle celestial particles floating in deep space with harmonic drift and parallax.
 */
const ParticleField = ({ scrollProgress = 0 }) => {
  const pointsRef = useRef();
  const materialRef = useRef();
  const { pointer } = useThree();

  const particleCount = 7000;

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const size = new Float32Array(particleCount);
    
    const colorMint = new THREE.Color('#00f5d4');
    const colorCyan = new THREE.Color('#38bdf8');
    const colorViolet = new THREE.Color('#8b5cf6');
    const colorIndigo = new THREE.Color('#6366f1');
    const colorWhite = new THREE.Color('#f1f5f9');
    const tempColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 4.0 + Math.cbrt(Math.random()) * 20; // Expansive field around the orb
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const seed = Math.random();
      if (seed < 0.35) {
        tempColor.lerpColors(colorMint, colorCyan, Math.random());
      } else if (seed < 0.75) {
        tempColor.lerpColors(colorViolet, colorIndigo, Math.random());
      } else {
        tempColor.copy(colorWhite);
      }

      col[i * 3] = tempColor.r;
      col[i * 3 + 1] = tempColor.g;
      col[i * 3 + 2] = tempColor.b;

      size[i] = 0.01 + Math.random() * 0.025;
    }
    
    return [pos, col, size];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Smooth slow cosmic drift
    pointsRef.current.rotation.y = time * 0.018 + scrollProgress * 0.3;
    pointsRef.current.rotation.x = Math.sin(time * 0.012) * 0.05;

    // Fluid mouse parallax
    const targetX = pointer.x * 0.4;
    const targetY = pointer.y * 0.4 - scrollProgress * 2.0;

    pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, targetX, 0.04);
    pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, targetY, 0.04);

    // Dynamic breathing opacity
    const currentOpacity = 0.5 + Math.sin(time * 0.8) * 0.12;
    materialRef.current.opacity = currentOpacity;
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
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        size={1}
      />
    </points>
  );
};

export default ParticleField;
