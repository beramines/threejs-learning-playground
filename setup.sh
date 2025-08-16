#!/bin/bash

# Three.js Learning Playground - Setup Script
# このスクリプトは依存関係のインストールと開発サーバーの起動を行います

echo "========================================="
echo "Three.js Learning Playground セットアップ"
echo "========================================="

# Node.jsバージョンチェック
echo ""
echo "Node.jsバージョンをチェック中..."
node_version=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js バージョン: $node_version"
else
    echo "❌ Node.jsがインストールされていません。"
    echo "   https://nodejs.org からインストールしてください。"
    exit 1
fi

# npmバージョンチェック
echo ""
echo "npmバージョンをチェック中..."
npm_version=$(npm -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ npm バージョン: $npm_version"
else
    echo "❌ npmがインストールされていません。"
    exit 1
fi

# 依存関係のインストール
echo ""
echo "========================================="
echo "依存関係をインストール中..."
echo "========================================="
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 依存関係のインストールが完了しました！"
else
    echo ""
    echo "❌ 依存関係のインストールに失敗しました。"
    echo "   エラーメッセージを確認してください。"
    exit 1
fi

# 開発サーバーの起動
echo ""
echo "========================================="
echo "開発サーバーを起動中..."
echo "========================================="
echo ""
echo "📦 プロジェクト: Three.js Learning Playground"
echo "🚀 URL: http://localhost:5173"
echo "📝 ホットリロード: 有効"
echo ""
echo "サーバーを停止するには Ctrl+C を押してください"
echo ""
echo "========================================="
echo ""

npm run dev
