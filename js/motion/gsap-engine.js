/**
 * gsap-engine.js — Travel AI Central GSAP & ScrollTrigger Motion Engine
 * 
 * Provides unified, accessible, and performant scroll-driven animations
 * for the Travel AI platform. Works with data-motion attributes, supports
 * nested child cascading (e.g. cards, steps, timeline rows, and panels),
 * and preserves full compatibility with native CSS and fallback systems.
 */
(function (root) {
  "use strict";

  let isInitialized = false;
  let isReducedMotion = false;
  let lenisInstance = null;
  let tickerCallback = null;
  let anchorListenerAttached = false;
  const activeTriggers = [];

  // Excluded from standard standalone scroll-trigger reveals (managed by hero page-load sequences)
  const HERO_MOTIONS = new Set([
    "hero-image",
    "hero-overlay",
    "hero-title",
    "hero-text",
    "hero-cta",
    "hero-content",
    "about-hero-image",
    "about-hero-title",
    "about-hero-eyebrow",
    "about-hero-lede",
    "contact-image",
    "contact-title",
    "contact-eyebrow",
    "contact-sub",
    "contact-form",
  ]);

  const SCROLL_DRIVEN_MOTIONS = new Set(["copy-follow", "char-scroll"]);

  const TravelMotion = {
    /**
     * Checks if GSAP & ScrollTrigger are available in the browser.
     */
    isReady: function () {
      return (
        typeof root.gsap !== "undefined" &&
        typeof root.ScrollTrigger !== "undefined" &&
        typeof root.TravelMotionPresets !== "undefined"
      );
    },

    /**
     * Returns whether prefers-reduced-motion is active.
     */
    hasReducedMotion: function () {
      return (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    },

    /**
     * Core initialization of the GSAP motion engine.
     */
    init: function () {
      if (!this.isReady()) {
        console.warn("[TravelMotion] GSAP or ScrollTrigger not loaded; keeping native fallback.");
        return false;
      }

      const gsap = root.gsap;
      const ScrollTrigger = root.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      if (root.MorphSVGPlugin) {
        gsap.registerPlugin(root.MorphSVGPlugin);
      }

      isReducedMotion = this.hasReducedMotion();

      // Mark HTML as having active GSAP motion engine
      if (typeof document !== "undefined") {
        document.documentElement.classList.add("gsap-active");
      }

      // Handle reduced motion preference
      if (isReducedMotion) {
        this.applyReducedMotion();
        this.watchReducedMotion();
        isInitialized = true;
        return true;
      }

      this.watchReducedMotion();

      // Initialize smooth scrolling (desktop / fine pointer only, disabled for reduced motion)
      this.initSmoothScroll();

      // Initialize all motion categories
      this.initChoreographedSections();
      this.initStaggerContainers();
      this.initStandaloneElements();
      this.initTypographyReveals();
      this.initDestinations();
      this.initJourneys();
      this.initExploreSection();
      this.initTestimonialsEditorial();
      this.initFooterBounce();

      // Bind resize & font load listeners for geometry recalculations
      this.bindMetricsWatchers();

      // Refresh ScrollTrigger once DOM layout is settled
      ScrollTrigger.refresh();

      isInitialized = true;
      return true;
    },

    /**
     * Initializes Lenis smooth scrolling and synchronizes it with GSAP ScrollTrigger.
     * Respects prefers-reduced-motion, avoids mobile touch hijacking, and keeps native scroll
     * on touch/coarse pointers.
     */
    initSmoothScroll: function () {
      if (isReducedMotion || typeof root.Lenis === "undefined") return null;

      // Clean up any existing instance first
      this.destroySmoothScroll();

      const presets = root.TravelMotionPresets;
      const config = (presets && presets.smoothScroll) || {
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
      };

      try {
        lenisInstance = new root.Lenis({
          duration: config.duration,
          easing: config.easing,
          smoothWheel: config.smoothWheel,
          touchMultiplier: 0, // completely bypass touch on mobile (preserves native kinetic scroll)
          infinite: false,
        });

        // Synchronize Lenis scroll events directly with GSAP ScrollTrigger
        if (root.ScrollTrigger) {
          lenisInstance.on("scroll", root.ScrollTrigger.update);
        }

        // Drive Lenis from GSAP's central requestAnimationFrame ticker
        if (root.gsap && root.gsap.ticker) {
          tickerCallback = (time) => {
            if (lenisInstance) {
              lenisInstance.raf(time * 1000);
            }
          };
          root.gsap.ticker.add(tickerCallback);
          root.gsap.ticker.lagSmoothing(0);
        }

        // Programmatic smooth scrolling for anchor links (e.g. #destinations)
        this.bindAnchorLinks();

        return lenisInstance;
      } catch (err) {
        console.warn("[TravelMotion] Error initializing smooth scrolling:", err);
        return null;
      }
    },

    /**
     * Destroys the smooth scroll instance and cleans up ticker listeners.
     */
    destroySmoothScroll: function () {
      if (tickerCallback && root.gsap && root.gsap.ticker) {
        root.gsap.ticker.remove(tickerCallback);
        tickerCallback = null;
      }
      if (lenisInstance) {
        if (root.ScrollTrigger && lenisInstance.off) {
          lenisInstance.off("scroll", root.ScrollTrigger.update);
        }
        if (typeof lenisInstance.destroy === "function") {
          lenisInstance.destroy();
        }
        lenisInstance = null;
      }
    },

    /**
     * Pauses Lenis smooth scrolling (e.g., when an overlay modal is active).
     */
    stopScroll: function () {
      if (lenisInstance && typeof lenisInstance.stop === "function") {
        lenisInstance.stop();
      }
    },

    /**
     * Resumes Lenis smooth scrolling (e.g., when an overlay modal closes).
     */
    startScroll: function () {
      if (lenisInstance && typeof lenisInstance.start === "function") {
        lenisInstance.start();
      }
    },

    /**
     * Returns the active Lenis smooth scroll instance if available.
     */
    getLenis: function () {
      return lenisInstance;
    },

    /**
     * Binds internal anchor links so they smoothly scroll using Lenis or native behavior,
     * maintaining accessibility focus rings on navigation targets.
     */
    bindAnchorLinks: function () {
      if (anchorListenerAttached || typeof document === "undefined") return;
      anchorListenerAttached = true;

      document.addEventListener("click", (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const hash = link.getAttribute("href");
        if (!hash || hash === "#") return;
        try {
          const target = document.querySelector(hash);
          if (target && lenisInstance && !isReducedMotion) {
            e.preventDefault();
            lenisInstance.scrollTo(target, {
              offset: 0,
              duration: 1.15,
              onComplete: () => {
                if (
                  target.getAttribute("tabindex") === null &&
                  target.tagName !== "A" &&
                  target.tagName !== "BUTTON" &&
                  target.tagName !== "INPUT"
                ) {
                  target.setAttribute("tabindex", "-1");
                }
                target.focus({ preventScroll: true });
              },
            });
          }
        } catch (err) {
          // Ignore invalid selector queries
        }
      });
    },

    /**
     * Returns the active smooth scroll instance.
     */
    getSmoother: function () {
      return lenisInstance;
    },

    /**
     * Instantly makes all animated elements visible for reduced-motion users.
     */
    applyReducedMotion: function () {
      if (typeof document === "undefined") return;
      this.destroySmoothScroll();
      const els = document.querySelectorAll("[data-motion], .reveal, [data-motion-stagger]");
      els.forEach((el) => {
        el.classList.add("is-visible");
        if (root.gsap) {
          root.gsap.set(el, { clearProps: "all" });
        }
      });
      const testSection = document.querySelector(".testimonials-section");
      if (testSection && root.gsap) {
        root.gsap.set(
          testSection.querySelectorAll(
            ".testimonials-card, .testimonials-eyebrow, .testimonials-label, .testimonials-headline, .testimonials-note__plus, .testimonials-note"
          ),
          { clearProps: "all" }
        );
      }
      const destSection = document.querySelector("#destinations");
      if (destSection && root.gsap) {
        root.gsap.set(
          destSection.querySelectorAll(
            ".dest-card, .dest-card__img, .dest-card__body, .dest-card__eyebrow, .dest-card__title, .dest-card__text, .btn, .eyebrow"
          ),
          { clearProps: "all" }
        );
      }
      const journeysSection = document.querySelector("#journeys");
      if (journeysSection && root.gsap) {
        root.gsap.set(
          journeysSection.querySelectorAll(
            ".journey-card, .journey-card__img, .journey-card__body, .journey-card__meta, .journey-card__title, .journey-card__text, .journey-card__footer, .btn, .icon--arrow"
          ),
          { clearProps: "all" }
        );
      }
      const exploreSection = document.querySelector("#explore");
      if (exploreSection && root.gsap) {
        root.gsap.set(
          exploreSection.querySelectorAll(
            ".place-card, .place-card__img, .place-card__body, .place-card__title, .place-card__text, .place-card__actions, .btn, .explore-tabs, .explore-places, .chip, .place"
          ),
          { clearProps: "all" }
        );
      }
      const bouncyPath = document.querySelector("#bouncy-path");
      if (bouncyPath) {
        bouncyPath.setAttribute("d", "M0-0.3C0-0.3,464,0,1139,0s1139-0.3,1139-0.3V683H0V-0.3z");
      }
      // Kill any active triggers
      if (root.ScrollTrigger) {
        root.ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    },

    /**
     * Watches for changes to prefers-reduced-motion mid-session.
     */
    watchReducedMotion: function () {
      if (typeof window === "undefined" || !window.matchMedia) return;
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handler = (e) => {
        isReducedMotion = e.matches;
        if (isReducedMotion) {
          this.applyReducedMotion();
        } else {
          this.refresh();
        }
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handler);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handler);
      }
    },

    /**
     * Cascades motion reveals to all nested [data-motion] elements within a parent container
     * (e.g. cards, steps, timeline rows, or panels containing text-reveal and image-reveal).
     */
    cascadeNestedMotion: function (parentEl, baseDelay = 0) {
      if (!parentEl || isReducedMotion) return;
      const gsap = root.gsap;
      const presets = root.TravelMotionPresets;
      const distances = presets.getDistances();
      const staggers = presets.getStaggers();

      // Query all descendants with data-motion
      const nestedEls = Array.from(parentEl.querySelectorAll("[data-motion]"));
      if (!nestedEls.length) return;

      // Filter out scroll-driven elements (copy-follow, char-scroll)
      const actionable = nestedEls.filter(
        (el) => !SCROLL_DRIVEN_MOTIONS.has(el.getAttribute("data-motion"))
      );
      if (!actionable.length) return;

      const images = actionable.filter((el) => el.getAttribute("data-motion") === "image-reveal");
      const texts = actionable.filter((el) => el.getAttribute("data-motion") === "text-reveal");
      const others = actionable.filter(
        (el) =>
          el.getAttribute("data-motion") !== "image-reveal" &&
          el.getAttribute("data-motion") !== "text-reveal"
      );

      // 1. Animate nested images
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { opacity: 0.9, scale: 1.04 },
          {
            opacity: 1,
            scale: 1,
            duration: presets.durations.reveal,
            ease: presets.easings.cinematic,
            delay: baseDelay,
            clearProps: "transform,opacity",
            onComplete: () => {
              img.classList.add("is-visible");
            },
          }
        );
      });

      // 2. Animate nested text reveals with sequential rise
      texts.forEach((textEl, idx) => {
        const isQuiet = presets.isCardInterior(textEl);
        const yDist = isQuiet ? distances.textRiseCard : distances.textRiseEditorial;
        const delay = baseDelay + idx * staggers.small;

        gsap.fromTo(
          textEl,
          { opacity: 0, y: yDist },
          {
            opacity: 1,
            y: 0,
            duration: presets.durations.reveal,
            ease: presets.easings.reveal,
            delay: delay,
            clearProps: "transform,opacity",
            onComplete: () => {
              textEl.classList.add("is-visible");
            },
          }
        );
      });

      // 3. Animate other nested primitives
      others.forEach((otherEl, idx) => {
        const mType = otherEl.getAttribute("data-motion");
        const config = presets.getPrimitiveConfig(mType, otherEl);
        const delay = baseDelay + idx * staggers.small;

        gsap.fromTo(otherEl, config.from, {
          ...config.to,
          delay: delay,
          onComplete: () => {
            otherEl.classList.add("is-visible");
            if (config.to.clearProps) {
              gsap.set(otherEl, { clearProps: config.to.clearProps });
            }
          },
        });
      });
    },

    /**
     * Initializes section-level choreography for sections tagged with [data-motion-choreography].
     */
    initChoreographedSections: function () {
      const sections = document.querySelectorAll("[data-motion-choreography]");
      sections.forEach((section) => {
        this.createSectionTimeline(section);
      });
    },

    /**
     * Builds a unified section-level timeline where related elements enter in harmony:
     * Eyebrow/Label -> Title -> Supporting Copy -> Divider -> Content/Cards -> CTA.
     */
    createSectionTimeline: function (section, customOptions = {}) {
      if (isReducedMotion || !section) return null;
      const gsap = root.gsap;
      const presets = root.TravelMotionPresets;
      const defaults = presets.scrollTriggerDefaults;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: customOptions.start || defaults.start,
          once: customOptions.once !== undefined ? customOptions.once : defaults.once,
        },
      });

      // 1. Eyebrow or label
      const eyebrow = section.querySelector(".eyebrow, .label, [data-motion-role='eyebrow']");
      if (eyebrow && eyebrow.hasAttribute("data-motion")) {
        const config = presets.getPrimitiveConfig("text-reveal", eyebrow);
        tl.fromTo(eyebrow, config.from, {
          ...config.to,
          onComplete: () => {
            eyebrow.classList.add("is-visible");
            gsap.set(eyebrow, { clearProps: "transform,opacity" });
          },
        });
      }

      // 2. Heading / Title
      const title = section.querySelector("h1, h2, .section-title, [data-motion-role='title']");
      if (title && title.hasAttribute("data-motion")) {
        const motionType = title.getAttribute("data-motion");
        if (motionType === "line-reveal" && root.TravelMotionText) {
          const lines = root.TravelMotionText.prepareLineReveal(title);
          if (lines.length) {
            tl.fromTo(
              lines,
              { opacity: 0, yPercent: 115 },
              {
                opacity: 1,
                yPercent: 0,
                duration: presets.durations.reveal,
                ease: presets.easings.cinematic,
                stagger: presets.getStaggers().line,
                clearProps: "transform,opacity",
                onComplete: () => title.classList.add("is-visible"),
              },
              "-=0.3"
            );
          }
        } else if (!SCROLL_DRIVEN_MOTIONS.has(motionType)) {
          const config = presets.getPrimitiveConfig(motionType, title);
          tl.fromTo(
            title,
            config.from,
            {
              ...config.to,
              onComplete: () => {
                title.classList.add("is-visible");
                gsap.set(title, { clearProps: "transform,opacity" });
              },
            },
            "-=0.3"
          );
        }
      }

      // 3. Supporting copy / Lede
      const copy = section.querySelector(".lede, .measure, [data-motion-role='copy']");
      if (copy && copy.hasAttribute("data-motion") && !SCROLL_DRIVEN_MOTIONS.has(copy.getAttribute("data-motion"))) {
        const config = presets.getPrimitiveConfig("fade-up", copy);
        tl.fromTo(
          copy,
          config.from,
          {
            ...config.to,
            onComplete: () => {
              copy.classList.add("is-visible");
              gsap.set(copy, { clearProps: "transform,opacity" });
            },
          },
          "-=0.4"
        );
      }

      // 4. Dividers or borders
      const divider = section.querySelector(".divider, [data-motion='divider'], [data-motion='border-reveal']");
      if (divider) {
        const config = presets.getPrimitiveConfig("divider", divider);
        tl.fromTo(divider, config.from, config.to, "-=0.3");
      }

      // 5. Imagery or Cards Grid
      const grid = section.querySelector("[data-motion-stagger], .destinations, .pkg-grid");
      if (grid) {
        const children = Array.from(grid.querySelectorAll(":scope > [data-motion]"));
        if (children.length) {
          const staggers = presets.getStaggers();
          tl.fromTo(
            children,
            { opacity: 0, y: presets.getDistances().fadeUp },
            {
              opacity: 1,
              y: 0,
              duration: presets.durations.reveal,
              ease: presets.easings.reveal,
              stagger: staggers.normal,
              clearProps: "transform,opacity",
              onComplete: () => {
                children.forEach((c) => c.classList.add("is-visible"));
              },
            },
            "-=0.3"
          );
          children.forEach((child) => {
            this.cascadeNestedMotion(child);
          });
        }
      }

      // 6. Action / CTA button
      const cta = section.querySelector(".btn, .btn-hero, [data-motion-role='cta']");
      if (cta && cta.hasAttribute("data-motion")) {
        const config = presets.getPrimitiveConfig("fade-up", cta);
        tl.fromTo(
          cta,
          config.from,
          {
            ...config.to,
            onComplete: () => {
              cta.classList.add("is-visible");
              gsap.set(cta, { clearProps: "transform,opacity" });
            },
          },
          "-=0.2"
        );
      }

      activeTriggers.push(tl.scrollTrigger);
      return tl;
    },

    /**
     * Initializes stagger containers ([data-motion-stagger] or [data-motion="stagger"]).
     */
    initStaggerContainers: function () {
      if (isReducedMotion) return;
      const gsap = root.gsap;
      const presets = root.TravelMotionPresets;
      const defaults = presets.scrollTriggerDefaults;

      const containers = document.querySelectorAll(
        "[data-motion-stagger], [data-motion='stagger']"
      );

      containers.forEach((container) => {
        // If inside a bespoke section or choreographed section, let dedicated controller handle it
        if (container.closest("#destinations") || container.closest("#journeys") || container.closest("#explore") || container.closest("[data-motion-choreography]")) return;

        const children = Array.from(container.querySelectorAll(":scope > [data-motion]"));
        if (!children.length) return;

        const distances = presets.getDistances();
        const staggers = presets.getStaggers();

        const trigger = root.ScrollTrigger.create({
          trigger: container,
          start: defaults.start,
          once: defaults.once,
          onEnter: () => {
            container.classList.add("is-visible");

            gsap.fromTo(
              children,
              { opacity: 0, y: distances.fadeUp },
              {
                opacity: 1,
                y: 0,
                duration: presets.durations.reveal,
                ease: presets.easings.reveal,
                stagger: staggers.normal,
                onComplete: () => {
                  children.forEach((child) => {
                    child.classList.add("is-visible");
                    gsap.set(child, { clearProps: "transform,opacity" });
                  });
                },
              }
            );

            // Cascade to all nested motion elements inside each child
            children.forEach((child, i) => {
              this.cascadeNestedMotion(child, i * staggers.normal);
            });
          },
        });

        activeTriggers.push(trigger);
      });
    },

    /**
     * Initializes standalone elements with [data-motion] that are not
     * nested inside a stagger container or choreographed section.
     */
    initStandaloneElements: function () {
      if (isReducedMotion) return;
      const gsap = root.gsap;
      const presets = root.TravelMotionPresets;
      const defaults = presets.scrollTriggerDefaults;

      const els = document.querySelectorAll("[data-motion]");

      els.forEach((el) => {
        const motionType = el.getAttribute("data-motion");

        // Skip hero, scroll-driven, stagger containers, and container children
        if (HERO_MOTIONS.has(motionType) || SCROLL_DRIVEN_MOTIONS.has(motionType)) return;
        if (motionType === "stagger" || el.hasAttribute("data-motion-stagger")) return;
        if (el.parentElement && (el.parentElement.hasAttribute("data-motion-stagger") || el.parentElement.getAttribute("data-motion") === "stagger")) return;
        if (el.closest("[data-motion-choreography]")) return;
        if (el.parentElement && el.parentElement.closest("[data-motion]")) return;

        // Line reveal handles its own line masks
        if (motionType === "line-reveal") return;

        const config = presets.getPrimitiveConfig(motionType, el);

        const trigger = root.ScrollTrigger.create({
          trigger: el,
          start: defaults.start,
          once: defaults.once,
          onEnter: () => {
            gsap.fromTo(el, config.from, {
              ...config.to,
              onComplete: () => {
                el.classList.add("is-visible");
                if (config.to.clearProps) {
                  gsap.set(el, { clearProps: config.to.clearProps });
                }
              },
            });

            // Cascade to any nested motion elements inside el (e.g. .about-join panel)
            this.cascadeNestedMotion(el, 0.05);
          },
        });

        activeTriggers.push(trigger);
      });
    },

    /**
     * Initializes typography line-reveal elements with masked GSAP animations.
     */
    initTypographyReveals: function () {
      if (isReducedMotion) return;
      const gsap = root.gsap;
      const presets = root.TravelMotionPresets;
      const defaults = presets.scrollTriggerDefaults;

      const lineEls = document.querySelectorAll('[data-motion="line-reveal"]');

      lineEls.forEach((el) => {
        if (el.closest("[data-motion-choreography]")) return;
        if (!root.TravelMotionText) return;

        const lines = root.TravelMotionText.prepareLineReveal(el);
        if (!lines.length) return;

        const trigger = root.ScrollTrigger.create({
          trigger: el,
          start: defaults.start,
          once: defaults.once,
          onEnter: () => {
            el.classList.add("is-visible");
            gsap.fromTo(
              lines,
              { opacity: 0, yPercent: 115 },
              {
                opacity: 1,
                yPercent: 0,
                duration: presets.durations.reveal,
                ease: presets.easings.cinematic,
                stagger: presets.getStaggers().line,
                clearProps: "transform,opacity",
              }
            );
          },
        });

        activeTriggers.push(trigger);
    });
  },
 
  /**
   * Section 03 — Explore / Destinations entrance reveal & subtle scroll parallax:
   * - Staggered fade + upward reveal for the destination cards
   * - Inner image scale animation from 1.08 -> 1.0
   * - Card text, heading, and button fade + upward reveal shortly after the image
   * - Subtle ScrollTrigger scrub parallax on the card imagery
   * - Interactive hover zoom integration
   * - Responsive & respects prefers-reduced-motion
   */
  initDestinations: function () {
    const section = document.querySelector("#destinations");
    if (!section) return;

    const gsap = root.gsap;
    const ScrollTrigger = root.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const eyebrow = section.querySelector(".eyebrow");
    const cards = Array.from(section.querySelectorAll(".dest-card"));
    if (!cards.length) return;

    if (isReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0 });
      cards.forEach((card) => {
        const img = card.querySelector(".dest-card__img");
        const content = card.querySelectorAll(".dest-card__eyebrow, .dest-card__title, .dest-card__text, .btn");
        if (img) gsap.set(img, { opacity: 1, scale: 1, yPercent: 0 });
        if (content.length) gsap.set(content, { opacity: 1, y: 0 });
        card.classList.add("is-visible");
      });
      if (eyebrow) {
        eyebrow.classList.add("is-visible");
        gsap.set(eyebrow, { opacity: 1, y: 0 });
      }
      return;
    }

    // 1. Set initial states
    gsap.set(cards, { opacity: 0, y: 40 });
    if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 16 });

    cards.forEach((card) => {
      const img = card.querySelector(".dest-card__img");
      const content = card.querySelectorAll(".dest-card__eyebrow, .dest-card__title, .dest-card__text, .btn");
      if (img) gsap.set(img, { scale: 1.08 });
      if (content.length) gsap.set(content, { opacity: 0, y: 18 });
    });

    // 2. Entrance reveal timeline
    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
        once: true,
        onEnter: () => {
          section.classList.add("is-visible");
        },
      },
    });

    if (eyebrow) {
      entranceTl.to(
        eyebrow,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          onComplete: () => {
            eyebrow.classList.add("is-visible");
          },
        },
        0
      );
    }

    cards.forEach((card, index) => {
      const startTime = 0.12 + index * 0.18; // Slight stagger between cards
      const img = card.querySelector(".dest-card__img");
      const content = card.querySelectorAll(".dest-card__eyebrow, .dest-card__title, .dest-card__text, .btn");

      // Card fade + upward reveal
      entranceTl.to(
        card,
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
          onComplete: () => {
            card.classList.add("is-visible");
          },
        },
        startTime
      );

      // Image reveal from scale: 1.08 to scale: 1
      if (img) {
        entranceTl.to(
          img,
          {
            scale: 1,
            duration: 1.25,
            ease: "power2.out",
          },
          startTime
        );
      }

      // Card text/buttons fade and move up slightly after image reveal begins
      if (content.length) {
        entranceTl.to(
          content,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.08,
            onComplete: () => {
              content.forEach((el) => el.classList.add("is-visible"));
            },
          },
          startTime + 0.32
        );
      }
    });

    if (entranceTl.scrollTrigger) {
      activeTriggers.push(entranceTl.scrollTrigger);
    }

    // 3. Subtle ScrollTrigger Parallax effect while scrolling through the section
    cards.forEach((card) => {
      const img = card.querySelector(".dest-card__img");
      if (!img) return;

      const parallaxTween = gsap.fromTo(
        img,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      if (parallaxTween.scrollTrigger) {
        activeTriggers.push(parallaxTween.scrollTrigger);
      }

      // 4. Smooth interactive hover zoom on fine pointer devices
      if (typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        card.addEventListener("mouseenter", () => {
          gsap.to(img, {
            scale: 1.04,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(img, {
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      }
    });
  },

  /**
   * Section 05 Journeys cards GSAP ScrollTrigger animation:
   * - Entrance: subtle fade + upward movement, with a small stagger between the two cards.
   * - Parallax: very subtle image-only parallax effect while scrolling through the section.
   * - Hover: card structure stable, card lifts -4px, image scales to ~1.04,
   *   card content shifts by -3px, and CTA arrow nudges up-right.
   * - Respects prefers-reduced-motion and responsive touch viewports.
   */
  initJourneys: function () {
    const section = document.querySelector("#journeys");
    const gsap = root.gsap;
    const ScrollTrigger = root.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    // Support both the featured section cards and any other journey cards on the page
    const featuredCards = section ? Array.from(section.querySelectorAll(".journey-card")) : [];
    const allJourneyCards = Array.from(document.querySelectorAll(".journey-card"));
    if (!allJourneyCards.length) return;

    if (isReducedMotion) {
      allJourneyCards.forEach((card) => {
        const img = card.querySelector(".journey-card__img");
        const body = card.querySelector(".journey-card__body");
        const content = card.querySelectorAll(
          ".journey-card__meta, .journey-card__title, .journey-card__text, .journey-card__footer, .btn"
        );
        if (img) gsap.set(img, { opacity: 1, scale: 1, yPercent: 0 });
        if (body) gsap.set(body, { y: 0 });
        if (content.length) gsap.set(content, { opacity: 1, y: 0 });
        card.classList.add("is-visible");
      });
      return;
    }

    // 1. Entrance reveal for #journeys featured cards
    if (section && featuredCards.length) {
      gsap.set(featuredCards, { opacity: 0, y: 36 });
      featuredCards.forEach((card) => {
        const content = card.querySelectorAll(
          ".journey-card__meta, .journey-card__title, .journey-card__text, .journey-card__footer, .btn"
        );
        if (content.length) gsap.set(content, { opacity: 0, y: 16 });
      });

      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
          onEnter: () => {
            section.classList.add("is-visible");
          },
        },
      });

      featuredCards.forEach((card, index) => {
        const startTime = 0.12 + index * 0.18; // Small stagger between the two cards
        const content = card.querySelectorAll(
          ".journey-card__meta, .journey-card__title, .journey-card__text, .journey-card__footer, .btn"
        );

        // Subtle fade + upward movement
        entranceTl.to(
          card,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            onComplete: () => {
              card.classList.add("is-visible");
              gsap.set(card, { y: 0 });
            },
          },
          startTime
        );

        // Smooth content reveal shifting slightly after card starts
        if (content.length) {
          entranceTl.to(
            content,
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power3.out",
              stagger: 0.06,
              onComplete: () => {
                content.forEach((el) => el.classList.add("is-visible"));
                gsap.set(content, { y: 0 });
              },
            },
            startTime + 0.22
          );
        }
      });

      if (entranceTl.scrollTrigger) {
        activeTriggers.push(entranceTl.scrollTrigger);
      }
    }

    // 2. Parallax and hover interactions for journey cards
    allJourneyCards.forEach((card) => {
      if (card.dataset.journeyMotionBound) return;
      card.dataset.journeyMotionBound = "true";

      const img = card.querySelector(".journey-card__img");

      // Subtle image-only parallax effect so image moves independently from card
      if (img) {
        const parallaxTween = gsap.fromTo(
          img,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );

        if (parallaxTween.scrollTrigger) {
          activeTriggers.push(parallaxTween.scrollTrigger);
        }
      }

      // 3. Stable hover interaction on fine pointer devices
      if (typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const body = card.querySelector(".journey-card__body");
        const ctaBtn = card.querySelector(".btn--accent-outline, .btn");
        const arrow = card.querySelector(".icon--arrow");

        card.addEventListener("mouseenter", () => {
          // Smoothly scale card image from 1 to around 1.04
          if (img) {
            gsap.to(img, {
              scale: 1.04,
              duration: 0.5,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          // Subtle card lift of -4px (structure remains stable)
          gsap.to(card, {
            y: -4,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });

          // Smoothly reveal/shift card content by a few pixels (-3px)
          if (body) {
            gsap.to(body, {
              y: -3,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          // Subtle CTA interaction
          if (arrow) {
            gsap.to(arrow, {
              x: 3,
              y: -2,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
          if (ctaBtn) {
            gsap.to(ctaBtn, {
              borderColor: "rgba(110, 86, 207, 0.6)",
              backgroundColor: "rgba(110, 86, 207, 0.08)",
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });

        card.addEventListener("mouseleave", () => {
          if (img) {
            gsap.to(img, {
              scale: 1,
              duration: 0.5,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          gsap.to(card, {
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });

          if (body) {
            gsap.to(body, {
              y: 0,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          if (arrow) {
            gsap.to(arrow, {
              x: 0,
              y: 0,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
          if (ctaBtn) {
            gsap.to(ctaBtn, {
              borderColor: "var(--color-accent-border)",
              backgroundColor: "transparent",
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });
      }
    });
  },

  /**
   * Section 06 — Explore / Deep Exploration premium GSAP animations:
   * - Scroll-driven storytelling entrance: left content reveals, then card reveals
   * - Subtle image-only parallax while scrolling
   * - Hover: image zoom (~1.03), CTA arrow nudge
   * - Animated destination switching (Dubai/Japan region + place navigation)
   * - Respects prefers-reduced-motion and responsive viewports
   */
  initExploreSection: function () {
    var section = document.querySelector("#explore");
    if (!section) return;

    var gsap = root.gsap;
    var ScrollTrigger = root.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    var placeCard = section.querySelector(".place-card");
    var placeImg = section.querySelector(".place-card__img");
    var placeTitle = section.querySelector(".place-card__title");
    var placeText = section.querySelector(".place-card__text");
    var placeActions = section.querySelector(".place-card__actions");
    var placeBody = section.querySelector(".place-card__body");
    var regionTabs = section.querySelector("[data-region-tabs]");
    var placesNav = section.querySelector("[data-places]");

    if (!placeCard) return;

    // ── Place Data ──────────────────────────────────────────────────────
    var EXPLORE_DATA = {
      Dubai: {
        places: ["Downtown", "Marina", "Old Town", "Desert", "Creek"],
        data: {
          Downtown: {
            image: "assets/images/explore-dubai.webp",
            alt: "Dubai Downtown skyline at golden hour",
            title: "Downtown Dubai",
            text: "Stand beneath the world's tallest building, walk along the Dubai Fountain promenade, and discover the vibrant heart of modern Dubai.",
            discoverLabel: "Discover Downtown",
            askLabel: "Ask about Downtown"
          },
          Marina: {
            image: "assets/images/explore-dubai.webp",
            alt: "Dubai Marina waterfront with yachts and skyscrapers",
            title: "Dubai Marina",
            text: "A waterfront district where gleaming towers meet the Arabian Gulf. Stroll the Marina Walk, dine at waterside restaurants, and feel the energy of cosmopolitan Dubai.",
            discoverLabel: "Discover Marina",
            askLabel: "Ask about Marina"
          },
          "Old Town": {
            image: "assets/images/explore-dubai.webp",
            alt: "Historic Al Fahidi neighbourhood with wind towers",
            title: "Old Town",
            text: "Wind towers, narrow lanes, and the gentle current of Dubai Creek. Explore the soul of old Dubai where heritage meets quiet charm.",
            discoverLabel: "Discover Old Town",
            askLabel: "Ask about Old Town"
          },
          Desert: {
            image: "assets/images/explore-dubai.webp",
            alt: "Desert dunes at sunset outside Dubai",
            title: "The Desert",
            text: "Beyond the city, golden dunes stretch to the horizon. Experience the silence of the Arabian desert, Bedouin traditions, and sunsets you won't forget.",
            discoverLabel: "Discover the Desert",
            askLabel: "Ask about the Desert"
          },
          Creek: {
            image: "assets/images/explore-dubai.webp",
            alt: "Traditional abra boats on Dubai Creek",
            title: "Dubai Creek",
            text: "Where Dubai's story began. Cross the creek by abra, explore the spice and gold souks, and discover a city shaped by trade and water.",
            discoverLabel: "Discover the Creek",
            askLabel: "Ask about the Creek"
          }
        }
      },
      Japan: {
        places: ["Tokyo", "Kyoto", "Osaka", "Mount Fuji", "Nara"],
        data: {
          Tokyo: {
            image: "assets/images/explore-japan.webp",
            alt: "Neon-lit streets and modern architecture in Tokyo",
            title: "Tokyo",
            text: "A city of contrasts — where ancient temples sit beneath glass towers, quiet gardens border bustling crossings, and every neighbourhood has its own character.",
            discoverLabel: "Discover Tokyo",
            askLabel: "Ask about Tokyo"
          },
          Kyoto: {
            image: "assets/images/map-kyoto.webp",
            alt: "Traditional pagoda and townscape at golden hour in Kyoto",
            title: "Kyoto",
            text: "A city where centuries of tradition still form part of everyday life. Wander through historic neighbourhoods, discover quiet gardens and experience a slower side of Japan.",
            discoverLabel: "Discover Kyoto",
            askLabel: "Ask about Kyoto"
          },
          Osaka: {
            image: "assets/images/explore-japan.webp",
            alt: "Vibrant street food scene in Osaka at night",
            title: "Osaka",
            text: "Japan's kitchen — a city that lives for food, laughter, and warmth. From street vendors in Dōtonbori to hidden izakayas, every meal tells a story.",
            discoverLabel: "Discover Osaka",
            askLabel: "Ask about Osaka"
          },
          "Mount Fuji": {
            image: "assets/images/explore-japan.webp",
            alt: "Mount Fuji rising above lake and cherry blossoms",
            title: "Mount Fuji",
            text: "Japan's most iconic silhouette. See it reflected in still lakes, framed by cherry blossoms, or towering above the clouds on a clear morning.",
            discoverLabel: "Discover Mount Fuji",
            askLabel: "Ask about Mount Fuji"
          },
          Nara: {
            image: "assets/images/explore-japan.webp",
            alt: "Friendly deer among autumn trees in Nara park",
            title: "Nara",
            text: "Ancient capital of Japan, where friendly deer roam freely through parkland and some of the country's oldest Buddhist temples stand in quiet grandeur.",
            discoverLabel: "Discover Nara",
            askLabel: "Ask about Nara"
          }
        }
      }
    };

    var currentRegion = "Japan";
    var currentPlace = "Kyoto";
    var isTransitioning = false;

    // ── Reduced Motion: show everything immediately ─────────────────────
    if (isReducedMotion) {
      if (placeCard) gsap.set(placeCard, { opacity: 1, y: 0, scale: 1 });
      if (placeImg) gsap.set(placeImg, { opacity: 1, scale: 1, yPercent: 0 });
      if (placeBody) gsap.set(placeBody, { opacity: 1, y: 0 });
      section.querySelectorAll("[data-motion]").forEach(function (el) {
        el.classList.add("is-visible");
      });
      // Still wire up destination switching without animation
      bindDestinationSwitching(false);
      return;
    }

    // ── 1. Scroll Entrance Reveal ───────────────────────────────────────
    var leftCol = section.querySelector(".split--top > :first-child");
    var leftElements = [];
    if (leftCol) {
      var sectionHead = leftCol.querySelector(".section-head");
      var lede = leftCol.querySelector(".lede, .stack-3");
      var tabs = leftCol.querySelector(".explore-tabs");
      var places = leftCol.querySelector(".explore-places");
      if (sectionHead) leftElements.push(sectionHead);
      if (lede) leftElements.push(lede);
      if (tabs) leftElements.push(tabs);
      if (places) leftElements.push(places);
    }

    // Set initial states
    leftElements.forEach(function (el) {
      gsap.set(el, { opacity: 0, y: 24 });
    });
    gsap.set(placeCard, { opacity: 0, y: 30 });
    if (placeImg) gsap.set(placeImg, { scale: 1.05 });

    var entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: function () {
          section.classList.add("is-visible");
        }
      }
    });

    // Left content: staggered fade + upward movement
    leftElements.forEach(function (el, idx) {
      entranceTl.to(
        el,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          onComplete: function () {
            el.classList.add("is-visible");
            // Also mark nested data-motion elements visible
            el.querySelectorAll("[data-motion]").forEach(function (child) {
              child.classList.add("is-visible");
            });
          }
        },
        0.08 + idx * 0.12
      );
    });

    // Right card: slightly delayed fade + upward movement
    entranceTl.to(
      placeCard,
      {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: "power3.out",
        onComplete: function () {
          placeCard.classList.add("is-visible");
          gsap.set(placeCard, { clearProps: "y" });
        }
      },
      0.22
    );

    // Image scale settle: 1.05 → 1
    if (placeImg) {
      entranceTl.to(
        placeImg,
        {
          scale: 1,
          duration: 1.3,
          ease: "power2.out"
        },
        0.22
      );
    }

    if (entranceTl.scrollTrigger) {
      activeTriggers.push(entranceTl.scrollTrigger);
    }

    // ── 2. Image Parallax (scrub) ───────────────────────────────────────
    if (placeImg) {
      var parallaxTween = gsap.fromTo(
        placeImg,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: placeCard,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        }
      );

      if (parallaxTween.scrollTrigger) {
        activeTriggers.push(parallaxTween.scrollTrigger);
      }
    }

    // ── 3. Hover Interactions ────────────────────────────────────────────
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      // Image hover zoom
      if (placeImg) {
        placeCard.addEventListener("mouseenter", function () {
          gsap.to(placeImg, {
            scale: 1.03,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto"
          });
        });
        placeCard.addEventListener("mouseleave", function () {
          gsap.to(placeImg, {
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto"
          });
        });
      }

      // CTA arrow nudge on primary button hover
      var primaryBtn = placeCard.querySelector(".btn--primary");
      if (primaryBtn) {
        primaryBtn.addEventListener("mouseenter", function () {
          gsap.to(primaryBtn, {
            letterSpacing: "0.11em",
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto"
          });
        });
        primaryBtn.addEventListener("mouseleave", function () {
          gsap.to(primaryBtn, {
            letterSpacing: "0.09em",
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto"
          });
        });
      }

      // Sparkle pulse on Ask button hover
      var sparkBtn = placeCard.querySelector(".btn-spark");
      if (sparkBtn) {
        sparkBtn.addEventListener("mouseenter", function () {
          gsap.to(sparkBtn, {
            scale: 1.02,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto"
          });
        });
        sparkBtn.addEventListener("mouseleave", function () {
          gsap.to(sparkBtn, {
            scale: 1,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto"
          });
        });
      }
    }

    // ── 4. Destination Switch Animation ─────────────────────────────────

    function updatePlaceCard(data, animate) {
      if (!data) return;

      if (!animate) {
        // Instant swap (reduced motion or initial load)
        if (placeImg) {
          placeImg.src = data.image;
          placeImg.alt = data.alt;
        }
        if (placeTitle) placeTitle.textContent = data.title;
        if (placeText) placeText.textContent = data.text;
        updateCTALabels(data);
        return;
      }

      if (isTransitioning) return;
      isTransitioning = true;

      var bodyElements = [placeTitle, placeText, placeActions].filter(Boolean);

      // Phase 1: Fade out current content
      var outTl = gsap.timeline({
        onComplete: function () {
          // Swap the content
          if (placeImg) {
            placeImg.src = data.image;
            placeImg.alt = data.alt;
          }
          if (placeTitle) placeTitle.textContent = data.title;
          if (placeText) placeText.textContent = data.text;
          updateCTALabels(data);

          // Phase 2: Fade in new content
          if (placeImg) {
            gsap.fromTo(
              placeImg,
              { opacity: 0.7, scale: 1.04 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "power2.out"
              }
            );
          }

          gsap.fromTo(
            bodyElements,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power3.out",
              stagger: 0.06,
              onComplete: function () {
                isTransitioning = false;
              }
            }
          );
        }
      });

      // Fade out body
      outTl.to(bodyElements, {
        opacity: 0,
        y: -8,
        duration: 0.25,
        ease: "power2.in",
        stagger: 0.03
      }, 0);

      // Crossfade image
      if (placeImg) {
        outTl.to(placeImg, {
          opacity: 0.3,
          scale: 0.98,
          duration: 0.3,
          ease: "power2.in"
        }, 0);
      }
    }

    function updateCTALabels(data) {
      var primaryBtn = placeCard.querySelector(".btn--primary");
      var sparkBtn = placeCard.querySelector(".btn-spark");
      if (primaryBtn && data.discoverLabel) {
        primaryBtn.textContent = data.discoverLabel + " →";
      }
      if (sparkBtn && data.askLabel) {
        // Preserve the sparkle pseudo-element by only updating text content
        sparkBtn.childNodes[0].textContent = data.askLabel;
      }
    }

    function updatePlacesNav(regionName) {
      if (!placesNav) return;
      var regionData = EXPLORE_DATA[regionName];
      if (!regionData) return;

      var placeNames = regionData.places;
      placesNav.setAttribute("aria-label", "Places in " + regionName);

      // Animate out existing place links
      var existingLinks = Array.from(placesNav.querySelectorAll(".place"));

      if (isReducedMotion || !existingLinks.length) {
        rebuildPlaceLinks(placeNames);
        return;
      }

      gsap.to(existingLinks, {
        opacity: 0,
        y: -6,
        duration: 0.2,
        ease: "power2.in",
        stagger: 0.02,
        onComplete: function () {
          rebuildPlaceLinks(placeNames);

          var newLinks = Array.from(placesNav.querySelectorAll(".place"));
          gsap.fromTo(
            newLinks,
            { opacity: 0, y: 8 },
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: "power3.out",
              stagger: 0.04
            }
          );
        }
      });
    }

    function rebuildPlaceLinks(placeNames) {
      if (!placesNav) return;
      placesNav.innerHTML = "";
      placeNames.forEach(function (name, idx) {
        var a = document.createElement("a");
        a.className = "place";
        a.href = "#";
        a.textContent = name;
        a.setAttribute("aria-current", idx === 0 ? "true" : "false");
        placesNav.appendChild(a);
      });
    }

    function bindDestinationSwitching(animate) {
      // Region chip clicks (Dubai / Japan)
      if (regionTabs) {
        regionTabs.addEventListener("click", function (e) {
          var chip = e.target.closest(".chip");
          if (!chip || isTransitioning) return;

          var chipText = chip.textContent.trim();
          if (chipText === currentRegion) return;

          // Update chip active states
          regionTabs.querySelectorAll(".chip").forEach(function (c) {
            c.setAttribute("aria-pressed", String(c === chip));
          });

          currentRegion = chipText;
          var regionData = EXPLORE_DATA[currentRegion];
          if (!regionData) return;

          // Switch to first place in the new region
          var firstPlace = regionData.places[0];
          currentPlace = firstPlace;
          var placeData = regionData.data[firstPlace];

          // Rebuild place navigation
          updatePlacesNav(currentRegion);

          // Animate the card content change
          updatePlaceCard(placeData, animate);
        });
      }

      // Place link clicks (Tokyo, Kyoto, Osaka, etc.)
      if (placesNav) {
        placesNav.addEventListener("click", function (e) {
          var placeLink = e.target.closest(".place");
          if (!placeLink || isTransitioning) return;
          e.preventDefault();

          var placeName = placeLink.textContent.trim();
          if (placeName === currentPlace) return;

          // Update active states
          placesNav.querySelectorAll(".place").forEach(function (p) {
            p.setAttribute("aria-current", String(p === placeLink));
          });

          currentPlace = placeName;
          var regionData = EXPLORE_DATA[currentRegion];
          if (!regionData) return;

          var placeData = regionData.data[placeName];
          updatePlaceCard(placeData, animate);
        });
      }
    }

    bindDestinationSwitching(true);
  },

  /**
   * Vita Travel style Testimonials / Practitioners section entrance choreography:
   * - Staggered card slides from left (x: -40 -> 0)
   * - Rotating plus icons (-180deg -> 0deg)
   * - Expanding hairline divider lines (width / height 0% -> 100%)
   * - Reversible on scroll back up, and respects prefers-reduced-motion
   */
  initTestimonialsEditorial: function () {
    const section = document.querySelector(".testimonials-section");
    if (!section) return;

    const gsap = root.gsap;
    const ScrollTrigger = root.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const cards = Array.from(section.querySelectorAll(".testimonials-card"));
    const eyebrow = section.querySelector(".testimonials-eyebrow");
    const label = section.querySelector(".testimonials-label");
    const headline = section.querySelector(".testimonials-headline");
    const plusIcons = Array.from(section.querySelectorAll(".testimonials-note__plus"));
    const notes = Array.from(section.querySelectorAll(".testimonials-note"));

    if (isReducedMotion) {
      gsap.set([cards, eyebrow, label, headline, plusIcons, notes], { opacity: 1, x: 0, y: 0, rotation: 0 });
      return;
    }

    // Initial state matching Vita Travel reference
    gsap.set(cards, { opacity: 0, x: -40 });
    if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 30 });
    if (label) gsap.set(label, { opacity: 0, y: 30 });
    if (headline) gsap.set(headline, { opacity: 0, y: 30 });
    if (plusIcons.length) {
      gsap.set(plusIcons, {
        rotation: -180,
        scale: 0.6,
        opacity: 0,
        transformOrigin: "50% 50%",
      });
    }
    if (notes.length) gsap.set(notes, { opacity: 0, y: 24 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });

    // 2. Cards entrance: slide from left (x: -40 -> 0) and fade in (opacity: 0 -> 1) with 0.15s stagger
    cards.forEach((card, i) => {
      const startTime = 0.15 * i;
      tl.to(card, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, startTime);
    });

    // 3. Right column text entrance
    if (eyebrow) {
      tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.25);
    }
    if (label) {
      tl.to(label, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.30);
    }
    if (headline) {
      tl.to(headline, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.38);
    }

    // 4. Plus icons spin & un-rotate from -180deg to 0deg (Vita Travel signature entrance)
    if (plusIcons.length) {
      tl.to(
        plusIcons,
        {
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.15,
        },
        0.45
      );
    }

    // 5. Notes fade in
    if (notes.length) {
      tl.to(notes, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 }, 0.55);
    }

    // 6. Interactive tactile hover/focus rotation matching mobile drawer feel
    notes.forEach((note) => {
      const plus = note.querySelector(".testimonials-note__plus");
      if (!plus) return;

      const handleEnter = () => {
        gsap.to(plus, {
          rotation: 45,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      const handleLeave = () => {
        gsap.to(plus, {
          rotation: 0,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      note.addEventListener("mouseenter", handleEnter);
      note.addEventListener("mouseleave", handleLeave);
      note.addEventListener("focusin", handleEnter);
      note.addEventListener("focusout", handleLeave);
    });

    activeTriggers.push(tl.scrollTrigger);
  },

  /**
   * Initializes the velocity-linked footer bounce animation.
   * Recreates the physics and dynamic elasticity of https://demos.gsap.com/demo/footer-bounce/
   */
  initFooterBounce: function () {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const bouncyPath = footer.querySelector("#bouncy-path");
    if (!bouncyPath) return;

    const gsap = root.gsap;
    const ScrollTrigger = root.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const down = "M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3V683H0V-0.3z";
    const center = "M0-0.3C0-0.3,464,0,1139,0s1139-0.3,1139-0.3V683H0V-0.3z";

    if (isReducedMotion) {
      bouncyPath.setAttribute("d", center);
      return;
    }

    // Initial flat resting state
    bouncyPath.setAttribute("d", center);

    const hasMorphSVG = Boolean(root.MorphSVGPlugin && gsap.plugins && gsap.plugins.morphSVG);

    const trigger = ScrollTrigger.create({
      trigger: footer,
      start: "top bottom",
      toggleActions: "play pause resume reverse",
      onEnter: (self) => {
        const velocity = typeof self.getVelocity === "function" ? self.getVelocity() : 1000;
        // Calculate variation based on scroll speed: clamp between -0.85 and 0.85
        const variation = Math.min(0.85, Math.max(-0.85, velocity / 10000));
        const springTension = Math.max(0.2, 1 + variation);
        const springDamping = Math.max(0.15, 1 - variation);

        if (hasMorphSVG) {
          gsap.fromTo(
            bouncyPath,
            { morphSVG: down },
            {
              duration: 2,
              morphSVG: center,
              ease: `elastic.out(${springTension}, ${springDamping})`,
              overwrite: "auto",
            }
          );
        } else {
          // High-performance native fallback: animate cubic bezier curve control points
          const proxy = { curve: 156 };
          gsap.killTweensOf(proxy);
          gsap.to(proxy, {
            curve: 0,
            duration: 2,
            ease: `elastic.out(${springTension}, ${springDamping})`,
            overwrite: "auto",
            onUpdate: () => {
              const c = proxy.curve.toFixed(1);
              bouncyPath.setAttribute(
                "d",
                `M0-0.3C0-0.3,464,${c},1139,${c}S2278-0.3,2278-0.3V683H0V-0.3z`
              );
            },
          });
        }
      },
    });

    activeTriggers.push(trigger);
  },

  /**
   * Animates dynamically injected elements, such as package cards
   * rendered in js/journeys.js during filtering or sorting.
   */
  animateDynamicGrid: function (gridEl) {
      if (!gridEl) return;

      if (this.hasReducedMotion()) {
        gridEl.querySelectorAll("[data-motion]").forEach((el) => {
          el.classList.add("is-visible");
        });
        return;
      }

      if (!this.isReady()) {
        // Fallback if GSAP is unavailable
        gridEl.querySelectorAll("[data-motion]").forEach((el) => {
          el.classList.add("is-visible");
        });
        return;
      }

      const gsap = root.gsap;
      const presets = root.TravelMotionPresets;
      const cards = Array.from(gridEl.querySelectorAll(".journey-card, :scope > [data-motion]"));
      if (!cards.length) return;

      const distances = presets.getDistances();
      const staggers = presets.getStaggers();
      const stepStagger = Math.min(staggers.small, staggers.cardLimit / cards.length);

      // Kill any active tweens on existing cards
      gsap.killTweensOf(cards);

      // Smooth, rapid entrance for filtered/sorted cards
      gsap.fromTo(
        cards,
        { opacity: 0, y: distances.fadeUp },
        {
          opacity: 1,
          y: 0,
          duration: presets.durations.normal,
          ease: presets.easings.reveal,
          stagger: stepStagger,
          onComplete: () => {
            cards.forEach((c) => {
              c.classList.add("is-visible");
              gsap.set(c, { clearProps: "transform,opacity" });
            });
          },
        }
      );

      // Cascade to all nested motion inside cards (images, text)
      cards.forEach((card, i) => {
        this.cascadeNestedMotion(card, i * stepStagger);
      });

      // Inform ScrollTrigger of DOM height changes
      if (root.ScrollTrigger) {
        root.ScrollTrigger.refresh();
      }
    },

    /**
     * Binds window resize and font loading to refresh ScrollTrigger and text metrics.
     */
    bindMetricsWatchers: function () {
      let resizeTimer = null;
      let lastWidth = window.innerWidth;

      window.addEventListener(
        "resize",
        () => {
          const currentWidth = window.innerWidth;
          if (currentWidth === lastWidth) return; // ignore mobile vertical address bar resize
          lastWidth = currentWidth;

          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            if (root.ScrollTrigger) root.ScrollTrigger.refresh();
          }, 150);
        },
        { passive: true }
      );

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          if (root.ScrollTrigger) root.ScrollTrigger.refresh();
        });
      }
    },

    /**
     * Refreshes all ScrollTriggers and smooth scroll on demand.
     */
    refresh: function () {
      if (!isReducedMotion && !lenisInstance && typeof root.Lenis !== "undefined") {
        this.initSmoothScroll();
      }
      if (root.ScrollTrigger) {
        root.ScrollTrigger.refresh();
      }
    },
  };

  root.TravelMotion = TravelMotion;
})(typeof window !== "undefined" ? window : this);
