// header.js — site header / primary navigation (reused across pages).
import { brand } from "./brand.js";

const NAV_LINKS = [
  { label: "About Us", href: "about-us.html" },
  { label: "Packages", href: "journeys.html" },
  { label: "AI Planner", href: "ai-planner.html" },
  { label: "My Trips", href: "my-trips.html" },
  { label: "Blog", href: "blog-listing.html" },
];

function currentPage() {
  const last = window.location.pathname.split("/").pop();
  return (last || "index.html").toLowerCase();
}

export function renderHeader() {
  const here = currentPage();
  const links = NAV_LINKS.map((l) => {
    const target = l.href.split("#")[0].toLowerCase();
    const isCurrent = target === here || (l.href === "ai-planner.html" && here === "ai-planner-result.html");
    const current = isCurrent ? ' aria-current="page"' : "";
    return `<a class="nav__link" href="${l.href}"${current}>${l.label}</a>`;
  }).join("");

  return `<div class="container site-header__inner">
    ${brand()}
    <nav class="nav" id="primary-nav" aria-label="Primary">
      ${links}
      <div class="nav__mobile-actions">
        <a class="nav-link-signin" href="#login" data-auth-trigger="login">Sign In</a>
        <a class="btn btn--pill btn--accent" href="#signup" data-auth-trigger="signup">Get Started</a>
      </div>
    </nav>
    <div class="nav-actions">
      <a class="nav-link-signin" href="#login" data-auth-trigger="login">Sign In</a>
      <a class="btn btn--pill btn--accent nav-cta-btn" href="#signup" data-auth-trigger="signup">Get Started</a>
    </div>
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
    if (e.target.closest(".nav__link, .nav-link-signin, .btn")) setOpen(false);
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
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
}
