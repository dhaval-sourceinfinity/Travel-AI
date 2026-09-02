// journey-details.js — Journey Detail page entry point.
import { mountShell } from "./shell.js";

mountShell();

/* ---- Sidebar scrollspy: highlight the section currently in view -------- */
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

initScrollspy();
