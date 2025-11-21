import mongoose from "mongoose";

const reportBaseSchema = {
  status: {
    type: String,
    enum: ["Pending", "Active", "Verified", "Resolved"],
    default: "Pending"
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
};

// ACCIDENT REPORT
const accidentSchema = new mongoose.Schema({
  ...reportBaseSchema,
  location: String,
  latitude: Number,       // ADDED
  longitude: Number,      // ADDED
  description: String,
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low"
  },
  vehiclesInvolved: Number,
  injuries: String,
  timeOfAccident: String,
}, { timestamps: true });

// TRAFFIC REPORT
const trafficSchema = new mongoose.Schema({
  ...reportBaseSchema,
  location: String,
  latitude: Number,       // ADDED
  longitude: Number,      // ADDED
  description: String,
  congestionLevel: String,
  timeReported: String,
}, { timestamps: true });

// CONSTRUCTION REPORT
const constructionSchema = new mongoose.Schema({
  ...reportBaseSchema,
  location: String,
  latitude: Number,       // ADDED
  longitude: Number,      // ADDED
  description: String,
  constructionType: String,
  progressStatus: String,
  expectedCompletion: String,
  timeReported: String,
}, { timestamps: true });

// ROAD HAZARD REPORT
const hazardSchema = new mongoose.Schema({
  ...reportBaseSchema,
  hazardType: String,
  location: String,
  latitude: Number,       // ADDED
  longitude: Number,      // ADDED
  description: String,
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low"
  },
  timeReported: String,
}, { timestamps: true });

export const AccidentReport = mongoose.model("AccidentReport", accidentSchema);
export const TrafficReport = mongoose.model("TrafficReport", trafficSchema);
export const ConstructionReport = mongoose.model("ConstructionReport", constructionSchema);
export const RoadHazardReport = mongoose.model("RoadHazardReport", hazardSchema);
