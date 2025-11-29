import React, { useState } from 'react';
import { generateLatexFromDescription } from '../services/geminiService';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface AIAssistantProps {
  onGenerated: (latex: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const latex = await generateLatexFromDescription(prompt);
      onGenerated(latex);
      setPrompt(''); // Clear input on success
    } catch (err) {
      setError("Failed to generate formula. Check API Key or connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg mb-4 border border-indigo-100">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-indigo-600" />
        <h3 className="text-sm font-semibold text-indigo-900">AI Formula Generator</h3>
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="e.g., 'Quadratic formula' or 'Surface area of a sphere'"
          className="flex-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AIAssistant;