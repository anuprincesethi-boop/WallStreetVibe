import React from 'react';
import { AppMode } from '../types';
import { MessageSquare, PenTool } from 'lucide-react';

interface ModeToggleProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex p-1 bg-fin-card rounded-xl mb-6 border border-gray-800 w-full md:w-fit">
      <button
        onClick={() => onModeChange(AppMode.COMMENT_GENERATOR)}
        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
          currentMode === AppMode.COMMENT_GENERATOR
            ? 'bg-fin-accent text-black shadow-lg shadow-fin-accent/20'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <MessageSquare className="w-4 h-4" />
        Comment Generator
      </button>
      <button
        onClick={() => onModeChange(AppMode.POST_CREATOR)}
        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
          currentMode === AppMode.POST_CREATOR
            ? 'bg-fin-accent text-black shadow-lg shadow-fin-accent/20'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <PenTool className="w-4 h-4" />
        Post Creator
      </button>
    </div>
  );
};

export default ModeToggle;