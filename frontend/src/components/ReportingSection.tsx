import { AlertTriangle, Car, Construction, MapPin, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const ReportingSection = () => {
  const reportTypes = [
    {
      id: "accident",
      title: "Accident",
      icon: AlertTriangle,
      color: "danger",
      count: 8,
      description: "Vehicle collision or breakdown"
    },
    {
      id: "traffic",
      title: "Heavy Traffic",
      icon: Car,
      color: "warning", 
      count: 15,
      description: "Congestion or slow traffic"
    },
    {
      id: "construction",
      title: "Road Work",
      icon: Construction,
      color: "primary",
      count: 4,
      description: "Construction or maintenance"
    },
    {
      id: "hazard",
      title: "Road Hazard",
      icon: MapPin,
      color: "secondary",
      count: 6,
      description: "Debris, potholes, or obstacles"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "danger":
        return "text-danger hover:bg-danger/10 border-danger/20";
      case "warning":
        return "text-warning-foreground hover:bg-warning/10 border-warning/20";
      case "primary":
        return "text-primary hover:bg-primary/10 border-primary/20";
      default:
        return "text-secondary-foreground hover:bg-secondary border-border";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Quick Reports</h2>
        <Button className="gradient-primary text-primary-foreground shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card
              key={report.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-custom-lg hover:-translate-y-1 ${getColorClasses(
                report.color
              )}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      report.color === "danger" ? "bg-danger/10" :
                      report.color === "warning" ? "bg-warning/10" :
                      report.color === "primary" ? "bg-primary/10" :
                      "bg-secondary"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {report.count}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{report.description}</p>
                <div className="mt-3">
                  <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto font-medium">
                    Report {report.title} →
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};