import React, { useRef } from 'react';
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const MaterialShowcase = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const { 
    materialType,
    color,
    emissive,
    metalness,
    roughness,
    wireframe,
    opacity,
    transparent
  } = useControls('マテリアル設定', {
    materialType: {
      value: 'standard',
      options: {
        'スタンダード': 'standard',
        'ベーシック': 'basic',
        'フォン': 'phong',
        'ランバート': 'lambert',
        'フィジカル': 'physical',
        'トゥーン': 'toon',
        'マットキャップ': 'matcap'
      },
      label: 'マテリアルタイプ'
    },
    color: { value: '#ff9800', label: '色' },
    emissive: { value: '#000000', label: 'エミッシブ' },
    metalness: { value: 0.5, min: 0, max: 1, step: 0.01, label: 'メタルネス' },
    roughness: { value: 0.5, min: 0, max: 1, step: 0.01, label: 'ラフネス' },
    wireframe: { value: false, label: 'ワイヤーフレーム' },
    opacity: { value: 1, min: 0, max: 1, step: 0.01, label: '不透明度' },
    transparent: { value: false, label: '透明' }
  });

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const renderMaterial = () => {
    const commonProps = {
      color,
      wireframe,
      opacity,
      transparent
    };

    switch (materialType) {
      case 'basic':
        return <meshBasicMaterial {...commonProps} />;
      case 'phong':
        return <meshPhongMaterial {...commonProps} emissive={emissive} shininess={100} />;
      case 'lambert':
        return <meshLambertMaterial {...commonProps} emissive={emissive} />;
      case 'standard':
        return <meshStandardMaterial {...commonProps} metalness={metalness} roughness={roughness} emissive={emissive} />;
      case 'physical':
        return <meshPhysicalMaterial {...commonProps} metalness={metalness} roughness={roughness} clearcoat={1} clearcoatRoughness={0} />;
      case 'toon':
        return <meshToonMaterial {...commonProps} />;
      case 'matcap':
        return <meshMatcapMaterial {...commonProps} />;
      default:
        return <meshStandardMaterial {...commonProps} />;
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ffaa00" />
      
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.4, 100, 16]} />
        {renderMaterial()}
      </mesh>
      
      <gridHelper args={[10, 10]} />
    </>
  );
};

MaterialShowcase.title = 'マテリアルショーケース';
MaterialShowcase.description = '様々なマテリアルタイプとプロパティの比較';
