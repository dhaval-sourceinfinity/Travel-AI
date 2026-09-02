// journeys.js — Journeys (packages listing) page entry point.
import { mountShell } from "./shell.js";
import { initReveal } from "./utils/reveal.js";
import { journeyCard } from "./components/journey-card.js";
import { journeysAll } from "../data/journeys.js";

/* ---- Render the full journeys grid ------------------------------------- */
const grid = document.querySelector('[data-journeys="all"]');
if (grid) {
  // First row is above the fold → load eagerly; the rest lazy-load.
  grid.innerHTML = journeysAll
    .map((j, i) => journeyCard(j, { lazy: i >= 2, headingLevel: 2 }))
    .join("");
}

/* ---- Boot -------------------------------------------------------------- */
mountShell();
initReveal();
