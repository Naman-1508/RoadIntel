import { User } from "../models/users.models.js";
import { getClerkUser } from "../lib/clerk.js";

/**
 * Sync Clerk user with MongoDB
 * Called when a user first logs in via Clerk
 * Creates or updates user in MongoDB
 */
export const syncClerkUser = async (req, res) => {
    try {
        const { clerkId } = req.body;

        if (!clerkId) {
            return res.status(400).json({ message: "Clerk ID is required" });
        }

        // Get user from Clerk
        const clerkUser = await getClerkUser(clerkId);

        // Check if user exists in MongoDB
        let user = await User.findOne({ clerkId });

        if (user) {
            // Update existing user
            user.email = clerkUser.emailAddresses[0]?.emailAddress || user.email;
            user.username = clerkUser.username || clerkUser.firstName || user.username;
            user.firstName = clerkUser.firstName || user.firstName;
            user.lastName = clerkUser.lastName || user.lastName;
            user.imageUrl = clerkUser.imageUrl || user.imageUrl;
            user.lastLogin = new Date();
            await user.save();
        } else {
            // Create new user
            // Check if admin seed email matches
            const adminSeedEmail = process.env.ADMIN_SEED_EMAIL;
            const userEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
            const isAdmin = adminSeedEmail && userEmail.toLowerCase() === adminSeedEmail.toLowerCase();

            user = new User({
                clerkId,
                email: userEmail,
                username: clerkUser.username || clerkUser.firstName || "",
                firstName: clerkUser.firstName || "",
                lastName: clerkUser.lastName || "",
                imageUrl: clerkUser.imageUrl || "",
                role: isAdmin ? "admin" : "user",
                lastLogin: new Date()
            });

            await user.save();
        }

        res.json({
            message: "User synced successfully",
            user: {
                id: user._id,
                clerkId: user.clerkId,
                username: user.username,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl
            }
        });
    } catch (err) {
        console.error("Sync Clerk user error:", err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            user: {
                id: user._id,
                clerkId: user.clerkId,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Update user profile (non-admin fields only)
 */
export const updateProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username) {
            user.username = username;
        }

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                clerkId: user.clerkId,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
