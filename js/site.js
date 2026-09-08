/**
 * site.js — Standalone script for Travel AI.
 * 
 * Works seamlessly both over HTTP servers (Live Server, Node, Python, Nginx)
 * and directly via file:// (double-clicking the HTML file in any browser)
 * without CORS restrictions.
 */
(function () {
  "use strict";

  /* ==========================================================================
     1. Brand & Shared Icons
     ========================================================================== */
  const brandMark = `<svg class="brand__mark" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 1.6 9.28 5.68H13.6L10.08 8.24 11.44 12.32 8 9.76 4.56 12.32 5.92 8.24 2.4 5.68H6.72L8 1.6Z"/></svg>`;

  function brand(extraClass = "") {
    return `<a class="brand ${extraClass}" href="index.html" aria-label="Travel AI — home">
      ${brandMark}
      <span>Travel <span class="brand__ai">AI</span></span>
    </a>`;
  }

  const arrow = `<svg class="icon icon--arrow" viewBox="0 0 9 9" aria-hidden="true" focusable="false"><path d="M2.25 6.75 6.75 2.25M6.75 5.76V2.25H3.24" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* ==========================================================================
     2. Header Component
     ========================================================================== */
  const NAV_LINKS = [
    { label: "About Us", href: "index.html#about" },
    { label: "How it Works", href: "index.html#how" },
    { label: "For Advisors", href: "index.html#advisors" },
    { label: "Blog", href: "404.html" },
  ];

  function renderHeader() {
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

  function initHeader(header) {
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

    const mq = window.matchMedia("(min-width: 769px)");
    mq.addEventListener("change", (e) => {
      if (e.matches) setOpen(false);
    });
  }

  /* ==========================================================================
     3. Footer Component
     ========================================================================== */
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
        { label: "Our Story", href: "index.html#about" },
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

  const LEGAL = ["Terms", "Privacy", "Booking Terms", "Cancellation Policy"];

  function renderFooter() {
    const cols = COLUMNS.map(
      (c) => `<nav class="footer-col" aria-label="${c.head}">
        <h2 class="footer-col__head">${c.head}</h2>
        ${c.links
          .map((l) => `<a class="footer-link" href="${l.href}">${l.label}</a>`)
          .join("")}
      </nav>`
    ).join("");

    const legal = LEGAL.map((l) => `<a href="404.html">${l}</a>`).join("");

    return `<div class="container">
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

  /* ==========================================================================
     4. Shell Mount (Header & Footer)
     ========================================================================== */
  function mountShell() {
    const headerEl = document.getElementById("site-header");
    if (headerEl) {
      headerEl.innerHTML = renderHeader();
      initHeader(headerEl);
    }

    const footerEl = document.getElementById("site-footer");
    if (footerEl) {
      footerEl.innerHTML = renderFooter();
    }

    document.documentElement.classList.add("js-ready");
  }

  /* ==========================================================================
     5. Reveal On Scroll
     ========================================================================== */
  function initReveal(root = document) {
    const els = root.querySelectorAll(".reveal");
    if (!els.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    els.forEach((el) => io.observe(el));
  }

  /* ==========================================================================
     6. Journeys Data & Journey Card Component
     ========================================================================== */
  const base = {
    dubai: {
      region: "Dubai",
      tag: "DUBAI",
      duration: "7 Days · 6 Nights",
      title: "The Dubai Signature Journey",
      excerpt:
        "A considered introduction to Dubai, bringing together iconic experiences, time to unwind and moments beyond the expected.",
      priceFrom: "NZ$X,XXX",
      href: "journey-details.html",
    },
    japan: {
      region: "Japan",
      tag: "JAPAN",
      duration: "10 Days · 9 Nights",
      title: "Japan, Beyond the Expected",
      excerpt:
        "Tokyo's energy. Kyoto's traditions. Osaka's character. A journey designed to let you experience more than the highlights.",
      priceFrom: "NZ$X,XXX",
      href: "journey-details.html",
    },
  };

  const journeysFeatured = [
    {
      ...base.dubai,
      image: {
        src: "assets/images/journey-dubai.webp",
        alt: "Burj Al Arab rising above the Dubai coastline",
      },
    },
    {
      ...base.japan,
      image: {
        src: "assets/images/journey-japan.webp",
        alt: "Pagoda surrounded by trees and mountains in Japan",
      },
    },
  ];

  const journeysAll = [
    {
      ...base.dubai,
      image: {
        src: "assets/images/journeys/dubai-1.webp",
        alt: "Aerial view of Palm Jumeirah, Dubai",
      },
    },
    {
      ...base.japan,
      image: {
        src: "assets/images/journeys/japan-1.webp",
        alt: "Red five-storied pagoda with mountains beyond, Japan",
      },
    },
    {
      ...base.dubai,
      image: {
        src: "assets/images/journeys/dubai-2.webp",
        alt: "Aerial view of the Burj Al Arab and the Dubai coastline",
      },
    },
    {
      ...base.japan,
      image: {
        src: "assets/images/journeys/japan-2.webp",
        alt: "Traveller with a red parasol in a historic Kyoto street at dusk",
      },
    },
    {
      ...base.dubai,
      image: {
        src: "assets/images/journeys/dubai-3.webp",
        alt: "The Burj Al Arab viewed across Madinat Jumeirah, Dubai",
      },
    },
    {
      ...base.japan,
      image: {
        src: "assets/images/journeys/japan-3.webp",
        alt: "Pagoda beside Nachi Falls surrounded by forest, Japan",
      },
    },
  ];

  function journeyCard(j, { lazy = true, headingLevel = 3 } = {}) {
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

  /* ==========================================================================
     7. Page-Specific Initializers
     ========================================================================== */

  // Home Page: Explore section chips
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

  // Journey Details Page: Sidebar scrollspy
  function initScrollspy() {
    const links = [...document.querySelectorAll(".pkg__nav a")];
    if (!links.length || !("IntersectionObserver" in window)) return;

    const map = new Map();
    links.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const section = document.getElementById(id);
      if (section) map.set(section, a);
    });
    if (!map.size) return;

    const setActive = (link) =>
      links.forEach((a) =>
        a.setAttribute("aria-current", String(a === link))
      );

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(map.get(visible.target));
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    map.forEach((_, section) => io.observe(section));
  }

  // Contact Page: Accessible form handling
  function initContactForm() {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    const statusEl = document.getElementById("form-status");
    const submitBtn = form.querySelector('button[type="submit"]');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const rules = {
      name: (v) => (v.trim() ? "" : "Please enter your name."),
      email: (v) =>
        !v.trim()
          ? "Please enter your email."
          : emailRe.test(v.trim())
          ? ""
          : "Please enter a valid email address.",
      message: (v) => (v.trim() ? "" : "Please enter a message."),
    };

    const fieldEl = (name) => form.elements[name];
    const wrapOf = (input) => input.closest(".field");
    const errorOf = (input) =>
      document.getElementById(input.getAttribute("aria-describedby"));

    function setError(input, msg) {
      const wrap = wrapOf(input);
      const err = errorOf(input);
      if (msg) {
        wrap.setAttribute("data-invalid", "true");
        input.setAttribute("aria-invalid", "true");
        if (err) err.textContent = msg;
      } else {
        wrap.removeAttribute("data-invalid");
        input.removeAttribute("aria-invalid");
        if (err) err.textContent = "";
      }
    }

    function validateField(name) {
      const input = fieldEl(name);
      const msg = rules[name](input.value);
      setError(input, msg);
      return !msg;
    }

    Object.keys(rules).forEach((name) => {
      const input = fieldEl(name);
      if (input) {
        input.addEventListener("input", () => {
          if (wrapOf(input).getAttribute("data-invalid") === "true") {
            validateField(name);
          }
        });
      }
    });

    let submitting = false;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (submitting) return;

      statusEl.textContent = "";
      statusEl.removeAttribute("data-state");

      const results = Object.keys(rules).map(validateField);
      if (results.includes(false)) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        statusEl.setAttribute("data-state", "error");
        statusEl.textContent = "Please fix the highlighted fields.";
        return;
      }

      submitting = true;
      submitBtn.setAttribute("aria-busy", "true");
      const label = submitBtn.childNodes[0];
      const original = label.textContent;
      label.textContent = "Sending… ";

      window.setTimeout(() => {
        submitting = false;
        submitBtn.removeAttribute("aria-busy");
        label.textContent = original;
        form.reset();
        statusEl.setAttribute("data-state", "success");
        statusEl.textContent = "Thanks — we'll be in touch soon.";
      }, 900);
    });
  }

  /* ==========================================================================
     8. Application Boot
     ========================================================================== */
  function boot() {
    // Shared chrome
    mountShell();

    // Home: featured journeys
    const featuredGrid = document.querySelector('[data-journeys="featured"]');
    if (featuredGrid) {
      featuredGrid.innerHTML = journeysFeatured
        .map((j) => journeyCard(j))
        .join("");
    }

    // Journeys: full list
    const allGrid = document.querySelector('[data-journeys="all"]');
    if (allGrid) {
      allGrid.innerHTML = journeysAll
        .map((j, i) => journeyCard(j, { lazy: i >= 2, headingLevel: 2 }))
        .join("");
    }

    // Explore chips (home)
    initExplore();

    // Scrollspy (detail page)
    initScrollspy();

    // Contact form (contact page)
    initContactForm();

    // Scroll reveal observer
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
