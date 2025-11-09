import express from "express";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getDashboardStats,
    getAllAccidents,
    deleteAccident,
    getAllReports,
    updateReportStatus
} from "../controllers/admin.controllers.js";
import { verifyClerkAuth, requireAdmin } from "../middleware/clerk.middleware.js";

const router = express.Router();

// All admin routes require Clerk authentication and admin role
router.use(verifyClerkAuth);
router.use(requireAdmin);

// User management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// Accident management
router.get("/accidents", getAllAccidents);
router.delete("/accidents/:id", deleteAccident);

// Report management
router.get("/reports", getAllReports);
router.put("/reports/:type/:id/status", updateReportStatus);

export default router;


