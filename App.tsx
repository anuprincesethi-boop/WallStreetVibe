import React, { useState } from 'react';
import Header from './components/Header';
import ModeToggle from './components/ModeToggle';
import InputSection from './components/InputSection';
import ResultCard from './components/ResultCard';
import { AppMode } from './types';
import { generateContent } from './services/geminiService';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.COMMENT_GENERATOR);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setResults([]);
    setError(null);
  };

  const handleSubmit = async (input: string) => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const generatedContent = await generateContent(mode, input);
      setResults(generatedContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fin-dark text-gray-100 flex justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl">
        <Header />
        
        <main>
          <ModeToggle currentMode={mode} onModeChange={handleModeChange} />
          
          <div className="bg-fin-card/30 border border-gray-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm mb-8">
            <InputSection 
              mode={mode} 
              isLoading={loading} 
              onSubmit={handleSubmit} 
            />
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-bold font-mono text-white">
                  Generated {mode === AppMode.COMMENT_GENERATOR ? 'Comments' : 'Post'}
                </h2>
                <span className="text-xs text-fin-accent border border-fin-accent/30 bg-fin-accent/10 px-2 py-1 rounded">
                   {results.length} Result{results.length > 1 ? 's' : ''}
                </span>
              </div>
             
              <div className="grid gap-4">
                {results.map((content, index) => (
                  <ResultCard key={index} content={content} index={index} />
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className="mt-20 text-center text-gray-600 text-xs py-8">
          <p>Powered by Google Gemini 2.5 • Designed for Global Markets</p>
        </footer>
      </div>
    </div>
  );
};

export default App;