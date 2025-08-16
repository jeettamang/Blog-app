import express from "express";
import {
  forgetPassword,
  getUsers,
  login,
  register,
  verifyEmail,
  verifyForgetPw,
} from "./user.controller.js";
import { secureAPI } from "../../utils/secure.js";
const router = express.Router();

router
  .post("/register", register)
  .post("/verify-email", verifyEmail)
  .post("/login", login)
  .post("/forget-password", forgetPassword)
  .post("/verify-fp", verifyForgetPw)
  .get("/all", getUsers);
export default router;
