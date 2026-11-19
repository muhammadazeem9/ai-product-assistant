import { ai } from "../config/gemini.js";

export const generateProductDescription = async (product) => {
  const { name, category, features } = product;

  const prompt = `
You are an expert e-commerce copywriter.

Product name: ${name}
Category: ${category}
Features: ${features.join(", ")}

Requirements:
- Write an engaging product description.
- Use professional marketing language.
- Do not invent specifications.
- Keep the description between 80 and 120 words.
- Return only the description.
`;

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response");
    }

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error("AI service is temporarily unavailable. Please try again.");
  }
};
