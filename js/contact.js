/**
 * contact.js — Contact & Conversion page module.
 *
 * Orchestrates restrained hero entrance choreography, accessible form
 * interaction, real-time validation, and submission feedback.
 */
import { mountShell } from "./shell.js";

// Ensure shell header/footer are mounted if site.js has not already mounted them.
const headerEl = document.getElementById("site-header");
if (!headerEl || !headerEl.hasChildNodes()) {
  mountShell();
}

/**
 * Contact Hero Entrance Choreography
 * Sequenced on page load so the above-the-fold conversion experience
 * settles calmly into place without distracting from the form interaction.
 */
function initContactEntrance() {
  const contactTop = document.querySelector(".contact-top");
  if (!contactTop) return;

  const header = document.getElementById("site-header");
  const media = contactTop.querySelector('[data-motion="contact-image"]');
  const eyebrow = contactTop.querySelector('[data-motion="contact-eyebrow"]');
  const title = contactTop.querySelector('[data-motion="contact-title"]');
  const sub = contactTop.querySelector('[data-motion="contact-sub"]');
  const form = contactTop.querySelector('[data-motion="contact-form"]');

  const allElements = [header, media, eyebrow, title, sub, form].filter(Boolean);

  const hasReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reduced motion: immediately display all elements statically
  if (hasReducedMotion) {
    allElements.forEach((el) => {
      el.classList.add("is-visible");
      if (window.gsap) {
        window.gsap.set(el, { clearProps: "all" });
      }
    });
    return;
  }

  // GSAP Entrance
  if (window.gsap) {
    const gsap = window.gsap;
    const ease = gsap.parseEase ? "travelEase" : "power2.out";
    const tl = gsap.timeline({
      defaults: { ease: ease },
      onComplete: () => {
        allElements.forEach((el) => el.classList.add("is-visible"));
      },
    });

    // Split title into line mask wrappers if TravelMotionText is available
    let titleLines = [];
    if (window.TravelMotionText && title) {
      titleLines = window.TravelMotionText.prepareLineReveal(title);
    }

    // 1. Header navigation reveals softly
    if (header) {
      header.classList.add("is-visible");
      tl.fromTo(
        header,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.35, clearProps: "transform,opacity" },
        0.0
      );
    }

    // 2. Kyoto photography settles with subtle zoom-down
    if (media) {
      tl.fromTo(
        media,
        { opacity: 0, scale: 1.03 },
        {
          opacity: 1,
          scale: 1.0,
          duration: 1.0,
          ease: "power2.out",
          clearProps: "transform,opacity",
          onComplete: () => media.classList.add("is-visible"),
        },
        0.05
      );
    }

    // 3. Eyebrow badge rises
    if (eyebrow) {
      tl.fromTo(
        eyebrow,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: ease,
          clearProps: "transform,opacity",
          onComplete: () => eyebrow.classList.add("is-visible"),
        },
        0.15
      );
    }

    // 4. Headline lines rise through mask
    if (titleLines && titleLines.length) {
      tl.fromTo(
        titleLines,
        { opacity: 0, yPercent: 115 },
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: ease,
          clearProps: "transform,opacity",
          onComplete: () => title.classList.add("is-visible"),
        },
        0.25
      );
    } else if (title) {
      tl.fromTo(
        title,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: ease,
          clearProps: "transform,opacity",
          onComplete: () => title.classList.add("is-visible"),
        },
        0.25
      );
    }

    // 5. Supporting subtitle copy
    if (sub) {
      tl.fromTo(
        sub,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: ease,
          clearProps: "transform,opacity",
          onComplete: () => sub.classList.add("is-visible"),
        },
        0.38
      );
    }

    // 6. Form container rises smoothly (single-level ownership)
    if (form) {
      tl.fromTo(
        form,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: ease,
          clearProps: "transform,opacity",
          onComplete: () => form.classList.add("is-visible"),
        },
        0.48
      );
    }
  } else {
    // Native fallback sequence
    setTimeout(() => { if (header) header.classList.add("is-visible"); }, 0);
    setTimeout(() => { if (media) media.classList.add("is-visible"); }, 50);
    setTimeout(() => { if (eyebrow) eyebrow.classList.add("is-visible"); }, 150);
    setTimeout(() => { if (title) title.classList.add("is-visible"); }, 250);
    setTimeout(() => { if (sub) sub.classList.add("is-visible"); }, 380);
    setTimeout(() => { if (form) form.classList.add("is-visible"); }, 480);
  }
}

/**
 * Accessible Contact Form Handling
 * Ensures accessible keyboard navigation, real-time error clearance,
 * aria-busy state indicators, and clean feedback.
 */
function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  // Prevent duplicate binding if already bound
  if (form.dataset.contactFormBound === "true") return;
  form.dataset.contactFormBound = "true";

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
    if (!input) return true;
    const msg = rules[name](input.value);
    setError(input, msg);
    return !msg;
  }

  // Clear a field's error as the user types
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

    if (statusEl) {
      statusEl.textContent = "";
      statusEl.removeAttribute("data-state");
    }

    const results = Object.keys(rules).map(validateField);
    if (results.includes(false)) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      if (statusEl) {
        statusEl.setAttribute("data-state", "error");
        statusEl.textContent = "Please fix the highlighted fields.";
      }
      return;
    }

    // Simulate submission
    submitting = true;
    if (submitBtn) submitBtn.setAttribute("aria-busy", "true");

    const label = submitBtn ? submitBtn.childNodes[0] : null;
    const originalText = label ? label.textContent : "Submit";
    if (label) label.textContent = "Sending… ";

    window.setTimeout(() => {
      submitting = false;
      if (submitBtn) submitBtn.removeAttribute("aria-busy");
      if (label) label.textContent = originalText;
      form.reset();
      if (statusEl) {
        statusEl.setAttribute("data-state", "success");
        statusEl.textContent = "Thanks — we'll be in touch soon.";
      }
    }, 900);
  });
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initContactEntrance();
    initContactForm();
  });
} else {
  initContactEntrance();
  initContactForm();
}
