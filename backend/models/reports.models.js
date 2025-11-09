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

const accidentSchema = new mongoose.Schema({
  ...reportBaseSchema,
  location: String,
  description: String,
  severity: String,
  vehiclesInvolved: Number,
  injuries: String,
  timeOfAccident: String,
}, { timestamps: true });

const trafficSchema = new mongoose.Schema({
  ...reportBaseSchema,
  location: String,
  description: String,
  congestionLevel: String,
  timeReported: String,
}, { timestamps: true });

const constructionSchema = new mongoose.Schema({
  ...reportBaseSchema,
  location: String,
  description: String,
  constructionType: String,
  progressStatus: String,
  expectedCompletion: String,
  timeReported: String,
}, { timestamps: true });

const hazardSchema = new mongoose.Schema({
  ...reportBaseSchema,
  hazardType: String,
  location: String,
  description: String,
  severity: String,
  timeReported: String,
}, { timestamps: true });

export const AccidentReport = mongoose.model("AccidentReport", accidentSchema);
export const TrafficReport = mongoose.model("TrafficReport", trafficSchema);
export const ConstructionReport = mongoose.model("ConstructionReport", constructionSchema);
export const RoadHazardReport = mongoose.model("RoadHazardReport", hazardSchema);
