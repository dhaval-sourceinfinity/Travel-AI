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
  const brandMark = `<svg class="brand__logo-svg" viewBox="0 0 219 69" width="109" height="34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
<path d="M15.6005 44.1263L7.07487 44.1184C6.4022 45.7454 4.71271 46.6957 3.01931 46.4024C1.32591 46.1091 -0.015508 44.5486 0.000135439 42.82C0.0157788 41.0914 1.25943 39.5662 2.90199 39.226C4.68534 38.8584 6.44131 39.84 7.09833 41.5803H15.7374C15.9134 40.8724 16.0307 40.1607 16.3631 39.5623L17.8258 36.9342H11.1265L7.98219 35.0492C6.83239 35.9839 5.32672 36.242 3.94619 35.5419C2.74555 34.9319 1.88908 33.6022 2.0064 32.116C2.16675 30.0276 3.94228 28.5415 5.95245 28.7292C8.01738 28.9209 9.51915 30.7746 9.21019 32.9139L11.6975 34.4039L19.2689 34.4195L21.8422 29.9651L17.6224 29.9494L14.2708 26.1051C12.7026 26.8364 10.8723 26.4649 9.78118 25.1469C8.69005 23.8289 8.57664 21.9869 9.60519 20.5477C10.7628 18.9286 12.8981 18.432 14.6072 19.4527C16.3162 20.4734 16.9771 22.5579 16.0268 24.3647L18.737 27.4739L23.3557 27.4504L26.5822 21.9361L34.4274 8.63528C35.1743 7.36816 36.0269 6.30832 37.075 5.31888C38.3304 4.12998 39.8087 3.42211 41.4982 3.06623C44.3179 2.47178 47.0516 2.53826 49.9026 2.93326C52.5268 3.29697 54.8968 4.50151 56.2969 6.81673L60.9078 14.439L65.3114 21.9556C62.6012 24.1457 59.8714 26.1637 56.8639 28.0957L48.3344 14.0518C46.9186 12.2919 44.3257 12.245 42.824 13.9267L37.9393 21.7718L27.3644 38.7567C27.0437 39.269 26.8521 39.8634 26.7934 40.3992C26.7113 41.1462 27.1141 41.7954 27.7946 42.0652C28.4751 42.3351 29.222 42.3547 29.9729 42.2178C33.0273 41.6742 35.9409 40.935 38.9053 39.9417C49.5819 36.3632 60.0474 30.5282 68.3775 22.9216C71.2676 20.2818 73.7823 17.4347 76.3556 14.4273C75.1863 17.5833 73.5476 20.3639 71.5062 22.9568C67.6344 27.8767 63.0783 32.0691 57.9824 35.7218C50.1451 41.3378 39.4489 46.4337 30.1372 48.9171C27.5325 49.6132 25.01 50.1607 22.3311 50.3523C20.4304 50.4892 18.5493 49.7579 17.3096 48.3969C16.2458 47.2276 15.7843 45.7962 15.6083 44.1302L15.6005 44.1263ZM12.3193 21.3025C11.4472 21.5333 11.0483 22.3937 11.2438 23.1093C11.4589 23.8993 12.2802 24.3413 13.0311 24.1457C13.782 23.9502 14.3021 23.1797 14.1418 22.4484C13.9619 21.6389 13.1993 21.0718 12.3232 21.3025H12.3193ZM5.18984 30.9741C4.31381 31.2361 3.93836 32.1043 4.23168 32.8356C4.52499 33.567 5.26805 33.9307 5.9681 33.7312C6.78155 33.5005 7.21566 32.7105 7.00056 31.9479C6.78546 31.1853 6.02676 30.7238 5.19375 30.9741H5.18984ZM3.27352 41.4121C2.39358 41.6546 2.01422 42.472 2.24496 43.262C2.45615 43.9855 3.24223 44.3844 3.95401 44.2201C4.79093 44.0324 5.22895 43.2776 5.04905 42.4837C4.86915 41.6898 4.14564 41.1697 3.26961 41.4082L3.27352 41.4121ZM57.607 56.465C59.0071 58.3696 60.7943 59.6132 63.0548 60.2429C70.6849 62.3665 78.1077 56.6527 78.7373 48.8545C78.8625 47.3175 78.4401 45.9565 77.8574 44.576L69.6798 30.2193C67.2512 32.687 64.8538 34.9749 62.1631 37.0867L67.8652 46.9655C68.0646 47.7516 67.6853 48.3852 67.0556 48.8819C65.7416 49.7344 63.9269 49.4724 62.8749 48.2796L57.8886 40.5048C55.5968 42.1004 53.2855 43.5357 50.8178 44.9749L57.6031 56.4689L57.607 56.465Z" fill="#7C3AED"/>
<path d="M160.658 36.9496C159.903 36.9496 159.141 37.6262 159.141 38.3184V44.9551C159.133 45.9054 159.911 46.5781 160.842 46.5781H170.588C171.038 46.5781 171.432 46.8753 171.593 47.2312L172.305 48.7956C172.5 49.2218 172.398 49.7068 171.933 49.9571C171.569 50.1526 171.065 50.2582 170.596 50.2543L159.09 50.2074C156.751 50.1996 154.862 48.162 154.87 45.8741L154.909 37.5597C154.921 35.2679 156.829 33.4415 159.078 33.4376L169.383 33.4063C172.078 33.3985 173.912 35.3696 173.822 38.029C173.779 39.3039 173.701 40.5358 172.817 41.5487C171.827 42.6829 170.439 43.1835 168.926 43.1796L162.148 43.1639C161.667 43.1639 161.432 42.8432 161.26 42.4678L160.615 41.0716C160.521 40.8722 160.564 40.4107 160.697 40.2269C160.815 40.0665 161.155 39.9218 161.429 39.9218L168.429 39.9062C169.282 39.9062 169.72 39.0927 169.692 38.381C169.661 37.5753 169.168 36.9418 168.323 36.9418H160.654L160.658 36.9496Z" fill="white"/>
<path d="M44.455 68.3069C41.999 65.4989 39.8168 62.6401 38.0021 59.4606C37.3881 58.3851 36.9384 57.2744 36.8875 56.0503C36.7115 51.8579 40.0631 48.4046 44.1539 48.256C48.2446 48.1074 51.9287 51.3456 52.0382 55.6162C52.0147 57.2314 51.4359 58.6119 50.5794 59.9729C48.7609 62.863 46.7429 65.5107 44.4511 68.3069H44.455ZM47.4664 55.2525C47.2317 53.43 45.64 52.3741 43.9349 52.6479C42.3862 52.8943 41.1504 54.4391 41.4632 56.1168C41.7761 57.7946 43.3326 58.7957 44.9439 58.5376C46.4261 58.2991 47.6815 56.9146 47.4703 55.2564L47.4664 55.2525Z" fill="white"/>
<path d="M95.2413 49.1164C95.2413 49.7734 94.9401 50.2036 94.3105 50.2075L91.3226 50.2154C91.0254 50.2154 90.5874 49.8908 90.5874 49.5388V30.4656H83.3679C82.8008 30.4656 82.4058 29.9767 82.3667 29.4683L82.355 27.552C82.355 26.9575 82.7617 26.5664 83.3757 26.5664H102.625C103.188 26.5664 103.474 26.9458 103.657 27.3642L104.318 28.8582C104.49 29.2454 104.4 29.6365 104.111 29.9884C103.63 30.2857 103.106 30.4734 102.519 30.4695H95.2334V49.1203L95.2413 49.1164Z" fill="white"/>
<path d="M134.776 35.7728C134.358 34.9437 133.474 34.6073 133.736 33.9581C133.814 33.7626 134.17 33.5592 134.385 33.5592H136.133C137.326 33.8017 138.659 34.4861 139.25 35.7141L143.947 45.456L149.207 34.2554C149.457 33.7235 149.899 33.4184 150.486 33.4302L154.186 33.4654C154.51 33.4654 154.311 33.9972 154.225 34.1615L146.121 49.6915C145.91 50.0982 145.453 50.282 145.03 50.2742L142.883 50.2312C142.195 50.2155 141.694 49.5703 141.397 48.9797L134.776 35.7806V35.7728Z" fill="white"/>
<path d="M199.333 32.284L191.8 49.5231C191.616 49.9455 191.433 50.2349 190.948 50.2427H186.677C186.568 50.2427 186.294 50.1918 186.278 50.1019L186.212 49.6795L193.224 34.2277L196.071 27.9C196.525 26.891 197.819 26.5507 198.781 26.5507L201.292 26.5429C202.004 26.5429 202.148 26.8558 202.407 27.4268L212.211 49.2063C212.313 49.4331 212.379 49.7265 212.317 49.8712C212.254 50.0159 211.914 50.231 211.753 50.231H207.064L203.541 41.9556L199.329 32.2801L199.333 32.284Z" fill="#7C3AED"/>
<path d="M218.996 49.0538V27.5558C218.996 27.286 219.008 26.9497 218.894 26.8167C218.781 26.6837 218.413 26.5508 218.226 26.5508L215.109 26.5742C214.585 26.5742 214.319 27.0709 214.338 27.5363L214.428 29.5895L214.42 49.4136C214.42 49.66 214.456 49.9259 214.565 50.0276C214.655 50.1136 214.976 50.2114 215.101 50.2114L218.237 50.188C219.027 50.1801 219 49.5622 219 49.0499L218.996 49.0538Z" fill="#7C3AED"/>
<path d="M133.986 50.2152C132.953 50.2035 131.807 49.4917 131.487 48.4241L128.483 38.4983C128.237 37.6927 127.404 37.0826 126.567 37.0826H118.949C118.362 37.0826 117.795 36.7541 117.795 36.0892V34.3411C117.791 33.8835 118.229 33.4416 118.718 33.4416L127.283 33.4533C129.453 33.4533 131.287 34.7635 132.195 36.6837L133.051 39.1827L135.84 48.1503L136.446 49.4644C136.501 49.5817 136.489 49.918 136.418 50.0236C136.348 50.1292 136.106 50.2387 135.965 50.2348L133.99 50.2152H133.986Z" fill="white"/>
<path d="M51.4513 30.6144C48.5533 32.1474 45.7805 33.3911 42.8787 34.6621C40.4579 35.7532 38.1426 36.7701 35.3816 37.4975L43.391 24.1341L45.1392 21.6663C45.2291 21.5373 45.628 21.5842 45.761 21.7094L48.1935 25.3543L51.4474 30.6144H51.4513Z" fill="white"/>
<path d="M179.586 50.2076L176.645 50.2154C176.497 50.2154 176.196 50.0238 176.067 49.8752V28.7683L175.828 27.7789C175.719 27.3174 176.016 26.6252 176.559 26.6212L179.888 26.5978C180.048 26.5978 180.333 26.9067 180.333 27.1062L180.353 49.3003C180.353 49.793 180.095 50.0825 179.579 50.2115L179.586 50.2076Z" fill="white"/>
<path d="M107.455 37.1764C106.493 37.1803 105.703 38.0329 105.703 38.9246L105.722 49.0771C105.722 49.6794 105.523 50.2074 104.768 50.2074H102.031C101.741 50.2113 101.393 49.8593 101.397 49.5543L101.506 37.8334C101.53 35.3618 103.685 33.4768 106.09 33.465L114.674 33.422C114.901 33.422 115.234 33.7114 115.308 33.8913C115.406 34.126 115.378 34.564 115.261 34.7869L114.389 36.4607C114.205 36.8166 113.767 37.1373 113.309 37.1412L107.447 37.1725L107.455 37.1764Z" fill="white"/>
<path d="M77.2863 13.0349C77.0203 13.0974 76.7896 13.1483 76.6762 13.1131C76.5354 13.074 76.5471 12.6673 76.6879 12.4287L74.1028 11.2633L74.9124 10.1017L77.5327 10.2816L80.0278 7.25463L73.5671 4.77124L74.2671 3.17561L82.9296 4.02818L85.3505 1.69731C86.1639 0.911229 87.169 0.402818 88.2445 0C88.616 0.0977713 89.1792 0.637469 89.0853 0.997268C88.7216 2.43255 87.8729 3.52368 86.9422 4.58743L85.3856 6.36687L86.6997 14.9316C86.1913 15.3032 85.7455 15.6004 85.1314 15.8898L82.3117 9.45253L79.3199 11.9711L79.8244 14.6813L78.7255 15.3618L77.2902 13.0388L77.2863 13.0349Z" fill="white"/>
<path d="M128.233 46.9029C128.538 46.9029 128.933 47.1923 129.035 47.4113L129.876 49.2533C130.067 49.6718 129.68 50.2349 129.16 50.2349H119.105C117.697 50.2271 116.415 49.4215 115.715 48.2951C115.171 47.4191 115.253 46.4883 115.198 45.5145C115.108 43.8446 115.609 42.2841 117.068 41.3534C117.819 40.8723 118.749 40.4421 119.696 40.4421L126.548 40.4265C127.005 40.4265 127.345 40.7667 127.498 41.1265L128.182 42.7261C128.37 43.168 127.912 43.7507 127.392 43.7507L120.517 43.7664C119.629 43.7664 119.152 44.6346 119.172 45.3737C119.199 46.3162 119.817 46.9029 120.744 46.9029H128.229H128.233Z" fill="white"/>
</svg>`;

  function brand(extraClass = "") {
    return `<a class="brand ${extraClass}" href="index.html" aria-label="Travel AI — Home">
      ${brandMark}
    </a>`;
  }

  const arrow = `<svg class="icon icon--arrow" viewBox="0 0 9 9" aria-hidden="true" focusable="false"><path d="M2.25 6.75 6.75 2.25M6.75 5.76V2.25H3.24" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* ==========================================================================
     2. Header Component
     ========================================================================== */
  const NAV_LINKS = [
    { label: "About Us", href: "about-us.html" },
    { label: "Packages", href: "journeys.html" },
    { label: "AI Planner", href: "index.html#how" },
    { label: "My Trips", href: "my-trips.html" },
    { label: "Blog", href: "blog-listing.html" },
  ];

  // Current document, as a bare filename. "/" and "/index.html" both resolve
  // to index.html so the home link highlights either way.
  function currentPage() {
    const last = window.location.pathname.split("/").pop();
    return (last || "index.html").toLowerCase();
  }

  function renderHeader() {
    const here = currentPage();
    const links = NAV_LINKS.map((l) => {
      const target = l.href.split("#")[0].toLowerCase();
      const current = target === here ? ' aria-current="page"' : "";
      return `<a class="nav__link" href="${l.href}"${current}>${l.label}</a>`;
    }).join("");

    return `<div class="container site-header__inner">
      ${brand()}
      <nav class="nav" id="primary-nav" aria-label="Primary">
        ${links}
        <div class="nav__mobile-actions">
          <a class="nav-link-signin" href="contact.html">Sign In</a>
          <a class="btn btn--pill btn--accent" href="index.html#destinations">Get Started</a>
        </div>
      </nav>
      <div class="nav-actions">
        <a class="nav-link-signin" href="contact.html">Sign In</a>
        <a class="btn btn--pill btn--accent nav-cta-btn" href="index.html#destinations">Get Started</a>
      </div>
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
      if (e.target.closest(".nav__link, .nav-link-signin, .btn")) setOpen(false);
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
        { label: "Our Story", href: "about-us.html" },
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

  // My Trips Page: status filter over statically-rendered trip cards
  function initMyTrips() {
    const grid = document.querySelector("[data-trips]");
    if (!grid) return;

    const filter = document.querySelector("[data-trip-filter]");
    const emptyEl = document.querySelector("[data-trips-empty]");
    const statusEl = document.querySelector("[data-trips-status]");
    const cards = [...grid.querySelectorAll("[data-trip-status]")];

    // A card hidden before the motion observer reached it would never
    // intersect, so it would stay at opacity 0 when a filter reveals it
    // later. Settle it the same way initMotionReveal's cascade does.
    function settleMotion(el) {
      el.classList.add("is-visible");
      el.querySelectorAll("[data-motion]").forEach((child) => {
        if (child.getAttribute("data-motion") !== "copy-follow") {
          child.classList.add("is-visible");
        }
      });
    }

    function apply(value) {
      let shown = 0;
      cards.forEach((card) => {
        const match = value === "all" || card.dataset.tripStatus === value;
        card.hidden = !match;
        if (match) {
          shown += 1;
          settleMotion(card);
        }
      });

      if (emptyEl) emptyEl.hidden = shown > 0;
      if (statusEl) {
        statusEl.textContent =
          shown === 0
            ? "No trips match this filter."
            : `Showing ${shown} ${shown === 1 ? "trip" : "trips"}.`;
      }
    }

    // Keep any tab count honest against the markup it describes.
    document.querySelectorAll("[data-count-for]").forEach((el) => {
      const status = el.getAttribute("data-count-for");
      const n = cards.filter((c) => c.dataset.tripStatus === status).length;
      el.textContent = `(${n})`;
    });

    if (filter) {
      filter.addEventListener("click", (e) => {
        const tab = e.target.closest(".trip-filter__tab");
        if (!tab) return;
        filter
          .querySelectorAll(".trip-filter__tab")
          .forEach((t) => t.setAttribute("aria-pressed", String(t === tab)));
        apply(tab.dataset.filter || "all");
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

    // My Trips: status filter
    initMyTrips();

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

