import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useTexture, Box, Sphere } from '@react-three/drei';
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

  // テクスチャをロード
  const textures = useTexture({
    map: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
    normalMap: 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
    displacementMap: 'https://threejs.org/examples/textures/planets/earth_displacement.jpg',
  });
  
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
      <Box position={[-4, 0, 0]} args={[1, 1, 1]}>
        <meshStandardMaterial color="red" metalness={0.9} roughness={0.1} />
      </Box>
      <Box position={[4, 0, 0]} args={[1, 1, 1]}>
        <meshStandardMaterial color="blue" metalness={0.9} roughness={0.1} />
      </Box>
      <Box position={[0, 0, -4]} args={[1, 1, 1]}>
        <meshStandardMaterial color="green" metalness={0.9} roughness={0.1} />
      </Box>
      <Box position={[0, 0, 4]} args={[1, 1, 1]}>
        <meshStandardMaterial color="yellow" metalness={0.9} roughness={0.1} />
      </Box>
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
        <ambientLight intensity={0.2} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffaa00" />
        
        <TexturedSphere />
        <EnvironmentBox />
        
        {/* 環境マップ */}
        <Environment preset={environmentPreset as any} background />
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={15}
        />
        
        <gridHelper args={[10, 10]} />
      </Canvas>
      <Leva collapsed={false} />
    </div>
  );
}

AdvancedTextures.title = '高度なテクスチャ';
AdvancedTextures.description = '法線マップ、変位マップ、環境マップを使用した高度なテクスチャリング';
