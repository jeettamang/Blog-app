import { compare } from "bcryptjs";
import { mailSend } from "../../services/mailer.js";
import { hashedPassword, comparePassword } from "../../utils/bcrypt.js";
import { generateOTP, generateToken } from "../../utils/token.js";
import UserModel from "./user.model.js";

const register = async (req, res) => {
  try {
    const { name, email, password, roles } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User is already registered" });
    }
    const pass = hashedPassword(password);
    const otp = generateOTP();
    const newUser = await UserModel.create({
      name,
      email,
      password: pass,
      roles,
      token: otp,
    });
    try {
      if (newUser) {
        await mailSend({
          to: newUser.email,
          subject: "Welcome to BlogQuill - verify your email",
          message: `Dear ${newUser.name} Welcome to <strong>BlogQuill </strong> </br>
  <p>Please verify your email with this OTP : ${newUser.token} </p>
  `,
        });
      }
    } catch (Emailerror) {
      await UserModel.deleteOne({ _id: newUser._id });
      throw new Error("Email sending failed. Please try again.");
    }
    const { password: _, ...rest } = newUser.toObject();
    res.status(200).json({
      message: "User register successfully. Please verify your email with OTP",
      Data: rest,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to register user", err: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      return res.status(400).json({ message: "Email or token is missing" });
    }
    const user = await UserModel.findOne({
      email,
      isActive: false,
      isEmailVerified: false,
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.token !== token) {
      return res.status(400).json({ message: "Invalid token" });
    }
    const updatedUser = await UserModel.updateOne(
      { email },
      { $set: { token: "", isActive: true, isEmailVerified: true } }
    );
    if (updatedUser.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to verify the user" });
    }
    res.status(200).json({ message: "Email is verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Email verification failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User not found");
    if (!user.isActive) throw new Error("User is inactive");
    if (!user.isEmailVerified) throw new Error("Email is unverified");
    const isMatch = comparePassword(password, user.password);
    if (!isMatch) throw new Error("Password is incorrect");
    const userData = { name: user.name, email: user.email, roles: user.roles };
    const accessToken = generateToken(userData);
    res.status(200).json({
      message: "User login successful",
      ...userData,
      token: accessToken,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};
export { register, verifyEmail, login };
