// Three.jsの各カテゴリーとサンプルの型定義
export interface Sample {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  samples: Sample[];
}

// Three.jsの機能カテゴリー
export const categories: Omit<Category, 'samples'>[] = [
  {
    id: 'basics',
    title: '基本',
    description: 'Three.jsの基本的な概念と使い方',
    icon: 'Box'
  },
  {
    id: 'geometries',
    title: 'ジオメトリ',
    description: '様々な形状とジオメトリ',
    icon: 'Shapes'
  },
  {
    id: 'materials',
    title: 'マテリアル',
    description: 'マテリアルとテクスチャ',
    icon: 'Palette'
  },
  {
    id: 'lights',
    title: 'ライト',
    description: '照明と影',
    icon: 'Lightbulb'
  },
  {
    id: 'cameras',
    title: 'カメラ',
    description: 'カメラとビューポート',
    icon: 'Camera'
  },
  {
    id: 'animations',
    title: 'アニメーション',
    description: '動きとインタラクション',
    icon: 'Play'
  },
  {
    id: 'textures',
    title: 'テクスチャ',
    description: 'テクスチャマッピングとUV',
    icon: 'Image'
  },
  {
    id: 'shaders',
    title: 'シェーダー',
    description: 'カスタムシェーダーとGLSL',
    icon: 'Code'
  },
  {
    id: 'postprocessing',
    title: 'ポストプロセシング',
    description: 'エフェクトとフィルター',
    icon: 'Sparkles'
  },
  {
    id: 'physics',
    title: '物理演算',
    description: '物理シミュレーション',
    icon: 'Zap'
  },
  {
    id: 'performance',
    title: 'パフォーマンス',
    description: '最適化テクニック',
    icon: 'Gauge'
  },
  {
    id: 'advanced',
    title: '高度な機能',
    description: '高度なテクニックと応用',
    icon: 'Cpu'
  }
];
