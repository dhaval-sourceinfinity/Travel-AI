/**
 * chat.js — Travel AI Chat Component Controller
 * Implements the 5 Figma conversation states (Figma screens 1–5):
 * - State 1: Greeting + Suggested Prompts
 * - State 2: User message + Travel Preference Chips
 * - State 3: User response + Trip Details Confirmation
 * - State 4: AI Recommendation Card (Dubai) + Action Buttons
 * - State 5: Custom 7-Day Plan + Actions
 *
 * Integrates with Home Discover CTA, background scroll locking,
 * keyboard accessibility, and state transitions.
 */

import { CHAT_STATES } from "./chat-data.js";

(function () {
  "use strict";

  /* ---- SVG Icons -------------------------------------------------------- */
  const ICONS = {
    star: `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="M10 2L11.6 7.1H17L12.6 10.3L14.3 15.4L10 12.2L5.7 15.4L7.4 10.3L3 7.1H8.4L10 2Z" fill="#A78BFA"/></svg>`,
    close: `<svg viewBox="0 0 56 56" width="28" height="28" fill="none" aria-hidden="true" focusable="false"><path d="M20.8032 37.672L19.6152 36.484L26.8312 29.224L19.6152 21.964L20.8032 20.776L28.0192 28.036L35.1912 20.776L36.3792 21.964L29.1632 29.224L36.3792 36.484L35.1912 37.672L28.0192 30.456L20.8032 37.672Z" fill="currentColor"/></svg>`,
    minimize: `<svg viewBox="0 0 56 56" width="28" height="28" fill="none" aria-hidden="true" focusable="false"><path d="M39 28.2812V30H17V28.2812H39Z" fill="currentColor"/></svg>`,
    search: `<svg viewBox="0 0 56 56" width="28" height="28" fill="none" aria-hidden="true" focusable="false"><path d="M22.666 17.5093C27.0181 13.1575 34.1049 13.1575 38.457 17.5093C40.3913 19.4435 41.544 22.0671 41.7266 24.8276L41.75 25.3823C41.7486 28.3362 40.5777 31.1229 38.457 33.2437C36.2818 35.4189 33.4372 36.48 30.5898 36.48C28.0782 36.4799 25.5668 35.6425 23.502 33.9683L23.3281 33.8257L15.7461 41.4077C15.538 41.627 15.3167 41.6946 15.1172 41.6812C14.91 41.667 14.7009 41.5627 14.5371 41.396C14.3737 41.2294 14.2684 41.0142 14.252 40.7983C14.2361 40.5889 14.3023 40.3632 14.5078 40.1577L15.4785 39.189L21.8672 32.7983L22.0254 32.6401L21.8848 32.4644C18.3136 28.0559 18.5929 21.5824 22.666 17.5093ZM30.5332 15.9995C28.1296 15.9995 25.7266 16.9371 23.9102 18.7534C20.2755 22.3881 20.2756 28.3648 23.9102 31.9995C27.544 35.6333 33.5174 35.6336 37.1523 32.0015L37.1543 32.0034C38.9739 30.2423 39.9102 27.8934 39.9102 25.3765C39.91 22.856 38.9136 20.5108 37.1562 18.7534C35.3398 16.937 32.9368 15.9995 30.5332 15.9995Z" fill="currentColor"/><path d="M30.5356 19.0308C30.7707 19.0278 30.997 19.0998 31.1587 19.2339C31.3147 19.3632 31.4243 19.5603 31.4243 19.8433V24.8628C31.4243 24.9535 31.4276 25.0472 31.4302 25.1284C31.4328 25.2119 31.4352 25.2873 31.4321 25.3589C31.4261 25.4967 31.4011 25.6027 31.3501 25.6929C31.1923 25.9009 30.9837 26.114 30.813 26.2847L27.5044 29.5933L27.4985 29.5972C27.2902 29.8171 27.0694 29.886 26.8696 29.8726C26.6625 29.8584 26.4533 29.7541 26.2896 29.5874C26.1261 29.4208 26.0209 29.2055 26.0044 28.9897C25.9885 28.7803 26.0548 28.5546 26.2603 28.3491L29.5688 25.0405L29.6431 24.9683V19.8999C29.6432 19.5996 29.7549 19.3908 29.9126 19.2534C30.0754 19.1116 30.3011 19.0339 30.5356 19.0308Z" fill="currentColor"/></svg>`,
    send: `<svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M27.2002 16L4.8002 4.80005L12.8002 16L4.8002 27.2L27.2002 16Z"/></svg>`,
    checkDouble: `✓✓`
  };

  /* ---- State & DOM References -------------------------------------------- */
  let currentState = 1;
  let isOpen = false;
  let previouslyFocusedElement = null;

  let backdropEl = null;
  let shellEl = null;
  let conversationEl = null;
  let composerFormEl = null;
  let composerInputEl = null;
  let composerSendEl = null;
  let stateButtons = [];

  /* ---- Scrollbar Width & Scroll Locking ---------------------------------- */
  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function lockScroll() {
    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth > 0) {
      document.body.style.setProperty(
        "--scrollbar-compensation",
        `${scrollbarWidth}px`
      );
    }
    document.documentElement.classList.add("chat-modal-locked");
    document.body.classList.add("chat-modal-locked");
    if (window.TravelMotion && typeof window.TravelMotion.stopScroll === "function") {
      window.TravelMotion.stopScroll();
    }
  }

  function unlockScroll() {
    document.documentElement.classList.remove("chat-modal-locked");
    document.body.classList.remove("chat-modal-locked");
    document.body.style.removeProperty("--scrollbar-compensation");
    if (window.TravelMotion && typeof window.TravelMotion.startScroll === "function") {
      window.TravelMotion.startScroll();
    }
  }

  /* ---- Build Chat DOM Shell ---------------------------------------------- */
  function createChatShell() {
    if (document.getElementById("chat-backdrop")) {
      return document.getElementById("chat-backdrop");
    }

    const backdrop = document.createElement("div");
    backdrop.className = "chat-backdrop";
    backdrop.id = "chat-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-labelledby", "chat-title");
    backdrop.setAttribute("data-lenis-prevent", "true");

    backdrop.innerHTML = `
      <div class="chat-shell" id="chat-shell" data-lenis-prevent="true">
        <!-- Top Handle Bar -->
        <div class="chat-handle" aria-hidden="true">
          <div class="chat-handle__pill"></div>
        </div>

        <!-- Chat Header -->
        <header class="chat-header">
          <div class="chat-header__profile">
            <div class="chat-avatar" aria-hidden="true">
              ${ICONS.star}
            </div>
            <div class="chat-header__info">
              <h2 class="chat-header__title" id="chat-title">Travel AI</h2>
              <p class="chat-header__subtitle">Your AI Travel Advisor</p>
            </div>
          </div>

          <!-- Prototype State Switcher (1-5) -->
          <nav class="chat-header__states" aria-label="Chat prototype states">
            <button type="button" class="chat-state-btn is-active" data-set-state="1" title="State 1: Initial Greeting" aria-label="State 1: Initial Greeting">1</button>
            <button type="button" class="chat-state-btn" data-set-state="2" title="State 2: Preference Collection" aria-label="State 2: Preference Collection">2</button>
            <button type="button" class="chat-state-btn" data-set-state="3" title="State 3: Trip Details Confirmation" aria-label="State 3: Trip Details Confirmation">3</button>
            <button type="button" class="chat-state-btn" data-set-state="4" title="State 4: AI Recommendation" aria-label="State 4: AI Recommendation">4</button>
            <button type="button" class="chat-state-btn" data-set-state="5" title="State 5: Custom 7-Day Plan" aria-label="State 5: Custom 7-Day Plan">5</button>
          </nav>

          <!-- Controls -->
          <div class="chat-header__actions">
            <button type="button" class="chat-icon-btn" id="chat-search-btn" aria-label="Search" title="Search">
              ${ICONS.search}
            </button>
            <button type="button" class="chat-icon-btn" id="chat-minimize-btn" aria-label="Minimize chat" title="Minimize chat">
              ${ICONS.minimize}
            </button>
            <button type="button" class="chat-icon-btn" id="chat-close-btn" aria-label="Close chat" title="Close chat" data-chat-close="true">
              ${ICONS.close}
            </button>
          </div>
        </header>

        <!-- Scrollable Conversation Viewport -->
        <div class="chat-conversation" id="chat-conversation" role="log" aria-live="polite" data-lenis-prevent="true">
          <!-- Dynamically populated by renderState() -->
        </div>

        <!-- Message Composer -->
        <form class="chat-composer" id="chat-composer-form" novalidate>
          <div class="chat-composer__input-wrap">
            <input
              type="text"
              class="chat-composer__input"
              id="chat-composer-input"
              name="message"
              placeholder="Type your message..."
              autocomplete="off"
              aria-label="Type your message to Travel AI"
            />
          </div>
          <button
            type="submit"
            class="chat-composer__send"
            id="chat-composer-send"
            aria-label="Send message"
            title="Send message"
            disabled
          >
            ${ICONS.send}
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(backdrop);
    return backdrop;
  }

  /* ---- Render Message Templates ------------------------------------------ */
  function renderAIMessage(msg) {
    return `
      <div class="chat-msg chat-msg--ai" id="${msg.id}">
        <div class="chat-avatar chat-msg__avatar" aria-hidden="true">
          ${ICONS.star}
        </div>
        <div class="chat-msg__content">
          <div class="chat-bubble chat-bubble--ai">
            ${escapeHtml(msg.text)}
            <div class="chat-bubble__meta">
              <time datetime="2026-09-10T11:12">${msg.time}</time>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderUserMessage(msg) {
    return `
      <div class="chat-msg chat-msg--user" id="${msg.id}">
        <div class="chat-bubble chat-bubble--user">
          ${escapeHtml(msg.text)}
          <div class="chat-bubble__meta">
            <time datetime="2026-09-10T11:23">${msg.time}</time>
            <span class="chat-bubble__status" aria-label="Delivered">${msg.status || ICONS.checkDouble}</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderTripSummaryMessage(msg) {
    const summary = msg.tripSummary;
    const itemsHtml = summary.items
      .map(
        (item) => `
        <li class="chat-summary-row">
          ${item.icon ? `<span class="chat-summary-icon" aria-hidden="true">${item.icon}</span>` : ""}
          <span class="chat-summary-label">${escapeHtml(item.label)}:</span>
          <span class="chat-summary-value">${escapeHtml(item.value)}</span>
        </li>`
      )
      .join("");

    return `
      <div class="chat-msg chat-msg--ai" id="${msg.id}">
        <div class="chat-avatar chat-msg__avatar" aria-hidden="true">
          ${ICONS.star}
        </div>
        <div class="chat-msg__content">
          <div class="chat-summary-card">
            <p class="chat-summary-intro">${escapeHtml(summary.intro)}</p>
            <ul class="chat-summary-grid">
              ${itemsHtml}
            </ul>
            <p class="chat-summary-question">${escapeHtml(summary.question)}</p>
            <div class="chat-bubble__meta">
              <time datetime="2026-09-10T11:25">${msg.time}</time>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderRecommendationCard(msg) {
    const card = msg.recommendationCard;
    const highlightsHtml = card.highlights
      .map((hl) => `<li>${escapeHtml(hl)}</li>`)
      .join("");

    return `
      <div class="chat-msg chat-msg--ai" id="${msg.id}">
        <div class="chat-avatar chat-msg__avatar" aria-hidden="true">
          ${ICONS.star}
        </div>
        <div class="chat-msg__content">
          <div class="chat-recommendation-card">
            <div class="chat-recommendation__media">
              <img
                class="chat-recommendation__img"
                src="${card.image}"
                alt="${escapeHtml(card.imageAlt)}"
                loading="lazy"
              />
            </div>
            <h3 class="chat-recommendation__header">${escapeHtml(card.title)}</h3>
            <div class="chat-recommendation__details">
              <span class="chat-recommendation__dest">${escapeHtml(card.destination)}</span>
              <span>${escapeHtml(card.budget)}</span>
              <span>${escapeHtml(card.style)}</span>
            </div>
            <div class="chat-recommendation__highlights">
              <div class="chat-recommendation__highlights-title">${escapeHtml(card.highlightsTitle)}:</div>
              <ul class="chat-recommendation__list">
                ${highlightsHtml}
              </ul>
            </div>
            <div class="chat-bubble__meta">
              <time datetime="2026-09-10T11:28">${msg.time}</time>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderItineraryCard(msg) {
    const plan = msg.itineraryPlan;
    const daysHtml = plan.days
      .map(
        (item) => `
        <div class="chat-itinerary__item">
          <span class="chat-itinerary__day">${escapeHtml(item.day)}</span>
          <span class="chat-itinerary__dash">—</span>
          <span class="chat-itinerary__desc">${escapeHtml(item.desc)}</span>
        </div>`
      )
      .join("");

    return `
      <div class="chat-msg chat-msg--ai" id="${msg.id}">
        <div class="chat-avatar chat-msg__avatar" aria-hidden="true">
          ${ICONS.star}
        </div>
        <div class="chat-msg__content">
          <div class="chat-itinerary-card">
            <h3 class="chat-itinerary__title">${escapeHtml(plan.title)}</h3>
            <div class="chat-itinerary__box">
              ${daysHtml}
            </div>
            <div class="chat-bubble__meta">
              <time datetime="2026-09-10T11:35">${msg.time}</time>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderChips(chips, isHorizontal = false) {
    if (!chips || !chips.length) return "";
    const wrapClass = isHorizontal
      ? "chat-chips-wrap chat-chips-wrap--horizontal"
      : "chat-chips-wrap";

    const chipsHtml = chips
      .map(
        (chip) => `
        <button
          type="button"
          class="chat-chip"
          data-chip-id="${chip.id}"
          data-next-state="${chip.nextState}"
        >
          ${escapeHtml(chip.text)}
        </button>`
      )
      .join("");

    return `<div class="${wrapClass}" role="group" aria-label="Suggested responses">${chipsHtml}</div>`;
  }

  function renderActions(actions) {
    if (!actions || !actions.length) return "";
    const actionsHtml = actions
      .map(
        (action) => `
        <button
          type="button"
          class="chat-action-btn chat-action-btn--${action.variant}"
          data-action-id="${action.id}"
          data-next-state="${action.nextState}"
        >
          ${escapeHtml(action.text)}
        </button>`
      )
      .join("");

    return `<div class="chat-actions-wrap" role="group" aria-label="Available actions">${actionsHtml}</div>`;
  }

  /* ---- Render State Machine ---------------------------------------------- */
  function renderState(stateNumber) {
    currentState = stateNumber;
    const stateData = CHAT_STATES[stateNumber] || CHAT_STATES[1];

    if (!conversationEl) return;

    let html = "";

    // 1. Render all messages in sequence
    stateData.messages.forEach((msg) => {
      if (msg.tripSummary) {
        html += renderTripSummaryMessage(msg);
      } else if (msg.recommendationCard) {
        html += renderRecommendationCard(msg);
      } else if (msg.itineraryPlan) {
        html += renderItineraryCard(msg);
      } else if (msg.sender === "user") {
        html += renderUserMessage(msg);
      } else {
        html += renderAIMessage(msg);
      }
    });

    // 2. Render chips or actions
    if (stateData.chips) {
      // Horizontal wrapping for State 2 preference chips
      const isHorizontal = stateNumber === 2 || stateNumber === 3;
      html += renderChips(stateData.chips, isHorizontal);
    }

    if (stateData.actions) {
      html += renderActions(stateData.actions);
    }

    conversationEl.innerHTML = html;

    // 3. Update composer placeholder
    if (composerInputEl) {
      composerInputEl.placeholder = stateData.composerPlaceholder || "Type your message...";
      composerInputEl.value = "";
      if (composerSendEl) composerSendEl.classList.remove("is-active");
    }

    // 4. Update prototype state switcher buttons
    stateButtons.forEach((btn) => {
      const btnState = parseInt(btn.getAttribute("data-set-state"), 10);
      if (btnState === stateNumber) {
        btn.classList.add("is-active");
        btn.setAttribute("aria-current", "true");
      } else {
        btn.classList.remove("is-active");
        btn.removeAttribute("aria-current");
      }
    });

    // 5. Scroll conversation to bottom
    setTimeout(() => {
      conversationEl.scrollTop = conversationEl.scrollHeight;
    }, 40);
  }

  /* ---- Open & Close Handlers --------------------------------------------- */
  function openChat(targetState = 1) {
    if (isOpen) return;

    previouslyFocusedElement = document.activeElement;
    lockScroll();

    if (!backdropEl) {
      backdropEl = createChatShell();
      bindEvents();
    }

    renderState(targetState);

    backdropEl.classList.add("is-open");
    isOpen = true;

    // Move focus into the chat dialog
    setTimeout(() => {
      if (composerInputEl) {
        composerInputEl.focus();
      } else {
        const closeBtn = document.getElementById("chat-close-btn");
        if (closeBtn) closeBtn.focus();
      }
    }, 120);
  }

  function closeChat() {
    if (!isOpen || !backdropEl) return;

    backdropEl.classList.remove("is-open");
    isOpen = false;
    unlockScroll();

    // Restore focus
    if (
      previouslyFocusedElement &&
      typeof previouslyFocusedElement.focus === "function"
    ) {
      previouslyFocusedElement.focus();
    }
  }

  /* ---- Event Delegation & Binding ---------------------------------------- */
  function bindEvents() {
    shellEl = document.getElementById("chat-shell");
    conversationEl = document.getElementById("chat-conversation");
    composerFormEl = document.getElementById("chat-composer-form");
    composerInputEl = document.getElementById("chat-composer-input");
    composerSendEl = document.getElementById("chat-composer-send");
    stateButtons = Array.from(document.querySelectorAll("[data-set-state]"));

    // Close on backdrop click (click outside modal shell)
    backdropEl.addEventListener("click", (e) => {
      if (e.target === backdropEl) {
        closeChat();
      }
    });

    // Close button & minimize button
    backdropEl.addEventListener("click", (e) => {
      const closeTrigger = e.target.closest("[data-chat-close]");
      const minTrigger = e.target.closest("#chat-minimize-btn");
      if (closeTrigger || minTrigger) {
        closeChat();
        return;
      }

      const searchTrigger = e.target.closest("#chat-search-btn");
      if (searchTrigger && composerInputEl) {
        composerInputEl.focus();
      }
    });

    // State Switcher buttons in header
    backdropEl.addEventListener("click", (e) => {
      const stateBtn = e.target.closest("[data-set-state]");
      if (stateBtn) {
        const next = parseInt(stateBtn.getAttribute("data-set-state"), 10);
        if (!isNaN(next)) {
          renderState(next);
        }
      }
    });

    // Chip click progression
    conversationEl.addEventListener("click", (e) => {
      const chip = e.target.closest(".chat-chip");
      if (chip) {
        const nextState = parseInt(chip.getAttribute("data-next-state"), 10);
        if (!isNaN(nextState)) {
          renderState(nextState);
        }
        return;
      }

      const action = e.target.closest(".chat-action-btn");
      if (action) {
        const nextState = parseInt(action.getAttribute("data-next-state"), 10);
        if (!isNaN(nextState)) {
          renderState(nextState);
        }
      }
    });

    // Composer Input typing state
    if (composerInputEl && composerSendEl) {
      const updateSendState = () => {
        const hasText = composerInputEl.value.trim().length > 0;
        if (hasText) {
          composerSendEl.classList.add("is-active");
          composerSendEl.removeAttribute("disabled");
        } else {
          composerSendEl.classList.remove("is-active");
          composerSendEl.setAttribute("disabled", "true");
        }
      };

      composerInputEl.addEventListener("input", updateSendState);
      composerInputEl.addEventListener("change", updateSendState);
      updateSendState();
    }

    // Composer submit handling
    if (composerFormEl) {
      composerFormEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = composerInputEl ? composerInputEl.value.trim() : "";
        if (!text) return;

        // Append custom user message and advance mock state
        const userMsg = {
          id: `msg-custom-${Date.now()}`,
          sender: "user",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: ICONS.checkDouble,
          text: text
        };

        const userMsgHtml = renderUserMessage(userMsg);
        conversationEl.insertAdjacentHTML("beforeend", userMsgHtml);
        composerInputEl.value = "";
        composerSendEl.classList.remove("is-active");
        composerSendEl.setAttribute("disabled", "true");
        conversationEl.scrollTop = conversationEl.scrollHeight;

        // Auto transition to next logical state after brief mock pause
        setTimeout(() => {
          if (currentState < 5) {
            renderState(currentState + 1);
          } else {
            renderState(1);
          }
        }, 350);
      });
    }

    // Keyboard navigation: Escape key to close + Focus Trap
    document.addEventListener("keydown", (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeChat();
        return;
      }

      if (e.key === "Tab") {
        trapFocus(e);
      }
    });
  }

  function trapFocus(e) {
    if (!shellEl) return;
    const focusable = shellEl.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ---- Home Page "Discover" Trigger Integration -------------------------- */
  function initDiscoverTriggers() {
    // Bind all elements with [data-chat-trigger] or hero CTA (.btn-hero)
    const triggers = document.querySelectorAll(
      '[data-chat-trigger], .hero__cta, a[href="#destinations"].btn-hero'
    );

    triggers.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Prevent anchor jumping so Home page stays smoothly stationary underneath
        e.preventDefault();
        openChat(1);
      });
    });

    // Check URL hash (#chat or ?chat=true)
    if (window.location.hash === "#chat" || window.location.search.includes("chat=true")) {
      setTimeout(() => openChat(1), 300);
    }
  }

  /* ---- Public API -------------------------------------------------------- */
  window.TravelChat = {
    open: openChat,
    close: closeChat,
    setState: renderState,
    getState: () => currentState,
    isOpen: () => isOpen
  };

  // Initialize once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      backdropEl = createChatShell();
      bindEvents();
      initDiscoverTriggers();
    });
  } else {
    backdropEl = createChatShell();
    bindEvents();
    initDiscoverTriggers();
  }
})();
