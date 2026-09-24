/**
 * faqs.js — FAQ page interactive tabs & accordion functionality
 */
(function () {
  "use strict";

  const FAQ_DATA = {
    general: {
      title: "General & Platform FAQs",
      desc: "Learn about Travel AI's hybrid human-computer curation process.",
      items: [
        {
          id: "gen-1",
          question: "What exactly is Travel AI and how does it make travel personal?",
          answer: "Travel AI represents a hybrid approach to modern holiday planning. We pair state-of-the-art artificial intelligence models with verified, professional travel agents. The AI organizes raw insights, neighborhood trends, and options while real local experts validate itineraries to guarantee everything runs smoothly.",
          open: true,
        },
        {
          id: "gen-2",
          question: "Are the journeys pre-packaged or fully customizable?",
          answer: "Every journey serves as a curated foundation that can be completely tailored. You can adjust durations, swap accommodations, add private excursions, or let our AI re-optimize the pacing according to your preferences.",
          open: false,
        },
        {
          id: "gen-3",
          question: "What booking and cancellation rules apply to your signature packages?",
          answer: "Since bookings depend on premium localized providers across Dubai and Japan, each route carries customized cancellation windows. You will see detailed timeline visualizers before finalizing any package. Support is always accessible through your dedicated agent.",
          open: true,
        },
        {
          id: "gen-4",
          question: "How detailed can my prompts be when using the AI Planner?",
          answer: "You can be as specific as you like. Include details like dietary requirements, mobility preferences, architectural interests, ideal daily wake-up times, or specific neighborhoods you want to stay in.",
          open: false,
        },
        {
          id: "gen-5",
          question: "Why do you focus exclusively on Dubai and Japan?",
          answer: "We prioritize depth over breadth. By focusing on Dubai and Japan, our AI models and human travel agents maintain unmatched ground-truth knowledge, exclusive local partnerships, and real-time availability.",
          open: false,
        },
      ],
    },
    booking: {
      title: "Booking & Payments",
      desc: "Clear guidelines on reservations, pricing, currencies, and cancellation policies.",
      items: [
        {
          id: "book-1",
          question: "What payment methods do you accept?",
          answer: "We accept all major credit and debit cards (Visa, MasterCard, American Express), Apple Pay, Google Pay, and bank wire transfers for bespoke concierge packages. All transactions are encrypted and processed securely.",
          open: true,
        },
        {
          id: "book-2",
          question: "Is a deposit required when securing a signature journey?",
          answer: "Yes, a 20% deposit confirms your reservation and locks in hotel and exclusive access slots. The remaining balance is due 30 days prior to your journey departure date.",
          open: false,
        },
        {
          id: "book-3",
          question: "How do refunds and flexible booking policies work?",
          answer: "Depending on your selected tier, bookings cancelled 30+ days in advance qualify for full refunds or credit toward future journeys. We also offer comprehensive travel protection add-ons.",
          open: false,
        },
        {
          id: "book-4",
          question: "Are taxes, local resort fees, and service charges included in the price?",
          answer: "All transparent pricing displays mandatory local taxes and tourism dirham/fees upfront. You will never encounter unexpected hidden checkout fees.",
          open: false,
        },
      ],
    },
    planner: {
      title: "AI Planner FAQs",
      desc: "How to craft bespoke, fatigue-free itineraries using prompt-driven curation.",
      items: [
        {
          id: "plan-1",
          question: "How does the Travel AI Planner generate my itinerary?",
          answer: "Our proprietary AI models analyze thousands of geo-verified venues, transit schedules, seasonal opening hours, and local crowd patterns to build optimal, fatigue-free day-by-day itineraries.",
          open: true,
        },
        {
          id: "plan-2",
          question: "Can I edit and regenerate specific days or activities?",
          answer: "Yes! You can regenerate individual days, swap activities, adjust pace, or ask the AI to find alternatives within walking distance of your hotel.",
          open: false,
        },
        {
          id: "plan-3",
          question: "Does the planner account for dietary restrictions and accessibility?",
          answer: "Absolutely. Simply mention halal, vegan, gluten-free, wheelchair accessible, or child-friendly preferences, and every dining and activity recommendation will respect your criteria.",
          open: false,
        },
        {
          id: "plan-4",
          question: "Can I invite travel companions to collaborate on the plan?",
          answer: "Yes, you can share a private collaboration link with your travel partners, allowing everyone to vote on activities and view updates in real time.",
          open: false,
        },
      ],
    },
    packages: {
      title: "Travel Packages",
      desc: "Details on our signature retreats, local partners, and private excursions.",
      items: [
        {
          id: "pkg-1",
          question: "What is included with a Travel AI Signature Package?",
          answer: "Signature packages include premium hand-picked accommodations, airport private transfers, bespoke daily excursions, curated dining reservations, and 24/7 on-trip concierge assistance.",
          open: true,
        },
        {
          id: "pkg-2",
          question: "Can I add private day trips outside the main destinations?",
          answer: "Yes. In Dubai, you can add desert conservation safaris, Abu Dhabi excursions, or yacht charters. In Japan, you can add Hakone onsen retreats, Kyoto temple visits, or Mount Fuji helicopter tours.",
          open: false,
        },
        {
          id: "pkg-3",
          question: "Do you offer solo traveler or small-group departures?",
          answer: "We cater to solo travelers, couples, families, and private groups. Our small-group signature retreats are capped at 12 guests to ensure intimate, high-quality experiences.",
          open: false,
        },
      ],
    },
    account: {
      title: "Account & Profile",
      desc: "Manage your travel documents, preferences, security, and notification settings.",
      items: [
        {
          id: "acc-1",
          question: "How do I access my saved itineraries and booking documents?",
          answer: "All your created plans, confirmed bookings, boarding passes, and voucher QR codes are stored securely in your Travel AI Profile and can be accessed offline via mobile web.",
          open: true,
        },
        {
          id: "acc-2",
          question: "How do you protect my personal and payment data?",
          answer: "We adhere to enterprise-grade GDPR standards, 256-bit SSL encryption, and never share or sell personal traveler data with unauthorized third parties.",
          open: false,
        },
        {
          id: "acc-3",
          question: "How can I update my travel preferences or password?",
          answer: "Navigate to your Profile settings tab to update passport details, loyalty numbers, dietary preferences, or reset your authentication credentials.",
          open: false,
        },
      ],
    },
  };

  const chevronSvg = `
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 6l4 4 4-4"/>
    </svg>
  `;

  function renderCategory(catKey) {
    const data = FAQ_DATA[catKey];
    if (!data) return;

    const titleEl = document.getElementById("faq-category-title");
    const descEl = document.getElementById("faq-category-desc");
    const stackEl = document.getElementById("faq-accordion-stack");

    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;

    if (!stackEl) return;

    stackEl.innerHTML = data.items
      .map(
        (item) => `
        <div class="faq-accordion${item.open ? " is-open" : ""}" data-faq-id="${item.id}">
          <button type="button" class="faq-accordion__trigger" aria-expanded="${item.open ? "true" : "false"}" aria-controls="faq-body-${item.id}" id="faq-btn-${item.id}">
            <span class="faq-accordion__question">${item.question}</span>
            <span class="faq-accordion__icon" aria-hidden="true">${chevronSvg}</span>
          </button>
          <div class="faq-accordion__body" id="faq-body-${item.id}" role="region" aria-labelledby="faq-btn-${item.id}"${item.open ? "" : " hidden"}>
            <div class="faq-accordion__content">
              <p>${item.answer}</p>
            </div>
          </div>
        </div>
      `
      )
      .join("");

    bindAccordions(stackEl);
  }

  function bindAccordions(container) {
    const triggers = container.querySelectorAll(".faq-accordion__trigger");
    triggers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-accordion");
        const body = item.querySelector(".faq-accordion__body");
        const isOpen = item.classList.contains("is-open");

        if (isOpen) {
          item.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
          if (body) body.hidden = true;
        } else {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          if (body) body.hidden = false;
        }
      });
    });
  }

  function init() {
    const catButtons = document.querySelectorAll(".faq-cat-btn");
    const stackEl = document.getElementById("faq-accordion-stack");

    if (stackEl) {
      bindAccordions(stackEl);
    }

    catButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-cat");
        catButtons.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");

        renderCategory(cat);
      });
    });

    // Hash deep-linking support (e.g. #booking, #planner)
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (hash && FAQ_DATA[hash]) {
      const targetBtn = document.querySelector(`.faq-cat-btn[data-cat="${hash}"]`);
      if (targetBtn) {
        targetBtn.click();
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
