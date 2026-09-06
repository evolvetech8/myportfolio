import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = ({ scrollProgress = 0 }) => {
  const pointsRef = useRef();
  const materialRef = useRef();
  const { pointer } = useThree();

  const particleCount = 8000;

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const size = new Float32Array(particleCount);
    
    const colorAmber = new THREE.Color('#FFA100');
    const colorGold = new THREE.Color('#FFD54F');
    const tempColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 18;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      tempColor.lerpColors(colorAmber, colorGold, Math.random());
      col[i * 3] = tempColor.r;
      col[i * 3 + 1] = tempColor.g;
      col[i * 3 + 2] = tempColor.b;

      size[i] = 0.015 + Math.random() * 0.025;
    }
    
    return [pos, col, size];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return;

    const time = state.clock.getElapsedTime();
    
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      positionsAttr.array[idx] += Math.sin(time * 0.1 + i) * 0.002;
      positionsAttr.array[idx + 1] += Math.cos(time * 0.1 + i) * 0.002;
    }
    positionsAttr.needsUpdate = true;

    const currentOpacity = THREE.MathUtils.lerp(0.3, 0.8, scrollProgress);
    materialRef.current.opacity = currentOpacity;
    
    const rotationSpeed = 0.05 + scrollProgress * 0.2;
    pointsRef.current.rotation.y = time * rotationSpeed;
    
    pointsRef.current.position.y = scrollProgress * -5;

    const targetX = (pointer.x * state.viewport.width * 0.03);
    const targetY = (pointer.y * state.viewport.height * 0.03);
    
    pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, targetX, 0.1);
    pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, scrollProgress * -5 + targetY, 0.1);
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
