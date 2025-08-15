import express from "express";
import { login, register, verifyEmail } from "./user.controller.js";
const router = express.Router();

router
  .post("/register", register)
  .post("/verify-email", verifyEmail)
  .post("/login", login);
export default router;
