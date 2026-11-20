import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables",
      );
    }
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `MongoDB connected successfully to ${connection.connection.host}`,
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw error;
  }
};

export default connectDB;
