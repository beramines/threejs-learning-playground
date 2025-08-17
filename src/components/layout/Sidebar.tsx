import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  categories: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  currentCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  categories,
  currentCategory,
  onCategorySelect,
  onToggle,
}) => {
  const navigate = useNavigate();
  
  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ size?: number }>;
    return Icon ? <Icon size={20} /> : null;
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
    navigate(`/category/${categoryId}`);
  };

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-16'
      } bg-gray-800 border-r border-gray-700 transition-all duration-300 relative`}
    >
      {/* トグルボタン */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 bg-blue-600 rounded-full p-1 hover:bg-blue-700 transition-colors z-10"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* ロゴ/タイトル */}
      <div className="p-4 border-b border-gray-700">
        <h1
          className={`font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent ${
            !isOpen && 'text-center'
          }`}
        >
          {isOpen ? 'Three.js Playground' : '3JS'}
        </h1>
      </div>

      {/* カテゴリーリスト */}
      <nav className="p-2 overflow-y-auto h-[calc(100vh-80px)]">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`w-full flex items-center p-3 mb-1 rounded-lg transition-all ${
              currentCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
            title={!isOpen ? category.title : undefined}
          >
            <div className="flex-shrink-0">{getIcon(category.icon)}</div>
            {isOpen && (
              <div className="ml-3 text-left">
                <div className="font-medium">{category.title}</div>
                <div className="text-xs opacity-75 mt-1">{category.description}</div>
              </div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;