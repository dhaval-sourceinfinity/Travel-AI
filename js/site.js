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
     5. Motion System — Cinematic Editorial Scroll Choreography
     ========================================================================== */

  const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const IS_MOBILE = window.matchMedia("(max-width: 768px)").matches;

  /* Scroll-progress window for editorial typography, as fractions of viewport
     height: the reveal starts when the heading's top passes `start` and
     completes when it reaches `end`. Resolution-independent and the single
     place to retune the feel. */
  const EDITORIAL_RANGE = {
    desktop: { start: 0.92, end: 0.32 },
    mobile: { start: 0.94, end: 0.38 },
  };

  /* ---- 5a. Legacy .reveal support (for journeys, contact, detail pages) -- */
  function initReveal(root = document) {
    const els = root.querySelectorAll(".reveal");
    if (!els.length) return;

    if (REDUCE_MOTION || !("IntersectionObserver" in window)) {
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

  /* ---- 5b. Data-motion reveal system ------------------------------------ */
  function initMotionReveal() {
    const els = document.querySelectorAll("[data-motion]");
    if (!els.length) return;

    if (REDUCE_MOTION || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    // Exclude hero elements — they are revealed by the hero entrance sequence
    const heroMotions = new Set([
      "hero-image", "hero-title", "hero-text", "hero-cta", "hero-content"
    ]);

    // copy-follow is driven entirely by --reveal-progress, so a one-shot
    // visibility trigger must never touch it. char-scroll is observed: its
    // characters are scroll-driven, but the heading itself takes a
    // transform-only entrance rise from .is-visible.
    const scrollDriven = new Set(["copy-follow"]);

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;

            const revealChild = (child) => {
              if (scrollDriven.has(child.getAttribute("data-motion"))) return;
              child.classList.add("is-visible");
            };

            // For stagger containers, reveal children in sequence
            if (el.hasAttribute("data-motion-stagger") || el.getAttribute("data-motion") === "stagger") {
              el.querySelectorAll("[data-motion]").forEach(revealChild);
            }

            // Cascade visibility to any nested motion elements (e.g. card images)
            el.querySelectorAll("[data-motion]").forEach(revealChild);

            el.classList.add("is-visible");
            obs.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    els.forEach((el) => {
      const motionType = el.getAttribute("data-motion");
      // Skip hero elements, scroll-driven typography, and stagger children
      if (heroMotions.has(motionType) || scrollDriven.has(motionType)) return;
      if (el.parentElement && (el.parentElement.hasAttribute("data-motion-stagger") || el.parentElement.getAttribute("data-motion") === "stagger")) return;
      // Skip nested motion elements whose ancestor already has [data-motion] (parent cascades reveal)
      if (el.parentElement && el.parentElement.closest("[data-motion]")) return;
      io.observe(el);
    });

    // Observe stagger containers themselves
    document.querySelectorAll('[data-motion-stagger], [data-motion="stagger"]').forEach((container) => {
      io.observe(container);
    });
  }

  /* ---- 5c. Hero entrance choreography ----------------------------------- */
  function initHeroEntrance() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const heroImage = hero.querySelector('[data-motion="hero-image"]');
    const heroTitle = hero.querySelector('[data-motion="hero-title"]');
    const heroText = hero.querySelector('[data-motion="hero-text"]');
    const heroCta = hero.querySelector('[data-motion="hero-cta"]');
    const heroContent = hero.querySelector('[data-motion="hero-content"]');
    const header = document.getElementById("site-header");

    if (REDUCE_MOTION) {
      [heroImage, heroTitle, heroText, heroCta, heroContent].forEach((el) => {
        if (el) el.classList.add("is-visible");
      });
      if (header) header.classList.add("is-visible");
      return;
    }

    // Sequence: Hero image → headline → supporting text → CTA
    const sequence = [
      { el: heroImage, delay: 50 },
      { el: heroTitle, delay: 350 },
      { el: heroText, delay: 650 },
      { el: heroCta, delay: 900 },
    ];

    // Mark hero-content visible immediately (it manages its own scroll state)
    if (heroContent) {
      heroContent.classList.add("is-visible");
    }

    sequence.forEach(({ el, delay }) => {
      if (!el) return;
      setTimeout(() => {
        el.classList.add("is-visible");
      }, delay);
    });

    // Header subtly reveals in tandem without interrupting hero narrative
    if (header) {
      setTimeout(() => {
        header.classList.add("is-visible");
      }, 300);

      const navLinks = header.querySelectorAll(".nav__link");
      navLinks.forEach((link, i) => {
        link.style.opacity = "0";
        link.style.transform = "translateY(-6px)";
        link.style.transition = `opacity 400ms var(--ease-reveal, cubic-bezier(.2,.8,.2,1)), transform 400ms var(--ease-reveal, cubic-bezier(.2,.8,.2,1))`;
        setTimeout(() => {
          link.style.opacity = "1";
          link.style.transform = "none";
        }, 400 + i * 70);
      });
    }

    // Once entrance completes, clear heroImage transition so scroll parallax is 100% immediate & responsive
    setTimeout(() => {
      if (heroImage) heroImage.style.transition = "none";
    }, 1600);
  }

  /* ---- 5d. Scroll-linked motion (Hero + subtle editorial parallax) ------- */
  function initScrollMotion() {
    if (REDUCE_MOTION) return;

    // Hero elements
    const hero = document.querySelector(".hero");
    const heroImage = hero ? hero.querySelector('[data-motion="hero-image"]') : null;
    const heroContent = hero ? hero.querySelector('[data-motion="hero-content"]') : null;

    // Editorial parallax elements (CTA background + Kyoto place card)
    const parallaxEls = Array.from(
      document.querySelectorAll('[data-motion="parallax"], [data-parallax]')
    );

    // Scroll-progressive editorial headings — these drive --reveal-progress
    const editorialEls = Array.from(
      document.querySelectorAll('[data-motion="char-scroll"]')
    );

    if (!hero && !parallaxEls.length && !editorialEls.length) return;

    let heroHeight = hero ? hero.offsetHeight : 0;
    let cachedParallax = [];
    let cachedEditorial = [];

    function cachePositions() {
      const isMobile = window.innerWidth <= 768;
      if (hero) {
        heroHeight = hero.offsetHeight;
      }
      // Batch every geometry read together; writes happen later, in the rAF tick
      const scrollY = window.scrollY;
      cachedParallax = parallaxEls.map((el) => {
        const rect = el.getBoundingClientRect();
        const isCta = el.classList.contains("cta__bg") || Boolean(el.closest(".cta"));
        return {
          el,
          isCta,
          docTop: rect.top + scrollY,
          height: rect.height,
          maxShift: isCta ? (isMobile ? 4 : 12) : (isMobile ? 0 : 8),
        };
      });
      cachedEditorial = editorialEls.map((el) => {
        const rect = el.getBoundingClientRect();
        const existing = cachedEditorial.find((item) => item.el === el);
        return {
          el,
          // Progress is published where both the heading and its supporting
          // copy can inherit it; falls back to the heading itself.
          scope: el.closest("[data-motion-scope]") || el,
          docTop: rect.top + scrollY,
          height: rect.height,
          lastP: existing ? existing.lastP : -1,
          settled: existing ? existing.settled : false,
        };
      });
    }

    cachePositions();

    let ticking = false;
    let lastScrollY = window.scrollY;

    function onScroll() {
      lastScrollY = window.scrollY;
      if (heroImage && heroImage.style.transition !== "none") {
        heroImage.style.transition = "none";
      }
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrollMotion);
      }
    }

    function updateScrollMotion() {
      ticking = false;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const scrollY = lastScrollY;
      const viewportH = window.innerHeight;
      const isMobile = window.innerWidth <= 768;

      // 1. Hero scroll effects (only while hero is in/near view)
      if (hero && scrollY <= heroHeight * 1.2) {
        const progress = Math.min(scrollY / heroHeight, 1);

        if (heroImage) {
          const imgY = scrollY * (isMobile ? 0.03 : 0.08);
          const imgScale = 1 + progress * (isMobile ? 0.02 : 0.04);
          heroImage.style.transform = `translateY(${imgY}px) scale(${imgScale})`;
        }

        if (heroContent) {
          const contentOpacity = Math.max(0, 1 - progress * 1.6);
          const contentY = -scrollY * (isMobile ? 0.12 : 0.2);
          heroContent.style.setProperty("--hero-scroll-opacity", contentOpacity);
          heroContent.style.setProperty("--hero-scroll-y", contentY + "px");
          heroContent.style.opacity = contentOpacity;
          heroContent.style.transform = `translateY(${contentY}px)`;
        }
      }

      // 2. Scroll-progressive editorial headings
      //    Progress is a pure function of scroll position — no timers, so a
      //    paused scroll holds progress and an upward scroll reverses it.
      if (cachedEditorial.length) {
        const range = isMobile ? EDITORIAL_RANGE.mobile : EDITORIAL_RANGE.desktop;
        const startPx = viewportH * range.start;
        const endPx = viewportH * range.end;
        const span = startPx - endPx;

        for (let i = 0; i < cachedEditorial.length; i++) {
          const item = cachedEditorial[i];
          const top = item.docTop - scrollY;

          // Skip elements well outside the window, but write the boundary once
          if (top > startPx && item.lastP === 0) continue;
          if (top < endPx && item.lastP === 1) continue;

          // Linear: brightness advances in direct proportion to scroll distance,
          // so every part of the window shows a distinct intermediate state.
          // Softness comes from the per-character overlap (fade/span), not from
          // an easing curve that would compress the reveal into mid-window.
          const raw = span > 0 ? (startPx - top) / span : 1;
          const p = raw <= 0 ? 0 : raw >= 1 ? 1 : raw;

          // Latch before the epsilon gate: the last step into a boundary is
          // often smaller than the gate, but it is the one that matters.
          const settled = p === 1;
          if (settled !== item.settled) {
            item.settled = settled;
            item.scope.classList.toggle("is-settled", settled);
          }

          if (p === item.lastP) continue;
          const atBoundary = p === 0 || p === 1;
          if (item.lastP >= 0 && !atBoundary && Math.abs(p - item.lastP) < 0.004) continue;
          item.lastP = p;
          item.scope.style.setProperty("--reveal-progress", p.toFixed(3));
        }
      }

      // 3. Editorial parallax elements (zero forced reflow during scroll)
      if (cachedParallax.length) {
        for (let i = 0; i < cachedParallax.length; i++) {
          const item = cachedParallax[i];
          const currentTop = item.docTop - scrollY;

          // Only process while element is in or near viewport
          if (currentTop + item.height < -60 || currentTop > viewportH + 60) continue;

          if (item.maxShift === 0) {
            item.el.style.setProperty("--parallax-y", "0px");
            continue;
          }

          // Center of element relative to viewport center (-1 to +1)
          const center = currentTop + item.height / 2;
          const offset = (center - viewportH / 2) / viewportH;
          const translateY = Math.round(offset * -item.maxShift * 10) / 10;

          item.el.style.setProperty("--parallax-y", `${translateY}px`);
          if (item.el.getAttribute("data-motion") === "parallax") {
            item.el.style.transform = `translateY(${translateY}px)`;
          }
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    // Debounced resize to update cached document coordinates
    let resizeTimer;
    window.addEventListener(
      "resize",
      () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          cachePositions();
          updateScrollMotion();
        }, 150);
      },
      { passive: true }
    );

    // Lazy images and late fonts shift document offsets — re-measure once settled
    window.addEventListener(
      "load",
      () => {
        cachePositions();
        updateScrollMotion();
      },
      { once: true, passive: true }
    );
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        cachePositions();
        updateScrollMotion();
      });
    }

    // Initial update in case page loaded pre-scrolled
    updateScrollMotion();
  }

  /* ---- 5f. Editorial typography reveals (line-reveal & char-scroll) ------ */
  function prepareLineReveal(el) {
    if (REDUCE_MOTION) return;
    if (!el.dataset.origHtml) {
      el.dataset.origHtml = el.innerHTML;
    }
    const rawHtml = el.dataset.origHtml;

    // Preserve original accessible text on the semantic container
    const temp = document.createElement("div");
    temp.innerHTML = rawHtml;
    const accessibleText = temp.textContent.replace(/\s+/g, " ").trim();
    el.setAttribute("aria-label", accessibleText);

    // Split words while honoring explicit <br> line breaks
    const tokens = rawHtml
      .replace(/<br\s*\/?>/gi, " __BR__ ")
      .split(/\s+/)
      .filter(Boolean);

    // Pass 1: Render temporary word spans to measure offsetTop in current layout
    el.innerHTML = tokens
      .map((token) => {
        if (token === "__BR__") return '<span class="motion-br" style="display:block;"></span>';
        return `<span class="motion-measure-word" style="display:inline-block;">${token}</span>`;
      })
      .join(" ");

    const wordSpans = el.querySelectorAll(".motion-measure-word");
    if (!wordSpans.length) {
      el.innerHTML = rawHtml;
      return;
    }

    // Pass 2: Group words into lines according to rendered vertical position
    const lines = [];
    let currentLine = [];
    let currentTop = null;

    wordSpans.forEach((span) => {
      const top = span.offsetTop;
      if (currentTop === null || Math.abs(top - currentTop) <= 4) {
        currentLine.push(span.textContent);
        if (currentTop === null) currentTop = top;
      } else {
        lines.push(currentLine.join(" "));
        currentLine = [span.textContent];
        currentTop = top;
      }
    });
    if (currentLine.length) {
      lines.push(currentLine.join(" "));
    }

    // Pass 3: Construct masked line DOM with descender protection
    const isAlreadyVisible = el.classList.contains("is-visible");
    const transitionOverride = isAlreadyVisible ? "transition: none;" : "";

    el.innerHTML = lines
      .map(
        (line, i) =>
          `<span class="line-mask" aria-hidden="true"><span class="line-inner" style="--line-index: ${i}; ${transitionOverride}">${line}</span></span>`
      )
      .join("");
  }

  /* Headings longer than this keep their text intact and brighten as a whole,
     rather than producing an unhelpfully long character chain. */
  const CHAR_SPLIT_MAX = 120;

  /**
   * Split an editorial heading into per-character spans for scroll-progressive
   * lighting, walking the DOM instead of flattening to text so that explicit
   * <br> line breaks (and any inline markup) survive intact.
   *
   * Characters stay display:inline and carry no transform, so the split text
   * occupies exactly the same box as the original — no reflow, no layout shift.
   * Whitespace advances the index but is left as a real text node, which keeps
   * native line breaking and kerning working.
   */
  function prepareCharScroll(el) {
    if (REDUCE_MOTION) return;
    if (!el.dataset.origHtml) {
      el.dataset.origHtml = el.innerHTML;
    }
    const rawHtml = el.dataset.origHtml;

    const source = document.createElement("div");
    source.innerHTML = rawHtml;

    // <br> carries no text, so treat it as a word boundary — otherwise the
    // accessible string reads "destinations.So much" across a line break.
    const readable = document.createElement("div");
    readable.innerHTML = rawHtml.replace(/<br\s*\/?>/gi, " ");
    const accessibleText = readable.textContent.replace(/\s+/g, " ").trim();

    // Very long statements brighten as a single unit — same engine, same tokens
    if (accessibleText.length > CHAR_SPLIT_MAX) {
      el.classList.add("is-whole");
      el.innerHTML = rawHtml;
      return;
    }
    el.classList.remove("is-whole");

    let charIndex = 0;

    function splitNode(node, target) {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          Array.from(child.textContent).forEach((char) => {
            if (/\s/.test(char)) {
              // Keep real whitespace: no glyph to light, and wrapping stays native
              target.appendChild(document.createTextNode(char));
              charIndex++;
              return;
            }
            const span = document.createElement("span");
            span.className = "char-unit";
            span.style.setProperty("--i", charIndex++);
            span.textContent = char;
            target.appendChild(span);
          });
          return;
        }
        if (child.nodeType !== Node.ELEMENT_NODE) return;
        if (child.tagName === "BR") {
          target.appendChild(document.createElement("br"));
          return;
        }
        // Preserve any inline wrapper (em, span, …) and split inside it
        const clone = child.cloneNode(false);
        splitNode(child, clone);
        target.appendChild(clone);
      });
    }

    const layer = document.createElement("span");
    layer.className = "char-layer";
    layer.setAttribute("aria-hidden", "true");
    splitNode(source, layer);
    layer.style.setProperty("--char-total", Math.max(charIndex, 1));

    // One coherent accessible string; the visual layer is hidden from AT.
    const accessible = document.createElement("span");
    accessible.className = "sr-only";
    accessible.textContent = accessibleText;

    el.textContent = "";
    el.appendChild(accessible);
    el.appendChild(layer);

    // Superseded by the accessible child — clear any label left by an earlier pass
    el.removeAttribute("aria-label");
  }

  function initTypographyReveals() {
    if (REDUCE_MOTION) return;

    const lineEls = document.querySelectorAll('[data-motion="line-reveal"]');
    const charEls = document.querySelectorAll('[data-motion="char-scroll"]');

    lineEls.forEach(prepareLineReveal);
    charEls.forEach(prepareCharScroll);

    // If fonts load after boot, re-evaluate lines once with exact font metrics
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        lineEls.forEach(prepareLineReveal);
      });
    }

    // Debounced resize handler to re-calculate lines if viewport width changes
    let resizeTimer = null;
    let lastWidth = window.innerWidth;

    window.addEventListener(
      "resize",
      () => {
        const currentWidth = window.innerWidth;
        if (currentWidth === lastWidth) return; // Ignore mobile height-only scroll resizes
        lastWidth = currentWidth;

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          lineEls.forEach(prepareLineReveal);
          // Re-split only if the length fallback flips at this width
          charEls.forEach(prepareCharScroll);
        }, 180);
      },
      { passive: true }
    );
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
    return `<article class="journey-card" data-motion="fade-in">
      <div class="journey-card__media">
        <img class="journey-card__img" src="${j.image.src}" alt="${j.image.alt}"${loading} decoding="async" data-motion="image-reveal" />
        <span class="journey-card__tag">${j.tag}</span>
      </div>
      <div class="journey-card__body">
        <p class="journey-card__meta" data-motion="text-reveal">${j.duration}</p>
        <h${h} class="journey-card__title" data-motion="text-reveal">${j.title}</h${h}>
        <p class="journey-card__text" data-motion="text-reveal">${j.excerpt}</p>
        <div class="journey-card__footer">
          <p class="journey-card__price" data-motion="text-reveal" style="--text-index: 3">From <strong>${j.priceFrom}</strong> per person</p>
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

    // Home: featured journeys (render before motion init so cards exist in DOM)
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

    // ---- Motion system ----
    // Split editorial typography (char-scroll) before the scroll engine registers it
    initTypographyReveals();

    // Legacy .reveal for non-homepage pages
    initReveal();

    // New cinematic motion (data-motion attributes)
    initMotionReveal();

    // Hero entrance animation (sequenced page-load)
    initHeroEntrance();

    // Scroll-linked motion (Hero + subtle editorial parallax)
    initScrollMotion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

