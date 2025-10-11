import { Search, Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { translateText } from "@/services/translateServices";
import { Navigation } from "@/components/Navigation";
export const Header : React.FC = () => {
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [navOpen, setNavOpen] = useState(false);


  const [headerTitle, setHeaderTitle] = useState("RoadIntel");
  const [navLabels,setNavLabels] = useState({
    dashboard: "Dashboard",
    reports: "Reports",
    analytics: "Analytics",
    alerts: "Alerts",
    social: "Social Insights",
  })

  const languages = ["EN","HI","GU","KN","MR"];

  const handleLanguageChange = async (lang : string) =>{
    setLanguage(lang);
    setLangOpen(false);

    const langMap : Record<string,string> = {
      EN : "en-IN",
      HI : "hi-IN",
      GU : "gu-IN",
      KN: "kn-IN",
      MR: "mr-IN",
    };
    const targetLang = langMap[lang];

    const translateHeader = await translateText("RoadIntel",targetLang);
    setHeaderTitle(translateHeader);
    const translatedNav = await Promise.all(
  ["Dashboard","Reports","Analytics","Alerts","Social Insights"].map(label =>
    translateText(label, targetLang)
  )
);

setNavLabels({
  dashboard: translatedNav[0],
  reports: translatedNav[1],
  analytics: translatedNav[2],
  alerts: translatedNav[3],
  social: translatedNav[4],
});

  }

  return (
    <>
    <header className="bg-card border-b border-border shadow-custom-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
         <div className="flex items-center space-x-4">
          <Button
          variant="ghost"
          size="sm"
          className="p-2"
          onClick={()=> setNavOpen(true)
          }
          >
          <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">RI</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">{headerTitle}</h1>
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
    {navLabels.dashboard}
  </Link>
  <Link to="/reports" className="text-muted-foreground hover:text-primary transition-colors font-medium">
    {navLabels.reports}
  </Link>
  <Link to="/analytics" className="text-muted-foreground hover:text-primary transition-colors font-medium">
    {navLabels.analytics}
  </Link>
  <Link to="/alerts" className="text-muted-foreground hover:text-primary transition-colors font-medium">
    {navLabels.alerts}
  </Link>
  <Link to="/social-insights" className="text-muted-foreground hover:text-primary transition-colors font-medium">
    {navLabels.social}
  </Link>
</nav>


          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full"></span>
            </Button>

          {/*Language Selector */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
                onClick={()=> setLangOpen(!langOpen)}
                >
                  <span>{language}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
                {langOpen && (
                  <div className="absolute right-0 mt-2 w-24 bg-card border border-border rounded shadow-md z-50">
                    {languages.map((lang)=>(
                      <button
                      key={lang}
                      className="block w-full text-left px-3 py-1 hover:bg-muted-foreground hover:text-foreground"
                      onClick={()=> handleLanguageChange(lang)}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
            </div>
            
            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className=" hover:opacity-90">
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
    <Navigation open={navOpen} onOpenChange={setNavOpen} />
</>
  );
};