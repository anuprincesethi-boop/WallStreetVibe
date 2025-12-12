import React, { useState } from 'react';
import { Copy, Check, User, Share2 } from 'lucide-react';

interface ResultCardProps {
  content: string;
  index: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ content, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-fin-card border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all duration-300">
      {/* Fake User Info for Immersion */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index % 2 === 0 ? 'bg-blue-900/30 text-blue-400' : 'bg-green-900/30 text-green-400'}`}>
          <User className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-400">User_{Math.floor(Math.random() * 9000) + 1000}</span>
          <span className="text-[10px] text-gray-600">Just now • Global</span>
        </div>
      </div>

      <p className="text-gray-200 font-sans leading-relaxed text-sm md:text-base">
        {content}
      </p>

      <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-800/50">
         <div className="flex gap-4">
             <button className="text-gray-600 hover:text-gray-400 text-xs flex items-center gap-1">
                <Share2 className="w-3 h-3"/> Share
             </button>
         </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
            copied 
              ? 'bg-green-500/10 text-green-400' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy Text
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResultCard;