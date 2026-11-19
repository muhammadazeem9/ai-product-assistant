import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing from environment variables");
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,

  httpOptions: {
    retryOptions: {
      attempts: 3,
      initialDelay: 1,
      maxDelay: 8,
      expBase: 2,
      jitter: 1,
      httpStatusCodes: [503],
    },
  },
});
