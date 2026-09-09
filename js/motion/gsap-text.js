/**
 * gsap-text.js — Travel AI Motion System Text Preparation
 * 
 * Accessible typography measuring and splitting utilities for masked line
 * reveals (`line-reveal`) and character reveals (`char-reveal`).
 * Preserves screen reader accessibility via aria-hidden visual layers and
 * semantic sr-only text.
 */
(function (root) {
  "use strict";

  const TravelMotionText = {
    /**
     * Prepares an element with [data-motion="line-reveal"] by wrapping
     * naturally broken lines in overflow-hidden masks (.line-mask > .line-inner).
     * Returns an array of .line-inner elements ready for GSAP animation.
     */
    prepareLineReveal: function (el) {
      if (!el) return [];
      if (!el.dataset.origHtml) {
        el.dataset.origHtml = el.innerHTML;
      }
      const rawHtml = el.dataset.origHtml;

      // Extract accessible clean text
      const temp = document.createElement("div");
      temp.innerHTML = rawHtml;
      const accessibleText = temp.textContent.replace(/\s+/g, " ").trim();
      el.setAttribute("aria-label", accessibleText);

      // Tokenize words, preserving explicit <br> breaks
      const tokens = rawHtml
        .replace(/<br\s*\/?>/gi, " __BR__ ")
        .split(/\s+/)
        .filter(Boolean);

      // Pass 1: Render measurement spans
      el.innerHTML = tokens
        .map((token) => {
          if (token === "__BR__") return '<span class="motion-br" style="display:block;"></span>';
          return `<span class="motion-measure-word" style="display:inline-block;">${token}</span>`;
        })
        .join(" ");

      const wordSpans = el.querySelectorAll(".motion-measure-word");
      if (!wordSpans.length) {
        el.innerHTML = rawHtml;
        return [];
      }

      // Pass 2: Group words into lines according to actual rendered top position
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
      el.innerHTML = lines
        .map(
          (line, i) =>
            `<span class="line-mask" aria-hidden="true"><span class="line-inner" data-line-index="${i}">${line}</span></span>`
        )
        .join("");

      return Array.from(el.querySelectorAll(".line-inner"));
    },

    /**
     * Splits text into character spans for [data-motion="char-reveal"],
     * preserving semantic accessibility with .sr-only.
     */
    prepareCharReveal: function (el) {
      if (!el) return [];
      if (!el.dataset.origHtml) {
        el.dataset.origHtml = el.innerHTML;
      }
      const rawHtml = el.dataset.origHtml;

      const source = document.createElement("div");
      source.innerHTML = rawHtml;

      const readable = document.createElement("div");
      readable.innerHTML = rawHtml.replace(/<br\s*\/?>/gi, " ");
      const accessibleText = readable.textContent.replace(/\s+/g, " ").trim();

      const layer = document.createElement("span");
      layer.className = "char-layer";
      layer.setAttribute("aria-hidden", "true");

      const chars = [];
      let charIndex = 0;

      function splitNode(node, target) {
        node.childNodes.forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            Array.from(child.textContent).forEach((char) => {
              if (/\s/.test(char)) {
                target.appendChild(document.createTextNode(char));
                charIndex++;
                return;
              }
              const span = document.createElement("span");
              span.className = "char-unit";
              span.dataset.charIndex = charIndex++;
              span.textContent = char;
              target.appendChild(span);
              chars.push(span);
            });
            return;
          }
          if (child.nodeType !== Node.ELEMENT_NODE) return;
          if (child.tagName === "BR") {
            target.appendChild(document.createElement("br"));
            return;
          }
          const clone = child.cloneNode(false);
          splitNode(child, clone);
          target.appendChild(clone);
        });
      }

      splitNode(source, layer);

      const accessible = document.createElement("span");
      accessible.className = "sr-only";
      accessible.textContent = accessibleText;

      el.textContent = "";
      el.appendChild(accessible);
      el.appendChild(layer);
      el.removeAttribute("aria-label");

      return chars;
    },

    /**
     * Reverts split text to original HTML string.
     */
    revert: function (el) {
      if (el && el.dataset.origHtml) {
        el.innerHTML = el.dataset.origHtml;
      }
    },
  };

  root.TravelMotionText = TravelMotionText;
})(typeof window !== "undefined" ? window : this);
