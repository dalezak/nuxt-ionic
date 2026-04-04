/**
 * Returns true if `object` has a callable method named `method`.
 * Used to safely check before calling Ionic element methods like `setFocus()`.
 * @param {any} object - The object to inspect.
 * @param {string} method - The method name to check for.
 * @returns {boolean}
 * @example
 * if (hasFunction(element.$el, 'setFocus')) element.$el.setFocus();
 */
export default function (object, method) {
  return object != null && typeof object[method] == "function";
}
