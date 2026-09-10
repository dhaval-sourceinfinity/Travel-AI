// footer.js — site footer (reused across pages).
import { brand, arrow } from "./brand.js";

const COLUMNS = [
  {
    head: "Explore",
    links: [
      { label: "Dubai", href: "404.html" },
      { label: "Japan", href: "404.html" },
    ],
  },
  {
    head: "Journeys",
    links: [
      { label: "Dubai Journeys", href: "journeys.html" },
      { label: "Japan Journeys", href: "journeys.html" },
    ],
  },
  {
    head: "Travel AI",
    links: [
      { label: "Our Story", href: "about-us.html" },
      { label: "How It Works", href: "index.html#how" },
      { label: "Travel AI Agents", href: "404.html" },
    ],
  },
  {
    head: "Help",
    links: [
      { label: "Contact", href: "contact.html" },
      { label: "FAQs", href: "404.html" },
    ],
  },
];

// These pages don't exist yet, so they route to the 404 page.
const LEGAL = ["Terms", "Privacy", "Booking Terms", "Cancellation Policy"];

export function renderFooter() {
  const cols = COLUMNS.map(
    (c) => `<nav class="footer-col" aria-label="${c.head}">
      <h2 class="footer-col__head">${c.head}</h2>
      ${c.links
        .map((l) => `<a class="footer-link" href="${l.href}">${l.label}</a>`)
        .join("")}
    </nav>`
  ).join("");

  const legal = LEGAL.map(
    (l) => `<a href="404.html">${l}</a>`
  ).join("");

  return `<div class="footer-bounce" aria-hidden="true">
    <svg preserveAspectRatio="none" class="footer-bounce__svg" id="footer-bouncy-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2278 683">
      <defs>
        <linearGradient id="footer-bounce-grad" x1="0" y1="0" x2="0" y2="683" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#0c1013"></stop>
          <stop offset="40%" stop-color="#090d0f"></stop>
          <stop offset="100%" stop-color="#080b0d"></stop>
        </linearGradient>
      </defs>
      <path class="footer-bounce__path" id="bouncy-path" fill="url(#footer-bounce-grad)" d="M0-0.3C0-0.3,464,0,1139,0s1139-0.3,1139-0.3V683H0V-0.3z"/>
    </svg>
  </div>
  <div class="container footer-content-wrap">
    <div class="footer-top">
      <div class="footer-brand">
        ${brand()}
        <p class="footer-brand__tag">Travel should feel personal.</p>
      </div>
      <div class="footer-cols">
        ${cols}
      </div>
    </div>

    <section class="advisor" id="advisors" aria-label="For travel professionals">
      <p class="advisor__text">Are you a travel professional?</p>
      <a class="btn btn--accent-outline" href="404.html">Become a Travel AI Agent ${arrow}</a>
    </section>

    <div class="footer-bottom">
      <p class="footer-copy">© 2026 Travel AI. All rights reserved.</p>
      <div class="footer-legal">${legal}</div>
    </div>
  </div>`;
}
