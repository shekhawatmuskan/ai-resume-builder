import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;

if (!apiKey) {
  throw new Error("Google AI API key is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // ✅ FIXED MODEL
});

export const generateAIContent = async (prompt) => {
  const result = await model.generateContent(prompt);
  return result.response.text();
};
