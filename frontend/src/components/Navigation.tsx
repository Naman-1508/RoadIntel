import { User, BarChart3, Bell, MessageSquare, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNavigate, useLocation } from "react-router-dom";

export const Navigation = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BarChart3, label: "Analytics Dashboard", path: "/analytics" },
    { icon: Bell, label: "Alert Dashboard", path: "/alerts" },
    { icon: MessageSquare, label: "Social Insights", path: "/social-insights" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle className="text-left text-lg font-semibold">Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  navigate(item.path);
                  onOpenChange(false); // close sidebar when clicked
                }}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
