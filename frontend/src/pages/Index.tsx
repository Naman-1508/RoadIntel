import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Header } from "@/components/Header";
import { MapSection } from "@/components/MapSection";
import { ReportingSection } from "@/components/ReportingSection";
import { LiveUpdates } from "@/components/LiveUpdates";
import { ActiveAlerts } from "@/components/ActiveAlerts";
import { Footer } from "@/components/Footer";
import API from "@/utility/api";

const Index = () => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (!isLoaded) return;

      if (isSignedIn && user) {
        try {
          // Get Clerk session token
          const token = await getToken();
          
          // Sync user with backend
          const response = await API.post("/auth/sync", {
            clerkId: user.id
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data.user) {
            const userRole = response.data.user.role;
            localStorage.setItem("user", JSON.stringify(response.data.user));
            
            // Redirect based on role
            if (userRole === "admin") {
              navigate("/admin/dashboard");
            } else {
              navigate("/user/dashboard");
            }
          }
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      }
    };

    checkUserAndRedirect();
  }, [isLoaded, isSignedIn, user, navigate, getToken]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Map Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              RoadIntel Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Real-time traffic monitoring and incident reporting for safer travel
            </p>
          </div>
          <MapSection />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Reporting */}
          <div className="lg:col-span-1">
            <ReportingSection />
          </div>
          
          {/* Right Column - Updates and Alerts */}
          <div className="lg:col-span-2 space-y-8">
            <LiveUpdates />
            <ActiveAlerts />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;