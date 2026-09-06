import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

const ArchonicCore = ({ scrollProgress = 0 }) => {
  const meshRef = useRef();
  const groupRef = useRef();

  useFrame(() => {
    if (!meshRef.current || !groupRef.current) return;

    meshRef.current.rotation.y += 0.003;

    let targetX = 0, targetY = 0.5, targetZ = 0;
    
    if (scrollProgress < 0.4) {
      const t = scrollProgress / 0.4;
      targetX = THREE.MathUtils.lerp(0, 3, t);
      targetY = THREE.MathUtils.lerp(0.5, 1, t);
      targetZ = THREE.MathUtils.lerp(0, -2, t);
    } else if (scrollProgress < 0.8) {
      const t = (scrollProgress - 0.4) / 0.4;
      targetX = THREE.MathUtils.lerp(3, 5, t);
      targetY = THREE.MathUtils.lerp(1, 3, t);
      targetZ = THREE.MathUtils.lerp(-2, -5, t);
    } else {
      targetX = 5;
      targetY = 3;
      targetZ = -5;
    }

    groupRef.current.position.set(
      THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1),
      THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1),
      THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.1)
    );

    let targetScale = 1.0;
    if (scrollProgress < 0.5) {
      const t = scrollProgress / 0.5;
      targetScale = THREE.MathUtils.lerp(1.0, 0.6, t);
    } else if (scrollProgress < 0.85) {
      const t = (scrollProgress - 0.5) / 0.35;
      targetScale = THREE.MathUtils.lerp(0.6, 0.3, t);
    } else {
      const t = (scrollProgress - 0.85) / 0.15;
      targetScale = THREE.MathUtils.lerp(0.3, 0.0, t);
    }
    
    targetScale = Math.max(0, targetScale);

    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
    );
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <Icosahedron args={[1.8, 1]} ref={meshRef}>
          <meshPhysicalMaterial
            color="#FFA100"
            metalness={0.85}
            roughness={0.12}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            emissive="#FF6D00"
            emissiveIntensity={0.3}
          />
        </Icosahedron>
      </Float>
      <pointLight color="#FFA100" intensity={2} distance={8} />
    </group>
  );
};

export default ArchonicCore;
