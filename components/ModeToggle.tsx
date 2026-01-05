import React from 'react';
import { AppMode } from '../types';
import { MessageSquare, PenTool } from 'lucide-react';

interface ModeToggleProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex p-1.5 bg-fin-card/80 border border-fin-border rounded-2xl mb-8 w-full md:w-max">
      <button
        onClick={() => onModeChange(AppMode.COMMENT_GENERATOR)}
        className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
          currentMode === AppMode.COMMENT_GENERATOR
            ? 'bg-white text-black shadow-xl'
            : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
        }`}
      >
        <MessageSquare className="w-4 h-4" />
        Comments
      </button>
      <button
        onClick={() => onModeChange(AppMode.POST_CREATOR)}
        className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
          currentMode === AppMode.POST_CREATOR
            ? 'bg-white text-black shadow-xl'
            : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
        }`}
      >
        <PenTool className="w-4 h-4" />
        Discussion
      </button>
    </div>
  );
};

export default ModeToggle;