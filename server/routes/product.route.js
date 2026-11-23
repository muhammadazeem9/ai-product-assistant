import express from "express";
import {
  products,
  generateDescription,
  changeProductStatus,
} from "../controller/product.controller.js";
const router = express.Router();

router.get("/", products); //get all products

router.post("/generate-description", generateDescription); // generate product description

router.patch("/:id/status", changeProductStatus); // change product status

export default router;
