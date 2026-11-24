import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import appError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new appError("Authentication required. Please log in.", 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new appError("Invalid or expired authentication token", 401);
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new appError("User associated with this token no longer exists", 401);
  }

  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  next();
});
