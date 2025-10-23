import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plane } from "lucide-react";

interface TripPlanFormProps {
  onSubmit: (data: TripData) => void;
  isLoading: boolean;
}

export interface TripData {
  destination: string;
  dates: string;
  budget: string;
  interests: string;
}

export const TripPlanForm = ({ onSubmit, isLoading }: TripPlanFormProps) => {
  const [formData, setFormData] = useState<TripData>({
    destination: "",
    dates: "",
    budget: "",
    interests: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.destination.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="destination" className="text-foreground font-semibold">
          Where are you heading? ✈️
        </Label>
        <Input
          id="destination"
          placeholder="e.g., Paris, Tokyo, Bali..."
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          className="text-lg py-6 border-2 focus:border-primary transition-smooth"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dates" className="text-foreground font-semibold">
          How long? 📅
        </Label>
        <Input
          id="dates"
          placeholder="e.g., 3 days, a weekend, a week..."
          value={formData.dates}
          onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
          className="text-lg py-6 border-2 focus:border-primary transition-smooth"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget" className="text-foreground font-semibold">
          What's your budget? 💰
        </Label>
        <Input
          id="budget"
          placeholder="e.g., student budget, mid-range, luxury..."
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          className="text-lg py-6 border-2 focus:border-primary transition-smooth"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests" className="text-foreground font-semibold">
          What makes you happy? 💕
        </Label>
        <Textarea
          id="interests"
          placeholder="e.g., food, fashion, art, nature, adventure..."
          value={formData.interests}
          onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
          className="text-lg min-h-[100px] border-2 focus:border-primary transition-smooth resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !formData.destination.trim()}
        className="w-full text-lg py-7 gradient-warm hover:shadow-glow transition-smooth font-semibold"
      >
        {isLoading ? (
          <>
            <Plane className="mr-2 h-5 w-5 animate-bounce" />
            Planning your dream trip...
          </>
        ) : (
          <>
            <Plane className="mr-2 h-5 w-5" />
            Create My Travel Plan
          </>
        )}
      </Button>
    </form>
  );
};
