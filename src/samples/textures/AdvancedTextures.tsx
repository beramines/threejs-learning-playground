import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useTexture } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import * as THREE from 'three';

// 球体コンポーネント（複数テクスチャ使用）
function TexturedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // コントロール設定
  const {
    rotationSpeed,
    roughness,
    metalness,
    normalScale,
    displacementScale,
    envMapIntensity,
    showNormalMap,
    showDisplacementMap
  } = useControls('高度なテクスチャ設定', {
    rotationSpeed: { value: 0.002, min: 0, max: 0.05, step: 0.001 },
    roughness: { value: 0.2, min: 0, max: 1, step: 0.01 },
    metalness: { value: 0.8, min: 0, max: 1, step: 0.01 },
    normalScale: { value: 1, min: -5, max: 5, step: 0.1 },
    displacementScale: { value: 0.1, min: 0, max: 1, step: 0.01 },
    envMapIntensity: { value: 1, min: 0, max: 2, step: 0.1 },
    showNormalMap: true,
    showDisplacementMap: true
  });

  // シンプルなテクスチャを作成
  const textures = React.useMemo(() => {
    // ベースカラーテクスチャ（シンプルなグラデーション）
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = 256;
    mapCanvas.height = 256;
    const mapContext = mapCanvas.getContext('2d')!;
    
    const gradient = mapContext.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, '#4a90e2');
    gradient.addColorStop(1, '#2c5aa0');
    
    mapContext.fillStyle = gradient;
    mapContext.fillRect(0, 0, 256, 256);
    
    const map = new THREE.CanvasTexture(mapCanvas);
    
    // シンプルな法線マップ
    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = 256;
    normalCanvas.height = 256;
    const normalContext = normalCanvas.getContext('2d')!;
    
    normalContext.fillStyle = '#8080ff';
    normalContext.fillRect(0, 0, 256, 256);
    
    // 少数のバンプパターン
    for (let i = 0; i < 10; i++) {
      normalContext.fillStyle = '#a0a0ff';
      normalContext.beginPath();
      normalContext.arc(Math.random() * 256, Math.random() * 256, 20, 0, Math.PI * 2);
      normalContext.fill();
    }
    
    const normalMap = new THREE.CanvasTexture(normalCanvas);
    
    // シンプルな変位マップ
    const displacementCanvas = document.createElement('canvas');
    displacementCanvas.width = 256;
    displacementCanvas.height = 256;
    const displacementContext = displacementCanvas.getContext('2d')!;
    
    displacementContext.fillStyle = '#808080';
    displacementContext.fillRect(0, 0, 256, 256);
    
    const displacementMap = new THREE.CanvasTexture(displacementCanvas);
    
    return { map, normalMap, displacementMap };
  }, []);
  
  // アニメーション
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={textures.map}
        normalMap={showNormalMap ? textures.normalMap : undefined}
        normalScale={new THREE.Vector2(normalScale, normalScale)}
        displacementMap={showDisplacementMap ? textures.displacementMap : undefined}
        displacementScale={displacementScale}
        roughness={roughness}
        metalness={metalness}
        envMapIntensity={envMapIntensity}
      />
    </mesh>
  );
}

// 背景環境用のボックス
function EnvironmentBox() {
  const { showEnvironment } = useControls('環境設定', {
    showEnvironment: true
  });

  return showEnvironment ? (
    <>
      {/* 周囲にボックスを配置 */}
      <mesh position={[-4, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[4, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, -4]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="green" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 4]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="yellow" metalness={0.9} roughness={0.1} />
      </mesh>
    </>
  ) : null;
}

// メインコンポーネント
export default function AdvancedTextures() {
  const { environmentPreset } = useControls('環境プリセット', {
    environmentPreset: {
      value: 'sunset',
      options: ['sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'city', 'park']
    }
  });

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [5, 3, 5], fov: 50 }}
        shadows
      >
        
        <TexturedSphere />
        <EnvironmentBox />
        
        {/* シンプルな環境ライティング */}
        <ambientLight intensity={environmentPreset === 'night' ? 0.1 : environmentPreset === 'sunset' ? 0.3 : 0.2} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={environmentPreset === 'night' ? 0.5 : environmentPreset === 'sunset' ? 1.2 : 1} 
          color={environmentPreset === 'night' ? '#4444aa' : environmentPreset === 'sunset' ? '#ffaa44' : '#ffffff'}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight 
          position={[-5, 5, -5]} 
          intensity={environmentPreset === 'night' ? 0.3 : 0.5} 
          color={environmentPreset === 'night' ? '#2222ff' : environmentPreset === 'sunset' ? '#ff6600' : '#ffaa00'} 
        />
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={15}
        />
        
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
}

AdvancedTextures.title = '高度なテクスチャ';
AdvancedTextures.description = '法線マップ、変位マップ、環境マップを使用した高度なテクスチャリング';
AdvancedTextures.hasCanvas = true;
