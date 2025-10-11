import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, MapPin, Clock } from "lucide-react";

export const LiveUpdates = () => {
  const [reports, setReports] = useState<any[]>([]);
  const MAX_DISPLAY = 5; // Number of reports to display
  const ACTIVE_MINUTES = 30; // Only show reports within last 30 minutes

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/reports");
        let data: any[] = await res.json();

        // Filter active reports based on ACTIVE_MINUTES
        const now = new Date().getTime();
        data = data.filter(r => {
          if (!r.timeReported) return true; // fallback
          const reportTime = new Date(r.timeReported).getTime();
          return now - reportTime <= ACTIVE_MINUTES * 60 * 1000;
        });

        // Sort newest first
        data.sort((a, b) => new Date(b.timeReported).getTime() - new Date(a.timeReported).getTime());

        // Limit display
        setReports(data.slice(0, MAX_DISPLAY));
      } catch (err) {
        console.error("Error fetching reports", err);
      }
    };

    fetchReports();
    const interval = setInterval(fetchReports, 10000); // refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-md border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Live Updates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reports.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent reports yet</p>
        ) : (
          reports.map((r) => (
            <div
              key={r._id}
              className="p-3 bg-muted/30 rounded-lg flex flex-col gap-1 border border-border hover:bg-muted/40 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm capitalize">{r.type || "Report"}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {r.timeReported ? new Date(r.timeReported).toLocaleTimeString() : "Just now"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="w-3 h-3" /> {r.location}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
