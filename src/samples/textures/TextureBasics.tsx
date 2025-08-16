import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import * as THREE from 'three';

// キューブコンポーネント
function TexturedCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // コントロール設定
  const {
    rotationSpeed,
    textureRepeat,
    textureRotation,
    textureOffset,
    material
  } = useControls('テクスチャ設定', {
    rotationSpeed: { value: 0.005, min: 0, max: 0.1, step: 0.001 },
    textureRepeat: { value: { x: 1, y: 1 }, min: 0.1, max: 5, step: 0.1 },
    textureRotation: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    textureOffset: { value: { x: 0, y: 0 }, min: -1, max: 1, step: 0.01 },
    material: {
      value: 'standard',
      options: ['standard', 'basic', 'lambert', 'phong']
    }
  });

  // テクスチャをロード（Three.jsのデフォルトテクスチャパスを使用）
  const colorMap = useTexture('https://threejs.org/examples/textures/uv_grid_opengl.jpg');
  
  // テクスチャ設定を更新
  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(textureRepeat.x, textureRepeat.y);
  colorMap.rotation = textureRotation;
  colorMap.offset.set(textureOffset.x, textureOffset.y);
  
  // アニメーション
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  // マテリアルの選択
  const getMaterial = () => {
    const props = { map: colorMap };
    switch (material) {
      case 'basic':
        return <meshBasicMaterial {...props} />;
      case 'lambert':
        return <meshLambertMaterial {...props} />;
      case 'phong':
        return <meshPhongMaterial {...props} />;
      default:
        return <meshStandardMaterial {...props} roughness={0.5} metalness={0.1} />;
    }
  };

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      {getMaterial()}
    </mesh>
  );
}

// メインコンポーネント
export default function TextureBasics() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [4, 4, 4], fov: 50 }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow
        />
        <TexturedCube />
        <OrbitControls enableDamping dampingFactor={0.05} />
        <gridHelper args={[10, 10]} />
        <axesHelper args={[5]} />
      </Canvas>
      <Leva collapsed={false} />
    </div>
  );
}

TextureBasics.title = 'テクスチャの基本';
TextureBasics.description = 'UV マッピング、テクスチャの繰り返し、オフセット、回転の基本的な例';
