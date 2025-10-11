import { AlertTriangle, Clock, MapPin, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ActiveAlerts = () => {
  const alerts = [
    {
      id: 1,
      title: "Multi-Vehicle Accident",
      location: "Interstate 95, Mile Marker 42",
      severity: "critical",
      status: "active",
      duration: "45 min",
      description: "3-car collision blocking northbound lanes",
      estimatedClearance: "2 hours"
    },
    {
      id: 2,
      title: "Road Construction",
      location: "Highway 101, Exit 15-18",
      severity: "moderate",
      status: "ongoing",
      duration: "3 days", 
      description: "Lane closures for bridge maintenance",
      estimatedClearance: "5 days"
    },
    {
      id: 3,
      title: "Weather Alert",
      location: "Downtown District",
      severity: "low",
      status: "watch",
      duration: "1 hour",
      description: "Heavy rain affecting visibility",
      estimatedClearance: "3 hours"
    },
    {
      id: 4,
      title: "Special Event",
      location: "City Center & Surrounding Areas",
      severity: "moderate",
      status: "scheduled",
      duration: "6 hours",
      description: "Marathon event causing road closures",
      estimatedClearance: "8 hours"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-danger text-danger-foreground";
      case "moderate":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-danger";
      case "ongoing":
        return "text-warning-foreground";
      case "scheduled":
        return "text-primary";
      case "watch":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

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
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => (
                <tr
                  key={alert.id}
                  className={`hover:bg-muted/30 transition-colors ${
                    index !== alerts.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">{alert.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{alert.description}</div>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className={`text-xs font-medium ${getStatusColor(alert.status)}`}>
                          {alert.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{alert.location}</span>
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
                        <span>{alert.duration}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ETC: {alert.estimatedClearance}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};