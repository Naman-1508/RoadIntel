import {body} from "express-validator";

export const registerValidation = [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({min:8}).withMessage("Password must be at least 8 chars long"),
];

export const loginValidation = [
    body("email").isEmail().withMessage("Please enter a email"),
    body("password").isLength({min:8}).withMessage("Password must be at least 8 chars long")
];