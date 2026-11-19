import { generateDescriptionSchema } from "../validators/product.validator.js";
import { generateProductDescription } from "../services/ai-service.js";

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

    const description = await generateProductDescription(validation.data);

    return res.status(200).json({
      success: true,
      message: "Product description generated successfully",
      data: {
        description,
      },
    });
  } catch (error) {
    next(error);
  }
};
