import { Search, Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-custom-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">RI</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">RoadIntel</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search locations, incidents..."
                className="pl-10 border-border focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Navigation */}
<nav className="hidden md:flex items-center space-x-6">
  <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
    Dashboard
  </Link>
  <Link to="/reports" className="text-muted-foreground hover:text-primary transition-colors font-medium">
    Reports
  </Link>
  <Link to="/analytics" className="text-muted-foreground hover:text-primary transition-colors font-medium">
    Analytics
  </Link>
  <Link to="/alerts" className="text-muted-foreground hover:text-primary transition-colors font-medium">
    Alerts
  </Link>
  {/* New Social Insights Button */}
  <Link
    to="/social-insights"
    className="text-muted-foreground hover:text-primary transition-colors font-medium"
  >
    Social Insights
  </Link>
</nav>


          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full"></span>
            </Button>
            
            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-primary hover:opacity-90">
                <Link to="/register">Register</Link>
              </Button>

            </div>
            
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};