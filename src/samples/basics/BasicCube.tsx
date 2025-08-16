import React, { useRef } from 'react';
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const BasicCube = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const { 
    positionX, 
    positionY, 
    positionZ,
    rotationSpeed,
    scale,
    color,
    wireframe
  } = useControls('キューブの設定', {
    positionX: { value: 0, min: -5, max: 5, step: 0.1, label: 'X座標' },
    positionY: { value: 0, min: -5, max: 5, step: 0.1, label: 'Y座標' },
    positionZ: { value: 0, min: -5, max: 5, step: 0.1, label: 'Z座標' },
    rotationSpeed: { value: 0.01, min: 0, max: 0.1, step: 0.001, label: '回転速度' },
    scale: { value: 1, min: 0.1, max: 3, step: 0.1, label: 'スケール' },
    color: { value: '#0088ff', label: '色' },
    wireframe: { value: false, label: 'ワイヤーフレーム' }
  });

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh
        ref={meshRef}
        position={[positionX, positionY, positionZ]}
        scale={scale}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={color} wireframe={wireframe} />
      </mesh>
      <gridHelper args={[10, 10]} />
    </>
  );
};

BasicCube.title = '基本的なキューブ';
BasicCube.description = '回転するキューブの基本的な例。位置、スケール、色などを調整できます。';
