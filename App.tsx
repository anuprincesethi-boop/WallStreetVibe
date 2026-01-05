import React, { useState } from 'react';
import Header from './components/Header';
import ModeToggle from './components/ModeToggle';
import InputSection from './components/InputSection';
import ResultCard from './components/ResultCard';
import { AppMode, GeneratedItem } from './types';
import { generateContent } from './services/geminiService';
import { AlertCircle, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.COMMENT_GENERATOR);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Generating...");
  const [results, setResults] = useState<GeneratedItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setResults([]);
    setError(null);
  };

  const handleSubmit = async (input: string) => {
    setLoading(true);
    setLoadingText("Initializing AI...");
    setError(null);
    setResults([]);

    try {
      const generatedContent = await generateContent(mode, input, (status) => {
        setLoadingText(status);
      });
      setResults(generatedContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
      setLoadingText("Generating...");
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-6 px-4 md:py-12 md:px-8">
      <div className="w-full max-w-4xl space-y-2">
        <Header />
        
        <main className="space-y-8">
          <div className="glass border border-fin-border rounded-[2rem] p-6 md:p-10 shadow-2xl">
            <ModeToggle currentMode={mode} onModeChange={handleModeChange} />
            <InputSection 
              mode={mode} 
              isLoading={loading} 
              loadingText={loadingText}
              onSubmit={handleSubmit} 
            />
          </div>

          {error && (
            <div className="p-5 bg-red-950/20 border border-red-900/30 rounded-2xl flex items-start gap-4 text-red-300 animate-in fade-in duration-300">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
              <div>
                <h4 className="font-bold text-sm uppercase tracking-tight mb-1">System Error</h4>
                <p className="text-sm opacity-80 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-3">
                   <div className="p-1.5 bg-fin-accent/10 rounded-lg">
                    <Terminal className="w-4 h-4 text-fin-accent" />
                   </div>
                   <h2 className="text-lg font-bold font-sans text-white tracking-tight">
                    Output Pipeline <span className="text-gray-600 font-normal ml-2 text-sm italic">/ results.json</span>
                  </h2>
                 </div>
                <div className="text-[10px] font-bold text-fin-accent border border-fin-accent/20 bg-fin-accent/5 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(0,229,255,0.05)]">
                   {results.length} Generation{results.length > 1 ? 's' : ''}
                </div>
              </div>
             
              <div className="grid gap-6">
                {results.map((item, index) => (
                  <ResultCard key={index} item={item} index={index} />
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className="pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-6 px-6 py-3 bg-fin-card/30 border border-fin-border rounded-2xl">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Engine: Gemini 2.5 Flash</p>
            <div className="w-px h-4 bg-gray-800"></div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Status: Production Ready</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;