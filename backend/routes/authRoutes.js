import express, { Router } from "express";
import { registerUser,loginUser } from "../controllers/auth.controllers.js";
import { registerValidation,loginValidation } from "../validations/authValidations.js";
import { validateRequest } from "../middleware/validateRequest.middleware.js";

const router = express.Router();

router.post("/register",registerUser,validateRequest,registerValidation);
router.post("/login",loginUser,validateRequest,loginValidation);

export default router;