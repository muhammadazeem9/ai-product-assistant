import express, { Router } from "express";
import {
  products,
  generateDescription,
  changeProductStatus,
} from "../controller/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/role.milddleware.js";
const router = express.Router();

router.use(protect, restrictTo("admin")); // All product management routes require an admin.

router.get("/", products); //get all products

router.post("/generate-description", generateDescription); // generate product description

router.patch("/:id/status", changeProductStatus); // change product status

export default router;
