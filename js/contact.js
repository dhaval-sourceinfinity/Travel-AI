// contact.js — Contact page entry: shell + accessible form handling.
import { mountShell } from "./shell.js";

mountShell();

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

  // Clear a field's error as the user corrects it.
  Object.keys(rules).forEach((name) => {
    const input = fieldEl(name);
    input.addEventListener("input", () => {
      if (wrapOf(input).getAttribute("data-invalid") === "true") {
        validateField(name);
      }
    });
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

    // No backend in this static build — simulate a successful send.
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

initContactForm();
