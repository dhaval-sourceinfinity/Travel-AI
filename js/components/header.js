// header.js — site header / primary navigation (reused across pages).
import { brand } from "./brand.js";

const NAV_LINKS = [
  { label: "About Us", href: "index.html#about" },
  { label: "How it Works", href: "index.html#how" },
  { label: "For Advisors", href: "index.html#advisors" },
  { label: "Blog", href: "404.html" },
];

export function renderHeader() {
  const links = NAV_LINKS.map(
    (l) => `<a class="nav__link" href="${l.href}">${l.label}</a>`
  ).join("");

  return `<div class="container site-header__inner">
    ${brand()}
    <nav class="nav" id="primary-nav" aria-label="Primary">
      ${links}
    </nav>
    <button class="nav-toggle" type="button" aria-expanded="false"
            aria-controls="primary-nav" aria-label="Open menu">
      <span class="nav-toggle__box" aria-hidden="true"><span></span><span></span><span></span></span>
    </button>
  </div>`;
}

/** Wire up the mobile menu: toggle, Escape, outside-click, link-close, resize reset. */
export function initHeader(header) {
  const toggle = header.querySelector(".nav-toggle");
  const nav = header.querySelector(".nav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () =>
    setOpen(!header.classList.contains("nav-open"))
  );

  nav.addEventListener("click", (e) => {
    if (e.target.closest(".nav__link")) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("nav-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (
      header.classList.contains("nav-open") &&
      !e.target.closest(".site-header")
    ) {
      setOpen(false);
    }
  });

  // If the viewport grows past the mobile breakpoint, ensure a clean state.
  const mq = window.matchMedia("(min-width: 769px)");
  mq.addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
}
