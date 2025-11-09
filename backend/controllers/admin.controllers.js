import { User } from "../models/users.models.js";
import { Accident } from "../models/accidents.models.js";
import { 
    AccidentReport, 
    TrafficReport, 
    ConstructionReport, 
    RoadHazardReport 
} from "../models/reports.models.js";
import bcrypt from "bcryptjs";

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, search } = req.query;
        const skip = (page - 1) * limit;

        // Build query
        const query = {};
        if (role) {
            query.role = role;
        }
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.json({
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get user by ID (admin only)
 */
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Update user (admin only)
 */
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role, isActive } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent admin from modifying their own role
        if (id === req.user.id && role && role !== user.role) {
            return res.status(403).json({ message: "Cannot modify own role" });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (role && ["user", "admin"].includes(role)) user.role = role;
        if (typeof isActive === "boolean") user.isActive = isActive;

        await user.save();

        res.json({
            message: "User updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (id === req.user.id) {
            return res.status(403).json({ message: "Cannot delete your own account" });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get dashboard statistics (admin only)
 */
export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalAdmins,
            totalAccidents,
            totalAccidentReports,
            totalTrafficReports,
            totalConstructionReports,
            totalHazardReports,
            recentUsers
        ] = await Promise.all([
            User.countDocuments({ role: "user" }),
            User.countDocuments({ role: "admin" }),
            Accident.countDocuments(),
            AccidentReport.countDocuments(),
            TrafficReport.countDocuments(),
            ConstructionReport.countDocuments(),
            RoadHazardReport.countDocuments(),
            User.find()
                .select("-password")
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        res.json({
            stats: {
                users: {
                    total: totalUsers,
                    admins: totalAdmins,
                    totalUsers: totalUsers + totalAdmins
                },
                reports: {
                    accidents: totalAccidents,
                    accidentReports: totalAccidentReports,
                    traffic: totalTrafficReports,
                    construction: totalConstructionReports,
                    hazards: totalHazardReports,
                    total: totalAccidents + totalAccidentReports + totalTrafficReports + 
                           totalConstructionReports + totalHazardReports
                }
            },
            recentUsers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get all accidents (admin only)
 */
export const getAllAccidents = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const accidents = await Accident.find()
            .populate("user", "username email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Accident.countDocuments();

        res.json({
            accidents,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Delete accident (admin only)
 */
export const deleteAccident = async (req, res) => {
    try {
        const { id } = req.params;
        const accident = await Accident.findByIdAndDelete(id);
        
        if (!accident) {
            return res.status(404).json({ message: "Accident not found" });
        }

        res.json({ message: "Accident deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get all reports (admin only)
 */
export const getAllReports = async (req, res) => {
    try {
        const { type, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        let reports = [];
        let total = 0;

        switch (type) {
            case "accident":
                reports = await AccidentReport.find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(parseInt(limit));
                total = await AccidentReport.countDocuments();
                break;
            case "traffic":
                reports = await TrafficReport.find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(parseInt(limit));
                total = await TrafficReport.countDocuments();
                break;
            case "construction":
                reports = await ConstructionReport.find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(parseInt(limit));
                total = await ConstructionReport.countDocuments();
                break;
            case "hazard":
                reports = await RoadHazardReport.find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(parseInt(limit));
                total = await RoadHazardReport.countDocuments();
                break;
            default:
                // Get all types
                const [accidents, traffic, construction, hazards] = await Promise.all([
                    AccidentReport.find().sort({ createdAt: -1 }).limit(parseInt(limit) / 4),
                    TrafficReport.find().sort({ createdAt: -1 }).limit(parseInt(limit) / 4),
                    ConstructionReport.find().sort({ createdAt: -1 }).limit(parseInt(limit) / 4),
                    RoadHazardReport.find().sort({ createdAt: -1 }).limit(parseInt(limit) / 4)
                ]);
                reports = [
                    ...accidents.map(r => ({ ...r.toObject(), reportType: "accident" })),
                    ...traffic.map(r => ({ ...r.toObject(), reportType: "traffic" })),
                    ...construction.map(r => ({ ...r.toObject(), reportType: "construction" })),
                    ...hazards.map(r => ({ ...r.toObject(), reportType: "hazard" }))
                ];
                total = await Promise.all([
                    AccidentReport.countDocuments(),
                    TrafficReport.countDocuments(),
                    ConstructionReport.countDocuments(),
                    RoadHazardReport.countDocuments()
                ]).then(counts => counts.reduce((a, b) => a + b, 0));
        }

        res.json({
            reports,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Update report status (admin only)
 */
export const updateReportStatus = async (req, res) => {
    try {
        const { type, id } = req.params;
        const { status } = req.body;

        if (!["Pending", "Active", "Verified", "Resolved"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        let report;
        switch (type) {
            case "accident":
                report = await AccidentReport.findByIdAndUpdate(
                    id,
                    { status },
                    { new: true }
                );
                break;
            case "traffic":
                report = await TrafficReport.findByIdAndUpdate(
                    id,
                    { status },
                    { new: true }
                );
                break;
            case "construction":
                report = await ConstructionReport.findByIdAndUpdate(
                    id,
                    { status },
                    { new: true }
                );
                break;
            case "hazard":
                report = await RoadHazardReport.findByIdAndUpdate(
                    id,
                    { status },
                    { new: true }
                );
                break;
            default:
                return res.status(400).json({ message: "Invalid report type" });
        }

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.json({
            message: "Report status updated successfully",
            report
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


