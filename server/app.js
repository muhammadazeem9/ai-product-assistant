import express from "express";
import productRoutes from "./routes/product.route.js";
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
  });
});

app.use("/api/products", productRoutes);

export default app;
