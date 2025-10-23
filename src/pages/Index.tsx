import { useState } from "react";
import { TripPlanForm, TripData } from "@/components/TripPlanForm";
import { TravelResponse } from "@/components/TravelResponse";
import { useToast } from "@/hooks/use-toast";
import { Heart, MapPin, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";

const Index = () => {
  const [travelPlan, setTravelPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: TripData) => {
    setIsLoading(true);
    setIsStreaming(true);
    setTravelPlan("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 429) {
        toast({
          title: "Rate limit exceeded",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
        setIsLoading(false);
        setIsStreaming(false);
        return;
      }

      if (response.status === 402) {
        toast({
          title: "Payment required",
          description: "Please add credits to continue.",
          variant: "destructive",
        });
        setIsLoading(false);
        setIsStreaming(false);
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error("Failed to start stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              setTravelPlan((prev) => prev + content);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      setIsStreaming(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating travel plan:", error);
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 gradient-hero" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-white animate-pulse" fill="white" />
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Lovable AI
          </h1>
          
          <p className="text-xl md:text-2xl text-white/95 mb-4 max-w-2xl mx-auto drop-shadow-md font-medium">
            Your sweet, caring travel companion 💕
          </p>
          
          <p className="text-lg text-white/90 max-w-xl mx-auto drop-shadow-md flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" />
            Let's plan your dream adventure together!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-10">
          {!travelPlan && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Tell me about your trip!
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                Share your destination, dates, budget, and what makes you happy. 
                I'll create a personalized travel plan just for you ✨
              </p>
            </div>
          )}

          <TripPlanForm onSubmit={handleFormSubmit} isLoading={isLoading} />

          {travelPlan && (
            <TravelResponse content={travelPlan} isStreaming={isStreaming} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          Made with <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" /> by Lovable AI
        </p>
      </footer>
    </div>
  );
};

export default Index;
