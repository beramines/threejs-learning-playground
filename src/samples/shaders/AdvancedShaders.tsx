import { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import * as THREE from 'three';

// カスタムシェーダーマテリアルを拡張
const FireShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uSpeed: 1,
    uIntensity: 1,
    uColorStart: new THREE.Color('#ff6600'),
    uColorEnd: new THREE.Color('#ffcc00'),
    uNoiseScale: 4
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform float uSpeed;
    uniform float uIntensity;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    uniform float uNoiseScale;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // ノイズ関数
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
      return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      // 炎のようなエフェクト
      vec2 uv = vUv;
      float time = uTime * uSpeed;
      
      // ノイズベースのディストーション
      float noise = snoise(vec3(uv * uNoiseScale, time * 0.5));
      float noise2 = snoise(vec3(uv * uNoiseScale * 2.0, time * 0.7));
      
      // 垂直グラデーション
      float gradient = 1.0 - vUv.y;
      gradient = pow(gradient, 2.0);
      
      // ノイズと組み合わせ
      float flame = gradient + noise * 0.3 + noise2 * 0.2;
      flame = clamp(flame * uIntensity, 0.0, 1.0);
      
      // カラーミックス
      vec3 color = mix(uColorEnd, uColorStart, flame);
      
      // アルファ
      float alpha = flame * gradient;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
);

// TypeScriptに型を追加
extend({ FireShaderMaterial });

// 炎エフェクトコンポーネント
function FireEffect() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  
  // コントロール設定
  const {
    speed,
    intensity,
    noiseScale,
    colorStart,
    colorEnd
  } = useControls('炎エフェクト設定', {
    speed: { value: 1, min: 0, max: 5, step: 0.1 },
    intensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
    noiseScale: { value: 4, min: 1, max: 10, step: 0.1 },
    colorStart: '#ff6600',
    colorEnd: '#ffcc00'
  });

  // アニメーション
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uSpeed = speed;
      materialRef.current.uIntensity = intensity;
      materialRef.current.uNoiseScale = noiseScale;
      materialRef.current.uColorStart = new THREE.Color(colorStart);
      materialRef.current.uColorEnd = new THREE.Color(colorEnd);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[4, 6, 32, 32]} />
      <fireShaderMaterial
        ref={materialRef}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// 球体グローエフェクト
function GlowSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const { glowIntensity, glowColor } = useControls('グローエフェクト', {
    glowIntensity: { value: 2, min: 0, max: 5, step: 0.1 },
    glowColor: '#00ffff'
  });

  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uGlowIntensity: { value: glowIntensity },
        uGlowColor: { value: new THREE.Color(glowColor) },
        viewVector: { value: new THREE.Vector3() }
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(0.7 - dot(vNormal, vNormel), 2.0);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uGlowColor;
        uniform float uGlowIntensity;
        varying float intensity;
        
        void main() {
          vec3 glow = uGlowColor * intensity * uGlowIntensity;
          gl_FragColor = vec4(glow, 1.0);
        }
      `,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uGlowIntensity.value = glowIntensity;
      material.uniforms.uGlowColor.value = new THREE.Color(glowColor);
      
      const camera = state.camera;
      material.uniforms.viewVector.value = new THREE.Vector3().subVectors(
        camera.position,
        meshRef.current.position
      );
      
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      {/* グロー用の大きい球 */}
      <mesh ref={meshRef} position={[5, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <primitive object={glowMaterial} attach="material" />
      </mesh>
      {/* 内側の球 */}
      <mesh position={[5, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// メインコンポーネント
export default function AdvancedShaders() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [8, 4, 8], fov: 50 }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        
        <FireEffect />
        <GlowSphere />
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={20}
        />
        
        <gridHelper args={[20, 20]} />
      </Canvas>
    </div>
  );
}

AdvancedShaders.title = '高度なシェーダーエフェクト';
AdvancedShaders.description = '炎エフェクトとグローエフェクトなど、複雑なシェーダーの実装例';
