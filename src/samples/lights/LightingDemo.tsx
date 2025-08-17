import { useRef } from 'react';
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useHelper } from '@react-three/drei';

export const LightingDemo = () => {
  const directionalRef = useRef<THREE.DirectionalLight>(null);
  const pointRef = useRef<THREE.PointLight>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  
  useHelper(directionalRef, THREE.DirectionalLightHelper, 1, 'yellow');
  useHelper(pointRef, THREE.PointLightHelper, 0.5, 'cyan');
  useHelper(spotRef, THREE.SpotLightHelper, 'magenta');

  const {
    ambientIntensity,
    ambientColor,
    directionalIntensity,
    directionalColor,
    directionalX,
    directionalY,
    directionalZ,
    pointIntensity,
    pointColor,
    spotIntensity,
    spotColor,
    spotAngle
  } = useControls('ライト設定', {
    '環境光': { value: true, collapsed: true },
    ambientIntensity: { value: 0.2, min: 0, max: 1, step: 0.01, label: '環境光強度' },
    ambientColor: { value: '#ffffff', label: '環境光色' },
    '平行光源': { value: true, collapsed: true },
    directionalIntensity: { value: 1, min: 0, max: 2, step: 0.01, label: '平行光強度' },
    directionalColor: { value: '#ffffff', label: '平行光色' },
    directionalX: { value: 5, min: -10, max: 10, step: 0.1, label: '平行光X' },
    directionalY: { value: 5, min: -10, max: 10, step: 0.1, label: '平行光Y' },
    directionalZ: { value: 5, min: -10, max: 10, step: 0.1, label: '平行光Z' },
    'ポイントライト': { value: true, collapsed: true },
    pointIntensity: { value: 1, min: 0, max: 2, step: 0.01, label: 'ポイント光強度' },
    pointColor: { value: '#00ffff', label: 'ポイント光色' },
    'スポットライト': { value: true, collapsed: true },
    spotIntensity: { value: 1, min: 0, max: 2, step: 0.01, label: 'スポット光強度' },
    spotColor: { value: '#ff00ff', label: 'スポット光色' },
    spotAngle: { value: Math.PI / 6, min: 0, max: Math.PI / 2, step: 0.01, label: 'スポット光角度' },
  });

  useFrame((state) => {
    if (pointRef.current) {
      const time = state.clock.elapsedTime;
      pointRef.current.position.x = Math.sin(time) * 3;
      pointRef.current.position.z = Math.cos(time) * 3;
    }
  });

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      
      <directionalLight
        ref={directionalRef}
        position={[directionalX, directionalY, directionalZ]}
        intensity={directionalIntensity}
        color={directionalColor}
        castShadow
      />
      
      <pointLight
        ref={pointRef}
        position={[0, 2, 0]}
        intensity={pointIntensity}
        color={pointColor}
      />
      
      <spotLight
        ref={spotRef}
        position={[0, 5, 0]}
        angle={spotAngle}
        intensity={spotIntensity}
        color={spotColor}
        penumbra={0.5}
        castShadow
      />

      {/* オブジェクト群 */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      
      <mesh position={[3, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      
      <mesh position={[-3, 0, 0]} castShadow receiveShadow>
        <coneGeometry args={[1, 2, 32]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      
      <mesh rotation-x={-Math.PI / 2} position-y={-1.5} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </>
  );
};

LightingDemo.title = 'ライティングデモ';
LightingDemo.description = '様々なライトタイプと設定の実験';
