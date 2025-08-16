import React, { useRef } from 'react';
import { useControls } from 'leva';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';

const Scene = ({ cameraType, fov, zoom, near, far }: any) => {
  return (
    <>
      {cameraType === 'perspective' ? (
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={fov} near={near} far={far} />
      ) : (
        <OrthographicCamera makeDefault position={[5, 5, 5]} zoom={zoom} near={near} far={far} />
      )}
      
      <OrbitControls enableDamping />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* シーンオブジェクト */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
      
      <mesh position={[2, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#4ecdc4" />
      </mesh>
      
      <mesh position={[-2, 0, 0]}>
        <coneGeometry args={[0.5, 1, 32]} />
        <meshStandardMaterial color="#45b7d1" />
      </mesh>
      
      <gridHelper args={[10, 10]} />
      <axesHelper args={[5]} />
    </>
  );
};

export const CameraDemo = () => {
  const {
    cameraType,
    fov,
    zoom,
    near,
    far
  } = useControls('カメラ設定', {
    cameraType: {
      value: 'perspective',
      options: {
        '透視投影': 'perspective',
        '平行投影': 'orthographic'
      },
      label: 'カメラタイプ'
    },
    fov: { 
      value: 50, 
      min: 10, 
      max: 120, 
      step: 1, 
      label: '視野角（透視投影）',
      render: (get) => get('カメラ設定.cameraType') === 'perspective'
    },
    zoom: { 
      value: 50, 
      min: 10, 
      max: 200, 
      step: 1, 
      label: 'ズーム（平行投影）',
      render: (get) => get('カメラ設定.cameraType') === 'orthographic'
    },
    near: { value: 0.1, min: 0.1, max: 10, step: 0.1, label: 'ニアクリップ' },
    far: { value: 1000, min: 10, max: 2000, step: 10, label: 'ファークリップ' }
  });

  return (
    <Canvas shadows>
      <Scene cameraType={cameraType} fov={fov} zoom={zoom} near={near} far={far} />
    </Canvas>
  );
};

CameraDemo.title = 'カメラコントロール';
CameraDemo.description = '透視投影と平行投影の比較とパラメーター調整';
CameraDemo.hasCanvas = true;
