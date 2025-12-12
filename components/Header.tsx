import React from 'react';
import { TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center gap-3 py-6 border-b border-gray-800 mb-8">
      <div className="p-2 bg-fin-accent/10 rounded-lg">
        <TrendingUp className="w-8 h-8 text-fin-accent" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
          WallStreet<span className="text-fin-accent">Vibe</span>
        </h1>
        <p className="text-sm text-gray-400">
          AI-powered human sentiment generator for finance
        </p>
      </div>
    </header>
  );
};

export default Header;