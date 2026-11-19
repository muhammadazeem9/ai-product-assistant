import { ai } from "../config/gemini.js";

export const generateProductDescription = async (product) => {
  const { name, category, features } = product;

  const prompt = `
You are an expert e-commerce copywriter.

Generate a professional product description using the following information.

Product name: ${name}
Category: ${category}
Features: ${features.join(", ")}

Requirements:
- Write an engaging product description.
- Use professional and natural marketing language.
- Use only facts explicitly provided in the product information.
- Do not invent product quality, materials, performance, certifications, or specifications.
- Do not use unsupported adjectives such as premium or high-quality.
- Do not make guarantees or claims that cannot be verified.
- If information is missing, simply omit it.
- Keep the description between 80 and 120 words.
- Avoid repetitive phrases and unnecessary exaggeration.
- Return only the description without headings or explanations.
`;

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: prompt,
    });

    const description = response.text?.trim();

    if (!description) {
      throw new Error("Gemini returned an empty response");
    }

    return description;
  } catch (error) {
    console.error("Gemini API Error:", error.message);

    throw new Error("AI service is temporarily unavailable. Please try again.");
  }
};
