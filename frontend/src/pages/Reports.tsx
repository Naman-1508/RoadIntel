import { Header } from "@/components/Header";
import { ReportingSection } from "@/components/ReportingSection";
import { LiveUpdates } from "@/components/LiveUpdates";
import { Footer } from "@/components/Footer";

const Reports = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Reports Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Submit and track traffic incidents and road reports
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Reporting Section */}
          <div className="lg:col-span-2">
            <ReportingSection />
          </div>
          
          {/* Right Column - Updates */}
          <div className="lg:col-span-1">
            <LiveUpdates />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;