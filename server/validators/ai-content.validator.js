import z from "zod";

export const aiProductContentSchema = z.object({
  seoTitle: z.string().min(10).max(70),

  metaDescription: z.string().min(50).max(180),

  slug: z
    .string()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

  primaryKeyword: z.string().min(2).max(100),

  relatedKeywords: z.array(z.string().min(2).max(100)).min(2).max(8),

  shortDescription: z.string().min(20).max(500),

  description: z.string().min(100).max(3000),

  faqs: z
    .array(
      z.object({
        question: z.string().min(5).max(200),
        answer: z.string().min(10).max(500),
      }),
    )
    .min(2)
    .max(5),

  imageAltText: z.string().min(5).max(200),
});
