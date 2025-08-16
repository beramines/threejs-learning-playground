import React, { useRef, useMemo } from 'react';
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const AnimationDemo = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const {
    animationType,
    speed,
    amplitude,
    particleCount,
    particleSize,
    colorA,
    colorB
  } = useControls('アニメーション設定', {
    animationType: {
      value: 'rotation',
      options: {
        '回転': 'rotation',
        '波動': 'wave',
        'らせん': 'spiral',
        'パーティクル': 'particles',
        '複合': 'combined'
      },
      label: 'アニメーションタイプ'
    },
    speed: { value: 1, min: 0, max: 5, step: 0.1, label: '速度' },
    amplitude: { value: 2, min: 0.5, max: 5, step: 0.1, label: '振幅' },
    particleCount: { value: 1000, min: 100, max: 5000, step: 100, label: 'パーティクル数' },
    particleSize: { value: 0.05, min: 0.01, max: 0.2, step: 0.01, label: 'パーティクルサイズ' },
    colorA: { value: '#ff6b6b', label: '色A' },
    colorB: { value: '#4ecdc4', label: '色B' }
  });

  // パーティクルの位置を生成
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      const color = new THREE.Color(Math.random() > 0.5 ? colorA : colorB);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, [particleCount, colorA, colorB]);

  useFrame((state) => {
    const time = state.clock.elapsedTime * speed;

    if (groupRef.current) {
      switch (animationType) {
        case 'rotation':
          groupRef.current.rotation.x = time * 0.5;
          groupRef.current.rotation.y = time * 0.3;
          break;
        case 'wave':
          groupRef.current.children.forEach((child, i) => {
            child.position.y = Math.sin(time + i * 0.5) * amplitude;
          });
          break;
        case 'spiral':
          groupRef.current.children.forEach((child, i) => {
            const angle = time + i * 0.5;
            child.position.x = Math.cos(angle) * amplitude;
            child.position.z = Math.sin(angle) * amplitude;
            child.position.y = Math.sin(time * 2 + i) * 0.5;
          });
          break;
        case 'particles':
          if (particlesRef.current) {
            particlesRef.current.rotation.y = time * 0.1;
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
              positions[i + 1] = Math.sin(time + positions[i] * 0.1) * amplitude;
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
          }
          break;
        case 'combined':
          groupRef.current.rotation.y = time * 0.2;
          groupRef.current.children.forEach((child, i) => {
            child.rotation.x = time + i * 0.5;
            child.rotation.z = time + i * 0.3;
            child.position.y = Math.sin(time + i * 0.5) * amplitude * 0.3;
          });
          break;
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {animationType === 'particles' ? (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={particles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={particleCount}
              array={particles.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={particleSize}
            vertexColors
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
      ) : (
        <group ref={groupRef}>
          <mesh position={[-3, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={colorA} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.7, 32, 32]} />
            <meshStandardMaterial color={colorB} />
          </mesh>
          <mesh position={[3, 0, 0]}>
            <coneGeometry args={[0.7, 1.5, 32]} />
            <meshStandardMaterial color={colorA} />
          </mesh>
        </group>
      )}
      
      <gridHelper args={[10, 10]} />
    </>
  );
};

AnimationDemo.title = 'アニメーションデモ';
AnimationDemo.description = '様々なアニメーションパターンの実験';
