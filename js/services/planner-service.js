/**
 * planner-service.js — Travel AI Planner Frontend Service & Contract
 *
 * Separates AI Planner presentation logic from future API/backend transport.
 * Supports both ES module imports and window.TravelServices.planner.
 */

/**
 * @typedef {Object} PlannerRequest
 * @property {'dubai' | 'japan' | string} destination - Target destination identifier (required)
 * @property {string} prompt - Raw user travel description/query (required)
 * @property {string} [selectedChip] - Optional suggested attraction chip clicked
 */

/**
 * @typedef {Object} PlannerActivity
 * @property {'Morning' | 'Afternoon' | 'Evening' | string} timeOfDay - Time period
 * @property {string} title - Activity headline
 * @property {string} description - Editorial description
 * @property {string} image - Image asset URL or path
 * @property {string} alt - Accessible image description
 */

/**
 * @typedef {Object} PlannerDay
 * @property {number} day - 1-based day index
 * @property {PlannerActivity[]} activities - Scheduled activities for the day
 */

/**
 * @typedef {Object} PlannerResult
 * @property {string} destination - Destination display name
 * @property {string} title - Itinerary title
 * @property {string} duration - Trip duration string (e.g. "3 days")
 * @property {string} status - Current booking/draft status
 * @property {string} statusLabel - Eyebrow status badge text
 * @property {string} metaText - Summary metadata markup/text
 * @property {PlannerDay[]} days - Array of scheduled days
 */

// Default prompts provided when user selects a destination
export const PLANNER_DEFAULT_PROMPTS = {
  dubai: "Five relaxed days in Dubai in November — good food, one desert night, no early starts.",
  japan: "Seven days across Tokyo and Kyoto in spring — culinary focus, historic temples, scenic trains, no rush."
};

// Suggestion chips available per destination
export const PLANNER_CHIPS = {
  dubai: [
    "Explore Dubai Marina",
    "Explore Burj Khalifa",
    "Explore Palm Jumeirah",
    "Explore Dubai Mall",
    "Explore Desert Safari",
    "Explore Global Village",
    "Explore Miracle Garden",
    "Explore Dubai Creek"
  ],
  japan: [
    "Explore Tokyo Shibuya",
    "Explore Mount Fuji",
    "Explore Kyoto Temples",
    "Explore Osaka Dotonbori",
    "Explore Nara Deer Park",
    "Explore Hiroshima Peace Park",
    "Explore Hakone Onsen",
    "Explore Arashiyama Bamboo"
  ]
};

