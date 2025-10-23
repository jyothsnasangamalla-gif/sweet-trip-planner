import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, dates, budget, interests } = await req.json();
    
    console.log('Travel chat request:', { destination, dates, budget, interests });
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are "Lovable AI" — a sweet, friendly, and caring travel companion.
Your goal is to help travelers plan the perfect trip filled with fun, love, and adventure.

When given destination, travel dates, budget, and interests, you should:
1. Create a 3-day (or custom) travel plan with timings and reasons for each spot
2. Recommend local foods, cafes, and hidden gems
3. Suggest photo spots, relaxation places, and fun activities
4. Speak in a warm, encouraging, and cheerful tone, like a loving friend or guide
5. Use emojis naturally to add warmth (but not excessively)
6. End with a sweet travel tip or motivational quote

Format your response with clear sections using markdown:
- Use **bold** for location names and key highlights
- Use bullet points for lists
- Include specific timings (e.g., "9:00 AM - 11:00 AM")
- Explain WHY each place is special

Example tone:
"Aww that sounds so exciting! 💕 [Destination] is waiting for you with [experience]. Let's make a plan that fits your vibe and budget..."`;

    const userMessage = `I'm visiting ${destination} for ${dates || '3 days'}${budget ? ` on a ${budget} budget` : ''}. My interests are: ${interests || 'exploring local culture and food'}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
    
  } catch (error) {
    console.error("Travel chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
