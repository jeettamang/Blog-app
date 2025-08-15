import mongoose from "mongoose";
const UserScehema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    image: {
      type: String,
    },
    isActive: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);
const UserModel = mongoose.model("User", UserScehema);
export default UserModel;
