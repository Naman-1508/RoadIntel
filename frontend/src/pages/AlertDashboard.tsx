import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Bell, Search, Filter, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCard } from "@/components/AlertCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const AlertDashboard = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/reports");
      setAlerts(res.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  // Initial fetch + auto-refresh every 10 seconds
  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 10000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats dynamically
  const activeCount = alerts.filter(a => a.status === "active").length;
  const pendingCount = alerts.filter(a => a.status === "pending").length;
  const resolvedCount = alerts.filter(a => a.status === "resolved").length;

  const alertStats = [
    { label: "Active Alerts", value: activeCount, color: "danger", icon: AlertCircle },
    { label: "Pending Review", value: pendingCount, color: "warning", icon: Clock },
    { label: "Resolved Today", value: resolvedCount, color: "success", icon: CheckCircle },
  ];

  // Filter alerts based on search and status
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || alert.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
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
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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
  <AlertCard key={alert._id} alert={alert} />
))}


          {filteredAlerts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No alerts found</h3>
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
