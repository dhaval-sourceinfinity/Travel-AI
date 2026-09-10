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
            ".testimonials-card, .testimonials-eyebrow, .testimonials-headline, .testimonials-note__plus, .testimonials-note, .testimonials-dec"
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
        // If inside a choreographed section, let the section timeline control it
        if (container.closest("[data-motion-choreography]")) return;

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
    const decTop = section.querySelector(".testimonials-dec--top");
    const decBottom = section.querySelector(".testimonials-dec--bottom");
    const decMidV = section.querySelector(".testimonials-dec--mid-v");
    const decGridV = section.querySelector(".testimonials-dec--grid-v");
    const decGridH = section.querySelector(".testimonials-dec--grid-h");
    const eyebrow = section.querySelector(".testimonials-eyebrow");
    const headline = section.querySelector(".testimonials-headline");
    const plusIcons = Array.from(section.querySelectorAll(".testimonials-note__plus"));
    const notes = Array.from(section.querySelectorAll(".testimonials-note"));

    if (isReducedMotion) {
      gsap.set([cards, eyebrow, headline, plusIcons, notes], { opacity: 1, x: 0, y: 0, rotation: 0 });
      gsap.set([decTop, decBottom, decGridH], { width: "100%" });
      gsap.set([decMidV, decGridV], { height: "100%" });
      return;
    }

    // Initial state matching Vita Travel reference
    gsap.set(cards, { opacity: 0, x: -40 });
    if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 30 });
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

    const isMobile = window.innerWidth <= 767;
    if (!isMobile) {
      if (decTop) gsap.set(decTop, { width: "0%" });
      if (decBottom) gsap.set(decBottom, { width: "0%" });
      if (decMidV) gsap.set(decMidV, { height: "0%" });
      if (decGridV) gsap.set(decGridV, { height: "0%" });
      if (decGridH) gsap.set(decGridH, { width: "0%" });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });

    // 1. Hairline divider lines expand across (Vita Travel ease power2.inOut)
    if (!isMobile) {
      if (decTop) tl.to(decTop, { width: "100%", duration: 0.8, ease: "power2.inOut" }, 0);
      if (decBottom) tl.to(decBottom, { width: "100%", duration: 0.8, ease: "power2.inOut" }, 0.1);
      if (decMidV) tl.to(decMidV, { height: "100%", duration: 0.8, ease: "power2.inOut" }, 0.2);
      if (decGridV) tl.to(decGridV, { height: "100%", duration: 0.8, ease: "power2.inOut" }, 0.25);
      if (decGridH) tl.to(decGridH, { width: "100%", duration: 0.8, ease: "power2.inOut" }, 0.3);
    }

    // 2. Cards entrance: slide from left (x: -40 -> 0) and fade in (opacity: 0 -> 1) with 0.15s stagger
    cards.forEach((card, i) => {
      const startTime = 0.15 * i;
      tl.to(card, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, startTime);
    });

    // 3. Right column text entrance
    if (eyebrow) {
      tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.25);
    }
    if (headline) {
      tl.to(headline, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.35);
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
