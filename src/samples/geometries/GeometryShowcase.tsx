import { useRef } from 'react';
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const GeometryShowcase = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const { 
    geometryType,
    wireframe,
    rotationSpeed,
    color
  } = useControls('ジオメトリ設定', {
    geometryType: {
      value: 'box',
      options: {
        'ボックス': 'box',
        '球体': 'sphere',
        'コーン': 'cone',
        'シリンダー': 'cylinder',
        'トーラス': 'torus',
        'トーラスノット': 'torusKnot',
        '正十二面体': 'dodecahedron',
        '正二十面体': 'icosahedron',
        '正八面体': 'octahedron',
        '正四面体': 'tetrahedron'
      },
      label: 'ジオメトリタイプ'
    },
    wireframe: { value: false, label: 'ワイヤーフレーム' },
    rotationSpeed: { value: 0.005, min: 0, max: 0.05, step: 0.001, label: '回転速度' },
    color: { value: '#4fc3f7', label: '色' }
  });

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += rotationSpeed;
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  const renderGeometry = () => {
    switch (geometryType) {
      case 'box':
        return <boxGeometry args={[2, 2, 2]} />;
      case 'sphere':
        return <sphereGeometry args={[1.5, 32, 16]} />;
      case 'cone':
        return <coneGeometry args={[1, 2, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[1, 1, 2, 32]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.4, 16, 100]} />;
      case 'torusKnot':
        return <torusKnotGeometry args={[1, 0.3, 100, 16]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[1.5]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[1.5]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1.5]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[1.5]} />;
      default:
        return <boxGeometry args={[2, 2, 2]} />;
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <group ref={groupRef}>
        <mesh>
          {renderGeometry()}
          <meshStandardMaterial color={color} wireframe={wireframe} />
        </mesh>
      </group>
      <gridHelper args={[10, 10]} />
    </>
  );
};

GeometryShowcase.title = 'ジオメトリショーケース';
GeometryShowcase.description = '様々な基本ジオメトリを切り替えて表示';
