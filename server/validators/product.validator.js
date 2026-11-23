import z from "zod";

export const generateDescriptionSchema = z.object({
  name: z.string().trim().min(2).max(120),

  category: z.string().trim().min(2).max(80),

  features: z.array(z.string().trim().min(1).max(100)).max(20).default([]),
});

export const updateProductStatusSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});
