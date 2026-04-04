import showToast from '~/utils/show-toast.js';
import setFocus from '~/utils/set-focus.js';

/**
 * Validates that a form field has a non-empty value.
 * Shows a toast and focuses the input if validation fails.
 * Use in form submit handlers before calling an API.
 * @param {object|null} input - Vue component ref for the input (or null to skip focus).
 * @param {string|null} value - The current value to validate.
 * @param {string} message - Toast message shown on failure (default: "Please enter a value").
 * @returns {boolean} true if valid, false if empty/null.
 * @example
 * if (!hasInput(emailRef, state.email, 'Email is required')) return;
 */
export default function (input, value, message = "Please enter a value") {
  if (value && value.length > 0) {
    return true;
  }
  else {
    showToast(message);
    if (input) {
      setFocus(input);
    }
    return false;
  }
}