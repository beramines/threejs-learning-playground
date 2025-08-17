import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  RenderTexture, 
  Text, 
  Box,
  Sphere,
  MeshPortalMaterial
} from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';

// ポータルマテリアルの例
function Portal() {
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[4, 4]} />
      <MeshPortalMaterial blur={0} resolution={512}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <Box args={[2, 2, 2]}>
          <meshStandardMaterial color="orange" />
        </Box>
        <Sphere args={[1, 32, 32]} position={[2, 0, -2]}>
          <meshStandardMaterial color="cyan" />
        </Sphere>
      </MeshPortalMaterial>
    </mesh>
  );
}

// Render Textureの例
function RenderTextureExample() {
  const textRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.x = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[5, 0, 0]}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial>
        <RenderTexture attach="map" anisotropy={16}>
          <PerspectiveCamera makeDefault aspect={1} position={[0, 0, 5]} />
          <color attach="background" args={['#ff0088']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <Text ref={textRef} fontSize={2} color="#fff">
            RENDER
          </Text>
        </RenderTexture>
      </meshStandardMaterial>
    </mesh>
  );
}

// カスタムジオメトリの例
function CustomGeometry() {
  const { vertices } = useControls('カスタムジオメトリ', {
    vertices: { value: 50, min: 10, max: 200, step: 1 }
  });

  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    for (let i = 0; i < vertices; i++) {
      const x = (Math.random() - 0.5) * 4;
      const y = (Math.random() - 0.5) * 4;
      const z = (Math.random() - 0.5) * 4;
      
      positions.push(x, y, z);
      
      colors.push(Math.random());
      colors.push(Math.random());
      colors.push(Math.random());
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();
    
    return geometry;
  }, [vertices]);

  return (
    <points position={[-5, 0, 0]}>
      <primitive object={geometry} attach="geometry" />
      <pointsMaterial size={0.1} vertexColors sizeAttenuation={false} />
    </points>
  );
}

// マルチパスレンダリングの例
function MultipassScene() {
  const { renderToTexture } = useControls('マルチパス', {
    renderToTexture: true
  });

  return (
    <>
      {renderToTexture && (
        <mesh position={[0, 3, -5]}>
          <planeGeometry args={[8, 6]} />
          <meshBasicMaterial>
            <RenderTexture attach="map">
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <color attach="background" args={['#000']} />
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Box>
                <meshStandardMaterial color="hotpink" />
              </Box>
            </RenderTexture>
          </meshBasicMaterial>
        </mesh>
      )}
    </>
  );
}

// メインコンポーネント
export default function AdvancedFeatures() {
  const { feature } = useControls('高度な機能', {
    feature: { 
      value: 'all', 
      options: ['portal', 'renderTexture', 'customGeometry', 'multipass', 'all'] 
    }
  });

  return (
    <>
      <color attach="background" args={['#222']} />
      <fog attach="fog" args={['#222', 5, 30]} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff0088" />
        
        {(feature === 'portal' || feature === 'all') && <Portal />}
        {(feature === 'renderTexture' || feature === 'all') && <RenderTextureExample />}
        {(feature === 'customGeometry' || feature === 'all') && <CustomGeometry />}
        {(feature === 'multipass' || feature === 'all') && <MultipassScene />}
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={30}
        />
        
        <gridHelper args={[20, 20]} />
    </>
  );
}

AdvancedFeatures.title = '高度な機能';
AdvancedFeatures.description = 'ポータル、レンダーテクスチャ、カスタムジオメトリなどの高度な機能';
