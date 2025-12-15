import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

// Initialize the client strictly with the environment variable
if (process.env.API_KEY) {
  client = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const streamChatResponse = async (
  message: string, 
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
) => {
  if (!client) {
    throw new Error("API Key not configured");
  }

  // Use gemini-2.5-flash for fast, responsive chat
  const chat = client.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: "You are a helpful business startup assistant. Keep answers concise, professional, and encouraging. Focus on business planning, marketing, and productivity.",
    },
    history: history,
  });

  return await chat.sendMessageStream({ message });
};
