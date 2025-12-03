import express from "express";
import multer from "multer";
import { analyzeVideo } from "../controllers/video.controllers.js";

const router = express.Router();
const upload = multer({ dest: "/tmp/" });

router.post("/analyze", upload.single("video"), analyzeVideo);

export const videoRoutes = router;
