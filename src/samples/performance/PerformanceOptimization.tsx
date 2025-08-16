import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stats, PerformanceMonitor, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import * as THREE from 'three';

// インスタンスメッシュを使用した最適化
function OptimizedInstances() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const {
    count,
    animationSpeed,
    scale
  } = useControls('インスタンス設定', {
    count: { value: 1000, min: 100, max: 10000, step: 100 },
    animationSpeed: { value: 1, min: 0, max: 5, step: 0.1 },
    scale: { value: 0.5, min: 0.1, max: 2, step: 0.1 }
  });

  // インスタンスの位置と色を事前計算
  const { positions, colors } = useMemo(() => {
    const positions: THREE.Matrix4[] = [];
    const colors: THREE.Color[] = [];
    
    for (let i = 0; i < count; i++) {
      const matrix = new THREE.Matrix4();
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      );
      const rotation = new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      const quaternion = new THREE.Quaternion().setFromEuler(rotation);
      const scaleVec = new THREE.Vector3(scale, scale, scale);
      
      matrix.compose(position, quaternion, scaleVec);
      positions.push(matrix);
      
      colors.push(new THREE.Color(`hsl(${(i / count) * 360}, 70%, 50%)`));
    }
    
    return { positions, colors };
  }, [count, scale]);

  // 初期設定
  useMemo(() => {
    if (meshRef.current) {
      positions.forEach((matrix, i) => {
        meshRef.current!.setMatrixAt(i, matrix);
        meshRef.current!.setColorAt(i, colors[i]);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [positions, colors]);

  // アニメーション
  useFrame((state) => {
    if (meshRef.current && animationSpeed > 0) {
      const time = state.clock.elapsedTime * animationSpeed;
      const dummy = new THREE.Object3D();
      
      for (let i = 0; i < count; i++) {
        const matrix = new THREE.Matrix4();
        meshRef.current.getMatrixAt(i, matrix);
        
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scaleVec = new THREE.Vector3();
        matrix.decompose(position, quaternion, scaleVec);
        
        dummy.position.copy(position);
        dummy.rotation.y = time + i * 0.01;
        dummy.rotation.x = Math.sin(time + i * 0.1) * 0.2;
        dummy.scale.copy(scaleVec);
        dummy.updateMatrix();
        
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial vertexColors />
    </instancedMesh>
  );
}

// LOD（Level of Detail）の例
function LODExample() {
  const { distance } = useControls('LOD設定', {
    distance: { value: 10, min: 5, max: 50, step: 1 }
  });

  return (
    <lod>
      <mesh visible userData={{ distance: 0 }}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh visible userData={{ distance }}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
      <mesh visible userData={{ distance: distance * 2 }}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </lod>
  );
}

// メインコンポーネント
export default function PerformanceOptimization() {
  const {
    showStats,
    adaptiveDpr,
    adaptiveEvents,
    shadowMapSize,
    antialias
  } = useControls('パフォーマンス設定', {
    showStats: true,
    adaptiveDpr: true,
    adaptiveEvents: true,
    shadowMapSize: { value: 1024, options: [512, 1024, 2048, 4096] },
    antialias: false
  });

  const [dpr, setDpr] = useControls('DPR', () => ({
    current: { value: 1, min: 0.5, max: 2, step: 0.1 }
  }));

  return (
    <div className="w-full h-full relative">
      {showStats && <Stats />}
      
      <Canvas
        camera={{ position: [20, 20, 20], fov: 50 }}
        shadows
        dpr={adaptiveDpr ? [0.5, 2] : dpr.current}
        gl={{ 
          antialias,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true
        }}
      >
        <color attach="background" args={['#111']} />
        <fog attach="fog" args={['#111', 20, 100]} />
        
        {adaptiveDpr && (
          <AdaptiveDpr pixelated />
        )}
        
        {adaptiveEvents && (
          <AdaptiveEvents />
        )}
        
        <PerformanceMonitor
          onDecline={() => console.log('Performance declining')}
          onIncline={() => console.log('Performance improving')}
          onChange={({ fps, factor }) => {
            console.log(`FPS: ${fps}, Factor: ${factor}`);
            if (adaptiveDpr) {
              setDpr({ current: Math.max(0.5, Math.min(2, factor)) });
            }
          }}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[shadowMapSize, shadowMapSize]}
        />
        
        <OptimizedInstances />
        <LODExample />
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minDistance={10}
          maxDistance={100}
        />
        
        <gridHelper args={[100, 100]} />
      </Canvas>
      
    </div>
  );
}

PerformanceOptimization.title = 'パフォーマンス最適化';
PerformanceOptimization.description = 'インスタンシング、LOD、アダプティブ品質などの最適化テクニック';
