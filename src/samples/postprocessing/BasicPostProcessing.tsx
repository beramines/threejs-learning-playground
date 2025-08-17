import { Box, Sphere, Torus } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import { useControls } from 'leva';
import { BlendFunction } from 'postprocessing';

// 3Dオブジェクトコンポーネント
function Scene() {
  useControls('シーン設定', {
    rotationSpeed: { value: 0.01, min: 0, max: 0.1, step: 0.001 }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} color="#ff0088" intensity={2} />
      
      <Box position={[-3, 0, 0]} args={[2, 2, 2]}>
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.2} />
      </Box>
      
      <Sphere position={[0, 0, 0]} args={[1.5, 32, 32]}>
        <meshStandardMaterial color="#ff0088" metalness={0.8} roughness={0.2} />
      </Sphere>
      
      <Torus position={[3, 0, 0]} args={[1, 0.4, 16, 32]}>
        <meshStandardMaterial color="#0088ff" metalness={0.9} roughness={0.1} />
      </Torus>
      
      <mesh rotation-x={-Math.PI / 2} position-y={-2}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.4} />
      </mesh>
    </>
  );
}

// メインコンポーネント
export default function BasicPostProcessing() {
  // Bloomエフェクトの設定
  const {
    bloomIntensity,
    bloomThreshold,
    bloomSmoothing,
    bloomRadius
  } = useControls('Bloom設定', {
    bloomIntensity: { value: 1.5, min: 0, max: 5, step: 0.1 },
    bloomThreshold: { value: 0.5, min: 0, max: 1, step: 0.01 },
    bloomSmoothing: { value: 0.5, min: 0, max: 1, step: 0.01 },
    bloomRadius: { value: 0.5, min: 0, max: 1, step: 0.01 }
  });

  // ChromaticAberrationの設定
  const {
    chromaticOffset,
    chromaticRadialModulation
  } = useControls('色収差設定', {
    chromaticOffset: { value: [0.002, 0.002], min: 0, max: 0.01, step: 0.0001 },
    chromaticRadialModulation: { value: false }
  });

  // Vignetteの設定
  const {
    vignetteOffset,
    vignetteDarkness
  } = useControls('ビネット設定', {
    vignetteOffset: { value: 0.2, min: 0, max: 1, step: 0.01 },
    vignetteDarkness: { value: 0.5, min: 0, max: 1, step: 0.01 }
  });

  // Noiseの設定
  const {
    noiseOpacity,
    noiseEnabled
  } = useControls('ノイズ設定', {
    noiseEnabled: true,
    noiseOpacity: { value: 0.1, min: 0, max: 1, step: 0.01 }
  });

  return (
    <>
      <color attach="background" args={['#111']} />
      
      <Scene />
      
      <EffectComposer>
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={bloomThreshold}
          luminanceSmoothing={bloomSmoothing}
          radius={bloomRadius}
        />
        <ChromaticAberration
          offset={chromaticOffset}
          radialModulation={chromaticRadialModulation}
          modulationOffset={0}
        />
        <Vignette
          offset={vignetteOffset}
          darkness={vignetteDarkness}
        />
        {noiseEnabled && (
          <Noise
            opacity={noiseOpacity}
            blendFunction={BlendFunction.OVERLAY}
          />
        )}
      </EffectComposer>
    </>
  );
}

BasicPostProcessing.title = '基本的なポストプロセシング';
BasicPostProcessing.description = 'Bloom、色収差、ビネット、ノイズなどの基本的なエフェクト';
