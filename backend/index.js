import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { initializeClerk } from "./lib/clerk.js";
initializeClerk();

// Route imports
import authRoutes from "./routes/authRoutes.js";
import accidentRoutes from "./routes/accidentRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import socialInsightsRoutes from "./routes/socialInsightsRoutes.js";
import reportRoutes from "./routes/reportsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { videoRoutes } from "./routes/video.routes.js";

// Load environment variables first

// Verify required environment variables
if (!process.env.CLERK_SECRET_KEY) {
    console.error("❌ ERROR: CLERK_SECRET_KEY is not set in environment variables");
    console.error("   Please add CLERK_SECRET_KEY to your .env file");
    console.error("   Example: CLERK_SECRET_KEY=sk_test_your_secret_key_here");
    process.exit(1);
}

if (!process.env.MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is not set in environment variables");
    console.error("   Please add MONGO_URI to your .env file");
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ["http://localhost:8080", "https://road-intel-frontend.vercel.app"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Backend API server - production ready

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/accidents", accidentRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/social-insights", socialInsightsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/video", videoRoutes);

// Health check route
app.get("/", (req, res) => {
    res.json({
        message: "RoadIntel Backend Server is running",
        version: "1.0.0",
        status: "healthy"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
});
