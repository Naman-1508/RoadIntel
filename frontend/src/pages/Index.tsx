import { Header } from "@/components/Header";
import { MapSection } from "@/components/MapSection";
import { ReportingSection } from "@/components/ReportingSection";
import { LiveUpdates } from "@/components/LiveUpdates";
import { ActiveAlerts } from "@/components/ActiveAlerts";
import { Footer } from "@/components/Footer";

const Index = () => {
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