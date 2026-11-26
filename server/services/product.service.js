import mongoose from "mongoose";
import Product from "../models/product.model.js";
import { generateProductDescription } from "./ai-service.js";
import appError from "../utils/appError.js";

export const createProductDraft = async (productData) => {
  const aiContent = await generateProductDescription(productData);

  // if (!aiContent || typeof aiContent !== "string") {
  //   throw new appError("Failed to generate product description", 502);
  // }

  const product = await Product.create({
    ...productData,
    ...aiContent,
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

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getProducts = async ({
  page,
  limit,
  status,
  category,
  search,
}) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (category) {
    filter.category = {
      $regex: `^${escapeRegex(category)}$`,
      $options: "i",
    };
  }

  if (search) {
    const searchRegex = {
      $regex: escapeRegex(search),
      $options: "i",
    };

    filter.$or = [{ name: searchRegex }, { category: searchRegex }];
  }

  const skip = (page - 1) * limit;

  const [products, totalProducts] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),

    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      currentPage: page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      hasNextPage: page * limit < totalProducts,
      hasPreviousPage: page > 1,
    },
  };
};

export const updateProduct = async (productId, updateData) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new appError("Product not found", 404);
  }

  // Check whether another product already uses this slug.
  if (updateData.slug && updateData.slug !== product.slug) {
    const existingSlug = await Product.findOne({
      slug: updateData.slug,
      _id: { $ne: productId },
    });

    if (existingSlug) {
      throw new appError("This product slug is already in use", 409);
    }
  }

  Object.assign(product, updateData);

  await product.save();

  return product;
};

export const getProductById = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new appError("product not found", 404);
  }
  return product;
};

export const deleteProduct = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new appError("Product not found", 404);
  }

  await product.deleteOne();

  return product;
};
