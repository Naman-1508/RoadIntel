import { AlertTriangle, Car, Construction, MapPin, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AccidentReportForm } from "./AccidentReportForm";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TrafficReportForm} from "./TrafficReportForm"
import { ConstructionReportForm } from "./ConstructionReportForm";
import { RoadHazardReportForm } from "./RoadHazardReportForm";

export const ReportingSection = () => {
  const [isAccidentDialogOpen, setIsAccidentDialogOpen] = useState(false);
  const [isTrafficDialogOpen, setIsTrafficDialogOpen] = useState(false);
  const [isConstructionDialogOpen, setIsConstructionDialogOpen] = useState(false);
  const [isHazardDialogOpen, setIsHazardDialogOpen] = useState(false);
  const { toast } = useToast();
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

  const handleReportClick = (reportType: string) => {
    if (reportType === "accident") {
      setIsAccidentDialogOpen(true);
    } else if(reportType === "traffic"){
      setIsTrafficDialogOpen(true);
    } else if(reportType === "construction"){
      setIsConstructionDialogOpen(true);
    } else if(reportType === "hazard"){
      setIsHazardDialogOpen(true);
    } else {
      toast({
        title: "Coming Soon",
        description: `${reportType} reporting will be available soon!`,
      });
    }
  };

  const handleAccidentSubmit = (data: any) => {
    console.log("Accident report submitted:", data);
    toast({
      title: "Report Submitted",
      description: "Your accident report has been submitted successfully.",
    });
    setIsAccidentDialogOpen(false);
  };

  const handleTrafficSubmit = (data: any) =>{
    console.log("Traffic report submitted:",data);
    toast({
      title: "Report Submitted",
      description: "Your traffic report has been submitted successfully.",
    });
    setIsTrafficDialogOpen(false);
  };

  const handleConstructionSubmit = (data: any) =>{
    console.log("Cosntruction report submitted:",data);
    toast({
      title: "Report Submitted",
      description: "Your construction report has been submitted successfully.",
    });
    setIsConstructionDialogOpen(false);
  };

  const handleHazardSubmit = (data: any) =>{
    console.log("Hazard report submitted:",data);
    toast({
      title: "Report Submitted",
      description: "Your hazard report has been submitted successfully.",
    });
    setIsHazardDialogOpen(false);
  };


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
              onClick={() => handleReportClick(report.id)}
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start p-0 h-auto font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReportClick(report.id);
                    }}
                  >
                    Report {report.title} →
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isAccidentDialogOpen} onOpenChange={setIsAccidentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Traffic Accident</DialogTitle>
          </DialogHeader>
          <AccidentReportForm 
            onSubmit={handleAccidentSubmit}
            onCancel={() => setIsAccidentDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isTrafficDialogOpen} onOpenChange={setIsTrafficDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Heavy Traffic</DialogTitle>
          </DialogHeader>
          <TrafficReportForm
          onSubmit={handleTrafficSubmit}
          onCancel={()=> setIsTrafficDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isConstructionDialogOpen} onOpenChange={setIsConstructionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Road Work (Cosntruction or Maintenance)</DialogTitle>
          </DialogHeader>
          <ConstructionReportForm
          onSubmit={handleConstructionSubmit}
          onCancel={()=> setIsConstructionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isHazardDialogOpen} onOpenChange={setIsHazardDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Hazard</DialogTitle>
          </DialogHeader>
          <RoadHazardReportForm
          onSubmit={handleHazardSubmit}
          onCancel={()=> setIsHazardDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};