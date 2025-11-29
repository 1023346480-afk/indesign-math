import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateLatexFromDescription = async (prompt: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are a specialized LaTeX math assistant. 
        Your sole purpose is to convert natural language math descriptions into standard LaTeX math code.
        Rules:
        1. Return ONLY the raw LaTeX string. Do not wrap it in markdown code blocks, do not add explanations.
        2. Do not use '$' delimiters.
        3. If the request is complex, try to format it cleanly.
        4. Examples:
           User: "integral of x squared from 0 to infinity"
           Output: \int_{0}^{\infty} x^2 \, dx
        `,
        temperature: 0.1, // Low temperature for deterministic code output
      },
    });

    let text = response.text || "";
    // Cleanup just in case the model adds backticks despite instructions
    text = text.replace(/^```latex/, '').replace(/^```/, '').replace(/```$/, '').trim();
    return text;
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};

export const fixLatexError = async (brokenLatex: string, errorContext: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return brokenLatex;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Fix this LaTeX code: ${brokenLatex}. Context/Error: ${errorContext}`,
      config: {
        systemInstruction: "Return ONLY the fixed, valid LaTeX code without markdown formatting.",
      }
    });
    return response.text?.trim() || brokenLatex;
  } catch (e) {
    return brokenLatex;
  }
};