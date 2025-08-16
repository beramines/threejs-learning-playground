import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Leva } from 'leva';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import CategoryView from './components/CategoryView';
import SampleViewer from './components/SampleViewer';
import Loading from './components/Loading';
import HomePage from './components/HomePage';
import { categories } from './types';

// サンプルコンポーネントのインポート
import * as BasicsSamples from './samples/basics';
import * as GeometriesSamples from './samples/geometries';
import * as MaterialsSamples from './samples/materials';
import * as LightsSamples from './samples/lights';
import * as CamerasSamples from './samples/cameras';
import * as AnimationsSamples from './samples/animations';
import * as TexturesSamples from './samples/textures';
import * as ShadersSamples from './samples/shaders';
import * as PostProcessingSamples from './samples/postprocessing';
import * as PhysicsSamples from './samples/physics';
import * as PerformanceSamples from './samples/performance';
import * as AdvancedSamples from './samples/advanced';

// レイアウトラッパーコンポーネント
const AppContent: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('basics');
  const [currentSample, setCurrentSample] = useState<string | null>(null);

  // サンプルコンポーネントのマッピング
  const samplesMap = {
    basics: BasicsSamples,
    geometries: GeometriesSamples,
    materials: MaterialsSamples,
    lights: LightsSamples,
    cameras: CamerasSamples,
    animations: AnimationsSamples,
    textures: TexturesSamples,
    shaders: ShadersSamples,
    postprocessing: PostProcessingSamples,
    physics: PhysicsSamples,
    performance: PerformanceSamples,
    advanced: AdvancedSamples,
  };

  const handleCategoryChange = (categoryId: string) => {
    setCurrentCategory(categoryId);
    setCurrentSample(null);
  };

  const handleSampleSelect = (sampleId: string) => {
    setCurrentSample(sampleId);
  };

  // ホームページの場合はレイアウトなしで表示
  if (location.pathname === '/home') {
    return <HomePage />;
  }

  // それ以外は通常のレイアウト
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* サイドバー */}
      <Sidebar
        isOpen={sidebarOpen}
        categories={categories}
        currentCategory={currentCategory}
        onCategorySelect={handleCategoryChange}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <Header
          currentCategory={currentCategory}
          currentSample={currentSample}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* コンテンツエリア */}
        <main className="flex-1 relative overflow-hidden">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route
                path="/category/:categoryId"
                element={
                  <CategoryView
                    categoryId={location.pathname.split('/')[2] || 'basics'}
                    onSampleSelect={handleSampleSelect}
                    samplesMap={samplesMap}
                  />
                }
              />
              <Route
                path="/category/:categoryId/:sampleId"
                element={
                  <SampleViewer
                    categoryId={location.pathname.split('/')[2] || 'basics'}
                    sampleId={location.pathname.split('/')[3] || ''}
                    samplesMap={samplesMap}
                  />
                }
              />
            </Routes>
          </Suspense>

          {/* Levaコントロールパネル */}
          <Leva
            collapsed={false}
            oneLineLabels={false}
            flat={true}
            theme={{
              sizes: {
                rootWidth: '280px',
                controlWidth: '120px',
              },
            }}
          />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
