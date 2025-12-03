import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://road-intel.vercel.app/api",    timeout: 10000,
});

// Token getter function - will be set by components that use Clerk
let tokenGetter: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (getter: () => Promise<string | null>) => {
    tokenGetter = getter;
};

// Request interceptor - get Clerk token dynamically
API.interceptors.request.use(
    async (config) => {
        try {
            // Get Clerk session token if token getter is available
            if (tokenGetter) {
                const token = await tokenGetter();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            console.error("Failed to get Clerk token:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear storage and redirect to home
            localStorage.removeItem("user");
            if (window.location.pathname !== "/") {
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export default API;
