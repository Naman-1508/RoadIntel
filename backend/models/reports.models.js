import mongoose from "mongoose";

const accidentSchema = new mongoose.Schema({
  location: String,
  description: String,
  severity: String,
  vehiclesInvolved: Number,
  injuries: String,
  timeOfAccident: String,
});

const trafficSchema = new mongoose.Schema({
  location: String,
  description: String,
  congestionLevel: String,
  timeReported: String,
});

const constructionSchema = new mongoose.Schema({
  location: String,
  description: String,
  constructionType: String,
  progressStatus: String,
  expectedCompletion: String,
  timeReported: String,
});

const hazardSchema = new mongoose.Schema({
  hazardType: String,
  location: String,
  description: String,
  severity: String,
  timeReported: String,
});

export const AccidentReport = mongoose.model("AccidentReport", accidentSchema);
export const TrafficReport = mongoose.model("TrafficReport", trafficSchema);
export const ConstructionReport = mongoose.model("ConstructionReport", constructionSchema);
export const RoadHazardReport = mongoose.model("RoadHazardReport", hazardSchema);
