export interface MathConfig {
  fontSize: number;
  color: string;
  fontFamily: string; // 'math' | 'sans' | 'serif' | 'tt'
}

export interface SymbolCategory {
  name: string;
  symbols: string[];
}

export interface MathJaxWindow extends Window {
  MathJax: {
    typesetPromise: (nodes?: HTMLElement[]) => Promise<void>;
    typesetClear: (nodes?: HTMLElement[]) => void;
    tex2svgPromise: (latex: string, options?: any) => Promise<HTMLElement>;
  };
}