// journeys.js — journey content model.
// Text/pricing are placeholder values carried from the Figma frames
// (see DESIGN.md §10); the visual layer stays independent of them.

const base = {
  dubai: {
    region: "Dubai",
    tag: "DUBAI",
    duration: "7 Days · 6 Nights",
    title: "The Dubai Signature Journey",
    excerpt:
      "A considered introduction to Dubai, bringing together iconic experiences, time to unwind and moments beyond the expected.",
    priceFrom: "NZ$X,XXX",
    href: "journey-details.html",
  },
  japan: {
    region: "Japan",
    tag: "JAPAN",
    duration: "10 Days · 9 Nights",
    title: "Japan, Beyond the Expected",
    excerpt:
      "Tokyo's energy. Kyoto's traditions. Osaka's character. A journey designed to let you experience more than the highlights.",
    priceFrom: "NZ$X,XXX",
    href: "journey-details.html",
  },
};

// Featured pair shown on the home page (uses the home frame's imagery).
export const journeysFeatured = [
  {
    ...base.dubai,
    image: {
      src: "assets/images/journey-dubai.webp",
      alt: "Burj Al Arab rising above the Dubai coastline",
    },
  },
  {
    ...base.japan,
    image: {
      src: "assets/images/journey-japan.webp",
      alt: "Pagoda surrounded by trees and mountains in Japan",
    },
  },
];

// Full listing shown on the Journeys page (matches the 6-card Figma grid).
export const journeysAll = [
  {
    ...base.dubai,
    image: {
      src: "assets/images/journeys/dubai-1.webp",
      alt: "Aerial view of Palm Jumeirah, Dubai",
    },
  },
  {
    ...base.japan,
    image: {
      src: "assets/images/journeys/japan-1.webp",
      alt: "Red five-storied pagoda with mountains beyond, Japan",
    },
  },
  {
    ...base.dubai,
    image: {
      src: "assets/images/journeys/dubai-2.webp",
      alt: "Aerial view of the Burj Al Arab and the Dubai coastline",
    },
  },
  {
    ...base.japan,
    image: {
      src: "assets/images/journeys/japan-2.webp",
      alt: "Traveller with a red parasol in a historic Kyoto street at dusk",
    },
  },
  {
    ...base.dubai,
    image: {
      src: "assets/images/journeys/dubai-3.webp",
      alt: "The Burj Al Arab viewed across Madinat Jumeirah, Dubai",
    },
  },
  {
    ...base.japan,
    image: {
      src: "assets/images/journeys/japan-3.webp",
      alt: "Pagoda beside Nachi Falls surrounded by forest, Japan",
    },
  },
];

// Packages listing (Figma 208:3819) — enriched data model for the packages page.
// Existing journeysFeatured / journeysAll exports stay untouched for the home page.
export const packagesAll = [
  {
    location: "Rotorua",
    tag: "ROTORUA",
    costTier: "Mid-Range",
    days: "3 Days",
    rating: 5,
    reviewCount: 0,
    title: "Rotorua Geothermal Weekend Mid-Range Plan",
    description:
      "Immerse yourself in Rotorua's famous geothermal wonders, Maori culture, and lush redwood forests. Perfect long-weekend escape from Auckland.",
    costType: "Mid-Range",
    price: "NZD 1,299",
    priceNum: 1299,
    consultant: { initials: "AS", name: "abcd sourceinfinity" },
    href: "journey-details.html",
    image: {
      src: "assets/images/journeys/dubai-1.webp",
      alt: "Aerial view of geothermal landscape in Rotorua",
    },
  },
  {
    location: "Auckland",
    tag: "AUCKLAND",
    costTier: "Budget",
    days: "7 Days",
    rating: 5,
    reviewCount: 0,
    title: "Auckland 7-Days Explorer Budget Plan",
    description:
      "A complete Auckland experience covering the city highlights, Waiheke Island wine trail, and the stunning Coromandel Peninsula. Flights, accommodation, and select activities included.",
    costType: "Budget",
    price: "NZD 1,299",
    priceNum: 1299,
    consultant: { initials: "AS", name: "abcd sourceinfinity" },
    href: "journey-details.html",
    image: {
      src: "assets/images/journeys/japan-1.webp",
      alt: "Traditional architecture among lush greenery in Auckland",
    },
  },
  {
    location: "Rotorua",
    tag: "ROTORUA",
    costTier: "Mid-Range",
    days: "3 Days",
    rating: 5,
    reviewCount: 0,
    title: "Rotorua Thermal Springs Retreat",
    description:
      "Relax in natural hot springs, explore the Wai-O-Tapu thermal wonderland, and enjoy authentic Maori cultural performances in the heart of New Zealand.",
    costType: "Mid-Range",
    price: "NZD 1,499",
    priceNum: 1499,
    consultant: { initials: "AS", name: "abcd sourceinfinity" },
    href: "journey-details.html",
    image: {
      src: "assets/images/journeys/dubai-2.webp",
      alt: "Steaming thermal pools at sunset in Rotorua",
    },
  },
  {
    location: "Auckland",
    tag: "AUCKLAND",
    costTier: "Budget",
    days: "7 Days",
    rating: 5,
    reviewCount: 0,
    title: "Auckland Coastal Discovery Budget Plan",
    description:
      "Discover Auckland's stunning coastline, from the black sand beaches of Piha to the charming seaside villages of the Hibiscus Coast.",
    costType: "Budget",
    price: "NZD 999",
    priceNum: 999,
    consultant: { initials: "AS", name: "abcd sourceinfinity" },
    href: "journey-details.html",
    image: {
      src: "assets/images/journeys/japan-2.webp",
      alt: "Scenic coastal walkway with ocean views near Auckland",
    },
  },
];
