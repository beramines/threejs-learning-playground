import React from 'react';
import { Menu, Github, Info } from 'lucide-react';
import { categories } from '../../types';

interface HeaderProps {
  currentCategory: string;
  currentSample: string | null;
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentCategory,
  currentSample,
  onSidebarToggle,
}) => {
  const category = categories.find((cat) => cat.id === currentCategory);

  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center">
        <button
          onClick={onSidebarToggle}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors mr-4"
        >
          <Menu size={20} />
        </button>
        
        <div>
          <h2 className="text-lg font-semibold">
            {category?.title || 'Three.js Learning Playground'}
          </h2>
          {currentSample && (
            <p className="text-sm text-gray-400">
              現在のサンプル: {currentSample}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          title="使い方"
        >
          <Info size={20} />
        </button>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          title="GitHub"
        >
          <Github size={20} />
        </a>
      </div>
    </header>
  );
};

export default Header;
