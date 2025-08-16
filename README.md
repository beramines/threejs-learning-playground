# Three.js Learning Playground 🎮

インタラクティブなThree.js学習サイト。12のカテゴリーに分かれた豊富なサンプルと、リアルタイムで操作できるGUIコントロールを備えています。

## 🚀 特徴

- **12のカテゴリー**: 基礎から高度な機能まで段階的に学習
- **インタラクティブなデモ**: Levaを使用したリアルタイムパラメータ調整
- **モダンなUI**: Tailwind CSSによるレスポンシブデザイン
- **TypeScript対応**: 型安全な開発環境
- **React Three Fiber**: 宣言的な3Dシーン構築

## 📚 カテゴリー一覧

### 1. 基本 (Basics)
- 基本的なキューブ
- 球体とマテリアル

### 2. ジオメトリ (Geometries)
- 様々な3D形状の展示

### 3. マテリアル (Materials)
- 各種マテリアルの比較と設定

### 4. ライト (Lights)
- 照明効果と影の実装

### 5. カメラ (Cameras)
- カメラコントロールと視点操作

### 6. アニメーション (Animations)
- 動きとインタラクションの実装

### 7. テクスチャ (Textures)
- UVマッピング
- 法線マップ、変位マップ
- 環境マップ

### 8. シェーダー (Shaders)
- カスタムGLSLシェーダー
- 炎エフェクト
- グローエフェクト

### 9. ポストプロセシング (Post-processing)
- Bloom効果
- 色収差
- 被写界深度
- グリッチエフェクト

### 10. 物理演算 (Physics)
- 重力シミュレーション
- 衝突検出
- ドミノ、振り子、チェーン
- 制約システム

### 11. パフォーマンス (Performance)
- インスタンシング
- LOD (Level of Detail)
- アダプティブ品質調整

### 12. 高度な機能 (Advanced)
- ポータルマテリアル
- レンダーテクスチャ
- カスタムジオメトリ
- マルチパスレンダリング

## 🛠️ 技術スタック

- **React** 19.1.1
- **TypeScript** 5.8.3
- **Three.js** 0.179.1
- **React Three Fiber** 9.3.0
- **React Three Drei** 10.6.1
- **React Three Cannon** (物理演算)
- **React Three Postprocessing** (ポストエフェクト)
- **Leva** (GUIコントロール)
- **Tailwind CSS** 3.4.17
- **Vite** 7.1.0

## 🚀 セットアップ

### 必要な環境
- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone [repository-url]
cd threejs-learning-playground

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run preview
```

## 📁 プロジェクト構造

```
threejs-learning-playground/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── CategoryView.tsx
│   │   ├── Loading.tsx
│   │   └── SampleViewer.tsx
│   ├── samples/
│   │   ├── basics/
│   │   ├── geometries/
│   │   ├── materials/
│   │   ├── lights/
│   │   ├── cameras/
│   │   ├── animations/
│   │   ├── textures/
│   │   ├── shaders/
│   │   ├── postprocessing/
│   │   ├── physics/
│   │   ├── performance/
│   │   └── advanced/
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎯 使い方

1. **カテゴリー選択**: 左側のサイドバーから学習したいカテゴリーを選択
2. **サンプル選択**: カテゴリー内のサンプルカードをクリック
3. **パラメータ調整**: 右側のLevaパネルでパラメータをリアルタイム調整
4. **3D操作**: マウスドラッグで視点を回転、スクロールでズーム

## 🔧 開発のヒント

### 新しいサンプルの追加

1. 対象カテゴリーのディレクトリに新しいコンポーネントを作成
2. コンポーネントに`title`と`description`プロパティを追加
3. カテゴリーの`index.ts`でエクスポート
4. Levaコントロールを使用してインタラクティブにする

例：
```tsx
export default function MySample() {
  const { param } = useControls('設定', {
    param: { value: 1, min: 0, max: 10 }
  });
  
  return (
    <Canvas>
      {/* 3Dシーン */}
    </Canvas>
  );
}

MySample.title = 'サンプルタイトル';
MySample.description = 'サンプルの説明';
```

## 📝 ライセンス

MIT

## 🤝 貢献

プルリクエストは歓迎します！大きな変更の場合は、まずissueを開いて変更内容について議論してください。

## 📧 お問い合わせ

質問や提案がある場合は、issueを作成してください。

---

**Happy Learning with Three.js! 🎨✨**
