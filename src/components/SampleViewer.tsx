import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Loading from './Loading';

interface SampleViewerProps {
  categoryId: string;
  sampleId: string;
  samplesMap: any;
}

const SampleViewer: React.FC<SampleViewerProps> = ({
  categoryId,
  sampleId,
  samplesMap,
}) => {
  const samples = samplesMap[categoryId] || {};
  const SampleComponent = samples[sampleId];

  if (!SampleComponent) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <p className="text-gray-400">サンプルが見つかりません</p>
      </div>
    );
  }

  // コンポーネントがCanvasを含むかどうかをチェック
  const hasCanvas = SampleComponent.hasCanvas;

  return (
    <div className="w-full h-full bg-gray-900">
      {hasCanvas ? (
        <SampleComponent />
      ) : (
        <Canvas
          shadows
          camera={{ position: [5, 5, 5], fov: 50 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <SampleComponent />
            <OrbitControls enableDamping />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default SampleViewer;
