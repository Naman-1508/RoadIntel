import { MapPin } from "lucide-react";

export const IncidentHeatmap = () => {
  const incidents = [
    { id: 1, x: 25, y: 30, severity: "high" },
    { id: 2, x: 60, y: 45, severity: "medium" },
    { id: 3, x: 80, y: 20, severity: "low" },
    { id: 4, x: 40, y: 70, severity: "high" },
    { id: 5, x: 75, y: 65, severity: "medium" },
    { id: 6, x: 15, y: 80, severity: "low" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-danger";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="relative bg-muted/20 rounded-lg p-4 h-80 overflow-hidden">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 rounded-lg">
        <svg className="w-full h-full opacity-10" viewBox="0 0 100 100">
          <path d="M10,50 Q50,10 90,50" stroke="hsl(var(--border))" strokeWidth="0.5" fill="none" />
          <path d="M20,70 Q60,30 80,70" stroke="hsl(var(--border))" strokeWidth="0.5" fill="none" />
          <path d="M50,10 L50,90" stroke="hsl(var(--border))" strokeWidth="0.3" fill="none" />
          <path d="M10,30 L90,30" stroke="hsl(var(--border))" strokeWidth="0.3" fill="none" />
          <path d="M10,70 L90,70" stroke="hsl(var(--border))" strokeWidth="0.3" fill="none" />
        </svg>
      </div>

      {/* Incident Markers */}
      {incidents.map((incident) => (
        <div
          key={incident.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
          style={{
            left: `${incident.x}%`,
            top: `${incident.y}%`,
          }}
        >
          <div className="relative">
            <MapPin className={`h-6 w-6 ${getSeverityColor(incident.severity)} drop-shadow-lg`} />
            <div className={`absolute inset-0 rounded-full ${getSeverityColor(incident.severity)} opacity-20 animate-ping`} />
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
        <h4 className="text-xs font-semibold text-foreground">Severity</h4>
        <div className="space-y-1">
          {[
            { level: "High", color: "text-danger", count: 2 },
            { level: "Medium", color: "text-warning", count: 2 },
            { level: "Low", color: "text-success", count: 2 },
          ].map((item) => (
            <div key={item.level} className="flex items-center space-x-2">
              <MapPin className={`h-3 w-3 ${item.color}`} />
              <span className="text-xs text-muted-foreground">
                {item.level} ({item.count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};