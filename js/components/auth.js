/**
 * auth.js — Travel AI Authentication Modals & Controller
 * Implements Login (Figma 208:4908) & Signup (Figma 208:5001)
 *
 * Features:
 * - Responsive glassmorphism modals with backdrop blur
 * - Focus trapping & Escape key handling for accessibility
 * - Password visibility toggles
 * - Dynamic password strength meter with visual tier bar
 * - Seamless switching between Login and Signup modals
 * - Body scroll locking with scrollbar jump prevention
 * - Deep linking support via URL hash (#login, #signup) or param (?auth=login)
 */

(function () {
  "use strict";  /* ---- SVG Icons (Figma 208:4960 Approved Vectors) ---------------------- */
  const ICONS = {
    close: `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m1 1 12 12M13 1 1 13"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
    google: `<svg viewBox="0 0 36 36" fill="none" aria-hidden="true" focusable="false"><path d="M36 18C36 20.3638 35.5344 22.7044 34.6298 24.8883C33.7252 27.0722 32.3994 29.0565 30.7279 30.7279C29.0565 32.3994 27.0722 33.7252 24.8883 34.6298C22.7044 35.5344 20.3638 36 18 36V30.96C19.7019 30.96 21.3872 30.6248 22.9596 29.9735C24.532 29.3222 25.9607 28.3676 27.1641 27.1641C28.3676 25.9607 29.3222 24.532 29.9735 22.9596C30.6248 21.3872 30.96 19.7019 30.96 18H36Z" fill="#4285F4"/><path d="M18 36C15.6362 36 13.2956 35.5344 11.1117 34.6298C8.92784 33.7252 6.94353 32.3994 5.27208 30.7279C3.60062 29.0565 2.27475 27.0722 1.37017 24.8883C0.465583 22.7044 -2.06649e-07 20.3638 0 18H5.04C5.04 19.7019 5.37522 21.3872 6.02652 22.9596C6.67782 24.532 7.63245 25.9607 8.83589 27.1641C10.0393 28.3676 11.468 29.3222 13.0404 29.9735C14.6128 30.6248 16.2981 30.96 18 30.96V36Z" fill="#EA4335"/><path d="M0 18C4.17347e-07 13.2261 1.89642 8.64773 5.27208 5.27208C8.64773 1.89642 13.2261 -5.69281e-08 18 0V5.04C14.5628 5.04 11.2664 6.40542 8.8359 8.83589C6.40542 11.2664 5.04 14.5628 5.04 18H0Z" fill="#FBBC05"/><path d="M18 0C20.3638 2.8188e-08 22.7044 0.465584 24.8883 1.37017C27.0722 2.27475 29.0565 3.60062 30.7279 5.27208C32.3994 6.94353 33.7252 8.92784 34.6298 11.1117C35.5344 13.2956 36 15.6362 36 18L30.96 18C30.96 16.2981 30.6248 14.6128 29.9735 13.0404C29.3222 11.468 28.3676 10.0393 27.1641 8.8359C25.9607 7.63245 24.532 6.67782 22.9596 6.02652C21.3872 5.37522 19.7019 5.04 18 5.04V0Z" fill="#34A853"/><path d="M18.123 25.1152C19.1712 25.1152 20.1875 24.9648 21.1719 24.6641C22.1562 24.3542 22.9173 23.9622 23.4551 23.4883V20.8223H18.752V17.8418H27.1465V24.9238C26.1257 25.972 24.7949 26.7923 23.1543 27.3848C21.5228 27.9772 19.8092 28.2734 18.0137 28.2734C15.9264 28.2734 14.1536 27.8861 12.6953 27.1113C11.2461 26.3275 10.1432 25.1927 9.38672 23.707C8.63021 22.2122 8.25195 20.403 8.25195 18.2793C8.25195 15.1074 9.09961 12.6784 10.7949 10.9922C12.4902 9.29688 14.9284 8.44922 18.1094 8.44922C20.3698 8.44922 22.2201 8.86849 23.6602 9.70703C25.1003 10.5365 26.1257 11.7897 26.7363 13.4668L23.0176 14.5879C22.6165 13.6126 21.9876 12.8743 21.1309 12.373C20.2741 11.8717 19.2669 11.6211 18.1094 11.6211C16.2135 11.6211 14.7734 12.1953 13.7891 13.3438C12.8047 14.4922 12.3125 16.1374 12.3125 18.2793C12.3125 20.4577 12.8184 22.1439 13.8301 23.3379C14.8509 24.5228 16.2819 25.1152 18.123 25.1152Z" fill="#4285F4"/></svg>`,
    apple: `<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M18.0001 9.79137V4.4991C18.0001 4.10126 18.1582 3.7197 18.4395 3.43839C18.7208 3.15707 19.1024 2.99902 19.5002 2.99902M18.0001 9.79137C19.2952 8.63307 20.8978 7.87416 22.6146 7.60661C24.3314 7.33906 26.0889 7.57413 27.675 8.28342C29.2611 8.99272 30.608 10.1459 31.5531 11.6038C32.4982 13.0618 33.0012 14.7621 33.0012 16.4995C33.0246 22.0231 31.0154 27.3624 27.3563 31.5003C26.6847 32.2516 25.7803 32.7558 24.7881 32.9321C23.7959 33.1083 22.7732 32.9464 21.8839 32.4723C20.6887 31.8347 19.3548 31.5011 18.0001 31.5011C16.6454 31.5011 15.3116 31.8347 14.1164 32.4723C13.2271 32.9464 12.2044 33.1083 11.2122 32.9321C10.2199 32.7558 9.31557 32.2516 8.64396 31.5003C4.99699 27.3551 2.98959 22.0206 2.99906 16.4995C2.9991 14.7621 3.50203 13.0618 4.44715 11.6038C5.39228 10.1459 6.73919 8.99272 8.3253 8.28342C9.91141 7.57413 11.6689 7.33906 13.3857 7.60661C15.1025 7.87416 16.7051 8.63307 18.0001 9.79137Z"/></svg>`,
    facebook: `<svg viewBox="0 0 36 36" fill="currentColor" aria-hidden="true" focusable="false"><path d="M22.5001 2.99902H26.9998V8.9995H22.5001C22.1023 8.9995 21.7208 9.15755 21.4395 9.43888C21.1582 9.72021 21.0002 10.1018 21.0002 10.4996V15H26.9998L25.4999 21.0005H21.0002V33.0014H15.0006V21.0005H10.501V15H15.0006V10.4996C15.0006 8.51034 15.7908 6.60253 17.1972 5.1959C18.6036 3.78926 20.5111 2.99902 22.5001 2.99902Z"/></svg>`,
  };

  /* ---- Modal State Management ------------------------------------------- */
  let activeModal = null; // 'login' | 'signup' | null
  let previouslyFocusedElement = null;

  /* ---- Helper: Scrollbar Width Compensation & Scroll Locking ------------- */
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
    document.documentElement.classList.add("auth-modal-locked");
    document.body.classList.add("auth-modal-locked");
    if (window.TravelMotion && typeof window.TravelMotion.stopScroll === "function") {
      window.TravelMotion.stopScroll();
    }
  }

  function unlockScroll() {
    document.documentElement.classList.remove("auth-modal-locked");
    document.body.classList.remove("auth-modal-locked");
    document.body.style.removeProperty("--scrollbar-compensation");
    if (window.TravelMotion && typeof window.TravelMotion.startScroll === "function") {
      window.TravelMotion.startScroll();
    }
  }

  /* ---- Validation Helpers ------------------------------------------------ */
  function setFieldError(inputEl, errorEl, message) {
    if (inputEl) {
      inputEl.classList.add("is-invalid");
      inputEl.setAttribute("aria-invalid", "true");
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add("is-visible");
    }
  }

  function clearFieldError(inputEl, errorEl) {
    if (inputEl) {
      inputEl.classList.remove("is-invalid");
      inputEl.removeAttribute("aria-invalid");
    }
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("is-visible");
    }
  }

  function resetLoginForm() {
    const email = document.getElementById("login-email");
    const password = document.getElementById("login-password");
    const emailErr = document.getElementById("login-email-error");
    const pwdErr = document.getElementById("login-password-error");
    const successAlert = document.getElementById("login-alert-success");
    clearFieldError(email, emailErr);
    clearFieldError(password, pwdErr);
    if (successAlert) successAlert.classList.remove("is-visible");
  }

  function resetSignupForm() {
    const form = document.getElementById("auth-signup-form");
    if (form) {
      const inputs = form.querySelectorAll(".auth-input, .auth-checkbox");
      inputs.forEach((el) => {
        el.classList.remove("is-invalid");
        el.removeAttribute("aria-invalid");
      });
      const errors = form.querySelectorAll(".auth-error-msg");
      errors.forEach((el) => {
        el.textContent = "";
        el.classList.remove("is-visible");
      });
      const successAlert = document.getElementById("signup-alert-success");
      if (successAlert) successAlert.classList.remove("is-visible");
    }
    const strengthEl = document.getElementById("signup-strength");
    const strengthLabel = document.getElementById("signup-strength-label");
    if (strengthEl) strengthEl.setAttribute("data-tier", "none");
    if (strengthLabel) strengthLabel.textContent = "";
  }

  /* ---- Modal Markup Templates ------------------------------------------- */
  function renderLoginMarkup() {
    return `
      <div class="auth-modal-backdrop" id="auth-login-backdrop" data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
        <div class="auth-modal auth-modal--login" id="auth-login-card" data-lenis-prevent>
          <button class="auth-modal__close" type="button" aria-label="Close sign in dialog" data-auth-close>
            ${ICONS.close}
          </button>
          
          <header class="auth-header">
            <h2 class="auth-header__title" id="login-modal-title">Welcome back</h2>
            <p class="auth-header__sub">Sign in to continue your journey</p>
          </header>

          <div class="auth-social-list">
            <button type="button" class="auth-social-btn auth-social-btn--google" data-social="google">
              ${ICONS.google}
              <span>Continue with Google</span>
            </button>
            <button type="button" class="auth-social-btn auth-social-btn--apple" data-social="apple">
              ${ICONS.apple}
              <span>Continue with Apple</span>
            </button>
            <button type="button" class="auth-social-btn auth-social-btn--facebook" data-social="facebook">
              ${ICONS.facebook}
              <span>Continue with Facebook</span>
            </button>
          </div>

          <div class="auth-divider">
            <span>or continue with email</span>
          </div>

          <form class="auth-form" id="auth-login-form" novalidate>
            <div class="auth-field">
              <label class="auth-label" for="login-email">Email Address</label>
              <div class="auth-input-wrap">
                <input class="auth-input" type="email" id="login-email" name="email"
                       placeholder="name@example.com" autocomplete="email" aria-describedby="login-email-error" required />
              </div>
              <span class="auth-error-msg" id="login-email-error" aria-live="polite"></span>
            </div>

            <div class="auth-field">
              <label class="auth-label" for="login-password">Password</label>
              <div class="auth-input-wrap">
                <input class="auth-input auth-input--has-icon" type="password" id="login-password" name="password"
                       placeholder="••••••••" autocomplete="current-password" aria-describedby="login-password-error" required />
                <button type="button" class="auth-toggle-pwd" aria-label="Toggle password visibility" data-toggle-target="login-password">
                  ${ICONS.eye}
                </button>
              </div>
              <span class="auth-error-msg" id="login-password-error" aria-live="polite"></span>
            </div>

            <div class="auth-helper-row">
              <a class="auth-forgot-link" href="reset-password.html">Forgot password?</a>
            </div>

            <div class="auth-alert auth-alert--success" id="login-alert-success" role="status">
              Sign in successful! Redirecting...
            </div>

            <button type="submit" class="auth-btn-submit">Login</button>
          </form>

          <footer class="auth-footer">
            <p class="auth-switch-text">
              Don't have an account? 
              <button type="button" class="auth-switch-link" data-switch-to="signup">Sign up</button>
            </p>
            <p class="auth-legal">
              By continuing, you agree to our 
              <a href="terms-of-use.html">Terms of Service</a> and 
              <a href="privacy-policy.html">Privacy Policy</a>
            </p>
          </footer>
        </div>
      </div>
    `;
  }

  function renderSignupMarkup() {
    return `
      <div class="auth-modal-backdrop" id="auth-signup-backdrop" data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="signup-modal-title">
        <div class="auth-modal auth-modal--signup" id="auth-signup-card" data-lenis-prevent>
          <button class="auth-modal__close" type="button" aria-label="Close sign up dialog" data-auth-close>
            ${ICONS.close}
          </button>
          
          <header class="auth-header">
            <h2 class="auth-header__title" id="signup-modal-title">Create your account</h2>
            <p class="auth-header__sub">Start planning your extraordinary journey</p>
          </header>

          <form class="auth-form" id="auth-signup-form" novalidate>
            <div class="auth-row">
              <div class="auth-field">
                <label class="auth-label" for="signup-first-name">First Name</label>
                <div class="auth-input-wrap">
                  <input class="auth-input" type="text" id="signup-first-name" name="firstName"
                         placeholder="First name" autocomplete="given-name" aria-describedby="signup-fname-error" required />
                </div>
                <span class="auth-error-msg" id="signup-fname-error" aria-live="polite"></span>
              </div>

              <div class="auth-field">
                <label class="auth-label" for="signup-last-name">Last Name</label>
                <div class="auth-input-wrap">
                  <input class="auth-input" type="text" id="signup-last-name" name="lastName"
                         placeholder="Last name" autocomplete="family-name" aria-describedby="signup-lname-error" required />
                </div>
                <span class="auth-error-msg" id="signup-lname-error" aria-live="polite"></span>
              </div>
            </div>

            <div class="auth-field">
              <label class="auth-label" for="signup-email">Email Address</label>
              <div class="auth-input-wrap">
                <input class="auth-input" type="email" id="signup-email" name="email"
                       placeholder="name@example.com" autocomplete="email" aria-describedby="signup-email-error" required />
              </div>
              <span class="auth-error-msg" id="signup-email-error" aria-live="polite"></span>
            </div>

            <div class="auth-field">
              <label class="auth-label" for="signup-password">Password</label>
              <div class="auth-input-wrap">
                <input class="auth-input auth-input--has-icon" type="password" id="signup-password" name="password"
                       placeholder="Create a password" autocomplete="new-password" aria-describedby="signup-password-error" required />
                <button type="button" class="auth-toggle-pwd" aria-label="Toggle password visibility" data-toggle-target="signup-password">
                  ${ICONS.eye}
                </button>
              </div>
              <!-- Password strength meter (hidden initially until typing begins) -->
              <div class="auth-strength" id="signup-strength" data-tier="none" aria-live="polite">
                <div class="auth-strength__track">
                  <div class="auth-strength__bar"></div>
                </div>
                <div class="auth-strength__label" id="signup-strength-label"></div>
              </div>
              <span class="auth-error-msg" id="signup-password-error" aria-live="polite"></span>
            </div>

            <div class="auth-field">
              <label class="auth-label" for="signup-confirm-password">Confirm Password</label>
              <div class="auth-input-wrap">
                <input class="auth-input auth-input--has-icon" type="password" id="signup-confirm-password" name="confirmPassword"
                       placeholder="Confirm your password" autocomplete="new-password" aria-describedby="signup-confirm-error" required />
                <button type="button" class="auth-toggle-pwd" aria-label="Toggle password visibility" data-toggle-target="signup-confirm-password">
                  ${ICONS.eye}
                </button>
              </div>
              <span class="auth-error-msg" id="signup-confirm-error" aria-live="polite"></span>
            </div>

            <div class="auth-field">
              <label class="auth-label" for="signup-phone">Phone Number (Optional)</label>
              <div class="auth-input-wrap">
                <input class="auth-input" type="tel" id="signup-phone" name="phone"
                       placeholder="+1 (555) 000-0000" autocomplete="tel" />
              </div>
            </div>

            <label class="auth-checkbox-wrap" for="signup-terms">
              <input class="auth-checkbox" type="checkbox" id="signup-terms" name="terms" aria-describedby="signup-terms-error" required />
              <span class="auth-checkbox-label">
                I agree to the <a href="terms-of-use.html">Terms of Service</a> and <a href="privacy-policy.html">Privacy Policy</a>
              </span>
            </label>
            <span class="auth-error-msg" id="signup-terms-error" aria-live="polite"></span>

            <div class="auth-alert auth-alert--success" id="signup-alert-success" role="status">
              Account created successfully! Welcome to Travel AI.
            </div>

            <button type="submit" class="auth-btn-submit">Sign up</button>
          </form>

          <div class="auth-divider">
            <span>or</span>
          </div>

          <button type="button" class="auth-social-btn auth-social-btn--dark" data-social="google">
            ${ICONS.google}
            <span>Continue with Google</span>
          </button>

          <footer class="auth-footer">
            <p class="auth-switch-text">
              Already have an account? 
              <button type="button" class="auth-switch-link" data-switch-to="login">Login</button>
            </p>
            <p class="auth-legal">
              By signing up, you agree to receive travel updates and special offers.
            </p>
          </footer>
        </div>
      </div>
    `;
  }

  /* ---- Password Strength Evaluator --------------------------------------- */
  function evaluatePasswordStrength(password) {
    if (!password) return { tier: "none", label: "" };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { tier: "weak", label: "Strength: Weak" };
    if (score <= 3) return { tier: "fair", label: "Strength: Fair" };
    if (score === 4) return { tier: "good", label: "Strength: Good" };
    return { tier: "strong", label: "Strength: Strong" };
  }

  /* ---- Ensure Modals in DOM --------------------------------------------- */
  function ensureModals() {
    let container = document.getElementById("auth-modals-root");
    if (!container) {
      container = document.createElement("div");
      container.id = "auth-modals-root";
      container.setAttribute("data-lenis-prevent", "");
      container.innerHTML = renderLoginMarkup() + renderSignupMarkup();
      document.body.appendChild(container);
      initModalEvents();
    }
  }

  /* ---- Focus Trap Handling ---------------------------------------------- */
  function trapFocus(modalEl, e) {
    if (e.key !== "Tab") return;

    const focusables = modalEl.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }

  /* ---- Open & Close Controllers ----------------------------------------- */
  function openLoginModal() {
    ensureModals();
    const loginBackdrop = document.getElementById("auth-login-backdrop");
    const signupBackdrop = document.getElementById("auth-signup-backdrop");

    if (signupBackdrop) signupBackdrop.classList.remove("is-open");
    resetLoginForm();

    previouslyFocusedElement = document.activeElement;
    loginBackdrop.classList.add("is-open");
    activeModal = "login";
    lockScroll();

    // Focus email field after transition
    const emailInput = document.getElementById("login-email");
    if (emailInput) {
      setTimeout(() => emailInput.focus(), 80);
    }
  }

  function openSignupModal() {
    ensureModals();
    const loginBackdrop = document.getElementById("auth-login-backdrop");
    const signupBackdrop = document.getElementById("auth-signup-backdrop");

    if (loginBackdrop) loginBackdrop.classList.remove("is-open");
    resetSignupForm();

    previouslyFocusedElement = document.activeElement;
    signupBackdrop.classList.add("is-open");
    activeModal = "signup";
    lockScroll();

    // Focus first name field after transition
    const firstNameInput = document.getElementById("signup-first-name");
    if (firstNameInput) {
      setTimeout(() => firstNameInput.focus(), 80);
    }
  }

  function closeAuthModal() {
    const loginBackdrop = document.getElementById("auth-login-backdrop");
    const signupBackdrop = document.getElementById("auth-signup-backdrop");

    if (loginBackdrop) loginBackdrop.classList.remove("is-open");
    if (signupBackdrop) signupBackdrop.classList.remove("is-open");

    activeModal = null;
    unlockScroll();

    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === "function") {
      previouslyFocusedElement.focus();
    }
  }

  /* ---- Event Handlers --------------------------------------------------- */
  function initModalEvents() {
    const root = document.getElementById("auth-modals-root");
    if (!root) return;

    // Backdrop wheel & touchmove containment to prevent page background scrolling
    root.querySelectorAll(".auth-modal-backdrop").forEach((backdrop) => {
      backdrop.addEventListener(
        "wheel",
        (e) => {
          const modal = e.target.closest(".auth-modal");
          if (!modal) {
            e.preventDefault();
            return;
          }
          const isScrollable = modal.scrollHeight > modal.clientHeight;
          if (!isScrollable) {
            e.preventDefault();
            return;
          }
          const atTop = modal.scrollTop <= 0 && e.deltaY < 0;
          const atBottom =
            modal.scrollTop + modal.clientHeight >= modal.scrollHeight - 1 &&
            e.deltaY > 0;
          if (atTop || atBottom) {
            e.preventDefault();
          }
        },
        { passive: false }
      );

      backdrop.addEventListener(
        "touchmove",
        (e) => {
          const modal = e.target.closest(".auth-modal");
          if (!modal) {
            e.preventDefault();
          }
        },
        { passive: false }
      );
    });

    // 1. Close buttons & switch buttons
    root.addEventListener("click", (e) => {
      // Close button
      if (e.target.closest("[data-auth-close]")) {
        e.preventDefault();
        closeAuthModal();
        return;
      }

      // Backdrop click outside card
      if (
        e.target.classList.contains("auth-modal-backdrop") &&
        !e.target.closest(".auth-modal")
      ) {
        closeAuthModal();
        return;
      }

      // Switch to Signup
      if (e.target.closest('[data-switch-to="signup"]')) {
        e.preventDefault();
        openSignupModal();
        return;
      }

      // Switch to Login
      if (e.target.closest('[data-switch-to="login"]')) {
        e.preventDefault();
        openLoginModal();
        return;
      }

      // Password toggle
      const toggleBtn = e.target.closest(".auth-toggle-pwd");
      if (toggleBtn) {
        e.preventDefault();
        const targetId = toggleBtn.getAttribute("data-toggle-target");
        const input = document.getElementById(targetId);
        if (input) {
          const isPassword = input.getAttribute("type") === "password";
          input.setAttribute("type", isPassword ? "text" : "password");
          toggleBtn.innerHTML = isPassword ? ICONS.eyeOff : ICONS.eye;
          toggleBtn.setAttribute(
            "aria-label",
            isPassword ? "Hide password" : "Show password"
          );
        }
        return;
      }
    });

    // 2. Keyboard handling (Escape & Focus Trap)
    document.addEventListener("keydown", (e) => {
      if (!activeModal) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeAuthModal();
        return;
      }

      const activeBackdrop =
        activeModal === "login"
          ? document.getElementById("auth-login-backdrop")
          : document.getElementById("auth-signup-backdrop");

      if (activeBackdrop && activeBackdrop.classList.contains("is-open")) {
        trapFocus(activeBackdrop, e);
      }
    });

    // 3. Signup Password Strength updates
    const signupPwd = document.getElementById("signup-password");
    const strengthEl = document.getElementById("signup-strength");
    const strengthLabel = document.getElementById("signup-strength-label");

    if (signupPwd && strengthEl && strengthLabel) {
      signupPwd.addEventListener("input", () => {
        const val = signupPwd.value;
        if (!val) {
          strengthEl.setAttribute("data-tier", "none");
          strengthLabel.textContent = "";
          return;
        }
        const { tier, label } = evaluatePasswordStrength(val);
        strengthEl.setAttribute("data-tier", tier);
        strengthLabel.textContent = label;
      });
    }

    // 4. Login Form Submission & Live Validation
    const loginForm = document.getElementById("auth-login-form");
    if (loginForm) {
      const email = document.getElementById("login-email");
      const password = document.getElementById("login-password");
      const emailErr = document.getElementById("login-email-error");
      const pwdErr = document.getElementById("login-password-error");
      const successAlert = document.getElementById("login-alert-success");

      // Clear errors on input
      if (email) {
        email.addEventListener("input", () => {
          if (email.classList.contains("is-invalid") && /^\S+@\S+\.\S+$/.test(email.value.trim())) {
            clearFieldError(email, emailErr);
          }
        });
      }
      if (password) {
        password.addEventListener("input", () => {
          if (password.classList.contains("is-invalid") && password.value) {
            clearFieldError(password, pwdErr);
          }
        });
      }

      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;
        clearFieldError(email, emailErr);
        clearFieldError(password, pwdErr);

        if (!email.value.trim()) {
          setFieldError(email, emailErr, "Please enter your email address.");
          valid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
          setFieldError(email, emailErr, "Please enter a valid email address.");
          valid = false;
        }

        if (!password.value) {
          setFieldError(password, pwdErr, "Please enter your password.");
          valid = false;
        }

        if (valid) {
          successAlert.classList.add("is-visible");
          setTimeout(() => {
            successAlert.classList.remove("is-visible");
            closeAuthModal();
          }, 1200);
        }
      });
    }

    // 5. Signup Form Submission & Consistent Validation
    const signupForm = document.getElementById("auth-signup-form");
    if (signupForm) {
      const fname = document.getElementById("signup-first-name");
      const lname = document.getElementById("signup-last-name");
      const email = document.getElementById("signup-email");
      const password = document.getElementById("signup-password");
      const confirmPwd = document.getElementById("signup-confirm-password");
      const terms = document.getElementById("signup-terms");

      const fnameErr = document.getElementById("signup-fname-error");
      const lnameErr = document.getElementById("signup-lname-error");
      const emailErr = document.getElementById("signup-email-error");
      const pwdErr = document.getElementById("signup-password-error");
      const confirmErr = document.getElementById("signup-confirm-error");
      const termsErr = document.getElementById("signup-terms-error");
      const successAlert = document.getElementById("signup-alert-success");

      // Live error clearing once user begins correcting fields
      if (fname) {
        fname.addEventListener("input", () => {
          if (fname.classList.contains("is-invalid") && fname.value.trim()) {
            clearFieldError(fname, fnameErr);
          }
        });
      }
      if (lname) {
        lname.addEventListener("input", () => {
          if (lname.classList.contains("is-invalid") && lname.value.trim()) {
            clearFieldError(lname, lnameErr);
          }
        });
      }
      if (email) {
        email.addEventListener("input", () => {
          if (email.classList.contains("is-invalid") && /^\S+@\S+\.\S+$/.test(email.value.trim())) {
            clearFieldError(email, emailErr);
          }
        });
      }
      if (password) {
        password.addEventListener("input", () => {
          if (password.classList.contains("is-invalid") && password.value.length >= 8) {
            clearFieldError(password, pwdErr);
          }
          if (confirmPwd && confirmPwd.classList.contains("is-invalid") && confirmPwd.value === password.value) {
            clearFieldError(confirmPwd, confirmErr);
          }
        });
      }
      if (confirmPwd) {
        confirmPwd.addEventListener("input", () => {
          if (confirmPwd.classList.contains("is-invalid") && confirmPwd.value === password.value) {
            clearFieldError(confirmPwd, confirmErr);
          }
        });
      }
      if (terms) {
        terms.addEventListener("change", () => {
          if (terms.checked) {
            clearFieldError(terms, termsErr);
          }
        });
      }

      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;

        clearFieldError(fname, fnameErr);
        clearFieldError(lname, lnameErr);
        clearFieldError(email, emailErr);
        clearFieldError(password, pwdErr);
        clearFieldError(confirmPwd, confirmErr);
        clearFieldError(terms, termsErr);

        if (!fname.value.trim()) {
          setFieldError(fname, fnameErr, "Please enter your first name.");
          valid = false;
        }

        if (!lname.value.trim()) {
          setFieldError(lname, lnameErr, "Please enter your last name.");
          valid = false;
        }

        if (!email.value.trim()) {
          setFieldError(email, emailErr, "Please enter your email address.");
          valid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
          setFieldError(email, emailErr, "Please enter a valid email address.");
          valid = false;
        }

        if (!password.value) {
          setFieldError(password, pwdErr, "Please enter a password.");
          valid = false;
        } else if (password.value.length < 8) {
          setFieldError(password, pwdErr, "Password must be at least 8 characters.");
          valid = false;
        }

        if (!confirmPwd.value) {
          setFieldError(confirmPwd, confirmErr, "Please confirm your password.");
          valid = false;
        } else if (confirmPwd.value !== password.value) {
          setFieldError(confirmPwd, confirmErr, "Passwords do not match. Please re-enter.");
          valid = false;
        }

        if (!terms.checked) {
          setFieldError(terms, termsErr, "You must agree to the Terms of Service.");
          valid = false;
        }

        if (valid) {
          successAlert.classList.add("is-visible");
          setTimeout(() => {
            successAlert.classList.remove("is-visible");
            closeAuthModal();
          }, 1400);
        }
      });
    }
  }

  /* ---- Global Trigger Wiring -------------------------------------------- */
  function initTriggers() {
    document.addEventListener("click", (e) => {
      // Login triggers: "Sign In" link in header / mobile menu
      const loginTrigger = e.target.closest(
        '.nav-link-signin, [data-auth-trigger="login"], a[href="#login"], a[href$="?auth=login"]'
      );
      if (loginTrigger) {
        e.preventDefault();
        openLoginModal();
        return;
      }

      // Signup triggers: "Get Started" in nav or buttons with signup trigger
      const signupTrigger = e.target.closest(
        '.nav-cta-btn, .nav__mobile-actions .btn--accent, [data-auth-trigger="signup"], a[href="#signup"], a[href$="?auth=signup"]'
      );
      // Only treat nav-cta-btn / mobile get started as signup modal if not on a form page
      if (signupTrigger && !e.target.closest("form")) {
        e.preventDefault();
        openSignupModal();
        return;
      }
    });

    // Check URL parameters or hash on load & on hash change
    function checkUrlState() {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash === "#login" || params.get("auth") === "login") {
        openLoginModal();
      } else if (hash === "#signup" || params.get("auth") === "signup") {
        openSignupModal();
      }
    }
    checkUrlState();
    window.addEventListener("hashchange", checkUrlState);
  }

  /* ---- Initialize on DOM Ready ------------------------------------------ */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      ensureModals();
      initTriggers();
    });
  } else {
    ensureModals();
    initTriggers();
  }

  /* ---- Expose TravelAuth API -------------------------------------------- */
  window.TravelAuth = {
    openLoginModal,
    openSignupModal,
    closeAuthModal,
  };
})();
