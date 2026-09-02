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
