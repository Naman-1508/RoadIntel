import { verifyClerkToken } from "../lib/clerk.js";
import { User } from "../models/users.models.js";

/**
 * Middleware to verify Clerk authentication token
 * Extracts token from Authorization header and verifies it with Clerk
 * Attaches user info to req.user
 */
export const verifyClerkAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ message: "No authorization header provided" });
        }

        // Extract token from "Bearer <token>" format
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.substring(7)
            : authHeader;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify token with Clerk
        const session = await verifyClerkToken(token);
        
        // Extract user ID from session
        const clerkUserId = session.userId || session.user?.id || session.sub;
        
        if (!clerkUserId) {
            return res.status(401).json({ message: "Invalid token - user ID not found" });
        }

        // Get or create user in MongoDB
        let user = await User.findOne({ clerkId: clerkUserId });
        
        if (!user) {
            // User doesn't exist in MongoDB, create it
            // We'll need to fetch user details from Clerk
            const { getClerkUser } = await import("../lib/clerk.js");
            const clerkUser = await getClerkUser(clerkUserId);
            
            // Check if admin seed email matches
            const adminSeedEmail = process.env.ADMIN_SEED_EMAIL;
            const userEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
            const isAdmin = adminSeedEmail && userEmail.toLowerCase() === adminSeedEmail.toLowerCase();

            user = new User({
                clerkId: clerkUserId,
                email: userEmail,
                username: clerkUser.username || clerkUser.firstName || "",
                firstName: clerkUser.firstName || "",
                lastName: clerkUser.lastName || "",
                imageUrl: clerkUser.imageUrl || "",
                role: isAdmin ? "admin" : "user",
                lastLogin: new Date()
            });
            
            await user.save();
        } else {
            // Update last login
            user.lastLogin = new Date();
            await user.save();
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ message: "Account is deactivated" });
        }

        // Attach user to request
        req.user = {
            id: user._id.toString(),
            clerkId: user.clerkId,
            email: user.email,
            username: user.username,
            role: user.role
        };

        next();
    } catch (error) {
        if (error.message.includes("Invalid Clerk token") || error.message.includes("expired")) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        console.error("Clerk auth middleware error:", error);
        return res.status(500).json({ message: "Authentication error", error: error.message });
    }
};

/**
 * Middleware to check if user has admin role
 * Must be used after verifyClerkAuth
 */
export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }

    next();
};

/**
 * Middleware to check if user has specific role(s)
 * Must be used after verifyClerkAuth
 */
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        next();
    };
};

