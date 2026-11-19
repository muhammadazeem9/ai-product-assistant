import express from "express";
import productRoutes from "./routes/product.route.js";
import { notFound } from "./middleware/notfound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
  });
});

app.use("/api/products", productRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
