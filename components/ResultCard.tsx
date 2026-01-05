import React, { useState } from 'react';
import { Copy, Check, User, Share2, Globe, Clock } from 'lucide-react';
import { GeneratedItem } from '../types';

interface ResultCardProps {
  item: GeneratedItem;
  index: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ item, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = item.title && item.title.trim() !== "" 
      ? `${item.title}\n\n${item.content}` 
      : item.content;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const userId = `fin_user_${1000 + index + Math.floor(Math.random() * 50)}`;

  return (
    <div className="group relative bg-fin-card border border-fin-border rounded-2xl p-6 hover:border-fin-accent/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-gray-400">
            <User className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-300 font-mono tracking-tight">{userId}</span>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Retail Trader</span>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Just now</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="p-2 text-gray-500 hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="space-y-3">
        {item.title && item.title.trim() !== "" && (
          <h3 className="text-fin-accent font-bold font-sans text-xl leading-tight">
            {item.title}
          </h3>
        )}

        <p className="text-gray-200 font-sans leading-relaxed text-[15px] md:text-base">
          {item.content}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between pt-5 border-t border-gray-800/80">
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest bg-gray-900/50 px-2 py-1 rounded">
             Human-Verified
           </span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-all ${
            copied 
              ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
              : 'bg-white/5 text-gray-400 hover:bg-white hover:text-black border border-white/10'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Text
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResultCard;