import { AlertTriangle, Clock, MapPin, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import API from "@/utility/api";
import { formatDistanceToNow } from "date-fns";

interface Report {
  _id: string;
  type: string;
  location: string;
  description: string;
  severity: string;
  status?: string;
  createdAt: string;
  latitude: number;
  longitude: number;
}

export const ActiveAlerts = () => {
  const [alerts, setAlerts] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await API.get("/reports");
        setAlerts(response.data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
      case "high":
        return "bg-danger text-danger-foreground";
      case "moderate":
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusColor = (status: string = "active") => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-danger";
      case "ongoing":
        return "text-warning-foreground";
      case "scheduled":
        return "text-primary";
      case "watch":
        return "text-success";
      case "resolved":
        return "text-muted-foreground";
      default:
        return "text-primary";
    }
  };

  const getTimeAgo = (createdAt: string) => {
    if (!createdAt) return "Recently";
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return "Recently";
    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  if (loading) {
    return (
      <Card className="shadow-custom-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <span>Active Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading alerts...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-custom-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          <span>Active Alerts</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Alert</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Location</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Severity</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Time Active</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No active alerts found.
                  </td>
                </tr>
              ) : (
                alerts.map((alert, index) => (
                  <tr
                    key={alert._id}
                    className={`hover:bg-muted/30 transition-colors ${
                      index !== alerts.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-foreground capitalize">{alert.type} Report</div>
                        <div className="text-sm text-muted-foreground mt-1 line-clamp-1">{alert.description}</div>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className={`text-xs font-medium ${getStatusColor(alert.status)}`}>
                            {(alert.status || "Active").toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground line-clamp-1">{alert.location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="flex items-center space-x-2 text-foreground">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{getTimeAgo(alert.createdAt)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};