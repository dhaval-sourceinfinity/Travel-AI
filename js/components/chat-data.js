/**
 * chat-data.js — Travel AI Mock Conversation Data
 * Represents the 5 conversation states from Figma:
 * - State 1 (Figma 208:4654): Greeting + suggested prompts
 * - State 2 (Figma 208:4752): User message + preference collection chips
 * - State 3 (Figma 73:2118): User response + structured trip details confirmation
 * - State 4 (Figma 73:2255): AI recommendation card with Dubai destination image & highlights
 * - State 5 (Figma 73:4012): Custom 7-day itinerary plan + action buttons
 */

export const CHAT_STATES = {
  1: {
    id: 1,
    name: "Initial Greeting & Prompts",
    description: "Welcome state with prompt suggestion chips",
    messages: [
      {
        id: "msg-1",
        sender: "ai",
        time: "11:12 AM",
        text: "Hi 👋 I'm Travel AI. Tell me about the trip you're thinking about. You can tell me your destination, budget, dates, travel style — or simply describe what you're looking for."
      }
    ],
    chips: [
      { id: "c1-1", text: "I want to visit Dubai for 7 days.", nextState: 2 },
      { id: "c1-2", text: "I have NZ$4,000 for a family holiday.", nextState: 2 },
      { id: "c1-3", text: "I want a luxury honeymoon in November.", nextState: 2 },
      { id: "c1-4", text: "I don't know where to go. Surprise me.", nextState: 2 }
    ],
    composerPlaceholder: "Type your message..."
  },

  2: {
    id: 2,
    name: "Preference Collection",
    description: "AI asks for travel style after receiving user query",
    messages: [
      {
        id: "msg-1",
        sender: "ai",
        time: "11:12 AM",
        text: "Hi 👋 I'm Travel AI. Tell me about the trip you're thinking about. You can tell me your destination, budget, dates, travel style — or simply describe what you're looking for."
      },
      {
        id: "msg-2",
        sender: "user",
        time: "11:23 AM",
        status: "✓✓",
        text: "I have NZ$4,000 for a family holiday."
      },
      {
        id: "msg-3",
        sender: "ai",
        time: "11:23 AM",
        text: "Great! I'm gathering a few more details to create your perfect trip. What type of travel experience are you looking for?"
      }
    ],
    chips: [
      { id: "c2-1", text: "Relaxing / Leisure", nextState: 3 },
      { id: "c2-2", text: "Adventure", nextState: 3 },
      { id: "c2-3", text: "Luxury", nextState: 3 },
      { id: "c2-4", text: "Culture & Sightseeing", nextState: 3 },
      { id: "c2-5", text: "Something Special (Honeymoon, Anniversary etc.)", nextState: 3 }
    ],
    composerPlaceholder: "Type your message..."
  },

  3: {
    id: 3,
    name: "Trip Details Confirmation",
    description: "Structured summary of collected trip details for validation",
    messages: [
      {
        id: "msg-4",
        sender: "user",
        time: "11:25 AM",
        status: "✓✓",
        text: "Relaxing / Leisure"
      },
      {
        id: "msg-5",
        sender: "ai",
        time: "11:25 AM",
        tripSummary: {
          intro: "I understand your trip details so far: 🌍",
          items: [
            { label: "Destination", value: "Dubai", icon: "" },
            { label: "Travellers", value: "2 Adults", icon: "👥" },
            { label: "Duration", value: "7 Days", icon: "📅" },
            { label: "Departure", value: "Auckland", icon: "✈️" },
            { label: "Budget", value: "NZ$5,000", icon: "💰" },
            { label: "Travel Style", value: "Leisure", icon: "🎨" },
            { label: "Travel Month", value: "December", icon: "🗓️" }
          ],
          question: "Is everything correct?"
        }
      }
    ],
    chips: [
      { id: "c3-1", text: "Yes, that's right", nextState: 4 },
      { id: "c3-2", text: "Let me change something", nextState: 2 }
    ],
    composerPlaceholder: "Type your message..."
  },

  4: {
    id: 4,
    name: "Destination Recommendation",
    description: "Rich destination card with imagery, budget and highlights",
    messages: [
      {
        id: "msg-6",
        sender: "ai",
        time: "11:28 AM",
        recommendationCard: {
          image: "assets/images/chat-destination-dubai.png",
          imageAlt: "Dubai skyline with Burj Khalifa and modern architecture",
          title: "Here's what I recommend for you ✨",
          destination: "Dubai — 7 Days",
          budget: "Estimated Budget: NZ$3,650 – NZ$4,100",
          style: "Travel Style: Leisure",
          highlightsTitle: "Highlights",
          highlights: [
            "Downtown Dubai",
            "Desert Safari Adventure",
            "Burj Khalifa Experience",
            "Dubai Marina & Yacht Tour",
            "Abu Dhabi Day Trip"
          ]
        }
      }
    ],
    actions: [
      { id: "a4-1", text: "Build My Trip", nextState: 5, variant: "primary" },
      { id: "a4-2", text: "Change Preferences", nextState: 2, variant: "secondary" }
    ],
    composerPlaceholder: "Type your message..."
  },

  5: {
    id: 5,
    name: "Custom 7-Day Plan",
    description: "Detailed daily itinerary plan with advisor consultation action",
    messages: [
      {
        id: "msg-7",
        sender: "ai",
        time: "11:35 AM",
        itineraryPlan: {
          title: "Here's your custom 7-day plan",
          days: [
            { day: "Day 1", desc: "Arrival & Downtown Dubai" },
            { day: "Day 2", desc: "Dubai Mall & Burj Khalifa" },
            { day: "Day 3", desc: "Desert Safari Adventure" },
            { day: "Day 4", desc: "Dubai Marina & Yacht Tour" },
            { day: "Day 5", desc: "Relax & Leisure Day" },
            { day: "Day 6", desc: "Abu Dhabi Day Trip" },
            { day: "Day 7", desc: "Departure" }
          ]
        }
      }
    ],
    actions: [
      { id: "a5-1", text: "Get This Trip Designed by a Travel AI Agent", nextState: 1, variant: "primary" },
      { id: "a5-2", text: "Customise More", nextState: 4, variant: "secondary" }
    ],
    composerPlaceholder: "Type your message..."
  }
};
