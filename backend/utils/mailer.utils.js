import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailOtp = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP for RoadIntel",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });

  console.log(`[DEV] OTP sent to ${to}: ${otp}`); // optional for dev
};
