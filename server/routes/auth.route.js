import express from "express";

import {
  register,
  login,
  logout,
  getMe,
} from "../controller/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  loginLimiter,
  registerLimiter,
} from "../middleware/ratelimit.middleware.js";

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
