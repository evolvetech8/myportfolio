import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '../../hooks/useScrollProgress';

/**
 * VesperOrb — Faithfully replicates the Vesper signature 3D Wavy Particle Torus.
 * Reference: https://storage.getlayers.ai/templates/vesper-06e69bbad0.webp
 *
 * Parametric undulating torus ribbon of 16,200 round glowing particles.
 * Reacts dynamically to scroll position and velocity:
 * - Rotates and tumbles through 3D space across scroll sections
 * - Expands outward ("blows open" into a cosmic ring)
 * - Amplifies wave frequency and ripple height with scroll speed
 * - Shifts position to frame landing page sections
 */
const VesperOrb = () => {
  const pointsRef = useRef();
  const groupRef = useRef();
  const { pointer } = useThree();

  const uSteps = 180;
  const vSteps = 90;
  const particleCount = uSteps * vSteps; // 16,200 points

  // Soft circular particle texture so points render as anti-aliased luminous glowing beads
  const circleTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.25)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Pre-calculate parametric angles (u, v) and gradient vertex colors
  const [positions, colors, angles] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const ang = new Float32Array(particleCount * 2);

    const cMint = new THREE.Color('#00f5d4');   // Electric Mint (Top/Left)
    const cCyan = new THREE.Color('#06b6d4');   // Pure Cyan
    const cBlue = new THREE.Color('#3b82f6');   // Azure Blue
    const cViolet = new THREE.Color('#8b5cf6'); // Electric Violet
    const cPurple = new THREE.Color('#c084fc'); // Neon Purple (Bottom/Right)
    const tempColor = new THREE.Color();

    let idx = 0;
    for (let i = 0; i < uSteps; i++) {
      const u = (i / uSteps) * Math.PI * 2;
      const uRatio = i / uSteps; // 0.0 to 1.0 around the ring

      // Interpolate smooth 4-stop gradient matching Vesper reference exactly
      if (uRatio < 0.25) {
        tempColor.lerpColors(cMint, cCyan, uRatio / 0.25);
      } else if (uRatio < 0.55) {
        tempColor.lerpColors(cCyan, cBlue, (uRatio - 0.25) / 0.3);
      } else if (uRatio < 0.85) {
        tempColor.lerpColors(cBlue, cViolet, (uRatio - 0.55) / 0.3);
      } else {
        tempColor.lerpColors(cViolet, cMint, (uRatio - 0.85) / 0.15);
      }

      for (let j = 0; j < vSteps; j++) {
        const v = (j / vSteps) * Math.PI * 2;
        ang[idx * 2] = u;
        ang[idx * 2 + 1] = v;

        pos[idx * 3] = 0;
        pos[idx * 3 + 1] = 0;
        pos[idx * 3 + 2] = 0;

        col[idx * 3] = tempColor.r;
        col[idx * 3 + 1] = tempColor.g;
        col[idx * 3 + 2] = tempColor.b;

        idx++;
      }
    }

    return [pos, col, ang];
  }, [uSteps, vSteps, particleCount]);

  useFrame((state) => {
    if (!pointsRef.current || !groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const posArray = positionsAttr.array;

    // Real-time zero-latency scroll progress (0.0 to 1.0) and velocity from Lenis
    const progress = scrollState.progress || 0;
    const velocity = scrollState.velocity || 0;

    // 1. Dynamic Wave Amplification based on scroll speed
    const speedBoost = Math.min(velocity * 0.0025, 2.5);
    const waveAmp = (0.28 + speedBoost * 0.15) * (1.0 + progress * 0.6);

    // 2. The "Blows Open" Torus Expansion
    // As the user scrolls down, the torus opens up into an expansive cosmic ribbon
    const majorR = 2.4 + progress * 2.6;
    const minorR = 0.85 + progress * 0.5;

    // Fluid undulation waves propagating around the parametric ring
    for (let i = 0; i < particleCount; i++) {
      const u = angles[i * 2];
      const v = angles[i * 2 + 1];

      // Harmonic waves modulated by scroll velocity
      const wave = Math.sin(u * 4.0 + time * 1.3 + progress * 3.0) * waveAmp
                 + Math.cos(v * 3.0 + time * 1.5) * (0.16 + speedBoost * 0.08)
                 + Math.sin(u * 2.0 - v * 2.0 + time * 1.8) * 0.18;

      const currentR = majorR + wave;
      const current_r = minorR * (1.0 + 0.22 * Math.sin(u * 3.0 + time * 0.9));

      const x = (currentR + current_r * Math.cos(v)) * Math.cos(u);
      const y = (currentR + current_r * Math.cos(v)) * Math.sin(u);
      const z = current_r * Math.sin(v) + Math.sin(u * 3.0 + time * 1.1 + progress * 2.0) * 0.35;

      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;
    }

    positionsAttr.needsUpdate = true;

    // 3. Dramatic 3D Tumbling on Scroll
    // Torus twists along all 3 axes as user travels down the page
    const baseRotX = -0.55;
    const baseRotY = 0.35 + time * 0.06;
    const baseRotZ = -0.22;

    const scrollRotX = progress * Math.PI * 1.5;
    const scrollRotY = progress * Math.PI * 2.2;
    const scrollRotZ = progress * Math.PI * 0.8;

    const targetRotX = baseRotX + scrollRotX + pointer.y * 0.25;
    const targetRotY = baseRotY + scrollRotY + pointer.x * 0.3;
    const targetRotZ = baseRotZ + scrollRotZ;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.07);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.07);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.07);

    // 4. Horizontal and Vertical Path Following
    // Glides dynamically to frame different section cards
    const targetX = Math.sin(progress * Math.PI * 2.0) * 1.6 + 0.2;
    const targetY = -progress * 2.2 + 0.1;
    const targetZ = -progress * 2.0;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.07);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.07);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.07);
  });

  return (
    <group ref={groupRef} position={[0.2, 0.1, 0]}>
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
          opacity={0.92}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          size={0.042}
        />
      </points>

      {/* Dynamic Ambient Point Lights */}
      <pointLight color="#00f5d4" intensity={2.2} distance={12} position={[-2, 2, 2]} />
      <pointLight color="#8b5cf6" intensity={2.2} distance={12} position={[2, -2, -1]} />
    </group>
  );
};

export default VesperOrb;
