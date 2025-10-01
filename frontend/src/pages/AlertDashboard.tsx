import { ArrowLeft, Bell, Search, Filter, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCard } from "@/components/AlertCard";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const AlertDashboard = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const alerts = [
    {
      id: "1",
      title: "Major Traffic Accident",
      description: "Multi-vehicle collision on Highway 101 Northbound",
      location: "Highway 101 NB, Mile 42",
      severity: "high" as const,
      status: "active" as const,
      timestamp: "2 minutes ago",
      reporter: "Traffic Control Center",
      upvotes: 24,
      downvotes: 2,
      comments: 8,
      hasPhotos: true,
    },
    {
      id: "2", 
      title: "Road Construction Alert",
      description: "Lane closure scheduled for maintenance work",
      location: "Main St, Downtown",
      severity: "medium" as const,
      status: "pending" as const,
      timestamp: "15 minutes ago",
      reporter: "City Works Department",
      upvotes: 15,
      downvotes: 1,
      comments: 3,
      hasPhotos: false,
    },
    {
      id: "3",
      title: "Weather Advisory",
      description: "Heavy rain affecting visibility and road conditions",
      location: "Multiple locations",
      severity: "medium" as const,
      status: "active" as const,
      timestamp: "1 hour ago",
      reporter: "Weather Service",
      upvotes: 31,
      downvotes: 3,
      comments: 15,
      hasPhotos: true,
    },
    {
      id: "4",
      title: "Vehicle Breakdown",
      description: "Disabled vehicle blocking right lane",
      location: "I-95 Southbound, Exit 23",
      severity: "low" as const,
      status: "resolved" as const,
      timestamp: "3 hours ago",
      reporter: "Automated System",
      upvotes: 42,
      downvotes: 0,
      comments: 12,
      hasPhotos: true,
    },
  ];

  const alertStats = [
    { label: "Active Alerts", value: 8, color: "danger", icon: AlertCircle },
    { label: "Pending Review", value: 5, color: "warning", icon: Clock },
    { label: "Resolved Today", value: 23, color: "success", icon: CheckCircle },
  ];

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || alert.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
        <Header />     
      {/* Page Heading */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <h1 className="text-2xl font-semibold text-foreground flex items-center space-x-2">
    <Bell className="h-6 w-6" />
    <span>Alert Dashboard</span>
  </h1>
  <p className="text-sm text-muted-foreground mt-1">
    Monitor and manage traffic alerts
  </p>
</div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {alertStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 text-${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts by title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                {["all", "active", "pending", "resolved"].map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(status)}
                    className="capitalize"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
          
          {filteredAlerts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No alerts found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AlertDashboard;