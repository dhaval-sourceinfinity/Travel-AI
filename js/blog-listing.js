// js/blog-listing.js — The Journal Page Interactions
// Handles card rendering, category/destination filtering, progressive load-more, and newsletter submission.

import { initialArticles, additionalArticles } from "../data/blog-articles.js";

document.addEventListener("DOMContentLoaded", () => {
  initBlogGrid();
  initNewsletter();
});

/**
 * Creates the HTML string for a single blog card
 */
function createCardHTML(article) {
  return `
    <article class="blog-card" data-category="${article.category}" data-destination="${article.destination}" data-motion="fade-in">
      <div class="blog-card__media">
        <span class="blog-badge">${article.badge}</span>
        <img class="blog-card__img" src="${article.image}" alt="${article.imageAlt}" loading="lazy" decoding="async" width="405" height="220" data-motion="image-reveal" />
      </div>
      <div class="blog-card__body">
        <p class="blog-card__meta">${article.category} · ${article.readTime}</p>
        <h3 class="blog-card__title">
          <a href="${article.link}" class="blog-card__link">${article.title}</a>
        </h3>
        <p class="blog-card__desc">${article.description}</p>
      </div>
      <div class="blog-card__footer">
        <time class="blog-card__date">${article.date}</time>
        <svg class="icon blog-card__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M2.9162 7H11.0838M7 11.0838L11.0838 7L7 2.9162" />
        </svg>
      </div>
    </article>
  `;
}

/**
 * Initializes the blog grid, filter buttons, and load-more behavior
 */
function initBlogGrid() {
  const grid = document.getElementById("blog-cards-grid");
  const filterChips = document.querySelectorAll(".blog-filter-chip");
  const loadMoreBtn = document.getElementById("load-more-btn");
  const loadMoreWrap = document.querySelector(".blog-load-more-wrap");

  if (!grid) return;

  // Track loaded articles
  let currentArticles = [...initialArticles];
  let currentFilter = "all";
  let hasLoadedMore = false;

  // Render initial cards into grid
  function renderCards(filter = "all") {
    const filtered = currentArticles.filter((item) => {
      if (filter === "all") return true;
      return item.destination.toLowerCase() === filter.toLowerCase() ||
             item.category.toLowerCase() === filter.toLowerCase() ||
             item.badge.toLowerCase() === filter.toLowerCase();
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<p class="blog-desc" style="grid-column: 1 / -1; text-align: center; padding: 40px 0;">No articles found for this category.</p>`;
      return;
    }

    grid.innerHTML = filtered.map((article) => createCardHTML(article)).join("");

    // Ensure elements receive motion visibility if in view
    requestAnimationFrame(() => {
      grid.querySelectorAll("[data-motion]").forEach((el) => {
        el.classList.add("is-visible");
      });
    });
  }

  // Initial render (default "all" destinations)
  renderCards(currentFilter);

  // Filter button click handlers
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filterVal = chip.getAttribute("data-filter") || "all";
      currentFilter = filterVal;

      filterChips.forEach((c) => {
        const isSelected = c === chip;
        c.setAttribute("aria-pressed", String(isSelected));
        c.classList.toggle("is-active", isSelected);
      });

      renderCards(currentFilter);

      // Adjust load-more button visibility based on filter
      if (loadMoreWrap) {
        if (currentFilter !== "all" || hasLoadedMore) {
          loadMoreWrap.style.display = "none";
        } else {
          loadMoreWrap.style.display = "flex";
        }
      }
    });
  });

  // Load More Button
  if (loadMoreBtn && loadMoreWrap) {
    loadMoreBtn.addEventListener("click", () => {
      if (hasLoadedMore) return;

      currentArticles = [...initialArticles, ...additionalArticles];
      hasLoadedMore = true;
      renderCards(currentFilter);

      loadMoreBtn.setAttribute("disabled", "true");
      loadMoreBtn.innerHTML = `All stories loaded`;
      loadMoreBtn.style.opacity = "0.6";
      loadMoreBtn.style.cursor = "default";
    });
  }
}

/**
 * Initializes newsletter validation and feedback
 */
function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  const input = document.getElementById("newsletter-email");
  const feedback = document.getElementById("newsletter-feedback");

  if (!form || !input || !feedback) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = input.value.trim();

    feedback.className = "newsletter__feedback";

    if (!email || !emailRegex.test(email)) {
      feedback.textContent = "Please enter a valid email address.";
      feedback.classList.add("is-visible", "newsletter__feedback--error");
      input.focus();
      return;
    }

    // Success response
    feedback.textContent = "Thank you for subscribing to The Journal.";
    feedback.classList.add("is-visible", "newsletter__feedback--success");
    input.value = "";
    input.blur();
  });
}
