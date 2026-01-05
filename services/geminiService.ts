import { GoogleGenAI } from "@google/genai";
import { AppMode, GeneratedItem } from "../types";

const getSystemInstruction = () => {
  return `
You are a polite, global retail investor. You participate in friendly financial discussions on platforms like LinkedIn, Reddit, or X (Twitter).

MANDATORY RULES FOR 100% HUMANIZED OUTPUT:

1. **HUMAN VIBE & TONE:** 
   - Be **polite, respectful, and genuinely curious**. 
   - Write like a real person typing on a phone or laptop.
   - USE lowercase occasionally or slightly informal grammar if it feels natural (but stay professional).
   - AVOID all robotic "AIisms": No "It's worth noting," "In conclusion," "As an AI," or "I recommend."
   - DO NOT use "The Writer's Dash" or bullet points.

2. **NAMING CONVENTIONS (CRITICAL):**
   - **COMMENTS:** You MUST use the **COMPANY NAME** (e.g., Apple, Tesla, Nvidia). You MUST NOT use stock ticker symbols (e.g., $AAPL, TSLA) in comments.
   - **POST TITLES:** You MUST use the **COMPANY NAME**. You MUST NOT use stock ticker symbols in the title.
   - **POST CONTENT (DETAILS):** You MUST include the relevant **stock ticker symbol** (e.g., $NVDA, $TSLA) at least once in the body of the post.

3. **LENGTH & STRUCTURE:**
   - **Comments:** 1-2 sentences MAX. Short, reactive, and conversational.
   - **Posts:** 2-3 sentences MAX. Engaging and discussion-oriented.
   - **Titles:** 1 short line MAX. No tickers.

4. **GLOBAL PERSPECTIVE:**
   - You represent a global audience. Your English is clear and simple.
   - Don't just focus on the US; be open to global market sentiments.

5. **OUTPUT FORMAT:**
   - Return a raw JSON object.
   - Structure: { "results": [ { "title": "...", "content": "..." }, ... ] }
`;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateContent = async (
  mode: AppMode,
  inputText: string,
  onStatusUpdate?: (status: string) => void
): Promise<GeneratedItem[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let prompt = "";
  if (mode === AppMode.COMMENT_GENERATOR) {
    prompt = `
      INPUT POST: "${inputText}"
      
      TASK: Generate 5 distinct, 100% human-like comments reacting to the post above.
      - RULES: Polite, conversational, simple English.
      - CONSTRAINT: Max 1-2 lines per comment. 
      - NAMING: Use only Company Names. NO TICKERS (no $ symbols).
      - TITLE: Leave as empty string "".
      - FORMAT: Return JSON object with a "results" array.
    `;
  } else {
    prompt = `
      TOPIC: "${inputText}"
      
      TASK: Write a single engaging discussion starter post about this topic.
      - RULES: Polite curiosity, clear English, 100% human vibe.
      - CONSTRAINT: Max 3 sentences for the content.
      - TITLE: Short and catchy. Use Company Name. NO TICKERS in the title.
      - CONTENT DETAILS: You MUST use the relevant ticker symbol (e.g. $MSFT) in the body of the post.
      - FORMAT: Return JSON object with a "results" array.
    `;
  }

  let attempts = 0;
  const maxRetries = 3;
  let lastError: any = null;

  while (attempts <= maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: getSystemInstruction(),
          responseMimeType: "application/json",
          temperature: 0.85,
        },
      });

      let jsonText = response.text;
      if (!jsonText) return [];

      jsonText = jsonText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(jsonText);
      return parsed.results || [];
    } catch (error: any) {
      lastError = error;
      const errString = error.message || String(error);

      if (errString.includes("429") || errString.includes("RESOURCE_EXHAUSTED")) {
        attempts++;
        if (attempts <= maxRetries) {
          if (onStatusUpdate) {
             onStatusUpdate(`Server busy. Retrying (Attempt ${attempts})...`);
          }
          await wait(Math.pow(2, attempts) * 1000);
          continue;
        }
      }
      break;
    }
  }

  const finalErr = lastError?.message || String(lastError);
  if (finalErr.includes("429")) {
    throw new Error("⚠️ The AI is currently at its limit. Please wait a moment and try again.");
  }
  throw new Error("Failed to generate humanized content. Please try again.");
};