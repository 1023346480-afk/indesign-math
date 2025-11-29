import React, { useState, useCallback } from 'react';
import { Download, Copy, Settings, Type, Palette, RefreshCw, AlertCircle } from 'lucide-react';
import MathPreview from './components/MathPreview';
import SymbolPalette from './components/SymbolPalette';
import AIAssistant from './components/AIAssistant';
import { DEFAULT_LATEX, PRESETS } from './constants';
import { MathConfig } from './types';

const App: React.FC = () => {
  const [latex, setLatex] = useState<string>(DEFAULT_LATEX);
  const [config, setConfig] = useState<MathConfig>({
    fontSize: 24,
    color: '#000000',
    fontFamily: 'math'
  });
  const [error, setError] = useState<string | null>(null);
  const [currentSvg, setCurrentSvg] = useState<string | null>(null);

  const handleSymbolInsert = useCallback((symbol: string) => {
    // Simple append for now. In a real app, we'd insert at cursor position.
    setLatex(prev => prev + ' ' + symbol + ' ');
  }, []);

  const handleDownload = () => {
    if (!currentSvg) return;
    const blob = new Blob([currentSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formula.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySvgCode = () => {
    if (!currentSvg) return;
    navigator.clipboard.writeText(currentSvg).then(() => {
      alert("SVG Code copied to clipboard!");
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar - Controls */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-10">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1 rounded">TeX</span> InDesign Pro
          </h1>
          <p className="text-xs text-gray-500 mt-1">Generate vector math for print</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* AI Section */}
          <AIAssistant onGenerated={(newLatex) => setLatex(newLatex)} />

          {/* Editor Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">LaTeX Code</label>
            <textarea
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              className="w-full h-40 p-3 font-mono text-sm bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
              placeholder="\int..."
            />
            {error && (
               <div className="flex items-start gap-2 text-red-600 bg-red-50 p-2 rounded text-xs">
                 <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                 <span>{error}</span>
               </div>
            )}
          </div>

          {/* Symbol Palette */}
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-2 block">Symbols</label>
            <SymbolPalette onInsert={handleSymbolInsert} />
          </div>

          {/* Presets */}
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-2 block">Quick Presets</label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map(p => (
                <button
                  key={p.name}
                  onClick={() => setLatex(p.code)}
                  className="text-left px-3 py-2 text-xs border rounded hover:bg-gray-50 text-gray-600 truncate"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Preview & Style */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Toolbar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
             {/* Font Size */}
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="12"
                max="120"
                value={config.fontSize}
                onChange={(e) => setConfig({ ...config, fontSize: Number(e.target.value) })}
                className="w-24 accent-indigo-600"
              />
              <span className="text-sm w-8">{config.fontSize}px</span>
            </div>

            {/* Color Picker */}
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-gray-400" />
              <div className="relative overflow-hidden w-8 h-8 rounded-full border border-gray-300 shadow-sm cursor-pointer">
                <input
                  type="color"
                  value={config.color}
                  onChange={(e) => setConfig({ ...config, color: e.target.value })}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
                />
              </div>
            </div>

            {/* Font Family */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Style:</span>
                <select 
                    value={config.fontFamily}
                    onChange={(e) => setConfig({...config, fontFamily: e.target.value})}
                    className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 border p-1"
                >
                    <option value="math">Standard (Italic)</option>
                    <option value="serif">Time New Roman</option>
                    <option value="sans">Sans Serif</option>
                    <option value="tt">Monospace</option>
                </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button
              onClick={handleCopySvgCode}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Copy className="w-4 h-4" />
              Copy Code
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download SVG
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-gray-100 overflow-hidden flex flex-col relative">
          <div className="absolute inset-0 pattern-grid opacity-5 pointer-events-none"></div>
          
          <div className="flex-1 flex items-center justify-center p-12 overflow-auto">
            <div className="bg-white rounded-xl shadow-xl min-w-[50%] min-h-[50%] flex items-center justify-center border border-gray-200">
               <MathPreview 
                 latex={latex} 
                 config={config} 
                 onError={setError}
                 onSvgReady={setCurrentSvg}
               />
            </div>
          </div>
          
          <div className="bg-white border-t border-gray-200 p-2 px-4 text-xs text-gray-500 flex justify-between">
             <span>Render Engine: MathJax 3 SVG</span>
             <span>InDesign Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;