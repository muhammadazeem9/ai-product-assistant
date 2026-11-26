import express, { Router } from "express";
import {
  products,
  generateDescription,
  changeProductStatus,
  editProduct,
  getProduct,
  delProduct,
} from "../controller/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/role.milddleware.js";
import { aiGenerationLimiter } from "../middleware/ratelimit.middleware.js";
import { validateObjectId } from "../middleware/validateObjectId.middleware.js";

const router = express.Router();

router.use(protect, restrictTo("admin")); // All product management routes require an admin.

router.get("/", products); //get all products

router.post("/generate-description", aiGenerationLimiter, generateDescription); // generate product description

router.patch("/:id/status", changeProductStatus); // change product status

router.patch("/:id", validateObjectId, editProduct);

router.get("/:id", validateObjectId, getProduct);

router.delete("/:id", validateObjectId, delProduct);

export default router;
