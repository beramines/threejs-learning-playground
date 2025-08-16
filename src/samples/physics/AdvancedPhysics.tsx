import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Plane } from '@react-three/drei';
import { Physics, useBox, useSphere, useCylinder, usePlane, useDistanceConstraint, usePointToPointConstraint } from '@react-three/cannon';
import { Leva, useControls } from 'leva';
import * as THREE from 'three';

// ドミノピース
function Domino({ position }: { position: [number, number, number] }) {
  const [ref] = useBox(() => ({
    mass: 0.5,
    position,
    args: [0.2, 2, 1],
  }));

  return (
    <Box ref={ref as any} args={[0.2, 2, 1]} castShadow>
      <meshStandardMaterial color="#ff6600" />
    </Box>
  );
}

// 振り子
function Pendulum({ position }: { position: [number, number, number] }) {
  const [sphereRef, sphereApi] = useSphere(() => ({
    mass: 1,
    position: [position[0], position[1] - 3, position[2]],
  }));
  
  const [anchorRef] = useBox(() => ({
    position,
    type: 'Static',
    args: [0.5, 0.5, 0.5],
  }));

  // 振り子の紐（制約）
  usePointToPointConstraint(anchorRef, sphereRef, {
    pivotA: [0, 0, 0],
    pivotB: [0, 3, 0],
  });

  return (
    <>
      <Box ref={anchorRef as any} args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial color="#333" />
      </Box>
      <Sphere ref={sphereRef as any} args={[0.5, 32, 32]} castShadow>
        <meshStandardMaterial color="#00ff88" metalness={0.8} roughness={0.2} />
      </Sphere>
    </>
  );
}

// チェーン
function Chain({ position }: { position: [number, number, number] }) {
  const linksCount = 10;
  const linkSize: [number, number, number] = [0.5, 0.2, 0.2];
  
  const links = Array.from({ length: linksCount }, (_, i) => {
    const [ref] = useBox(() => ({
      mass: i === 0 ? 0 : 0.5,
      position: [position[0], position[1] - i * 0.3, position[2]],
      args: linkSize,
      type: i === 0 ? 'Static' : 'Dynamic',
    }));
    
    return ref;
  });

  // リンク間の制約を作成
  for (let i = 0; i < linksCount - 1; i++) {
    useDistanceConstraint(links[i], links[i + 1], {
      distance: 0.3,
    });
  }

  return (
    <>
      {links.map((ref, i) => (
        <Box key={i} ref={ref as any} args={linkSize} castShadow>
          <meshStandardMaterial 
            color={i === 0 ? '#333' : `hsl(${i * 36}, 70%, 50%)`}
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
      ))}
    </>
  );
}

// インタラクティブな球（クリックで力を加える）
function InteractiveSphere() {
  const [ref, api] = useSphere(() => ({
    mass: 2,
    position: [0, 5, 0],
  }));

  const handleClick = () => {
    const force = 10;
    api.applyImpulse(
      [
        (Math.random() - 0.5) * force,
        force,
        (Math.random() - 0.5) * force
      ],
      [0, 0, 0]
    );
  };

  return (
    <Sphere 
      ref={ref as any} 
      args={[1, 32, 32]} 
      castShadow
      onClick={handleClick}
    >
      <meshStandardMaterial 
        color="#ff00ff"
        emissive="#ff00ff"
        emissiveIntensity={0.2}
        metalness={0.9}
        roughness={0.1}
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
    <Plane ref={ref as any} args={[100, 100]} receiveShadow>
      <meshStandardMaterial color="#222" />
    </Plane>
  );
}

// メインコンポーネント
export default function AdvancedPhysics() {
  const {
    gravity,
    simulationType,
    windForce,
    friction,
    restitution
  } = useControls('高度な物理設定', {
    gravity: { value: -9.82, min: -20, max: 0, step: 0.1 },
    simulationType: { value: 'all', options: ['domino', 'pendulum', 'chain', 'interactive', 'all'] },
    windForce: { value: 0, min: -10, max: 10, step: 0.1 },
    friction: { value: 0.4, min: 0, max: 1, step: 0.01 },
    restitution: { value: 0.3, min: 0, max: 1, step: 0.01 }
  });

  // ドミノを配置
  const dominos = Array.from({ length: 15 }, (_, i) => (
    <Domino key={`domino-${i}`} position={[i * 1.5 - 10, 0, 0]} />
  ));

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [20, 15, 20], fov: 50 }}
        shadows
      >
        <color attach="background" args={['#111']} />
        <fog attach="fog" args={['#111', 10, 100]} />
        
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ff0088" />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#0088ff" />

        <Physics
          gravity={[windForce, gravity, 0]}
          iterations={50}
          defaultContactMaterial={{
            friction,
            restitution,
          }}
        >
          {(simulationType === 'domino' || simulationType === 'all') && dominos}
          
          {(simulationType === 'pendulum' || simulationType === 'all') && (
            <>
              <Pendulum position={[-5, 5, -5]} />
              <Pendulum position={[5, 5, -5]} />
              <Pendulum position={[0, 5, -5]} />
            </>
          )}
          
          {(simulationType === 'chain' || simulationType === 'all') && (
            <>
              <Chain position={[-8, 8, 5]} />
              <Chain position={[8, 8, 5]} />
            </>
          )}
          
          {(simulationType === 'interactive' || simulationType === 'all') && (
            <InteractiveSphere />
          )}
          
          <Ground />
        </Physics>

        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minDistance={10}
          maxDistance={50}
        />
        
        <gridHelper args={[100, 100]} position={[0, -4.99, 0]} />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-black/50 p-4 rounded-lg">
        <p className="text-white text-sm">
          💡 ヒント: 紫の球をクリックすると力が加わります
        </p>
      </div>
      
      <Leva collapsed={false} />
    </div>
  );
}

AdvancedPhysics.title = '高度な物理演算';
AdvancedPhysics.description = 'ドミノ、振り子、チェーン、制約システムなどの複雑な物理シミュレーション';
