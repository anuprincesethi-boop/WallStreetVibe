import { GoogleGenAI } from "@google/genai";
import { AppMode, GeneratedItem } from "../types";

const getSystemInstruction = () => {
  return `
You are a polite, global retail investor. You participate in friendly financial discussions online.

MANDATORY RULES - READ CAREFULLY:

1. **HUMAN VIBE (GLOBAL & POLITE):** 
   - Be **polite, respectful, and constructive**. 
   - DO NOT be aggressive, cynical, or overly sarcastic.
   - DO NOT use robotic phrases like "Here is a comment," "It is worth noting," "In conclusion," or "However."
   - DO NOT use "Writer's Dash" (e.g., "- This stock is good").
   - **LANGUAGE:** Use **SIMPLE, CLEAR ENGLISH**. Avoid complex vocabulary. Write in a way that is easily understood by a global audience (non-native speakers included).

2. **STRICT TICKER SYMBOL USAGE (MANDATORY):**
   - **CRITICAL:** When discussing a public company, you **MUST** include its STOCK TICKER SYMBOL formatted with a '$' (e.g., $MSFT, $GOOGL, $TSLA, $NVDA) **at least once**.
   - **PRIORITY:** The ticker ($MSFT) is required. The company name (Microsoft) is optional—use it only if needed for sentence flow, otherwise default to the ticker.

3. **LENGTH CONSTRAINTS:**
   - **Comments:** 1-2 lines MAXIMUM. Short, polite, and reactive.
   - **Posts:** 2-3 sentences MAXIMUM. Simple discussion starters.
   - **Titles:** 1 line MAXIMUM. Short and punchy.

4. **CONTENT & REGION:**
   - FOCUS on **general human opinion** and sentiment.
   - **GLOBAL PERSPECTIVE:** You are not restricted to Western markets. You are open to global views.
   - AVOID reciting heavy stats. Focus on the general "feeling" of the market.

5. **OUTPUT FORMAT:**
   - Return a raw JSON object.
   - Structure: { "results": [ { "title": "...", "content": "..." }, ... ] }
`;
};

export const generateContent = async (
  mode: AppMode,
  inputText: string
): Promise<GeneratedItem[]> => {
  // Explicitly check for API key to provide better error messages
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables or vite.config.ts.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let prompt = "";
  if (mode === AppMode.COMMENT_GENERATOR) {
    prompt = `
      INPUT POST: "${inputText}"
      
      TASK: Generate 5 distinct, 100% human-like comments reacting to the post above.
      - VIBE: Polite, constructive, and conversational.
      - LANGUAGE: Simple English.
      - CONSTRAINT: Max 1-2 lines per comment. 
      - CRITICAL: Use the $TICKER (e.g. $AAPL) instead of the company name whenever possible.
      - REGION: Global users.
      - TITLE: Leave the 'title' field as an empty string "" for all comments.
      - FORMAT: Return JSON object with a "results" array.
    `;
  } else {
    prompt = `
      TOPIC: "${inputText}"
      
      TASK: Write a single engaging discussion starter post about this financial topic.
      - VIBE: Polite curiosity, "what do you think?", or a gentle observation.
      - LANGUAGE: Simple, clear English.
      - CONSTRAINT: Max 3 sentences for the content.
      - CRITICAL: You MUST include the specific company ticker symbol (e.g. $MSFT) at least once.
      - TITLE: Generate a suitable, short, catchy title (max 1 line) for the post in the 'title' field.
      - REGION: Global perspective.
      - FORMAT: Return JSON object with a "results" array.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(),
        responseMimeType: "application/json",
        // We rely on the prompt for schema structure to be more robust against validation errors
        temperature: 0.8, 
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const parsed = JSON.parse(jsonText);
    return parsed.results || [];
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Return the actual error message to help debugging
    const errorMessage = error.message || "Unknown error occurred";
    throw new Error(`Failed to generate content: ${errorMessage}`);
  }
};