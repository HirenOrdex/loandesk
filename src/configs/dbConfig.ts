import mongoose from "mongoose";
import { DB_URL, DB_NAME } from "./envConfigs";

export const connectToDB = async () => {
  try {
    await mongoose.connect(`${DB_URL}`);
    console.log(DB_URL);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};
