import { SocialInsightCard, SocialInsight } from "@/components/SocialInsightsCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState,useEffect } from "react";



const SocialInsights = () => {
  const [ insights, setInsights ] = useState<SocialInsight[]>([]);
  const [ loading, setLoading ] = useState(true);

  useEffect (()=>{
    const fetchInsights = async ()=>{
      try{
        const res = await fetch("http://localhost:3000/api/social-insights");
        const data = await res.json();
        setInsights(data);
      } catch(err){
        console.error("Failed to fetch insights",err);
      } finally{
        setLoading(false);
      }
    };
    fetchInsights();
  },[]);
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

        {loading ? (
          <p>Loading Insights...</p>

        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((insight)=>(
              <SocialInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SocialInsights;
