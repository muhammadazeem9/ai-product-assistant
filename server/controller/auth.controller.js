import { registerSchema, loginSchema } from "../validators/auth.validator.js";

import { registerUser, loginUser } from "../services/auth.service.js";

import asyncHandler from "../utils/asyncHandler.js";

const COOKIE_NAME = "accessToken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: Number(process.env.COOKIE_EXPIRES_IN) || 900000,
  });
};

// Register
export const register = asyncHandler(async (req, res) => {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration data",
      errors: validation.error.issues,
    });
  }

  const result = await registerUser(validation.data);

  setAuthCookie(res, result.token);

  return res.status(201).json({
    success: true,
    message: "Account registered successfully",
    data: {
      user: result.user,
    },
  });
});

// Login
export const login = asyncHandler(async (req, res) => {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid login credentials",
      errors: validation.error.issues,
    });
  }

  const result = await loginUser(validation.data);

  setAuthCookie(res, result.token);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: result.user,
    },
  });
});

// Logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// Current authenticated user
export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});
