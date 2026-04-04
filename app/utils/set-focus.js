/**
 * Focuses an Ionic input element or scrolls it into view as a fallback.
 * Accepts either a Vue component ref (with `.$el`) or a raw DOM element.
 * Prefers Ionic's `setFocus()` method when available (e.g. `ion-input`, `ion-textarea`),
 * otherwise falls back to `scrollIntoView()`.
 * Typically called by `hasInput()` when validation fails.
 * @param {object|HTMLElement} element - Vue component ref or DOM element to focus.
 * @example
 * setFocus(emailInputRef);
 */
export default function (element) {
  if (process.client) {
    if (element && element.$el) {
      if (hasFunction(element.$el, "setFocus")) {
        element.$el.setFocus();
      }
      else {
        element.$el.scrollIntoView(false);
      }
    }
    else if (element) {
      if (hasFunction(element, "setFocus")) {
        element.setFocus();
      }
      else {
        element.scrollIntoView(false);
      }
    }
  }
}