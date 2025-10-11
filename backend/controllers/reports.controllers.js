import { AccidentReport, TrafficReport, ConstructionReport, RoadHazardReport } from "../models/reports.models.js";

export const createAccidentReport = async (req, res) => {
  try {
    const report = await AccidentReport.create(req.body);
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTrafficReport = async (req, res) => {
  try {
    const report = await TrafficReport.create(req.body);
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createConstructionReport = async (req, res) => {
  try {
    const report = await ConstructionReport.create(req.body);
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRoadHazardReport = async (req, res) => {
  try {
    const report = await RoadHazardReport.create(req.body);
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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

