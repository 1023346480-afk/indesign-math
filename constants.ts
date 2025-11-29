import { SymbolCategory } from './types';

export const DEFAULT_LATEX = `\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}`;

export const PRESETS = [
  { name: "Quadratic Formula", code: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
  { name: "Gaussian Integral", code: "\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}" },
  { name: "Maxwell's Equations", code: "\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}" },
  { name: "Matrix", code: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" }
];

export const SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    name: "Basic",
    symbols: ["+", "-", "\\pm", "\\times", "\\div", "=", "\\neq", "\\approx", "\\infty"]
  },
  {
    name: "Greek",
    symbols: ["\\alpha", "\\beta", "\\gamma", "\\theta", "\\lambda", "\\pi", "\\sigma", "\\omega", "\\Delta", "\\Sigma"]
  },
  {
    name: "Relations",
    symbols: ["<", ">", "\\leq", "\\geq", "\\in", "\\subset", "\\subseteq", "\\cup", "\\cap"]
  },
  {
    name: "Logic",
    symbols: ["\\forall", "\\exists", "\\implies", "\\iff", "\\neg", "\\land", "\\lor"]
  },
  {
    name: "Calculus",
    symbols: ["\\int", "\\sum", "\\prod", "\\partial", "\\lim", "\\frac{dy}{dx}", "\\sqrt{}"]
  }
];