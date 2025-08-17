import { useRef } from 'react';
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const BasicSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const { 
    radius,
    widthSegments,
    heightSegments,
    color,
    metalness,
    roughness,
    wireframe,
    animate
  } = useControls('球体の設定', {
    radius: { value: 1.5, min: 0.5, max: 3, step: 0.1, label: '半径' },
    widthSegments: { value: 32, min: 8, max: 64, step: 1, label: '横分割数' },
    heightSegments: { value: 16, min: 8, max: 32, step: 1, label: '縦分割数' },
    color: { value: '#ff6b6b', label: '色' },
    metalness: { value: 0.3, min: 0, max: 1, step: 0.01, label: 'メタルネス' },
    roughness: { value: 0.4, min: 0, max: 1, step: 0.01, label: 'ラフネス' },
    wireframe: { value: false, label: 'ワイヤーフレーム' },
    animate: { value: true, label: 'アニメーション' }
  });

  useFrame((state) => {
    if (meshRef.current && animate) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, widthSegments, heightSegments]} />
        <meshStandardMaterial 
          color={color}
          metalness={metalness}
          roughness={roughness}
          wireframe={wireframe}
        />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={-2} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </>
  );
};

BasicSphere.title = '球体とマテリアル';
BasicSphere.description = '球体のジオメトリとPBRマテリアルの設定例';
