// js/blog-details.js — The Journal, article detail page interactions.
//
// The article body is static markup, so this module never rewrites the DOM.
// That means the canonical [data-motion] observer in site.js reveals every
// element normally — no forced .is-visible re-hydration is needed here.
//
// Two behaviours, both no-ops when their markup is absent:
//   1. Table-of-contents scrollspy
//   2. Share rail (copy link; X and email are plain links needing no JS)

const COPIED_MESSAGE = "Link copied to your clipboard.";
const COPY_FAILED_MESSAGE = "Couldn't copy — copy the address bar instead.";

/* ---- Table of contents scrollspy ---------------------------------------
   Mirrors initScrollspy() in site.js: the section occupying the middle band
   of the viewport becomes current. Uses aria-current so the state is exposed
   to assistive technology, not just painted. ------------------------------ */
function initTocScrollspy() {
  const links = [...document.querySelectorAll(".article-toc__link")];
  if (!links.length || !("IntersectionObserver" in window)) return;

  const sections = new Map();
  links.forEach((link) => {
    const id = (link.getAttribute("href") || "").slice(1);
    const section = id && document.getElementById(id);
    if (section) sections.set(section, link);
  });
  if (!sections.size) return;

  const setCurrent = (active) => {
    links.forEach((link) => {
      if (link === active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      const topMost = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (topMost) setCurrent(sections.get(topMost.target));
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
  );

  sections.forEach((_link, section) => io.observe(section));
}

/* ---- Share rail ---------------------------------------------------------
   Only the copy-link control needs scripting. If the Clipboard API is absent
   or rejects (file://, denied permission), the failure is reported rather
   than silently swallowed. ------------------------------------------------ */
function initShare() {
  const share = document.querySelector(".article-share");
  if (!share) return;

  const status = share.querySelector("[data-share-status]");

  const announce = (message, state) => {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  };

  share.addEventListener("click", async (event) => {
    const trigger = event.target.closest('[data-share="copy"]');
    if (!trigger) return;

    const url = window.location.href;
    if (!navigator.clipboard?.writeText) {
      announce(COPY_FAILED_MESSAGE, "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      announce(COPIED_MESSAGE, "ok");
    } catch {
      announce(COPY_FAILED_MESSAGE, "error");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTocScrollspy();
  initShare();
});
