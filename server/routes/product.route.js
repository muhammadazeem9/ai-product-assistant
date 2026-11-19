import express from "express";
import {
  products,
  generateDescription,
} from "../controller/product.controller.js";
const router = express.Router();

router.get("/", products);
router.post("/generate-description", generateDescription);

export default router;
