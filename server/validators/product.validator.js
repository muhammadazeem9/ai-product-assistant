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
