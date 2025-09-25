import { Clock, MapPin, AlertTriangle, Car, Construction } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const LiveUpdates = () => {
  const updates = [
    {
      id: 1,
      user: "Sarah M.",
      avatar: "SM",
      type: "accident",
      severity: "high",
      location: "I-95 North, Exit 23",
      time: "2 min ago",
      message: "Multi-vehicle accident blocking two lanes. Emergency services on scene."
    },
    {
      id: 2,
      user: "Mike R.",
      avatar: "MR", 
      type: "traffic",
      severity: "medium",
      location: "Broadway & 42nd St",
      time: "5 min ago",
      message: "Heavy traffic due to street festival. Expect 15-20 min delays."
    },
    {
      id: 3,
      user: "Lisa K.",
      avatar: "LK",
      type: "construction",
      severity: "low",
      location: "Highway 101 South",
      time: "8 min ago",
      message: "Lane closure for maintenance work. Traffic moving slowly but steady."
    },
    {
      id: 4,
      user: "John D.",
      avatar: "JD",
      type: "hazard",
      severity: "medium",
      location: "Main St & Oak Ave",
      time: "12 min ago",
      message: "Large pothole reported. City crews have been notified."
    },
    {
      id: 5,
      user: "Emma T.", 
      avatar: "ET",
      type: "traffic",
      severity: "low",
      location: "Downtown District", 
      time: "15 min ago",
      message: "Traffic clearing up after earlier incident. Normal flow restored."
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "accident":
        return <AlertTriangle className="w-4 h-4 text-danger" />;
      case "traffic":
        return <Car className="w-4 h-4 text-warning-foreground" />;
      case "construction":
        return <Construction className="w-4 h-4 text-primary" />;
      default:
        return <MapPin className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-danger/20 text-danger border-danger/30">Critical</Badge>;
      case "medium":
        return <Badge className="bg-warning/20 text-warning-foreground border-warning/30">Moderate</Badge>;
      case "low":
        return <Badge className="bg-success/20 text-success border-success/30">Low</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <Card className="shadow-custom-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>Live Updates</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {updates.map((update, index) => (
            <div
              key={update.id}
              className={`p-4 transition-colors hover:bg-muted/50 cursor-pointer ${
                index !== updates.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" alt={update.user} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {update.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-foreground">{update.user}</span>
                    {getTypeIcon(update.type)}
                    {getSeverityBadge(update.severity)}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{update.location}</span>
                    <span>•</span>
                    <span>{update.time}</span>
                  </div>
                  
                  <p className="text-sm text-foreground">{update.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};