/**
 * reset-password.js — Travel AI Reset Password Page Controller
 * Figma 208:6586
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reset-password-form");
    const emailInput = document.getElementById("reset-email");
    const emailError = document.getElementById("reset-email-error");
    const successState = document.getElementById("reset-success-state");
    const sentEmailEl = document.getElementById("reset-sent-email");
    const resendBtn = document.getElementById("reset-resend-btn");
    const resendFeedback = document.getElementById("reset-resend-feedback");

    if (!form || !emailInput) return;

    emailInput.addEventListener("input", () => {
      if (emailInput.classList.contains("is-invalid") && /^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
        emailInput.classList.remove("is-invalid");
        emailInput.removeAttribute("aria-invalid");
        emailError.textContent = "";
        emailError.classList.remove("is-visible");
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      emailInput.classList.remove("is-invalid");
      emailInput.removeAttribute("aria-invalid");
      emailError.textContent = "";
      emailError.classList.remove("is-visible");

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        emailInput.classList.add("is-invalid");
        emailInput.setAttribute("aria-invalid", "true");
        emailError.textContent = "Please enter a valid email address.";
        emailError.classList.add("is-visible");
        emailInput.focus();
        return;
      }

      // Successful submit state
      if (sentEmailEl) {
        sentEmailEl.textContent = email;
      }
      form.style.display = "none";
      if (successState) {
        successState.classList.add("is-visible");
        successState.focus();
      }
    });

    if (resendBtn && resendFeedback) {
      resendBtn.addEventListener("click", () => {
        resendBtn.disabled = true;
        resendFeedback.textContent = "Reset link resent! Please check your inbox.";
        resendFeedback.classList.add("is-visible");
        setTimeout(() => {
          resendBtn.disabled = false;
        }, 4000);
      });
    }
  });
})();
