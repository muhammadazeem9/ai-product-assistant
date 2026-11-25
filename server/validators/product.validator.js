import z from "zod";

export const generateDescriptionSchema = z.object({
  name: z.string().trim().min(2).max(120),

  category: z.string().trim().min(2).max(80),

  features: z.array(z.string().trim().min(1).max(100)).max(20).default([]),

  additionalInfo: z.string().trim().max(1000).default(""),
});

export const updateProductStatusSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  status: z.enum(["draft", "approved", "rejected"]).optional(),

  category: z.string().trim().min(1).max(80).optional(),

  search: z.string().trim().min(1).max(100).optional(),
});

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),

    category: z.string().trim().min(2).max(80).optional(),

    features: z.array(z.string().trim().min(1).max(150)).max(20).optional(),

    seoTitle: z.string().trim().min(10).max(70).optional(),

    metaDescription: z.string().trim().min(50).max(180).optional(),

    slug: z
      .string()
      .trim()
      .min(2)
      .max(150)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),

    primaryKeyword: z.string().trim().min(2).max(100).optional(),

    relatedKeywords: z
      .array(z.string().trim().min(2).max(100))
      .min(2)
      .max(8)
      .optional(),

    shortDescription: z.string().trim().min(20).max(500).optional(),

    description: z.string().trim().min(100).max(3000).optional(),

    faqs: z
      .array(
        z.object({
          question: z.string().trim().min(5).max(200),
          answer: z.string().trim().min(10).max(500),
        }),
      )
      .min(2)
      .max(5)
      .optional(),

    imageAltText: z.string().trim().min(5).max(200).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
