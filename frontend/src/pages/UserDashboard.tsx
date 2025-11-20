import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapSection } from "@/components/MapSection";
import { ReportingSection } from "@/components/ReportingSection";
import { LiveUpdates } from "@/components/LiveUpdates";
import { ActiveAlerts } from "@/components/ActiveAlerts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import API from "@/utility/api";

const UserDashboard = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/");
    }
  }, [isLoaded, isSignedIn, navigate]);

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress || "User"}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your personal dashboard for reporting and monitoring road incidents
          </p>
        </div>

        {/* Hero Map Section */}
        <section className="mb-12">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>My Reports</CardTitle>
              <CardDescription>View and manage your submitted reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/reports">View Reports</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Track trends and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a href="/analytics">View Analytics</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a href="/profile">Edit Profile</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  );
};

export default UserDashboard;

