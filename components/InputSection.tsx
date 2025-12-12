import React, { useState } from 'react';
import { AppMode } from '../types';
import { Send, Loader2 } from 'lucide-react';

interface InputSectionProps {
  mode: AppMode;
  isLoading: boolean;
  onSubmit: (input: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ mode, isLoading, onSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const placeholder = mode === AppMode.COMMENT_GENERATOR
    ? "Paste a financial news headline or tweet..."
    : "Enter a financial topic to start a discussion...";

  const label = mode === AppMode.COMMENT_GENERATOR
    ? "Source Content"
    : "Discussion Topic";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-2 flex justify-between items-end">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 font-mono">
          {label}
        </label>
        <span className="text-xs text-fin-accent/70 font-mono">
          {text.length} chars
        </span>
      </div>
      
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-fin-accent to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-300 blur"></div>
        <div className="relative w-full bg-fin-card text-gray-200 border border-gray-700 rounded-xl overflow-hidden focus-within:border-fin-accent/50 focus-within:ring-1 focus-within:ring-fin-accent/50 transition-all">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent p-4 min-h-[120px] focus:outline-none resize-y placeholder:text-gray-600 font-mono text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setText(mode === AppMode.COMMENT_GENERATOR ? 'Microsoft just announced a new AI partnership with OpenAI worth billions.' : 'Impact of AI on software engineering jobs')}
            className="text-xs text-gray-500 hover:text-fin-accent transition-colors underline decoration-dotted"
          >
            Try Example
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 ml-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Generate
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InputSection;