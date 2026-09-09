// journeys.js — Packages listing page (Figma 208:3819).
// Loaded as type="module"; site.js (defer) handles shell mounting.
import { packagesAll } from "../data/journeys.js";

/* ---- Inline SVG fragments ----------------------------------------------- */
const starSvg = `<svg class="journey-card__star" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

const clockSvg = `<svg class="journey-card__badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

/* ---- DOM refs ----------------------------------------------------------- */
const grid = document.getElementById("packages-grid");
const countEl = document.getElementById("pkg-count");
const filterDest = document.getElementById("filter-dest");
const filterConsultant = document.getElementById("filter-consultant");
const filterCost = document.getElementById("filter-cost");
const filterReset = document.getElementById("filter-reset");
const sortSelect = document.getElementById("sort-select");

/* ---- Card template ------------------------------------------------------ */
function packageCard(pkg, { lazy = true } = {}) {
  const loading = lazy ? ' loading="lazy"' : ' fetchpriority="high"';
  const stars = starSvg.repeat(pkg.rating);
  const reviewText =
    pkg.reviewCount > 0
      ? `(${pkg.reviewCount} review${pkg.reviewCount > 1 ? "s" : ""})`
      : "(No reviews)";
  const ratingLabel = pkg.reviewCount > 0 ? `${pkg.rating}.0` : "New";

  return `<article class="journey-card" data-motion="fade-up">
    <div class="journey-card__media">
      <img class="journey-card__img" src="${pkg.image.src}" alt="${pkg.image.alt}"${loading} decoding="async" data-motion="image-reveal" />
      <span class="journey-card__tag">${pkg.tag}</span>
      <span class="journey-card__badge">${clockSvg} ${pkg.costTier} · ${pkg.days}</span>
    </div>
    <div class="journey-card__body" data-motion="fade-in">
      <div class="journey-card__rating">
        <span class="journey-card__stars">${stars}</span>
        <span class="journey-card__rating-label">${ratingLabel}</span>
        <span class="journey-card__rating-count">${reviewText}</span>
      </div>
      <h2 class="journey-card__title">${pkg.title}</h2>
      <p class="journey-card__desc">${pkg.description}</p>
      <div class="journey-card__divider"></div>
      <div class="journey-card__cost-row">
        <div class="journey-card__cost-type">
          <span class="journey-card__cost-label">Cost Type</span>
          <span class="journey-card__cost-value">${pkg.costType}</span>
        </div>
        <div class="journey-card__price-col">
          <span class="journey-card__price-label">Price (per traveler)</span>
          <span class="journey-card__price-value">${pkg.price}</span>
        </div>
      </div>
      <div class="journey-card__consultant">
        <span class="journey-card__avatar">${pkg.consultant.initials}</span>
        <div class="journey-card__consultant-info">
          <span class="journey-card__consultant-label">Travel Consultant</span>
          <span class="journey-card__consultant-name">${pkg.consultant.name}</span>
        </div>
      </div>
      <a class="journey-card__cta" href="${pkg.href}">View Package Details &amp; Enquiry ↗</a>
    </div>
  </article>`;
}

/* ---- Rendering ---------------------------------------------------------- */
let allPackages = [...packagesAll];

function renderGrid(packages) {
  // Kill active tweens on outgoing cards to prevent memory leaks or animation conflicts
  if (window.gsap) {
    const oldCards = grid.querySelectorAll(".journey-card, [data-motion]");
    if (oldCards.length) {
      window.gsap.killTweensOf(oldCards);
    }
  }

  if (packages.length === 0) {
    grid.innerHTML = `<div class="pkg-empty" style="grid-column: 1 / -1; text-align: center; padding: 48px 24px; color: var(--color-text-secondary);">
      <p style="font-size: 18px; font-weight: 600; color: var(--color-text); margin-bottom: 8px;">No packages match your selected filters.</p>
      <p style="font-size: 14px; margin-bottom: 16px;">Try adjusting your destination, consultant, or cost criteria.</p>
    </div>`;
    return;
  }

  grid.innerHTML = packages
    .map((p, i) => packageCard(p, { lazy: i >= 2 }))
    .join("");

  // When GSAP engine is active, animate dynamically injected cards cleanly.
  // Otherwise, use graceful double-rAF fallback for native environments.
  if (window.TravelMotion && window.TravelMotion.isReady()) {
    window.TravelMotion.animateDynamicGrid(grid);
  } else {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        grid.querySelectorAll("[data-motion]").forEach((el) => {
          el.classList.add("is-visible");
        });
      });
    });
  }
}

function updateCount(shown, total) {
  countEl.textContent = `Showing ${shown} of ${total} packages`;
}

/* ---- Filtering & sorting ------------------------------------------------ */
function getFiltered() {
  let result = allPackages;
  const dest = filterDest.value;
  const consultant = filterConsultant.value;
  const cost = filterCost.value;

  if (dest) result = result.filter((p) => p.location === dest);
  if (consultant)
    result = result.filter((p) => p.consultant.name === consultant);
  if (cost) result = result.filter((p) => p.costType === cost);

  return result;
}

function getSorted(packages) {
  const val = sortSelect.value;
  const sorted = [...packages];
  if (val === "price-asc") sorted.sort((a, b) => a.priceNum - b.priceNum);
  else if (val === "price-desc") sorted.sort((a, b) => b.priceNum - a.priceNum);
  else if (val === "name-asc")
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  return sorted;
}

function applyFiltersAndSort() {
  const filtered = getFiltered();
  const sorted = getSorted(filtered);
  renderGrid(sorted);
  updateCount(sorted.length, allPackages.length);
}

/* ---- Populate filter options from data ---------------------------------- */
function populateFilters() {
  const destinations = [...new Set(allPackages.map((p) => p.location))];
  const consultants = [...new Set(allPackages.map((p) => p.consultant.name))];
  const costTypes = [...new Set(allPackages.map((p) => p.costType))];

  destinations.forEach((d) => {
    filterDest.appendChild(new Option(d, d));
  });
  consultants.forEach((c) => {
    filterConsultant.appendChild(new Option(c, c));
  });
  costTypes.forEach((t) => {
    filterCost.appendChild(new Option(t, t));
  });
}

/* ---- Wire events -------------------------------------------------------- */
function initFilters() {
  populateFilters();
  filterDest.addEventListener("change", applyFiltersAndSort);
  filterConsultant.addEventListener("change", applyFiltersAndSort);
  filterCost.addEventListener("change", applyFiltersAndSort);
  filterReset.addEventListener("click", () => {
    filterDest.value = "";
    filterConsultant.value = "";
    filterCost.value = "";
    applyFiltersAndSort();
  });
}

function initSort() {
  sortSelect.addEventListener("change", applyFiltersAndSort);
}

/* ---- Boot --------------------------------------------------------------- */
renderGrid(allPackages);
updateCount(allPackages.length, allPackages.length);
initFilters();
initSort();
