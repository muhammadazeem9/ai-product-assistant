import { generateDescriptionSchema } from "../validators/product.validator.js";
// import { generateProductDescription } from "../services/ai-service.js";
import { createProductDraft } from "../services/product.service.js";
export const products = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Products retrieved successfully",
  });
};

export const generateDescription = async (req, res, next) => {
  try {
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

    // 2. Generate description and save product in MongoDB as a draft
    const product = await createProductDraft(validation.data);

    return res.status(201).json({
      success: true,
      message: "Product created successfully as a draft",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};
