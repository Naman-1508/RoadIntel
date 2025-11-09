import { Clerk } from "@clerk/clerk-sdk-node"; // ✅ changed import — Clerk is a class, not a function

/**
 * Initialize Clerk client
 * Make sure CLERK_SECRET_KEY is set in environment variables
 */
let clerk;

/**
 * Initialize or get Clerk client
 * This function ensures the client is initialized with the secret key
 */
export const initializeClerk = () => {
    if (clerk) {
        return clerk;
    }

    const secretKey = process.env.CLERK_SECRET_KEY;

    if (!secretKey) {
        console.error("❌ CLERK_SECRET_KEY is not set in environment variables");
        console.error("   Please add CLERK_SECRET_KEY to your .env file");
        return null;
    }

    try {
        // ✅ FIXED LINE: use 'new Clerk()' instead of 'clerkClient()'
        clerk = new Clerk({ secretKey });
        console.log("✅ Clerk client initialized successfully");
        return clerk;
    } catch (error) {
        console.error("❌ Failed to initialize Clerk client:", error);
        return null;
    }
};

// Initialize on module load
initializeClerk();

/**
 * Verify Clerk session token
 * @param {string} token - Clerk session token
 * @returns {Promise<Object>} - Decoded token with user info
 */
export const verifyClerkToken = async (token) => {
    const client = initializeClerk();
    if (!client) {
        throw new Error("Clerk client not initialized. Make sure CLERK_SECRET_KEY is set in your .env file.");
    }

    try {
        const session = await client.sessions.verifyToken(token);
        return session;
    } catch (error) {
        try {
            const parts = token.split(".");
            if (parts.length !== 3) {
                throw new Error("Invalid token format");
            }

            const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
            const userId = payload.sub;

            if (!userId) {
                throw new Error("User ID not found in token");
            }

            const user = await client.users.getUser(userId);

            return {
                userId: user.id,
                user: user
            };
        } catch (decodeError) {
            throw new Error(`Invalid Clerk token: ${error.message}`);
        }
    }
};

/**
 * Get user from Clerk by ID
 * @param {string} userId - Clerk user ID
 * @returns {Promise<Object>} - Clerk user object
 */
export const getClerkUser = async (userId) => {
    const client = initializeClerk();
    if (!client) {
        throw new Error("Clerk client not initialized. Make sure CLERK_SECRET_KEY is set in your .env file.");
    }

    try {
        const user = await client.users.getUser(userId);
        return user;
    } catch (error) {
        throw new Error(`Failed to get Clerk user: ${error.message}`);
    }
};

/**
 * Update user in Clerk
 * @param {string} userId - Clerk user ID
 * @param {Object} updates - User updates
 * @returns {Promise<Object>} - Updated Clerk user object
 */
export const updateClerkUser = async (userId, updates) => {
    const client = initializeClerk();
    if (!client) {
        throw new Error("Clerk client not initialized. Make sure CLERK_SECRET_KEY is set in your .env file.");
    }

    try {
        const user = await client.users.updateUser(userId, updates);
        return user;
    } catch (error) {
        throw new Error(`Failed to update Clerk user: ${error.message}`);
    }
};

export default clerk;
