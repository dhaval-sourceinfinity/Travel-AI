/**
 * gsap-presets.js — Travel AI Motion System Presets
 * 
 * Centralized motion tokens, easings, timings, and primitive animation
 * definitions adapted from the Vita Travel design language.
 */
(function (root) {
  "use strict";

  const TravelMotionPresets = {
    // Easing curves matching tokens.css & Vita's editorial aesthetic
    easings: {
      cinematic: "cubic-bezier(0.16, 1, 0.3, 1)", // Confident, smooth deceleration
      reveal: "cubic-bezier(0.2, 0.8, 0.2, 1)",    // Standard deceleration without overshoot
      standard: "power2.out",
      gentle: "power1.out",
    },

    // Duration tiers in seconds
    durations: {
      fast: 0.24,
      normal: 0.35,
      reveal: 0.7,
      slow: 0.9,
      cinematic: 1.2,
    },

    // Responsive distance tokens (px)
    getDistances: function () {
      const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
      return {
        fadeUp: isMobile ? 14 : 24,
        fadeDown: isMobile ? -10 : -16,
        fadeLeft: isMobile ? 14 : 24,
        fadeRight: isMobile ? -14 : -24,
        textRiseEditorial: isMobile ? 18 : 28,
        textRiseCard: isMobile ? 12 : 18,
      };
    },

    // Stagger delays in seconds
    getStaggers: function () {
      const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
      return {
        normal: isMobile ? 0.05 : 0.08,
        small: isMobile ? 0.04 : 0.06,
        line: isMobile ? 0.06 : 0.09,
        char: 0.02,
        cardLimit: isMobile ? 0.18 : 0.48, // max total stagger delay on phones
      };
    },

    // Default ScrollTrigger configuration
    scrollTriggerDefaults: {
      start: "top 88%",
      once: true,
    },

    // Smooth scrolling tokens (Lenis + GSAP ScrollTrigger)
    smoothScroll: {
      duration: 1.15,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      syncTouch: false,
    },

    /**
     * Determines whether an element is inside a card/metadata container
     * to apply the quieter text rise tier (18px/12px vs 28px/18px).
     */
    isCardInterior: function (el) {
      if (!el || !el.closest) return false;
      return Boolean(
        el.closest(
          ".dest-card, .journey-card, .person-card, .place-card, .step, .feature, .note, .about-belief, .about-place, .about-stat, .about-timeline__row, .about-join"
        )
      );
    },

    /**
     * Returns the GSAP from/to config for a given primitive name.
     */
    getPrimitiveConfig: function (primitiveName, el) {
      const distances = this.getDistances();
      const easings = this.easings;
      const durations = this.durations;

      switch (primitiveName) {
        case "fade":
        case "fade-in":
          return {
            from: { opacity: 0 },
            to: {
              opacity: 1,
              duration: durations.reveal,
              ease: easings.reveal,
              clearProps: "opacity",
            },
          };

        case "fade-up":
          return {
            from: { opacity: 0, y: distances.fadeUp },
            to: {
              opacity: 1,
              y: 0,
              duration: durations.reveal,
              ease: easings.reveal,
              clearProps: "transform,opacity",
            },
          };

        case "fade-down":
          return {
            from: { opacity: 0, y: distances.fadeDown },
            to: {
              opacity: 1,
              y: 0,
              duration: durations.normal,
              ease: easings.reveal,
              clearProps: "transform,opacity",
            },
          };

        case "fade-left":
          return {
            from: { opacity: 0, x: distances.fadeLeft },
            to: {
              opacity: 1,
              x: 0,
              duration: durations.reveal,
              ease: easings.reveal,
              clearProps: "transform,opacity",
            },
          };

        case "fade-right":
          return {
            from: { opacity: 0, x: distances.fadeRight },
            to: {
              opacity: 1,
              x: 0,
              duration: durations.reveal,
              ease: easings.reveal,
              clearProps: "transform,opacity",
            },
          };

        case "text-reveal": {
          const isQuiet = el ? this.isCardInterior(el) : false;
          const yDist = isQuiet ? distances.textRiseCard : distances.textRiseEditorial;
          return {
            from: { opacity: 0, y: yDist },
            to: {
              opacity: 1,
              y: 0,
              duration: durations.reveal,
              ease: easings.reveal,
              clearProps: "transform,opacity",
            },
          };
        }

        case "scale-reveal":
          return {
            from: { opacity: 0.85, scale: 0.97 },
            to: {
              opacity: 1,
              scale: 1,
              duration: durations.slow,
              ease: easings.cinematic,
              clearProps: "transform,opacity",
            },
          };

        case "image-reveal":
          return {
            from: { opacity: 0.9, scale: 1.04 },
            to: {
              opacity: 1,
              scale: 1,
              duration: durations.reveal,
              ease: easings.cinematic,
              clearProps: "transform,opacity",
            },
          };

        case "border-reveal":
        case "divider":
          return {
            from: { scaleX: 0, transformOrigin: "left center" },
            to: {
              scaleX: 1,
              duration: durations.reveal,
              ease: easings.reveal,
              clearProps: "transform",
            },
          };

        default:
          return {
            from: { opacity: 0, y: distances.fadeUp },
            to: {
              opacity: 1,
              y: 0,
              duration: durations.reveal,
              ease: easings.reveal,
              clearProps: "transform,opacity",
            },
          };
      }
    },
  };

  root.TravelMotionPresets = TravelMotionPresets;
})(typeof window !== "undefined" ? window : this);
