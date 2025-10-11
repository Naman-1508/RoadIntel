import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controllers.js";
import { sendOtp, verifyOtp } from "../controllers/otp.controllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;
