import { mailSend } from "../../services/mailer.js";
import { hashedPassword } from "../../utils/bcrypt.js";
import { generateOTP } from "../../utils/token.js";
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

export { register };
