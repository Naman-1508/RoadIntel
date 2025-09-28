import { body } from "express-validator";

export const accidentValidation = [
    body("location").notEmpty().withMessage("Location is required"),
    body("Severity").isIn(["low","medium","high"]).withMessage("Invalid Severity"),
    body("description").isLength({min:10}).withMessage("Description must be at least 10 chars")
];
