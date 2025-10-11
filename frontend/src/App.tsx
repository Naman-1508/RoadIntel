import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import AlertDashboard from "./pages/AlertDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import SocialInsights from "./pages/SocialInsights";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
import VerifyOtp from "./pages/VerifyOtp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute> } />
          <Route path="/alerts" element={<ProtectedRoute><AlertDashboard /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
          <Route path="/social-insights" element={<ProtectedRoute><SocialInsights /></ProtectedRoute>} />
           <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
           <Route path ="/verify-otp" element={<VerifyOtp/>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
