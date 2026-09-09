// itinerary.js — centralized mock itinerary data for AI Planner
// Structured for seamless replacement with a real AI backend / API response.

export const mockItineraries = {
  dubai: {
    destination: "Dubai",
    title: "Five days in Dubai",
    duration: "3 days",
    status: "Draft",
    statusLabel: "DRAFT ITINERARY",
    metaText: "3 days · Dubai · <span class=\"result-status--draft\">Draft</span> · not booked",
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
    metaText: "3 days · Japan · <span class=\"result-status--draft\">Draft</span> · not booked",
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

export const suggestionChips = {
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

export const defaultPrompts = {
  dubai: "Five relaxed days in Dubai in November — good food, one desert night, no early starts.",
  japan: "Seven days across Tokyo and Kyoto in spring — culinary focus, historic temples, scenic trains, no rush."
};
