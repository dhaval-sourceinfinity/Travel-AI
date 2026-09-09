/**
 * contact-service.js — Travel AI Contact Submission Service & Contract
 *
 * Separates UI form interaction and validation from network submission transport.
 * Supports both ES module imports and window.TravelServices.contact.
 */

/**
 * @typedef {Object} ContactPayload
 * @property {string} name - Contact person's name (required, non-empty)
 * @property {string} email - Contact person's valid email address (required)
 * @property {string} message - Detailed travel enquiry or question (required, non-empty)
 * @property {string} [timestamp] - ISO 8601 generation timestamp
 */

/**
 * @typedef {Object} ContactResponse
 * @property {boolean} success - Operation outcome
 * @property {string} message - Human-readable user feedback
 * @property {string} [referenceId] - Future CRM/Lead tracking ID
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the contact payload.
 * @param {ContactPayload} payload
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateContactPayload(payload) {
  const errors = {};

  if (!payload || typeof payload !== "object") {
    return { isValid: false, errors: { form: "Invalid form payload." } };
  }

  const name = (payload.name || "").trim();
  const email = (payload.email || "").trim();
  const message = (payload.message || "").trim();

  if (!name) {
    errors.name = "Please enter your name.";
  }

  if (!email) {
    errors.email = "Please enter your email.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!message) {
    errors.message = "Please enter a message.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Submits the contact enquiry to the backend.
 * Currently uses a fast local simulated transport; easily swappable with fetch('/api/contact').
 *
 * @param {ContactPayload} payload
 * @returns {Promise<ContactResponse>}
 */
export async function submitContact(payload) {
  const validation = validateContactPayload(payload);
  if (!validation.isValid) {
    const errorMessages = Object.values(validation.errors).join(" ");
    throw new Error(errorMessages || "Form validation failed.");
  }

  // Simulated asynchronous transport delay (can be replaced directly with fetch)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Thanks — we'll be in touch soon.",
        referenceId: `LEAD-${Date.now().toString(36).toUpperCase()}`
      });
    }, 450);
  });
}

// Universal Global Registration
if (typeof window !== "undefined") {
  window.TravelServices = window.TravelServices || {};
  window.TravelServices.contact = {
    EMAIL_REGEX,
    validateContactPayload,
    submitContact
  };
}
