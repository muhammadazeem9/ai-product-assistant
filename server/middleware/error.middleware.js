export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log detailed errors on the server, not in the API response.
  console.error("API Error:", {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
  });

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500
        ? "Internal server error"
        : err.message || "Request failed",
  });
};
