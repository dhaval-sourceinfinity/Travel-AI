/**
 * journeys-service.js — Travel AI Packages/Journeys Service & Contracts
 *
 * Encapsulates package querying, filtering, sorting, and normalization.
 * Supports both ES module imports and window.TravelServices.journeys.
 */
import { packagesAll } from "../../data/journeys.js";

/**
 * @typedef {Object} PackageConsultant
 * @property {string} name - Consultant full name
 * @property {string} initials - Consultant monogram
 */

/**
 * @typedef {Object} PackageImage
 * @property {string} src - Image source URL
 * @property {string} alt - Image description
 */

/**
 * @typedef {Object} PackageItem
 * @property {string} location - Primary destination / region name
 * @property {string} tag - Uppercase category tag
 * @property {string} costTier - "Mid-Range" | "Luxury" | "Budget"
 * @property {string} days - Duration label (e.g. "3 Days", "7 Days · 6 Nights")
 * @property {number} rating - Integer or float rating (e.g. 5)
 * @property {number} reviewCount - Total reviews count
 * @property {string} title - Journey package title
 * @property {string} description - Journey summary description
 * @property {string} costType - "Guided Tour" | "Self-Guided" | "Custom"
 * @property {string} price - Display price string (e.g. "NZ$1,200")
 * @property {number} priceNum - Numeric price value for sorting
 * @property {PackageConsultant} consultant - Assigned travel expert
 * @property {string} href - Target details link
 * @property {PackageImage} image - Card visual media
 */

/**
 * @typedef {Object} PackageFilters
 * @property {string} [destination] - Filter by destination/location
 * @property {string} [consultant] - Filter by consultant name
 * @property {string} [costType] - Filter by cost type
 * @property {'price-asc' | 'price-desc' | 'name-asc' | string} [sortBy] - Sort criteria
 */

/**
 * Normalizes a raw package item ensuring all expected fields exist with correct types.
 * @param {any} raw
 * @returns {PackageItem}
 */
export function normalizePackage(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      location: "General",
      tag: "JOURNEY",
      costTier: "Mid-Range",
      days: "Flexible",
      rating: 5,
      reviewCount: 0,
      title: "Custom Experience",
      description: "",
      costType: "Guided Tour",
      price: "Price on request",
      priceNum: 0,
      consultant: { name: "Travel Concierge", initials: "TC" },
      href: "journey-details.html",
      image: { src: "assets/images/journey-dubai.webp", alt: "Travel package" }
    };
  }

  const rating = typeof raw.rating === "number" ? Math.max(1, Math.min(5, raw.rating)) : 5;
  const reviewCount = typeof raw.reviewCount === "number" ? Math.max(0, raw.reviewCount) : 0;
  let priceNum = typeof raw.priceNum === "number" ? raw.priceNum : 0;
  if (!priceNum && typeof raw.price === "string") {
    const parsed = parseInt(raw.price.replace(/[^\d]/g, ""), 10);
    priceNum = isNaN(parsed) ? 0 : parsed;
  }

  return {
    location: String(raw.location || raw.region || "Destination"),
    tag: String(raw.tag || (raw.location || "JOURNEY")).toUpperCase(),
    costTier: String(raw.costTier || "Mid-Range"),
    days: String(raw.days || raw.duration || "Multi-day"),
    rating: rating,
    reviewCount: reviewCount,
    title: String(raw.title || "Travel Journey"),
    description: String(raw.description || raw.excerpt || ""),
    costType: String(raw.costType || "Guided Tour"),
    price: String(raw.price || raw.priceFrom || "Enquire for pricing"),
    priceNum: priceNum,
    consultant: {
      name: (raw.consultant && raw.consultant.name) || "Travel Advisor",
      initials: (raw.consultant && raw.consultant.initials) || "TA"
    },
    href: String(raw.href || "journey-details.html"),
    image: {
      src: (raw.image && raw.image.src) || "assets/images/journey-dubai.webp",
      alt: (raw.image && raw.image.alt) || "Journey overview photography"
    }
  };
}

/**
 * Filters a collection of packages based on filter parameters.
 * @param {PackageItem[]} packages
 * @param {PackageFilters} [filters]
 * @returns {PackageItem[]}
 */
export function filterPackages(packages, filters = {}) {
  let result = Array.isArray(packages) ? [...packages] : [];

  if (filters.destination) {
    result = result.filter((p) => p.location === filters.destination);
  }
  if (filters.consultant) {
    result = result.filter((p) => p.consultant.name === filters.consultant);
  }
  if (filters.costType) {
    result = result.filter((p) => p.costType === filters.costType);
  }

  return result;
}

/**
 * Sorts packages according to specified key.
 * @param {PackageItem[]} packages
 * @param {string} [sortBy]
 * @returns {PackageItem[]}
 */
export function sortPackages(packages, sortBy) {
  const sorted = [...packages];
  if (sortBy === "price-asc") {
    sorted.sort((a, b) => a.priceNum - b.priceNum);
  } else if (sortBy === "price-desc") {
    sorted.sort((a, b) => b.priceNum - a.priceNum);
  } else if (sortBy === "name-asc") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
  return sorted;
}

/**
 * Asynchronous package transport boundary.
 * Easily swappable for fetch('/api/packages?...') in the future.
 * @param {PackageFilters} [filters]
 * @returns {Promise<PackageItem[]>}
 */
export async function fetchPackages(filters = {}) {
  // Normalize dataset
  const normalized = packagesAll.map(normalizePackage);
  const filtered = filterPackages(normalized, filters);
  const sorted = sortPackages(filtered, filters.sortBy);
  return sorted;
}

/**
 * Extracts unique filter facet options from a list of packages.
 * @param {PackageItem[]} packages
 * @returns {{ destinations: string[], consultants: string[], costTypes: string[] }}
 */
export function extractFilterFacets(packages) {
  return {
    destinations: [...new Set(packages.map((p) => p.location))].sort(),
    consultants: [...new Set(packages.map((p) => p.consultant.name))].sort(),
    costTypes: [...new Set(packages.map((p) => p.costType))].sort()
  };
}

// Universal Global Registration
if (typeof window !== "undefined") {
  window.TravelServices = window.TravelServices || {};
  window.TravelServices.journeys = {
    normalizePackage,
    filterPackages,
    sortPackages,
    fetchPackages,
    extractFilterFacets
  };
}
