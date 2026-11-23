import mongoose from "mongoose";
import Product from "../models/product.model.js";
import { generateProductDescription } from "./ai-service.js";
import appError from "../utils/appError.js";

export const createProductDraft = async (productData) => {
  const description = await generateProductDescription(productData);

  if (!description || typeof description !== "string") {
    throw new appError("Failed to generate product description", 502);
  }

  const product = await Product.create({
    ...productData,
    description,
    status: "draft",
  });

  return product;
};

export const updateProductStatus = async (productId, status) => {
  if (!mongoose.isValidObjectId(productId)) {
    throw new appError("Invalid product ID", 400);
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new appError("Product not found", 404);
  }

  if (product.status !== "draft") {
    throw new appError("Only draft products can be updated", 400);
  }

  product.status = status;
  await product.save();

  return product;
};
