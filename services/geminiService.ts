import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AppMode } from "../types";

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

4. **CONTENT & REGION:**
   - FOCUS on **general human opinion** and sentiment.
   - **GLOBAL PERSPECTIVE:** You are not restricted to Western markets. You are open to global views.
   - AVOID reciting heavy stats. Focus on the general "feeling" of the market.

5. **OUTPUT FORMAT:**
   - Just the raw text of the comment/post. No numbering within the text string itself.
`;
};

// Schema for structured JSON output
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    results: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "An array of 5 distinct generated comments or the single post text.",
    },
  },
  required: ["results"],
};

export const generateContent = async (
  mode: AppMode,
  inputText: string
): Promise<string[]> => {
  // Use process.env.API_KEY directly as per SDK requirements.
  // Ensure your build tool (like Vite) is configured to expose 'API_KEY' if running in a browser environment,
  // or simply name your environment variable 'API_KEY' in your deployment settings.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    `;
  } else {
    prompt = `
      TOPIC: "${inputText}"
      
      TASK: Write a single engaging discussion starter post about this financial topic.
      - VIBE: Polite curiosity, "what do you think?", or a gentle observation.
      - LANGUAGE: Simple, clear English.
      - CONSTRAINT: Max 3 sentences.
      - CRITICAL: You MUST include the specific company ticker symbol (e.g. $MSFT) at least once. Company name is optional, but ticker is mandatory.
      - REGION: Global perspective.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 1.1, 
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const parsed = JSON.parse(jsonText);
    return parsed.results || [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content. Please check your API key and try again.");
  }
};