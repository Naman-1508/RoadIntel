import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import AlertDashboard from "./pages/AlertDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import SocialInsights from "./pages/SocialInsights";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
import VideoAnalysis from "./pages/VideoAnalysis";
import { setTokenGetter } from "./utility/api";
import { Footer } from "@/components/Footer";

const queryClient = new QueryClient();

// Get Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.error("VITE_CLERK_PUBLISHABLE_KEY is not set in environment variables");
}

// Component to set up token getter
const TokenGetterSetup = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    // Set the token getter function for API interceptor
    setTokenGetter(async () => {
      try {
        return await getToken();
      } catch (error) {
        console.error("Failed to get token:", error);
        return null;
      }
    });
  }, [getToken]);

  return null;
};

const AppContent = () => (
  <>
    <TokenGetterSetup />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            
            {/* Protected user routes */}
            <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><AlertDashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
            <Route path="/social-insights" element={<ProtectedRoute><SocialInsights /></ProtectedRoute>} />
            <Route path="/video-analysis" element={<ProtectedRoute><VideoAnalysis /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Admin routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer/>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </>
);

const App = () => (
  <ClerkProvider publishableKey={clerkPubKey}>
    <AppContent />
  </ClerkProvider>
);

export default App;
