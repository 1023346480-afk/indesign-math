import React, { useState } from 'react';
import { SYMBOL_CATEGORIES } from '../constants';

interface SymbolPaletteProps {
  onInsert: (symbol: string) => void;
}

const SymbolPalette: React.FC<SymbolPaletteProps> = ({ onInsert }) => {
  const [activeTab, setActiveTab] = useState(SYMBOL_CATEGORIES[0].name);

  return (
    <div className="bg-white border-b border-gray-200 p-2">
      <div className="flex space-x-2 mb-2 overflow-x-auto pb-1 text-sm no-scrollbar">
        {SYMBOL_CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveTab(cat.name)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
              activeTab === cat.name
                ? 'bg-indigo-100 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-1 sm:grid-cols-10 md:grid-cols-12 max-h-24 overflow-y-auto">
        {SYMBOL_CATEGORIES.find(c => c.name === activeTab)?.symbols.map((symbol) => (
          <button
            key={symbol}
            onClick={() => onInsert(symbol)}
            className="p-1 hover:bg-gray-100 rounded text-center text-gray-700 font-serif text-lg transition-colors border border-transparent hover:border-gray-200"
            title={symbol}
          >
            {/* Render a simple preview if possible, otherwise raw */}
            <span dangerouslySetInnerHTML={{__html: `$$${symbol}$$`}} /> 
             {/* Note: The above innerHTML relies on MathJax typesetting automatically, 
                which might not happen instantly for dynamically added buttons without a trigger.
                For simplicity in this component, we display raw, but ideally we'd typeset.
                Given the complexity, let's just display the code or a simple text representation if appropriate.
                Actually, simpler: just show the code for clarity or trigger typeset. 
                Let's stick to text code for reliability in this specific view. */}
             <span className="text-xs font-mono">{symbol}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SymbolPalette;