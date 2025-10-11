import { MapPin, AlertTriangle, Car, Construction } from "lucide-react";
import { Card } from "@/components/ui/card";
import dashboardHero from "@/assets/dashboard-hero.jpg";

export const MapSection = () => {
  const incidents = [
    { id: 1, type: "accident", severity: "high", lat: 40.7589, lng: -73.9851, title: "Multi-car accident" },
    { id: 2, type: "construction", severity: "medium", lat: 40.7505, lng: -73.9934, title: "Road work" },
    { id: 3, type: "traffic", severity: "low", lat: 40.7614, lng: -73.9776, title: "Heavy traffic" },
  ];

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "accident":
        return <AlertTriangle className="w-4 h-4" />;
      case "construction":
        return <Construction className="w-4 h-4" />;
      case "traffic":
        return <Car className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-danger bg-danger/10 border-danger/30";
      case "medium":
        return "text-warning-foreground bg-warning/10 border-warning/30";
      case "low":
        return "text-success bg-success/10 border-success/30";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <Card className="h-96 relative overflow-hidden shadow-custom-md interactive-card">
      {/* Map Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${dashboardHero})` }}
      >
        <div className="absolute inset-0 bg-primary/10"></div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="p-3 bg-card/95 backdrop-blur-sm shadow-custom-md">
          <h3 className="font-semibold text-card-foreground mb-2">Traffic Map</h3>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-muted-foreground">Clear</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="text-muted-foreground">Caution</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-danger"></div>
              <span className="text-muted-foreground">Danger</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Incident Markers */}
      <div className="absolute inset-0 z-10">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getSeverityColor(
              incident.severity
            )} border rounded-full p-2 shadow-custom-md cursor-pointer hover:scale-110 transition-transform`}
            style={{
              left: `${30 + incident.id * 15}%`,
              top: `${40 + incident.id * 10}%`,
            }}
          >
            {getIncidentIcon(incident.type)}
          </div>
        ))}
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="p-3 bg-card/95 backdrop-blur-sm shadow-custom-md">
          <div className="text-right">
            <div className="text-2xl font-bold text-card-foreground">24</div>
            <div className="text-sm text-muted-foreground">Active incidents</div>
          </div>
        </Card>
      </div>
    </Card>
  );
};