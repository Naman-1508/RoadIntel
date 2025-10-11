
import { ArrowLeft, TrendingUp, Users, AlertTriangle, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import { TrafficChart } from "@/components/TrafficChart";
import { IncidentHeatmap } from "@/components/IncidentHeatmap";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const AnalyticsDashboard = () => {
  const trafficMetrics = [
    {
      title: "Active Incidents",
      value: "23",
      change: "+12%",
      trend: "up" as const,
      icon: AlertTriangle,
      color: "danger" as const,
    },
    {
      title: "Traffic Flow",
      value: "85%",
      change: "+5%",
      trend: "up" as const,
      icon: Car,
      color: "success" as const,
    },
    {
      title: "Response Time",
      value: "4.2min",
      change: "-15%",
      trend: "down" as const,
      icon: TrendingUp,
      color: "primary" as const,
    },
    {
      title: "Reports Filed",
      value: "156",
      change: "+28%",
      trend: "up" as const,
      icon: Users,
      color: "warning" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Page Heading */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <h1 className="text-2xl font-semibold text-foreground flex items-center space-x-2">
    <span>Ananlytics Dashboard</span>
  </h1>
  <p className="text-sm text-muted-foreground mt-1">
    Real-time traffic and incident analytics
  </p>
</div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {trafficMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Traffic Flow Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Traffic Flow Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TrafficChart />
            </CardContent>
          </Card>

          {/* Incident Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-danger" />
                <span>Incident Types</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "Vehicle Breakdown", count: 45, color: "warning" },
                  { type: "Traffic Accident", count: 23, color: "danger" },
                  { type: "Road Construction", count: 12, color: "muted" },
                  { type: "Weather Related", count: 8, color: "primary" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full bg-${item.color}`}
                      />
                      <span className="text-sm font-medium">{item.type}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Heat Map */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Heat Map</CardTitle>
          </CardHeader>
          <CardContent>
            <IncidentHeatmap />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AnalyticsDashboard;