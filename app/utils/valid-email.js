/**
 * Returns true if the string is a valid email address.
 * @param {string} email
 * @returns {boolean}
 * @example
 * if (!validEmail(email)) showAlert('Invalid Email', 'Please enter a valid email address.');
 */
export default function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() ?? '');
}
