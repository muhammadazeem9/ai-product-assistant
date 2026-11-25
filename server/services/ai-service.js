// import { ai } from "../config/gemini.js";

// export const generateProductDescription = async (product) => {
//   const { name, category, features } = product;

//   const prompt = `
// You are an expert e-commerce copywriter.

// Generate a professional product description using the following information.

// Product name: ${name}
// Category: ${category}
// Features: ${features.join(", ")}

// Requirements:
// - Write an engaging product description.
// - Use professional and natural marketing language.
// - Use only facts explicitly provided in the product information.
// - Do not invent product quality, materials, performance, certifications, or specifications.
// - Do not use unsupported adjectives such as premium or high-quality.
// - Do not make guarantees or claims that cannot be verified.
// - If information is missing, simply omit it.
// - Keep the description between 80 and 120 words.
// - Avoid repetitive phrases and unnecessary exaggeration.
// - Return only the description without headings or explanations.
// `;

//   try {
//     const response = await ai.models.generateContent({
//       model: process.env.GEMINI_MODEL,
//       contents: prompt,
//     });

//     const description = response.text?.trim();

//     if (!description) {
//       throw new Error("Gemini returned an empty response");
//     }

//     return description;
//   } catch (error) {
//     console.error("Gemini API Error:", error.message);

//     throw new Error("AI service is temporarily unavailable. Please try again.");
//   }
// };

import { ai } from "../config/gemini.js";
import { aiProductContentSchema } from "../validators/ai-content.validator.js";
import appError from "../utils/appError.js";

export const generateProductDescription = async (product) => {
  const { name, category, features = [], additionalInfo = "" } = product;

  const prompt = `
You are an expert e-commerce SEO strategist and product copywriter.

Your task is to generate a complete, search-friendly product content package.

PRODUCT INFORMATION:
Name: ${name}
Category: ${category}
Features: ${features.length ? features.join(", ") : "Not provided"}
Additional information: ${additionalInfo || "Not provided"}

CONTENT REQUIREMENTS:

1. Understand the product using only the supplied information.
2. Create a descriptive SEO title containing the product name naturally.
3. Write a useful meta description that accurately summarizes the product.
4. Generate a clean, readable, lowercase URL slug.
5. Identify one relevant primary keyword.
6. Suggest 3-5 closely related keywords.
7. Write a concise short description explaining the product.
8. Write a detailed, original product description between 100 and 3000 characters.
9. Include 2-5 useful product-specific FAQs.
10. Generate descriptive image alt text based only on known product information.

SEO RULES:
- Prioritize search relevance and natural language.
- Use keywords naturally. Never keyword-stuff.
- Write for customers first, search engines second.
- Avoid generic, repetitive marketing language.
- Make the content unique and specific to this product.
- Use the product name and relevant search terms naturally.
- Do not claim guaranteed rankings or search performance.
- Do not invent materials, dimensions, compatibility, certifications,
  performance, warranties, or other specifications.
- Do not invent benefits that cannot reasonably be supported by the input.
- When information is missing, omit unsupported details.
- Do not repeat the same information across every field.

OUTPUT RULES:
- Return valid JSON only.
- Do not include Markdown code fences.
- Do not include explanations outside the JSON.
- Use exactly these keys:

{
  "seoTitle": "string",
  "metaDescription": "string",
  "slug": "string",
  "primaryKeyword": "string",
  "relatedKeywords": ["string"],
  "shortDescription": "string",
  "description": "string",
  "faqs": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "imageAltText": "string"
}
`;

  let response;

  try {
    response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
  } catch (error) {
    console.error("Gemini API Error:", error.message);

    throw new appError(
      "AI service is temporarily unavailable. Please try again.",
      502,
    );
  }

  try {
    const rawContent = response.text;

    if (!rawContent) {
      throw new Error("Gemini returned an empty response");
    }

    const parsedContent = JSON.parse(rawContent);

    const validation = aiProductContentSchema.safeParse(parsedContent);

    if (!validation.success) {
      console.error("Invalid Gemini output:", validation.error.issues);

      throw new Error("Gemini generated invalid product content");
    }

    return validation.data;
  } catch (error) {
    console.error("AI content processing error:", error.message);

    throw new appError(
      "Unable to generate valid product content. Please try again.",
      502,
    );
  }
};
