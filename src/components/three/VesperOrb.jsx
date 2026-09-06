import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * VesperOrb — Inspired by GetLayers "Vesper"
 * A living, breathing cloud of mint and violet light that breathes as an orb,
 * expands into a spiral galaxy upon scroll, and responds fluidly to mouse movement.
 */
const VesperOrb = ({ scrollProgress = 0 }) => {
  const pointsRef = useRef();
  const innerGlowRef = useRef();
  const outerGlowRef = useRef();
  const groupRef = useRef();
  const { pointer } = useThree();

  const particleCount = 15000;

  // Generate multi-layered celestial particle system:
  // Layer 1: Dense mint/cyan nucleus
  // Layer 2: Spiral galaxy arms with mint-to-violet gradients
  // Layer 3: Ethereal neural filaments and outer starlight
  const [positions, colors, sizes, meta] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const sz = new Float32Array(particleCount);
    
    // Custom metadata array to track initial math parameters per particle:
    // [radius, theta, phi, arm, speed, layer, baseOpacity]
    const metadata = [];

    const colorMint = new THREE.Color('#00f5d4');     // Electric Mint
    const colorCyan = new THREE.Color('#2dd4bf');     // Soft Seafoam Cyan
    const colorViolet = new THREE.Color('#8b5cf6');   // Electric Violet
    const colorPurple = new THREE.Color('#a855f7');   // Neon Purple
    const colorMagenta = new THREE.Color('#d946ef');  // Iridescent Magenta
    const colorStar = new THREE.Color('#f8fafc');     // Pure Starlight
    const tempColor = new THREE.Color();

    const armsCount = 3;

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const arm = Math.floor(Math.random() * armsCount);
      const armOffset = (arm * (2 * Math.PI)) / armsCount;

      let layer = 1;
      let r, theta, phi, speed;

      if (i < 4500) {
        // LAYER 1: Core Nucleus (dense, luminous mint & cyan)
        layer = 1;
        r = 0.3 + Math.pow(Math.random(), 2) * 1.5;
        theta = u * 2 * Math.PI;
        phi = Math.acos(2 * v - 1);
        speed = 0.8 + Math.random() * 0.6;

        // Gradient from pure mint to bright cyan
        tempColor.lerpColors(colorMint, colorCyan, Math.random());
        sz[i] = 0.02 + Math.random() * 0.035;
      } else if (i < 12000) {
        // LAYER 2: Spiral Galaxy Arms (mint transitioning to electric violet & magenta)
        layer = 2;
        const distRatio = Math.random();
        r = 1.2 + distRatio * 3.2;
        
        // Logarithmic spiral math
        const spiralAngle = Math.log(r + 0.1) * 2.8 + armOffset;
        theta = spiralAngle + (Math.random() - 0.5) * 0.6;
        phi = Math.PI / 2 + (Math.random() - 0.5) * 0.9 * Math.exp(-r * 0.2); // Flattened disc galaxy
        speed = 0.4 + Math.random() * 0.5;

        // Gradient from cyan at center to violet and magenta at the outer rim
        if (distRatio < 0.45) {
          tempColor.lerpColors(colorCyan, colorViolet, distRatio / 0.45);
        } else {
          tempColor.lerpColors(colorViolet, colorMagenta, (distRatio - 0.45) / 0.55);
        }
        sz[i] = 0.018 + Math.random() * 0.032;
      } else {
        // LAYER 3: Neural Filaments & Cosmic Stardust (halo sphere)
        layer = 3;
        r = 2.0 + Math.random() * 4.5;
        theta = u * 2 * Math.PI;
        phi = Math.acos(2 * v - 1);
        speed = 0.2 + Math.random() * 0.3;

        // Soft ethereal violet & starlight
        if (Math.random() > 0.3) {
          tempColor.lerpColors(colorPurple, colorViolet, Math.random());
        } else {
          tempColor.copy(colorStar);
        }
        sz[i] = 0.012 + Math.random() * 0.024;
      }

      // Compute initial Cartesian coordinates
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      col[i * 3] = tempColor.r;
      col[i * 3 + 1] = tempColor.g;
      col[i * 3 + 2] = tempColor.b;

      metadata.push({ r, theta, phi, arm, speed, layer, armOffset });
    }

    return [pos, col, sz, metadata];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Rhythmic breathing motion (deep, calm, hypnotic)
    const breathCycle = Math.sin(time * 1.4);
    const harmonicBreath = Math.sin(time * 2.8) * 0.3;
    const breath = 1.0 + (breathCycle + harmonicBreath) * 0.09;

    // As user scrolls, the orb "blows open" into a vast spiral galaxy
    const expandFactor = 1.0 + scrollProgress * 1.6;

    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const array = positionsAttr.array;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const m = meta[i];

      // Dynamic orbital motion with harmonic waves
      let currentR = m.r * breath;
      let currentTheta = m.theta + time * 0.08 * m.speed;
      let currentPhi = m.phi;

      if (m.layer === 1) {
        // Core breathes and pulsates
        currentR *= (1.0 + Math.sin(time * 2.2 + m.r * 5.0) * 0.08);
      } else if (m.layer === 2) {
        // Spiral galaxy arms uncoil and expand with scroll
        currentR *= expandFactor;
        currentTheta += scrollProgress * 1.2;
        // Subtle vertical wave
        currentPhi += Math.sin(time * 1.1 + m.r * 2.0) * 0.04;
      } else {
        // Neural filaments oscillate gently in 3D
        currentR *= (1.0 + scrollProgress * 1.2);
        currentTheta += Math.cos(time * 0.5 + m.phi) * 0.03;
      }

      const x = currentR * Math.sin(currentPhi) * Math.cos(currentTheta);
      const y = currentR * Math.sin(currentPhi) * Math.sin(currentTheta);
      const z = currentR * Math.cos(currentPhi);

      array[idx] = x;
      array[idx + 1] = y;
      array[idx + 2] = z;
    }

    positionsAttr.needsUpdate = true;

    // Smooth mouse parallax with fluid damping
    const targetRotX = pointer.y * 0.35 + Math.sin(time * 0.15) * 0.1;
    const targetRotY = pointer.x * 0.45 + time * 0.05;
    const targetRotZ = Math.cos(time * 0.12) * 0.08;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.05);

    // Scroll trajectory: orb shifts slightly to create depth framing
    const targetY = scrollProgress * -1.8 + 0.2;
    const targetZ = scrollProgress * -2.5;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.06);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.06);

    // Pulse volumetric core glow meshes
    if (innerGlowRef.current) {
      const glowScale = (1.1 + Math.sin(time * 1.4) * 0.15) * (1.0 + scrollProgress * 0.5);
      innerGlowRef.current.scale.setScalar(glowScale);
    }
    if (outerGlowRef.current) {
      const outerScale = (1.8 + Math.cos(time * 1.1) * 0.2) * (1.0 + scrollProgress * 0.8);
      outerGlowRef.current.scale.setScalar(outerScale);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      {/* Inner Bioluminescent Volumetric Sheen (Mint Core) */}
      <mesh ref={innerGlowRef}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial
          color="#00f5d4"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Ethereal Volumetric Aura (Violet Sheen) */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 15,000 High-Precision Mint & Violet Living Points */}
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
          vertexColors
          transparent
          opacity={0.88}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          size={1}
        />
      </points>

      {/* Dynamic Colored Point Lights for Scene Illumination */}
      <pointLight color="#00f5d4" intensity={2.5} distance={10} position={[0, 0, 0]} />
      <pointLight color="#8b5cf6" intensity={2.0} distance={12} position={[2, -1, 1]} />
    </group>
  );
};

export default VesperOrb;
