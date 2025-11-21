import { 
  AccidentReport, 
  TrafficReport, 
  ConstructionReport, 
  RoadHazardReport 
} from "../models/reports.models.js";

// -------------------------------------------
// Helper: validate required geo fields
// -------------------------------------------
const validateGeo = (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude === undefined || longitude === undefined) {
    res.status(400).json({
      success: false,
      message: "Latitude and longitude are required."
    });
    return false;
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    res.status(400).json({
      success: false,
      message: "Latitude and longitude must be numeric."
    });
    return false;
  }

  return true;
};

// -------------------------------------------
// ACCIDENT REPORT
// -------------------------------------------
export const createAccidentReport = async (req, res) => {
  try {
    if (!validateGeo(req, res)) return;

    const report = await AccidentReport.create({
      location: req.body.location,     // address string
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      description: req.body.description,
      severity: req.body.severity,
      vehiclesInvolved: req.body.vehiclesInvolved,
      injuries: req.body.injuries,
      timeOfAccident: req.body.timeOfAccident,
      reportedBy: req.user.id
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------
// TRAFFIC REPORT
// -------------------------------------------
export const createTrafficReport = async (req, res) => {
  try {
    if (!validateGeo(req, res)) return;

    const report = await TrafficReport.create({
      location: req.body.location,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      description: req.body.description,
      congestionLevel: req.body.congestionLevel,
      timeReported: req.body.timeReported,
      reportedBy: req.user.id
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------
// CONSTRUCTION REPORT
// -------------------------------------------
export const createConstructionReport = async (req, res) => {
  try {
    if (!validateGeo(req, res)) return;

    const report = await ConstructionReport.create({
      location: req.body.location,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      description: req.body.description,
      constructionType: req.body.constructionType,
      progressStatus: req.body.progressStatus,
      expectedCompletion: req.body.expectedCompletion,
      timeReported: req.body.timeReported,
      reportedBy: req.user.id
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------
// ROAD HAZARD REPORT
// -------------------------------------------
export const createRoadHazardReport = async (req, res) => {
  try {
    if (!validateGeo(req, res)) return;

    const report = await RoadHazardReport.create({
      hazardType: req.body.hazardType,
      location: req.body.location,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      description: req.body.description,
      severity: req.body.severity,
      timeReported: req.body.timeReported,
      reportedBy: req.user.id
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------
// GET ALL REPORTS
// -------------------------------------------
export const getAllReports = async (req, res) => {
  try {
    const accidentReports = await AccidentReport.find();
    const trafficReports = await TrafficReport.find();
    const constructionReports = await ConstructionReport.find();
    const roadHazardReports = await RoadHazardReport.find();

    const allReports = [
      ...accidentReports.map(r => ({ ...r.toObject(), type: "accident" })),
      ...trafficReports.map(r => ({ ...r.toObject(), type: "traffic" })),
      ...constructionReports.map(r => ({ ...r.toObject(), type: "construction" })),
      ...roadHazardReports.map(r => ({ ...r.toObject(), type: "hazard" })),
    ];

    allReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(allReports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching reports" });
  }
};
