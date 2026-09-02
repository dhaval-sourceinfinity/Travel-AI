// app.js — home page entry point.
import { mountShell } from "./shell.js";
import { initReveal } from "./utils/reveal.js";
import { journeyCard } from "./components/journey-card.js";
import { journeysFeatured } from "../data/journeys.js";

/* ---- Render the featured journeys (shared journey-card component) ------- */
const featuredGrid = document.querySelector('[data-journeys="featured"]');
if (featuredGrid) {
  featuredGrid.innerHTML = journeysFeatured.map((j) => journeyCard(j)).join("");
}

/* ---- Explore section: region + place selection (visual state) ---------- */
function initExplore() {
  const region = document.querySelector("[data-region-tabs]");
  if (region) {
    region.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      region
        .querySelectorAll(".chip")
        .forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    });
  }

  const places = document.querySelector("[data-places]");
  if (places) {
    places.addEventListener("click", (e) => {
      const place = e.target.closest(".place");
      if (!place) return;
      e.preventDefault();
      places
        .querySelectorAll(".place")
        .forEach((p) => p.setAttribute("aria-current", String(p === place)));
    });
  }
}

/* ---- Boot -------------------------------------------------------------- */
mountShell();
initReveal();
initExplore();
