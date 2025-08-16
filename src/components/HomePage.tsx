import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Code2, Palette, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'インタラクティブ',
      description: 'リアルタイムでパラメータを調整可能'
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: 'TypeScript対応',
      description: '型安全な開発環境'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'モダンなUI',
      description: 'Tailwind CSSによる美しいデザイン'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: '高速',
      description: 'Viteによる爆速な開発体験'
    }
  ];

  const highlights = [
    { count: '12', label: 'カテゴリー' },
    { count: '24+', label: 'サンプル' },
    { count: '100+', label: 'パラメータ' },
    { count: '∞', label: '可能性' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-y-auto">
      {/* ヒーローセクション */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Three.js Learning Playground
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            インタラクティブなデモとリアルタイムコントロールで
            <br />
            Three.jsを楽しく学ぼう
          </p>
          <button
            onClick={() => navigate('/category/basics')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg inline-flex items-center gap-2 transition-all transform hover:scale-105"
          >
            学習を始める
            <ArrowRight size={20} />
          </button>
        </div>

        {/* 統計 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {highlights.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{item.count}</div>
              <div className="text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 特徴セクション */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          なぜ Three.js Playground？
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 hover:bg-white/20 transition-all"
            >
              <div className="text-blue-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* カテゴリープレビュー */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          学習カテゴリー
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: '基本', path: 'basics' },
            { name: 'ジオメトリ', path: 'geometries' },
            { name: 'マテリアル', path: 'materials' },
            { name: 'ライト', path: 'lights' },
            { name: 'カメラ', path: 'cameras' },
            { name: 'アニメーション', path: 'animations' },
            { name: 'テクスチャ', path: 'textures' },
            { name: 'シェーダー', path: 'shaders' },
            { name: 'ポストプロセシング', path: 'postprocessing' },
            { name: '物理演算', path: 'physics' },
            { name: 'パフォーマンス', path: 'performance' },
            { name: '高度な機能', path: 'advanced' }
          ].map((category, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center hover:bg-white/20 transition-all cursor-pointer"
              onClick={() => navigate(`/category/${category.path}`)}
            >
              <div className="text-white font-semibold">{category.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            準備はできましたか？
          </h2>
          <p className="text-xl text-white/90 mb-8">
            今すぐ Three.js の世界を探検しよう
          </p>
          <button
            onClick={() => navigate('/category/basics')}
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg inline-flex items-center gap-2 transition-all transform hover:scale-105"
          >
            探検を始める
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
