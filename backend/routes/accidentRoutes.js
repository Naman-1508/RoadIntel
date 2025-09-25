import express from "express";
import { getAccidents,addAccident } from "../controllers/accident.controllers.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { get } from "mongoose";

const router = express.Router();

router.post("/",verifyToken,addAccident);
router.get("/",verifyToken,getAccidents);

export default router;