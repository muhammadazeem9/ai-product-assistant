import {
  generateDescriptionSchema,
  updateProductStatusSchema,
} from "../validators/product.validator.js";
import Product from "../models/product.model.js";
import {
  createProductDraft,
  updateProductStatus,
} from "../services/product.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const products = asyncHandler(async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    message: "All products retrieved successfully",
    data: {
      products,
    },
  });
});

export const generateDescription = asyncHandler(async (req, res) => {
  const validation = generateDescriptionSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid product information",
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const product = await createProductDraft(validation.data);

  res.status(201).json({
    success: true,
    message: "Product created successfully as a draft",
    data: { product },
  });
});

export const changeProductStatus = asyncHandler(async (req, res) => {
  const validation = updateProductStatusSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid product status",
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const product = await updateProductStatus(
    req.params.id,
    validation.data.status,
  );

  return res.status(200).json({
    success: true,
    message: `Product ${product.status} successfully`,
    data: { product },
  });
});
