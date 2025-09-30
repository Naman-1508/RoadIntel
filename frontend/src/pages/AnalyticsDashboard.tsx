
import { ArrowLeft, TrendingUp, Users, AlertTriangle, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MetricCard } from "@/components/MetricCard";
import { TrafficChart } from "@/components/TrafficChart";
import { IncidentHeatmap } from "@/components/IncidentHeatmap";

const AnalyticsDashboard = () => {
  const navigate = useNavigate();

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
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Real-time traffic and incident analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

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
    </div>
  );
};

export default AnalyticsDashboard;