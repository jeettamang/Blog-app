import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  secure: false,
  auth: {
    user: process.env.SMTP_GMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const mailSend = async ({ to, subject, message }) => {
  try {
    const info = await transporter.sendMail({
      from: `"BlogQuill" <${process.env.SMTP_GMAIL}>`,
      to,
      subject,
      html: message,
    });
    return info?.messageId;
  } catch (error) {
    console.error("Email send failed:", error);
    throw new Error("Failed to send email");
  }
};
export { mailSend };
