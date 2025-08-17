import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Text } from '@react-three/drei';
import { 
  EffectComposer, 
  DepthOfField, 
  Glitch, 
  Pixelation, 
  HueSaturation,
  BrightnessContrast,
  Sepia,
  DotScreen
} from '@react-three/postprocessing';
import { useControls } from 'leva';
import { GlitchMode } from 'postprocessing';
import * as THREE from 'three';

// アニメーションするシーン
function AnimatedScene() {
  const boxRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (boxRef.current) {
      boxRef.current.rotation.x += 0.01;
      boxRef.current.rotation.y += 0.01;
    }
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, -5]} color="#ff00ff" intensity={1} />
      <pointLight position={[5, 5, 5]} color="#00ffff" intensity={1} />
      
      {/* 背景のボックス群 */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Box
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 20 - 5
          ]}
          args={[1, 1, 1]}
        >
          <meshStandardMaterial 
            color={`hsl(${i * 18}, 70%, 50%)`}
            emissive={`hsl(${i * 18}, 70%, 50%)`}
            emissiveIntensity={0.2}
          />
        </Box>
      ))}
      
      {/* メインオブジェクト */}
      <Box ref={boxRef} position={[-2, 0, 0]} args={[2, 2, 2]}>
        <meshStandardMaterial color="#ff0088" metalness={0.8} roughness={0.2} />
      </Box>
      
      <Sphere ref={sphereRef} position={[2, 0, 0]} args={[1.5, 32, 32]}>
        <meshStandardMaterial color="#00ff88" metalness={0.9} roughness={0.1} />
      </Sphere>
      
      <Text
        position={[0, 3, 0]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        EFFECTS
      </Text>
      
      <mesh rotation-x={-Math.PI / 2} position-y={-3} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
      </mesh>
    </>
  );
}

// メインコンポーネント
export default function AdvancedPostProcessing() {
  // Depth of Field設定
  const {
    focusDistance,
    focalLength,
    bokehScale
  } = useControls('被写界深度', {
    focusDistance: { value: 5, min: 0, max: 20, step: 0.1 },
    focalLength: { value: 0.02, min: 0, max: 0.1, step: 0.001 },
    bokehScale: { value: 2, min: 0, max: 10, step: 0.1 }
  });

  // Glitch設定
  const {
    glitchEnabled,
    glitchDelay,
    glitchDuration,
    glitchStrength
  } = useControls('グリッチ', {
    glitchEnabled: false,
    glitchDelay: { value: [1.5, 3.5], min: 0, max: 10, step: 0.1 },
    glitchDuration: { value: [0.6, 1.0], min: 0, max: 2, step: 0.1 },
    glitchStrength: { value: [0.3, 1.0], min: 0, max: 1, step: 0.01 }
  });

  // Pixelation設定
  const {
    pixelationEnabled,
    pixelationGranularity
  } = useControls('ピクセル化', {
    pixelationEnabled: false,
    pixelationGranularity: { value: 4, min: 1, max: 20, step: 1 }
  });

  // Color Grading設定
  const {
    hue,
    saturation,
    brightness,
    contrast
  } = useControls('カラーグレーディング', {
    hue: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    saturation: { value: 0, min: -1, max: 1, step: 0.01 },
    brightness: { value: 0, min: -1, max: 1, step: 0.01 },
    contrast: { value: 0, min: -1, max: 1, step: 0.01 }
  });

  // Stylization設定
  const {
    sepiaEnabled,
    sepiaIntensity,
    dotScreenEnabled,
    dotScreenScale
  } = useControls('スタイライゼーション', {
    sepiaEnabled: false,
    sepiaIntensity: { value: 0.5, min: 0, max: 1, step: 0.01 },
    dotScreenEnabled: false,
    dotScreenScale: { value: 0.5, min: 0, max: 1, step: 0.01 }
  });

  return (
    <>
      <color attach="background" args={['#000']} />
      <fog attach="fog" args={['#000', 10, 50]} />
      
      <AnimatedScene />
      
      <EffectComposer>
        <DepthOfField
          focusDistance={focusDistance}
          focalLength={focalLength}
          bokehScale={bokehScale}
          height={480}
        />
        
        {glitchEnabled && (
          <Glitch
            delay={new THREE.Vector2(glitchDelay[0], glitchDelay[1])}
            duration={new THREE.Vector2(glitchDuration[0], glitchDuration[1])}
            strength={new THREE.Vector2(glitchStrength[0], glitchStrength[1])}
            mode={GlitchMode.SPORADIC}
            active
            ratio={0.85}
          />
        )}
        
        {pixelationEnabled && (
          <Pixelation
            granularity={pixelationGranularity}
          />
        )}
        
        <HueSaturation
          hue={hue}
          saturation={saturation}
        />
        
        <BrightnessContrast
          brightness={brightness}
          contrast={contrast}
        />
        
        {sepiaEnabled && (
          <Sepia
            intensity={sepiaIntensity}
          />
        )}
        
        {dotScreenEnabled && (
          <DotScreen
            scale={dotScreenScale}
          />
        )}
      </EffectComposer>
    </>
  );
}

AdvancedPostProcessing.title = '高度なポストプロセシング';
AdvancedPostProcessing.description = '被写界深度、グリッチ、ピクセル化、カラーグレーディングなどの高度なエフェクト';
