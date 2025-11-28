import { Card } from "@/components/ui/card";
import { LeafletMap } from "@/components/LeafletMap";
import { useEffect, useState } from "react";
import API from "@/utility/api";

interface Incident {
  id: string;
  type: string;
  severity: "high" | "medium" | "low";
  lat: number;
  lng: number;
  title: string;
}

export const MapSection = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await API.get("/reports");
        const mappedIncidents = response.data
          .filter((report: any) => report.latitude != null && report.longitude != null)
          .map((report: any) => ({
            id: report._id,
            type: report.type || "accident",
            severity: report.severity || "medium",
            lat: report.latitude,
            lng: report.longitude,
            title: report.description || `${report.type} Report`,
          }));
        setIncidents(mappedIncidents);
      } catch (error) {
        console.error("Failed to fetch incidents for map:", error);
      }
    };

    fetchIncidents();
  }, []);

  return (
    <Card className="h-96 relative overflow-hidden shadow-custom-md interactive-card">
      <LeafletMap incidents={incidents} />
      
      <div className="absolute top-4 left-14 z-[1000]">
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

      <div className="absolute bottom-4 right-4 z-[1000]">
        <Card className="p-3 bg-card/95 backdrop-blur-sm shadow-custom-md">
          <div className="text-right">
            <div className="text-2xl font-bold text-card-foreground">{incidents.length}</div>
            <div className="text-sm text-muted-foreground">Active incidents</div>
          </div>
        </Card>
      </div>
    </Card>
  );
};