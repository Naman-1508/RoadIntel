import { MapPin, Clock, User, AlertCircle, CheckCircle, AlertTriangle, ThumbsUp, ThumbsDown, MessageCircle, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Alert {
  id: string;
  title: string;
  description: string;
  location: string;
  severity: "high" | "medium" | "low";
  status: "active" | "pending" | "resolved";
  timestamp: string;
  reporter: string;
  upvotes?: number;
  downvotes?: number;
  comments?: number;
  hasPhotos?: boolean;
}

interface AlertCardProps {
  alert: Alert;
}

export const AlertCard = ({ alert }: AlertCardProps) => {
  const [upvotes, setUpvotes] = useState(alert.upvotes || 0);
  const [downvotes, setDownvotes] = useState(alert.downvotes || 0);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleUpvote = () => {
    if (userVote === 'up') {
      setUpvotes(upvotes - 1);
      setUserVote(null);
    } else {
      setUpvotes(upvotes + 1);
      if (userVote === 'down') setDownvotes(downvotes - 1);
      setUserVote('up');
    }
  };

  const handleDownvote = () => {
    if (userVote === 'down') {
      setDownvotes(downvotes - 1);
      setUserVote(null);
    } else {
      setDownvotes(downvotes + 1);
      if (userVote === 'up') setUpvotes(upvotes - 1);
      setUserVote('down');
    }
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "high":
        return { color: "danger", icon: AlertCircle, bgColor: "bg-danger/10" };
      case "medium":
        return { color: "warning", icon: AlertTriangle, bgColor: "bg-warning/10" };
      case "low":
        return { color: "success", icon: CheckCircle, bgColor: "bg-success/10" };
      default:
        return { color: "muted", icon: AlertCircle, bgColor: "bg-muted/10" };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { variant: "destructive" as const, label: "Active" };
      case "pending":
        return { variant: "secondary" as const, label: "Pending" };
      case "resolved":
        return { variant: "default" as const, label: "Resolved" };
      default:
        return { variant: "secondary" as const, label: status };
    }
  };

  const severityConfig = getSeverityConfig(alert.severity);
  const statusConfig = getStatusConfig(alert.status);
  const SeverityIcon = severityConfig.icon;

  return (
    <Card className="shadow-card hover:shadow-primary/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className={cn("p-2 rounded-lg", severityConfig.bgColor)}>
              <SeverityIcon className={`h-5 w-5 text-${severityConfig.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-foreground">{alert.title}</h3>
                <Badge variant={statusConfig.variant} className="text-xs">
                  {statusConfig.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {alert.description}
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{alert.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{alert.timestamp}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{alert.reporter}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Engagement Section */}
        <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
          <div className="flex items-center space-x-4">
            {/* Voting */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 gap-1",
                  userVote === 'up' && "text-success bg-success-light"
                )}
                onClick={handleUpvote}
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="text-xs font-medium">{upvotes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 gap-1",
                  userVote === 'down' && "text-danger bg-danger-light"
                )}
                onClick={handleDownvote}
              >
                <ThumbsDown className="h-4 w-4" />
                <span className="text-xs font-medium">{downvotes}</span>
              </Button>
            </div>

            {/* Comments */}
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs font-medium">{alert.comments || 0}</span>
            </Button>

            {/* Photo indicator */}
            {alert.hasPhotos && (
              <Badge variant="outline" className="text-xs gap-1">
                <Camera className="h-3 w-3" />
                Photos
              </Badge>
            )}
          </div>

          <div className="flex space-x-2">
            {alert.status === "active" && (
              <>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="default" size="sm">
                  Respond
                </Button>
              </>
            )}
            {alert.status === "pending" && (
              <>
                <Button variant="outline" size="sm">
                  Review
                </Button>
                <Button variant="default" size="sm">
                  Approve
                </Button>
              </>
            )}
            {alert.status === "resolved" && (
              <Button variant="outline" size="sm">
                View Report
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};