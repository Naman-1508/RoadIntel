import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/users.models.js";
import { getClerkUser } from "../lib/clerk.js";

dotenv.config();

/**
 * Seed admin user from Clerk
 * This script should be run after creating an admin user in Clerk
 * Set ADMIN_SEED_EMAIL in .env to the email of the admin user
 */
const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB");

        const adminEmail = process.env.ADMIN_SEED_EMAIL;
        
        if (!adminEmail) {
            console.error("❌ ADMIN_SEED_EMAIL not set in environment variables");
            process.exit(1);
        }

        // Find all users in Clerk (we'll need to search by email)
        // Note: Clerk doesn't have a direct search by email in the SDK
        // So we'll need to manually provide the Clerk ID or use webhooks
        // For now, we'll check if a user with this email exists in MongoDB
        
        const existingUser = await User.findOne({ 
            email: adminEmail.toLowerCase() 
        });

        if (existingUser) {
            // Update existing user to admin
            if (existingUser.role !== "admin") {
                existingUser.role = "admin";
                await existingUser.save();
                console.log(`✅ Updated user ${adminEmail} to admin role`);
            } else {
                console.log(`ℹ️  User ${adminEmail} is already an admin`);
            }
        } else {
            console.log(`⚠️  User with email ${adminEmail} not found in MongoDB`);
            console.log("   Make sure the user has logged in at least once via Clerk");
            console.log("   Or manually create the user with the correct Clerk ID");
        }

        await mongoose.disconnect();
        console.log("✅ Disconnected from MongoDB");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedAdmin();

