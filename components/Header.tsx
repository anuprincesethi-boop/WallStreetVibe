import React from 'react';
import { TrendingUp, ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 mb-8">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-fin-accent/10 rounded-xl border border-fin-accent/20">
          <TrendingUp className="w-8 h-8 text-fin-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
            WallStreet<span className="text-fin-accent">Vibe</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            AI-powered Human Sentiment Analysis
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/10 text-[10px] font-bold text-green-500 uppercase tracking-widest">
        <ShieldCheck className="w-3 h-3" />
        Anti-Bot Verified
      </div>
    </header>
  );
};

export default Header;