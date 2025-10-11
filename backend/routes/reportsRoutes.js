import express from "express";
import {
  createAccidentReport,
  createTrafficReport,
  createConstructionReport,
  createRoadHazardReport,
} from "../controllers/reports.controllers.js";
import { getAllReports } from "../controllers/reports.controllers.js";

const router = express.Router();

router.post("/accident", createAccidentReport);
router.post("/traffic", createTrafficReport);
router.post("/construction", createConstructionReport);
router.post("/hazard", createRoadHazardReport);
router.get("/",getAllReports);

export default router;
