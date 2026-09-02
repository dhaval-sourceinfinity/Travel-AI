// shell.js — shared page chrome: mounts the header and footer on any page.
import { renderHeader, initHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";

export function mountShell() {
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
