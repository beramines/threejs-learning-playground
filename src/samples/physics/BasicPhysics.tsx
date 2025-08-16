import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Plane } from '@react-three/drei';
import { Physics, useBox, useSphere, usePlane } from '@react-three/cannon';
import { Leva, useControls } from 'leva';
import * as THREE from 'three';

// 物理演算を適用したボックス
function PhysicsBox({ position }: { position: [number, number, number] }) {
  const [ref] = useBox(() => ({
    mass: 1,
    position,
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
  }));

  return (
    <Box ref={ref as any} args={[1, 1, 1]} castShadow>
      <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 50%)`} />
    </Box>
  );
}

// 物理演算を適用した球体
function PhysicsSphere({ position }: { position: [number, number, number] }) {
  const [ref] = useSphere(() => ({
    mass: 1,
    position,
  }));

  return (
    <Sphere ref={ref as any} args={[0.5, 32, 32]} castShadow>
      <meshStandardMaterial 
        color={`hsl(${Math.random() * 360}, 70%, 50%)`}
        metalness={0.8}
        roughness={0.2}
      />
    </Sphere>
  );
}

// 地面
function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -5, 0],
  }));

  return (
    <Plane ref={ref as any} args={[50, 50]} receiveShadow>
      <meshStandardMaterial color="#333" />
    </Plane>
  );
}

// 壁
function Walls() {
  const [backRef] = usePlane(() => ({
    position: [0, 0, -10],
  }));
  
  const [frontRef] = usePlane(() => ({
    position: [0, 0, 10],
    rotation: [0, Math.PI, 0],
  }));
  
  const [leftRef] = usePlane(() => ({
    position: [-10, 0, 0],
    rotation: [0, Math.PI / 2, 0],
  }));
  
  const [rightRef] = usePlane(() => ({
    position: [10, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
  }));

  return (
    <>
      <Plane ref={backRef as any} args={[20, 20]} visible={false} />
      <Plane ref={frontRef as any} args={[20, 20]} visible={false} />
      <Plane ref={leftRef as any} args={[20, 20]} visible={false} />
      <Plane ref={rightRef as any} args={[20, 20]} visible={false} />
    </>
  );
}

// メインコンポーネント
export default function BasicPhysics() {
  const {
    gravity,
    iterations,
    tolerance,
    objectCount,
    objectType
  } = useControls('物理演算設定', {
    gravity: { value: -9.82, min: -20, max: 0, step: 0.1 },
    iterations: { value: 50, min: 10, max: 100, step: 1 },
    tolerance: { value: 0.001, min: 0.0001, max: 0.01, step: 0.0001 },
    objectCount: { value: 10, min: 1, max: 30, step: 1 },
    objectType: { value: 'mixed', options: ['boxes', 'spheres', 'mixed'] }
  });

  // オブジェクトを生成
  const objects = Array.from({ length: objectCount }, (_, i) => {
    const position: [number, number, number] = [
      (Math.random() - 0.5) * 8,
      5 + i * 1.5,
      (Math.random() - 0.5) * 8
    ];
    
    if (objectType === 'boxes') {
      return <PhysicsBox key={i} position={position} />;
    } else if (objectType === 'spheres') {
      return <PhysicsSphere key={i} position={position} />;
    } else {
      return i % 2 === 0 
        ? <PhysicsBox key={i} position={position} />
        : <PhysicsSphere key={i} position={position} />;
    }
  });

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [15, 10, 15], fov: 50 }}
        shadows
      >
        <color attach="background" args={['#222']} />
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#ff0088" />

        <Physics
          gravity={[0, gravity, 0]}
          iterations={iterations}
          tolerance={tolerance}
          defaultContactMaterial={{
            friction: 0.4,
            restitution: 0.3,
          }}
        >
          {objects}
          <Ground />
          <Walls />
        </Physics>

        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={40}
        />
        
        <gridHelper args={[50, 50]} position={[0, -4.99, 0]} />
      </Canvas>
      <Leva collapsed={false} />
    </div>
  );
}

BasicPhysics.title = '基本的な物理演算';
BasicPhysics.description = '重力、衝突検出、跳ね返りなどの基本的な物理シミュレーション';
