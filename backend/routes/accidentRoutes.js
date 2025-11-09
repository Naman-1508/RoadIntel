import express from "express";
import { getAccidents,addAccident } from "../controllers/accident.controllers.js";
import { verifyClerkAuth } from "../middleware/clerk.middleware.js";

const router = express.Router();

router.post("/", verifyClerkAuth, addAccident);
router.get("/", verifyClerkAuth, getAccidents);

export default router;