// Canonical mock itineraries
export const PLANNER_MOCK_ITINERARIES = {
  dubai: {
    destination: "Dubai",
    title: "Five days in Dubai",
    duration: "3 days",
    status: "Draft",
    statusLabel: "DRAFT ITINERARY",
    metaText: '3 days · Dubai · <span class="result-status--draft">Draft</span> · not booked',
    days: [
      {
        day: 1,
        activities: [
          {
            timeOfDay: "Morning",
            title: "Old Dubai and the creek",
            description: "Cross by abra, walk the spice and gold lanes while it is still cool.",
            image: "assets/images/planner/dubai-creek-morning.webp",
            alt: "Traditional wooden abra boat crossing Old Dubai Creek at golden sunrise"
          },
          {
            timeOfDay: "Afternoon",
            title: "Al Fahidi and lunch",
            description: "Wind-tower houses, a slow Emirati lunch and an hour out of the sun.",
            image: "assets/images/planner/dubai-fahidi-afternoon.webp",
            alt: "Traditional wind-tower sandstone architecture in Al Fahidi historical district"
          },
          {
            timeOfDay: "Evening",
            title: "Dubai Creek Harbour",
            description: "The skyline from the quieter side of the water, with dinner along the promenade.",
            image: "assets/images/planner/dubai-harbour-evening.webp",
            alt: "Dubai Creek Harbour waterfront promenade at dusk with illuminated skyline"
          }
        ]
      },
      {
        day: 2,
        activities: [
          {
            timeOfDay: "Morning",
            title: "Dubai Marina Promenade",
            description: "Waterfront breakfast along the canal, yacht watching, and morning sea breeze.",
            image: "assets/images/planner/dubai-marina-morning.webp",
            alt: "Luxury yachts moored in Dubai Marina canal beneath modern skyscrapers"
          },
          {
            timeOfDay: "Afternoon",
            title: "Arabian Desert Safari",
            description: "Dune driving in a vintage 4x4, falconry demonstration, and sunset over golden sands.",
            image: "assets/images/planner/dubai-desert-afternoon.webp",
            alt: "Rolling golden sand dunes in the Dubai desert during late afternoon safari"
          },
          {
            timeOfDay: "Evening",
            title: "Downtown & Fountain Lake",
            description: "Burj Khalifa lights, evening fountain choreography, and dinner by the promenade.",
            image: "assets/images/planner/dubai-mall-evening.webp",
            alt: "Burj Khalifa illuminated lake and choreographed fountains at night"
          }
        ]
      },
      {
        day: 3,
        activities: [
          {
            timeOfDay: "Morning",
            title: "Museum of the Future",
            description: "Pioneering architecture, immersive technological exhibits, and calligraphy views.",
            image: "assets/images/planner/dubai-future-morning.webp",
            alt: "Futuristic Museum of the Future building with Arabic calligraphy in morning sun"
          },
          {
            timeOfDay: "Afternoon",
            title: "Palm Jumeirah Beach Club",
            description: "Private beachside relaxation, warm Persian Gulf waters, and chilled refreshments.",
            image: "assets/images/planner/dubai-beach-afternoon.webp",
            alt: "White sandy beach and turquoise water at Palm Jumeirah resort"
          },
          {
            timeOfDay: "Evening",
            title: "Skyline Rooftop Dining",
            description: "Panoramic night views of illuminated skyscrapers with world-class dining.",
            image: "assets/images/planner/dubai-downtown-evening.webp",
            alt: "Elegant rooftop lounge overlooking the glittering Dubai skyline"
          }
        ]
      }
    ]
  },
  japan: {
    destination: "Japan",
    title: "Seven days in Tokyo & Kyoto",
    duration: "3 days",
    status: "Draft",
    statusLabel: "DRAFT ITINERARY",
    metaText: '3 days · Japan · <span class="result-status--draft">Draft</span> · not booked',
    days: [
      {
        day: 1,
        activities: [
          {
            timeOfDay: "Morning",
            title: "Asakusa & Senso-ji Temple",
            description: "Early morning incense at Tokyo's oldest temple, before the Nakamise stalls fill with crowds.",
            image: "assets/images/trip-tokyo-tech.webp",
            alt: "Traditional pagoda and lantern at Asakusa Tokyo"
          },
          {
            timeOfDay: "Afternoon",
            title: "Shibuya Crossing & Omotesando",
            description: "Architectural walking tour through tree-lined Omotesando, quiet backstreet coffee, and Shibuya Sky views.",
            image: "assets/images/explore-japan.webp",
            alt: "Vibrant city streets of Tokyo"
          },
          {
            timeOfDay: "Evening",
            title: "Shinjuku Omoide Yokocho",
            description: "Charcoal yakitori in lantern-lit alleyways, followed by quiet craft cocktails in Golden Gai.",
            image: "assets/images/about-japan.webp",
            alt: "Atmospheric evening street in Tokyo"
          }
        ]
      },
      {
        day: 2,
        activities: [
          {
            timeOfDay: "Morning",
            title: "Shinkansen to Kyoto & Gion",
            description: "High-speed bullet train past Mount Fuji, arriving in Kyoto for a peaceful walk along Shirakawa Canal.",
            image: "assets/images/contact-kyoto.webp",
            alt: "Historic preserved streets of Kyoto at sunrise"
          },
          {
            timeOfDay: "Afternoon",
            title: "Fushimi Inari Mountain Path",
            description: "Hike through thousands of vermilion torii gates into the tranquil cedar forest summit.",
            image: "assets/images/trip-kyoto-autumn.webp",
            alt: "Vermilion gates and pagodas in Kyoto autumn foliage"
          },
          {
            timeOfDay: "Evening",
            title: "Kaiseki Dinner by the Kamogawa",
            description: "Multi-course seasonal Kyoto dining on a raised wooden platform over the flowing river.",
            image: "assets/images/map-kyoto.webp",
            alt: "Peaceful Kyoto waterscape at dusk"
          }
        ]
      },
      {
        day: 3,
        activities: [
          {
            timeOfDay: "Morning",
            title: "Arashiyama Bamboo Grove",
            description: "Quiet morning stroll through towering green bamboo stalks before visiting Tenryu-ji Zen garden.",
            image: "assets/images/journey-japan.webp",
            alt: "Serene bamboo forest pathway in Arashiyama"
          },
          {
            timeOfDay: "Afternoon",
            title: "Nara Deer Park & Todai-ji",
            description: "Free-roaming sacred sika deer and the monumental Great Bronze Buddha hall.",
            image: "assets/images/explore-japan.webp",
            alt: "Historic temple grounds in Nara"
          },
          {
            timeOfDay: "Evening",
            title: "Osaka Dotonbori Street Food",
            description: "Takoyaki, okonomiyaki, and neon reflections along the vibrant Dotonbori canal.",
            image: "assets/images/trip-tokyo-tech.webp",
            alt: "Dotonbori neon canal at night"
          }
        ]
      }
    ]
  }
};

