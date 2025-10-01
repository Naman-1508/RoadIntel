import { SocialInsightCard, SocialInsight } from "@/components/SocialInsightsCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const mockSocialInsights: SocialInsight[] = [
  {
    id: "1",
    platform: "twitter",
    author: "Traffic Alert NYC",
    authorHandle: "trafficnyc",
    content:
      "Major accident on I-95 North near Exit 16. Multiple lanes blocked. Emergency services on scene. Expect significant delays. #NYCTraffic",
    timestamp: "2 min ago",
    severity: "critical",
    location: "I-95 North, Exit 16",
  },
  {
    id: "2",
    platform: "instagram",
    author: "Sarah Johnson",
    authorHandle: "sarahjnyc",
    content:
      "Traffic is absolutely crazy on the Brooklyn Bridge right now. Been stuck here for 30 minutes. Does anyone know what's going on?",
    timestamp: "15 min ago",
    severity: "high",
    location: "Brooklyn Bridge",
  },
  {
    id: "3",
    platform: "facebook",
    author: "Mike Chen",
    authorHandle: "mikechen",
    content:
      "FYI - There's a stalled vehicle in the left lane on FDR Drive southbound. Traffic is backing up but moving slowly.",
    timestamp: "25 min ago",
    severity: "moderate",
    location: "FDR Drive Southbound",
  },
  {
    id: "4",
    platform: "twitter",
    author: "NYC Transit Updates",
    authorHandle: "nyctransit",
    content:
      "Construction on 5th Avenue is causing minor delays. Right lane closed between 42nd and 45th. Plan accordingly.",
    timestamp: "1 hour ago",
    severity: "low",
    location: "5th Avenue, Midtown",
  },
  {
    id: "5",
    platform: "instagram",
    author: "David Park",
    authorHandle: "davidp_nyc",
    content:
      "Massive backup on the Queens Midtown Tunnel. Something serious must have happened. Avoid if you can! 🚗🚦",
    timestamp: "5 min ago",
    severity: "critical",
    location: "Queens Midtown Tunnel",
  },
  {
    id: "6",
    platform: "facebook",
    author: "Lisa Martinez",
    authorHandle: "lisamartinez",
    content:
      "Traffic moving smoothly on West Side Highway this morning. Finally a good commute day!",
    timestamp: "45 min ago",
    severity: "low",
    location: "West Side Highway",
  },
  {
    id: "7",
    platform: "twitter",
    author: "Emergency NYC",
    authorHandle: "emergencynyc",
    content:
      "Emergency vehicles responding to incident on Manhattan Bridge. Please give way to emergency services. Traffic being diverted.",
    timestamp: "10 min ago",
    severity: "high",
    location: "Manhattan Bridge",
  },
  {
    id: "8",
    platform: "instagram",
    author: "Alex Rivera",
    authorHandle: "alexr_commuter",
    content:
      "Spotted some construction crews on the BQE near the Kosciuszko Bridge. Looks like they're setting up for roadwork.",
    timestamp: "30 min ago",
    severity: "moderate",
    location: "BQE, Kosciuszko Bridge",
  },
];

const SocialInsights = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Social Insights
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time traffic updates from social media platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSocialInsights.map((insight) => (
            <SocialInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SocialInsights;
