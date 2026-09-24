/**
 * terms.js — Terms of Use Table of Contents Navigation & Scrollspy
 * Directly derived from reference UX (vita-travel.webflow.io)
 */

(function () {
  'use strict';

  function initTermsTOC() {
    const navLinks = Array.from(document.querySelectorAll('.terms-nav__link'));
    if (!navLinks.length) return;

    const sections = navLinks
      .map(link => {
        const id = link.getAttribute('href');
        if (!id || !id.startsWith('#')) return null;
        const el = document.getElementById(id.slice(1));
        return el ? { id: id.slice(1), el, link } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    let isScrollingFromClick = false;
    let clickTimeout = null;

    function setActive(activeLink) {
      navLinks.forEach(link => {
        if (link === activeLink) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    }

    // Register ScrollToPlugin if loaded
    if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
      gsap.registerPlugin(ScrollToPlugin);
    }

    function scrollToTarget(targetEl) {
      if (!targetEl) return;

      isScrollingFromClick = true;
      if (clickTimeout) clearTimeout(clickTimeout);

      // Header height offset for sticky header clearance (generous breathing room)
      const headerEl = document.getElementById('site-header');
      const headerHeight = headerEl && headerEl.offsetHeight > 0 ? headerEl.offsetHeight : 77;
      const offsetY = headerHeight + 36; // 36px comfortable gap below sticky navbar

      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        const targetTop = Math.max(0, targetEl.getBoundingClientRect().top + window.pageYOffset - offsetY);
        window.scrollTo(0, targetTop);
        isScrollingFromClick = false;
        return;
      }

      // Check if Lenis is active (site's default smooth scroll engine)
      const lenis = (window.TravelMotion && typeof window.TravelMotion.getLenis === 'function')
        ? window.TravelMotion.getLenis()
        : null;

      if (lenis && typeof lenis.scrollTo === 'function') {
        // Use default website smooth scrolling with slow, luxurious deceleration
        lenis.scrollTo(targetEl, {
          offset: -offsetY,
          duration: 1.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            isScrollingFromClick = false;
          }
        });
      } else if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
        // GSAP ScrollToPlugin animation (slow and smooth)
        gsap.killTweensOf(window);
        gsap.to(window, {
          duration: 1.8,
          scrollTo: {
            y: `#${targetEl.id}`,
            offsetY: offsetY,
            autoKill: true
          },
          ease: 'power2.out',
          onComplete: () => {
            isScrollingFromClick = false;
          },
          onInterrupt: () => {
            isScrollingFromClick = false;
          }
        });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        clickTimeout = setTimeout(() => {
          isScrollingFromClick = false;
        }, 1000);
      }
    }

    // Smooth click handler for TOC links
    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        const targetEl = document.getElementById(href.slice(1));
        if (!targetEl) return;

        e.preventDefault();
        e.stopPropagation();
        setActive(link);

        if (history.replaceState) {
          history.replaceState(null, '', href);
        }

        scrollToTarget(targetEl);
      });
    });

    // Handle direct page load / reload with URL hash (e.g. #terms-service)
    if (window.location.hash) {
      const hashId = window.location.hash.slice(1);
      const hashTarget = document.getElementById(hashId);
      if (hashTarget) {
        setTimeout(() => {
          scrollToTarget(hashTarget);
          const activeNav = navLinks.find(l => l.getAttribute('href') === '#' + hashId);
          if (activeNav) setActive(activeNav);
        }, 150);
      }
    }

    // Scrollspy with header clearance and bottom-of-page detection
    let ticking = false;

    function updateActiveOnScroll() {
      if (isScrollingFromClick) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Header height offset + comfortable trigger buffer
      const headerEl = document.getElementById('site-header');
      const headerHeight = headerEl ? headerEl.offsetHeight : 72;
      const triggerY = scrollTop + headerHeight + 60;

      // 1. Bottom of page: activate last section
      if (scrollTop + windowHeight >= docHeight - 80) {
        setActive(sections[sections.length - 1].link);
        return;
      }

      // 2. Iterate sections to find current active block
      for (let i = 0; i < sections.length; i++) {
        const current = sections[i];
        const next = sections[i + 1];

        const top = current.el.offsetTop;
        const bottom = next ? next.el.offsetTop : Infinity;

        if (triggerY >= top && triggerY < bottom) {
          setActive(current.link);
          return;
        }
      }

      // If above first section, keep first active
      if (sections.length > 0 && triggerY < sections[0].el.offsetTop) {
        setActive(sections[0].link);
      }
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial check
    updateActiveOnScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTermsTOC);
  } else {
    initTermsTOC();
  }
})();
