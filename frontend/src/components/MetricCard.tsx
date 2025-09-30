import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: "primary" | "success" | "warning" | "danger";
}

export const MetricCard = ({ title, value, change, trend, icon: Icon, color }: MetricCardProps) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10", 
    warning: "text-warning bg-warning/10",
    danger: "text-danger bg-danger/10",
  };

  const trendColor = trend === "up" ? "text-success" : "text-danger";
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;

  return (
    <Card className="shadow-card hover:shadow-primary/20 transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <div className="flex items-center space-x-1">
              <TrendIcon className={cn("h-4 w-4", trendColor)} />
              <span className={cn("text-sm font-medium", trendColor)}>{change}</span>
            </div>
          </div>
          <div className={cn("p-3 rounded-lg", colorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};