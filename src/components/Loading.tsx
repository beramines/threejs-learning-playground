import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-400">読み込み中...</p>
      </div>
    </div>
  );
};

export default Loading;
