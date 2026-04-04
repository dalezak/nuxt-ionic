/**
 * Returns true if a DOM element matching `selector` exists and is visible.
 * An element is considered visible when it has a non-null `offsetParent`
 * (i.e. it is not hidden via `display:none` or `visibility:hidden`).
 * @param {string} selector - CSS selector string, e.g. "#my-element" or ".my-class".
 * @returns {boolean}
 * @example
 * if (isVisible('#ion-loading')) hideLoading();
 */
export default function (selector) {
  if (process.client) {
    let element = document.querySelector(selector);
      return element && element.offsetParent != null;
  }
  return false;
}