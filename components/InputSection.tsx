import React, { useState } from 'react';
import { AppMode } from '../types';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface InputSectionProps {
  mode: AppMode;
  isLoading: boolean;
  loadingText?: string;
  onSubmit: (input: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ mode, isLoading, loadingText, onSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const placeholder = mode === AppMode.COMMENT_GENERATOR
    ? "Paste a financial news headline, stock tweet, or Reddit post..."
    : "Describe a topic like '$NVDA earnings' or 'US Inflation data'...";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="flex justify-between items-end px-1">
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em]">
          <Sparkles className="w-3 h-3 text-fin-accent" />
          {mode === AppMode.COMMENT_GENERATOR ? 'Analysis Source' : 'Topic Brief'}
        </div>
        <div className="text-[10px] font-mono text-gray-600 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
          {text.length} / 2000
        </div>
      </div>
      
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/40 text-gray-100 border border-fin-border rounded-2xl p-5 min-h-[160px] focus:outline-none focus:border-fin-accent/50 focus:ring-1 focus:ring-fin-accent/20 transition-all placeholder:text-gray-700 font-sans text-base leading-relaxed resize-none shadow-inner"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setText(mode === AppMode.COMMENT_GENERATOR ? '$TSLA just hit a new 52-week high after better than expected delivery numbers.' : 'Is it time to rotation from Big Tech into Small Caps?')}
            className="text-[11px] font-semibold text-gray-500 hover:text-fin-accent transition-colors bg-gray-900/50 hover:bg-fin-accent/5 border border-gray-800 px-3 py-1.5 rounded-lg"
          >
            Load Sample Data
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="w-full md:w-auto flex items-center justify-center gap-2.5 bg-fin-accent text-black px-10 py-3.5 rounded-xl font-bold hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-mono text-sm tracking-tight">{loadingText || "Processing..."}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Generate Sentiment
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InputSection;