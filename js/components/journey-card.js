// journey-card.js — reusable journey/package card (home featured + journeys list).
import { arrow } from "./brand.js";

/**
 * @param {object} j                  journey data (see data/journeys.js)
 * @param {object} [opts]
 * @param {boolean} [opts.lazy]        lazy-load the image (default true; pass false for above-the-fold)
 * @param {number}  [opts.headingLevel] heading level for the title (2–4; default 3) so the
 *                                     card fits each page's outline correctly
 */
export function journeyCard(j, { lazy = true, headingLevel = 3 } = {}) {
  const loading = lazy ? ' loading="lazy"' : ' fetchpriority="high"';
  const h = Math.min(4, Math.max(2, headingLevel));
  return `<article class="journey-card">
    <div class="journey-card__media">
      <img class="journey-card__img" src="${j.image.src}" alt="${j.image.alt}"${loading} decoding="async" />
      <span class="journey-card__tag">${j.tag}</span>
    </div>
    <div class="journey-card__body">
      <p class="journey-card__meta">${j.duration}</p>
      <h${h} class="journey-card__title">${j.title}</h${h}>
      <p class="journey-card__text">${j.excerpt}</p>
      <div class="journey-card__footer">
        <p class="journey-card__price">From <strong>${j.priceFrom}</strong> per person</p>
        <a class="btn btn--accent-outline" href="${j.href}" aria-label="Explore ${j.title}">Explore the Journey ${arrow}</a>
      </div>
    </div>
  </article>`;
}
