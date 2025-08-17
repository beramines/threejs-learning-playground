import React, { useState } from 'react';
import { Code, X, Copy, Check } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  language?: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <>
      {/* コード表示ボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all z-40"
        title="ソースコードを表示"
      >
        <Code size={24} />
      </button>

      {/* コード表示モーダル */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">ソースコード</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      コピー済み
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      コピー
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-800 rounded transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* コード表示エリア */}
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-sm">
                <code className="language-typescript text-gray-300">
                  {code}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CodeViewer;
