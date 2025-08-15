import mongoose from "mongoose";

export const DBConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Database is connected successfully");
  } catch (error) {
    console.log("Failed to connect database");
    error: error.message;
  }
};
