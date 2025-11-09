    import express from "express";
    import { 
        syncClerkUser,
        getProfile, 
        updateProfile 
    } from "../controllers/auth.controllers.js";
    import { verifyClerkAuth } from "../middleware/clerk.middleware.js";

    const router = express.Router();

    // Sync Clerk user with MongoDB (called after Clerk authentication)
    router.post("/sync", verifyClerkAuth,syncClerkUser);

    // Protected routes - require Clerk authentication
    router.get("/profile", verifyClerkAuth, getProfile);
    router.put("/profile", verifyClerkAuth, updateProfile);

    export default router;
