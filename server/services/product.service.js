import Product from "../models/product.model.js";
import { generateProductDescription } from "./ai-service.js";

export const createProductDraft = async (productData) => {
  const description = await generateProductDescription(productData);

  const product = await Product.create({
    ...productData,
    description,
    status: "draft",
  });

  return product;
};
