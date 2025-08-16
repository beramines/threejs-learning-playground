import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import * as THREE from 'three';

// カスタムシェーダーマテリアル
function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // コントロール設定
  const {
    timeSpeed,
    amplitude,
    frequency,
    color1,
    color2
  } = useControls('シェーダー設定', {
    timeSpeed: { value: 1, min: 0, max: 5, step: 0.1 },
    amplitude: { value: 0.5, min: 0, max: 2, step: 0.01 },
    frequency: { value: 2, min: 0.1, max: 10, step: 0.1 },
    color1: '#ff0066',
    color2: '#00ffff'
  });

  // カスタムシェーダー
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uFrequency: { value: frequency },
        uColor1: { value: new THREE.Color(color1) },
        uColor2: { value: new THREE.Color(color2) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uAmplitude;
        uniform float uFrequency;
        
        varying vec2 vUv;
        varying float vElevation;
        
        void main() {
          vUv = uv;
          
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          
          float elevation = sin(modelPosition.x * uFrequency + uTime) * 
                          sin(modelPosition.z * uFrequency + uTime) * 
                          uAmplitude;
          
          modelPosition.y += elevation;
          vElevation = elevation;
          
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          
          gl_Position = projectedPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        
        varying vec2 vUv;
        varying float vElevation;
        
        void main() {
          float mixStrength = (vElevation + 0.5) * 0.5;
          vec3 color = mix(uColor1, uColor2, mixStrength);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      wireframe: false,
      side: THREE.DoubleSide
    });
  }, []);

  // アニメーション
  useFrame((state) => {
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime * timeSpeed;
      material.uniforms.uAmplitude.value = amplitude;
      material.uniforms.uFrequency.value = frequency;
      material.uniforms.uColor1.value = new THREE.Color(color1);
      material.uniforms.uColor2.value = new THREE.Color(color2);
    }
  });

  return (
    <mesh ref={meshRef} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[10, 10, 64, 64]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

// メインコンポーネント
export default function BasicShader() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [7, 5, 7], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        <ShaderPlane />
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={20}
        />
        
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  );
}

BasicShader.title = '基本的なシェーダー';
BasicShader.description = 'GLSL を使用したカスタム頂点・フラグメントシェーダーの基本例';
