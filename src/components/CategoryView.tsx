import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { type SamplesMap } from '../types';

interface CategoryViewProps {
  categoryId: string;
  onSampleSelect: (sampleId: string) => void;
  samplesMap: SamplesMap;
}

const CategoryView: React.FC<CategoryViewProps> = ({
  categoryId,
  onSampleSelect,
  samplesMap,
}) => {
  const navigate = useNavigate();
  const samples = samplesMap[categoryId] || {};
  
  // サンプル一覧を取得
  const sampleList = Object.entries(samples).map(([key, component]: [string, React.ComponentType & { title?: string; description?: string }]) => ({
    id: key,
    title: component.title || key,
    description: component.description || 'サンプルの説明',
  }));

  const handleSampleClick = (sampleId: string) => {
    onSampleSelect(sampleId);
    navigate(`/category/${categoryId}/${sampleId}`);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          カテゴリー: {categoryId}
        </h2>
        <p className="text-gray-400 mb-8">
          このカテゴリーのサンプルを選択してください
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleList.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleSampleClick(sample.id)}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all cursor-pointer group border border-gray-700 hover:border-blue-500"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {sample.title}
                </h3>
                <ArrowRight className="text-gray-500 group-hover:text-blue-400 transition-colors" size={20} />
              </div>
              <p className="text-gray-400 text-sm">
                {sample.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                  インタラクティブ
                </span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                  GUI付き
                </span>
              </div>
            </div>
          ))}
        </div>

        {sampleList.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              このカテゴリーのサンプルは準備中です
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryView;
