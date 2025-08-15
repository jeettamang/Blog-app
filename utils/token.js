import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateOTP = () => crypto.randomInt(100000, 1000000);
const generateToken = (Payload) => {
  return jwt.sign(Payload, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_DURATION,
  });
};
export { generateOTP, generateToken };
