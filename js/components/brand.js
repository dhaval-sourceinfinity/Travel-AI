// brand.js — the Travel AI lockup, reused in the header and footer.
export const brandMark = `<svg class="brand__mark" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 1.6 9.28 5.68H13.6L10.08 8.24 11.44 12.32 8 9.76 4.56 12.32 5.92 8.24 2.4 5.68H6.72L8 1.6Z"/></svg>`;

export function brand(extraClass = "") {
  return `<a class="brand ${extraClass}" href="index.html" aria-label="Travel AI — home">
    ${brandMark}
    <span>Travel <span class="brand__ai">AI</span></span>
  </a>`;
}

// Small diagonal arrow (↗), themed with currentColor.
export const arrow = `<svg class="icon icon--arrow" viewBox="0 0 9 9" aria-hidden="true" focusable="false"><path d="M2.25 6.75 6.75 2.25M6.75 5.76V2.25H3.24" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
