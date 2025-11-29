import React, { useEffect, useRef, useState } from 'react';
import { MathJaxWindow, MathConfig } from '../types';

interface MathPreviewProps {
  latex: string;
  config: MathConfig;
  onError: (msg: string | null) => void;
  onSvgReady: (svg: string | null) => void;
}

const MathPreview: React.FC<MathPreviewProps> = ({ latex, config, onError, onSvgReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    const renderMath = async () => {
      const w = window as unknown as MathJaxWindow;
      if (!w.MathJax) return;

      if (!containerRef.current) return;

      try {
        // Clear previous content
        containerRef.current.innerHTML = '';
        onError(null);

        // Modify LaTeX based on font family config if needed
        // Note: MathJax handles fonts internally, but we can wrap content for basic styles
        let processedLatex = latex;
        if (config.fontFamily === 'sans') {
          processedLatex = `\\mathsf{${latex}}`;
        } else if (config.fontFamily === 'tt') {
          processedLatex = `\\mathtt{${latex}}`;
        }
        // Serif is default math italic usually

        // Generate SVG
        const svgElement = await w.MathJax.tex2svgPromise(processedLatex, {
          display: true,
        });

        // Apply styles to the SVG element directly
        const svgNode = svgElement.querySelector('svg');
        if (svgNode) {
          svgNode.style.color = config.color;
          svgNode.style.fontSize = `${config.fontSize}px`;
          
          // Ensure width/height attributes are set for InDesign compatibility
          // MathJax typically uses 'ex' units, we might want to ensure standard handling
          svgNode.setAttribute('width', svgNode.style.width || '100%');
          svgNode.setAttribute('height', svgNode.style.height || 'auto');
        }

        containerRef.current.appendChild(svgElement);
        await w.MathJax.typesetPromise([containerRef.current]);

        // Capture SVG string for export
        if (svgNode) {
            // We need to bake the color into the fill attributes for robust export
            // or ensure styling is inline.
            svgNode.style.fill = config.color;
            svgNode.setAttribute('fill', config.color);
            
            // Serialize
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgNode);
            setSvgContent(svgString);
            onSvgReady(svgString);
        }

      } catch (err: any) {
        console.error("MathJax error:", err);
        onError(err.message || "Invalid LaTeX syntax");
        onSvgReady(null);
      }
    };

    renderMath();
  }, [latex, config, onError, onSvgReady]);

  return (
    <div 
      ref={containerRef} 
      className="flex items-center justify-center p-8 min-h-[200px] overflow-auto"
      style={{ 
        color: config.color,
        // We use fontSize in the SVG itself, but this scales the container context
        fontSize: `${config.fontSize}px` 
      }}
    >
      {/* MathJax SVG will be injected here */}
    </div>
  );
};

export default MathPreview;