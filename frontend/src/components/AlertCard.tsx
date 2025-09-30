import { MapPin, Clock, User, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  title: string;
  description: string;
  location: string;
  severity: "high" | "medium" | "low";
  status: "active" | "pending" | "resolved";
  timestamp: string;
  reporter: string;
}

interface AlertCardProps {
  alert: Alert;
}

export const AlertCard = ({ alert }: AlertCardProps) => {
  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "high":
        return { color: "danger", icon: AlertCircle, bgColor: "bg-danger/10" };
      case "medium":
        return { color: "warning", icon: AlertTriangle, bgColor: "bg-warning/10" };
      case "low":
        return { color: "success", icon: CheckCircle, bgColor: "bg-success/10" };
      default:
        return { color: "muted", icon: AlertCircle, bgColor: "bg-muted/10" };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { variant: "destructive" as const, label: "Active" };
      case "pending":
        return { variant: "secondary" as const, label: "Pending" };
      case "resolved":
        return { variant: "default" as const, label: "Resolved" };
      default:
        return { variant: "secondary" as const, label: status };
    }
  };

  const severityConfig = getSeverityConfig(alert.severity);
  const statusConfig = getStatusConfig(alert.status);
  const SeverityIcon = severityConfig.icon;

  return (
    <Card className="shadow-card hover:shadow-primary/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className={cn("p-2 rounded-lg", severityConfig.bgColor)}>
              <SeverityIcon className={`h-5 w-5 text-${severityConfig.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-foreground">{alert.title}</h3>
                <Badge variant={statusConfig.variant} className="text-xs">
                  {statusConfig.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {alert.description}
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{alert.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{alert.timestamp}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{alert.reporter}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={cn("text-xs", `text-${severityConfig.color} border-${severityConfig.color}/30`)}
          >
            {alert.severity.toUpperCase()} PRIORITY
          </Badge>
          
          <div className="flex space-x-2">
            {alert.status === "active" && (
              <>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="default" size="sm">
                  Respond
                </Button>
              </>
            )}
            {alert.status === "pending" && (
              <>
                <Button variant="outline" size="sm">
                  Review
                </Button>
                <Button variant="default" size="sm">
                  Approve
                </Button>
              </>
            )}
            {alert.status === "resolved" && (
              <Button variant="outline" size="sm">
                View Report
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};