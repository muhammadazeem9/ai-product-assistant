import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import appError from "../utils/appError.js";

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new appError(
      "JWT_SECRET is not defined in environment variables",
      500,
    );
  }
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};

const getSafeUser = (user) => {
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

export const registerUser = async (userData) => {
  try {
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: "user",
    });

    return {
      user: getSafeUser(user),
      token: createToken(user),
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new appError("Email is already registered", 409);
    }

    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new appError("Invalid email or password", 401);
  }

  return {
    user: getSafeUser(user),
    token: createToken(user),
  };
};
