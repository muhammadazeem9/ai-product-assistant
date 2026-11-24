import dns from "dns";
import "dotenv/config";

import connectDB from "../config/db.js";
import User from "../models/user.model.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const createAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Admin environment variables are missing");
    }

    await connectDB();

    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL.toLowerCase().trim(),
    });

    if (existingAdmin) {
      throw new Error("An account with this admin email already exists");
    }

    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    console.log(`Admin created successfully: ${admin.email}`);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect();
  }
};

createAdmin();
