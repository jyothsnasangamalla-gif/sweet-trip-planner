import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plane, X } from "lucide-react";

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

const budgetOptions = [
  { value: "budget", label: "Budget-friendly 💰" },
  { value: "student", label: "Student budget 🎓" },
  { value: "mid-range", label: "Mid-range 💳" },
  { value: "comfortable", label: "Comfortable 🌟" },
  { value: "luxury", label: "Luxury ✨" },
];

const interestOptions = [
  "Food & Dining 🍜",
  "Shopping & Fashion 🛍️",
  "Art & Museums 🎨",
  "Nature & Outdoors 🌿",
  "Photography 📸",
  "Nightlife & Entertainment 🎉",
  "History & Culture 🏛️",
  "Adventure Sports 🏄",
  "Relaxation & Spa 🧘",
  "Local Experiences 🏘️",
];

export const TripPlanForm = ({ onSubmit, isLoading }: TripPlanFormProps) => {
  const [formData, setFormData] = useState<TripData>({
    destination: "",
    dates: "",
    budget: "",
    interests: "",
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      const newInterests = prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest];
      setFormData({ ...formData, interests: newInterests.join(", ") });
      return newInterests;
    });
  };

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
        <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
          <SelectTrigger className="text-lg py-6 border-2 focus:border-primary transition-smooth bg-background">
            <SelectValue placeholder="Choose your budget range..." />
          </SelectTrigger>
          <SelectContent className="bg-card border-2 z-50">
            {budgetOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="text-lg py-3 cursor-pointer hover:bg-muted focus:bg-muted"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-foreground font-semibold">
          What makes you happy? 💕
        </Label>
        <p className="text-sm text-muted-foreground">Select all that apply</p>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => (
            <Badge
              key={interest}
              variant={selectedInterests.includes(interest) ? "default" : "outline"}
              className={`
                text-sm px-4 py-2 cursor-pointer transition-smooth
                ${selectedInterests.includes(interest) 
                  ? "gradient-warm text-white hover:shadow-glow" 
                  : "hover:border-primary hover:bg-muted"
                }
              `}
              onClick={() => toggleInterest(interest)}
            >
              {interest}
              {selectedInterests.includes(interest) && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
        </div>
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