/**
 * Normalizes raw API response into guaranteed UI-safe PlannerResult contract.
 * @param {any} raw - Raw payload from backend or mock
 * @returns {PlannerResult}
 */
export function normalizePlannerResult(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      destination: "Unknown",
      title: "Custom Itinerary",
      duration: "1 day",
      status: "Draft",
      statusLabel: "DRAFT ITINERARY",
      metaText: '1 day · <span class="result-status--draft">Draft</span>',
      days: []
    };
  }

  const destination = String(raw.destination || raw.dest || "Dubai");
  const days = Array.isArray(raw.days)
    ? raw.days.map((d, index) => ({
        day: Number(d.day) || index + 1,
        activities: Array.isArray(d.activities)
          ? d.activities.map((a) => ({
              timeOfDay: a.timeOfDay || a.time || "Morning",
              title: String(a.title || "Experience"),
              description: String(a.description || a.desc || ""),
              image: a.image || "assets/images/journey-dubai.webp",
              alt: a.alt || a.title || "Travel activity"
            }))
          : []
      }))
    : [];

  return {
    destination: destination,
    title: String(raw.title || `Bespoke Itinerary for ${destination}`),
    duration: String(raw.duration || `${days.length} days`),
    status: String(raw.status || "Draft"),
    statusLabel: String(raw.statusLabel || "DRAFT ITINERARY"),
    metaText: raw.metaText || `${days.length} days · ${destination} · <span class="result-status--draft">Draft</span>`,
    days: days
  };
}

/**
 * Validates a planner request before submission.
 * @param {PlannerRequest} request
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validatePlannerRequest(request) {
  if (!request || typeof request !== "object") {
    return { isValid: false, error: "Invalid planner request object." };
  }
  if (!request.destination || !["dubai", "japan"].includes(request.destination.toLowerCase())) {
    return { isValid: false, error: "Please select a supported destination." };
  }
  if (!request.prompt || !request.prompt.trim()) {
    return { isValid: false, error: "Please describe your travel vision." };
  }
  if (request.prompt.trim().length > 2000) {
    return { isValid: false, error: "Prompt exceeds maximum length of 2000 characters." };
  }
  return { isValid: true };
}

/**
 * Future API Boundary: generates itinerary for a given request.
 * Currently backed by verified mock data; easily replaceable with fetch() or AI endpoint.
 * @param {PlannerRequest} request
 * @returns {Promise<PlannerResult>}
 */
export async function generateItinerary(request) {
  const validation = validatePlannerRequest(request);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const destKey = request.destination.toLowerCase();
  const raw = PLANNER_MOCK_ITINERARIES[destKey] || PLANNER_MOCK_ITINERARIES.dubai;
  return normalizePlannerResult(raw);
}

/**
 * Returns suggested chips for a destination.
 * @param {string} destination
 * @returns {string[]}
 */
export function getSuggestedChips(destination) {
  const key = (destination || "").toLowerCase();
  return PLANNER_CHIPS[key] || PLANNER_CHIPS.dubai;
}

/**
 * Returns default prompt for a destination.
 * @param {string} destination
 * @returns {string}
 */
export function getDefaultPrompt(destination) {
  const key = (destination || "").toLowerCase();
  return PLANNER_DEFAULT_PROMPTS[key] || PLANNER_DEFAULT_PROMPTS.dubai;
}

// Universal Global Registration for non-module scripts
if (typeof window !== "undefined") {
  window.TravelServices = window.TravelServices || {};
  window.TravelServices.planner = {
    DEFAULT_PROMPTS: PLANNER_DEFAULT_PROMPTS,
    CHIPS: PLANNER_CHIPS,
    MOCK_ITINERARIES: PLANNER_MOCK_ITINERARIES,
    normalizePlannerResult,
    validatePlannerRequest,
    generateItinerary,
    getSuggestedChips,
    getDefaultPrompt
  };
}
