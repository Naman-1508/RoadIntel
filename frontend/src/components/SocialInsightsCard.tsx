import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Twitter, Instagram, Facebook, TrendingUp, AlertTriangle, AlertCircle } from "lucide-react";

export interface SocialInsight {
  id: string;
  platform: "twitter" | "instagram" | "facebook";
  author: string;
  authorHandle: string;
  content: string;
  timestamp: string;
  severity: "low" | "moderate" | "high" | "critical";
  location?: string;
}

interface SocialInsightCardProps {
  insight: SocialInsight;
}

export const SocialInsightCard = ({ insight }: SocialInsightCardProps) => {
  const getPlatformConfig = (platform: string) => {
    switch (platform) {
      case "twitter":
        return {
          icon: Twitter,
          color: "text-[#1DA1F2]",
          bg: "bg-[#1DA1F2]/10",
          name: "Twitter"
        };
      case "instagram":
        return {
          icon: Instagram,
          color: "text-[#E4405F]",
          bg: "bg-[#E4405F]/10",
          name: "Instagram"
        };
      case "facebook":
        return {
          icon: Facebook,
          color: "text-[#1877F2]",
          bg: "bg-[#1877F2]/10",
          name: "Facebook"
        };
      default:
        return {
          icon: TrendingUp,
          color: "text-primary",
          bg: "bg-primary/10",
          name: "Social"
        };
    }
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          icon: AlertTriangle,
          variant: "default" as const,
          className: "bg-danger text-danger-foreground",
          label: "Critical"
        };
      case "high":
        return {
          icon: AlertCircle,
          variant: "default" as const,
          className: "bg-warning text-warning-foreground",
          label: "High"
        };
      case "moderate":
        return {
          icon: AlertCircle,
          variant: "secondary" as const,
          className: "bg-primary/20 text-primary",
          label: "Moderate"
        };
      case "low":
        return {
          icon: TrendingUp,
          variant: "outline" as const,
          className: "text-success border-success",
          label: "Low"
        };
      default:
        return {
          icon: AlertCircle,
          variant: "secondary" as const,
          className: "bg-muted text-muted-foreground",
          label: "Unknown"
        };
    }
  };

  const platformConfig = getPlatformConfig(insight.platform);
  const severityConfig = getSeverityConfig(insight.severity);
  const PlatformIcon = platformConfig.icon;
  const SeverityIcon = severityConfig.icon;

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${platformConfig.bg}`}>
              <PlatformIcon className={`h-4 w-4 ${platformConfig.color}`} />
            </div>
            <div>
              <p className="font-semibold text-sm">{insight.author}</p>
              <p className="text-xs text-muted-foreground">@{insight.authorHandle}</p>
            </div>
          </div>
          <Badge className={severityConfig.className}>
            <SeverityIcon className="h-3 w-3 mr-1" />
            {severityConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground leading-relaxed">{insight.content}</p>
        
        <div className="flex items-center justify-between pt-2">
          {insight.location && (
            <p className="text-xs text-muted-foreground">📍 {insight.location}</p>
          )}
          <span className="text-xs text-muted-foreground ml-auto">{insight.timestamp}</span>
        </div>
      </CardContent>
    </Card>
  );
};