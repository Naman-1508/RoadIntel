import express from "express";
import {
  createAccidentReport,
  createTrafficReport,
  createConstructionReport,
  createRoadHazardReport,
} from "../controllers/reports.controllers.js";
import { getAllReports } from "../controllers/reports.controllers.js";
import { verifyClerkAuth } from "../middleware/clerk.middleware.js";

const router = express.Router();

// All report routes require Clerk authentication
router.post("/accident", verifyClerkAuth, createAccidentReport);
router.post("/traffic", verifyClerkAuth, createTrafficReport);
router.post("/construction", verifyClerkAuth, createConstructionReport);
router.post("/hazard", verifyClerkAuth, createRoadHazardReport);
router.get("/", verifyClerkAuth, getAllReports);

export default router;
