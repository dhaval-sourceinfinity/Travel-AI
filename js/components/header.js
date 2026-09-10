// header.js — site header / primary navigation (reused across pages).
import { brand } from "./brand.js";

const NAV_LINKS = [
  { label: "About Us", href: "about-us.html" },
  { label: "Packages", href: "journeys.html" },
  { label: "AI Planner", href: "ai-planner.html" },
  { label: "My Trips", href: "my-trips.html" },
  { label: "Blog", href: "blog-listing.html" },
  { label: "Profile", href: "profile.html" },
];

function currentPage() {
  const last = window.location.pathname.split("/").pop();
  return (last || "index.html").toLowerCase();
}

export function renderHeader() {
  const here = currentPage();
  const desktopLinks = NAV_LINKS.map((l) => {
    const target = l.href.split("#")[0].toLowerCase();
    const isCurrent = target === here || (l.href === "ai-planner.html" && here === "ai-planner-result.html");
    const current = isCurrent ? ' aria-current="page"' : "";
    return `<a class="nav__link" href="${l.href}"${current}>${l.label}</a>`;
  }).join("");

  const mobileLinks = NAV_LINKS.map((l) => {
    const target = l.href.split("#")[0].toLowerCase();
    const isCurrent = target === here || (l.href === "ai-planner.html" && here === "ai-planner-result.html");
    const current = isCurrent ? ' aria-current="page"' : "";
    return `<li class="mobile-drawer__item header-nav__item" data-drawer-item>
      <a class="mobile-drawer__link header-nav__link${isCurrent ? " is-current" : ""}" href="${l.href}"${current}>
        <span class="mobile-drawer__plus" aria-hidden="true">+</span>${l.label}
      </a>
    </li>`;
  }).join("");

  return `<div class="container site-header__inner">
    ${brand()}
    <nav class="nav" id="primary-nav" aria-label="Primary">
      ${desktopLinks}
    </nav>
    <div class="nav-actions">
      <a class="nav-link-signin" href="#login" data-auth-trigger="login">Sign In</a>
      <a class="btn btn--pill btn--accent nav-cta-btn" href="#signup" data-auth-trigger="signup">Get Started</a>
    </div>
    <div class="header__burger">
      <button class="nav-toggle btn-burger" type="button" aria-expanded="false"
              aria-controls="mobile-drawer" aria-label="Open menu">
        <span class="btn-burger__in" aria-hidden="true">
          <span class="btn-burger__line btn-burger__line--1"></span>
          <span class="btn-burger__line btn-burger__line--2"></span>
        </span>
      </button>
    </div>
  </div>
  <div class="mobile-drawer mobile-menu" id="mobile-drawer" aria-hidden="true">
    <div class="mobile-drawer__inner">
      <ul class="mobile-drawer__nav header-nav" role="list">
        ${mobileLinks}
      </ul>
      <div class="mobile-drawer__footer header__button mobile-visible">
        <div class="mobile-drawer__actions">
          <a class="nav-link-signin mobile-drawer__signin" href="#login" data-auth-trigger="login">Sign In</a>
          <a class="btn btn--pill btn--accent mobile-drawer__cta" href="#signup" data-auth-trigger="signup">Get Started</a>
        </div>
      </div>
    </div>
    <div class="header__dec header__dec--1" aria-hidden="true"></div>
  </div>`;
}

/** Wire up the mobile menu: toggle, Escape, outside-click, link-close, resize reset, and GSAP drawer choreography. */
export function initHeader(header) {
  const toggle = header.querySelector(".nav-toggle, .btn-burger");
  const drawer = header.querySelector(".mobile-drawer, .mobile-menu");
  if (!toggle) return;

  let isOpen = false;
  let isAnimating = false;

  const getLinks = () => (drawer ? drawer.querySelectorAll("[data-drawer-item], .mobile-drawer__item, .header-nav__item") : []);
  const getPlusIcons = () => (drawer ? drawer.querySelectorAll(".mobile-drawer__plus") : []);
  const getFooter = () => (drawer ? drawer.querySelector(".mobile-drawer__footer, .mobile-drawer__actions") : null);

  const setOpen = (open) => {
    if (open === isOpen && !isAnimating) return;
    isOpen = open;

    toggle.classList.toggle("is-active", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    header.classList.toggle("nav-open", open);
    document.body.classList.toggle("drawer-open", open);

    if (!drawer) return;

    drawer.setAttribute("aria-hidden", String(!open));

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasGsap = typeof window !== "undefined" && window.gsap;

    if (!hasGsap || prefersReducedMotion) {
      drawer.classList.toggle("is-active", open);
      return;
    }

    const items = getLinks();
    const pluses = getPlusIcons();
    const footer = getFooter();

    // Clear active tweens on drawer elements
    window.gsap.killTweensOf([drawer, items, pluses, footer]);

    if (open) {
      isAnimating = true;
      drawer.classList.add("is-active");

      const tl = window.gsap.timeline({
        onComplete: () => {
          isAnimating = false;
        },
      });

      // 1. Drawer background and container entrance
      tl.fromTo(
        drawer,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
      );

      // 2. Staggered navigation links reveal
      if (items.length) {
        tl.fromTo(
          items,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power3.out" },
          "-=0.3"
        );
      }

      // 3. Plus sign accents reveal with subtle rotation
      if (pluses.length) {
        tl.fromTo(
          pluses,
          { opacity: 0, scale: 0.5, rotation: -90 },
          { opacity: 1, scale: 1, rotation: 0, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" },
          "-=0.4"
        );
      }

      // 4. Mobile actions reveal
      if (footer) {
        tl.fromTo(
          footer,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
          "-=0.25"
        );
      }
    } else {
      isAnimating = true;
      const tl = window.gsap.timeline({
        onComplete: () => {
          drawer.classList.remove("is-active");
          window.gsap.set([drawer, items, pluses, footer], { clearProps: "all" });
          isAnimating = false;
        },
      });

      // Quick exit for items
      if (items.length) {
        tl.to(items, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: "power2.in",
          stagger: 0.02,
        });
      }

      if (footer) {
        tl.to(footer, { opacity: 0, y: -6, duration: 0.18, ease: "power2.in" }, 0);
      }

      // Drawer fade out
      tl.to(
        drawer,
        { opacity: 0, y: -16, duration: 0.28, ease: "power2.inOut" },
        "-=0.1"
      );
    }
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!isOpen);
  });

  if (drawer) {
    drawer.addEventListener("click", (e) => {
      if (e.target.closest("a, button, [data-auth-trigger]")) {
        setOpen(false);
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (isOpen && !e.target.closest(".site-header")) {
      setOpen(false);
    }
  });

  // If the viewport grows past the mobile breakpoint, reset to clean desktop state
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", (e) => {
    if (e.matches && isOpen) {
      setOpen(false);
      if (drawer && window.gsap) {
        window.gsap.set(drawer, { clearProps: "all" });
        window.gsap.set(getLinks(), { clearProps: "all" });
        window.gsap.set(getPlusIcons(), { clearProps: "all" });
        if (getFooter()) window.gsap.set(getFooter(), { clearProps: "all" });
      }
    }
  });
}
