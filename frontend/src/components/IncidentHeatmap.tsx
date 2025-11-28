import { LeafletMap } from "@/components/LeafletMap";
import { useEffect, useState } from "react";
import API from "@/utility/api";

interface Incident {
  id: string;
  lat: number;
  lng: number;
  severity: "high" | "medium" | "low";
}

export const IncidentHeatmap = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await API.get("/reports");
        const mappedIncidents = response.data
          .filter((report: any) => report.latitude != null && report.longitude != null)
          .map((report: any) => ({
            id: report._id,
            lat: report.latitude,
            lng: report.longitude,
            severity: report.severity || "medium",
          }));
        setIncidents(mappedIncidents);
      } catch (error) {
        console.error("Failed to fetch incidents for heatmap:", error);
      }
    };

    fetchIncidents();
  }, []);

  return (
    <div className="relative bg-muted/20 rounded-lg p-0 h-80 overflow-hidden">
      <LeafletMap incidents={incidents} heatmap={true} />
    </div>
  );
};