import * as icon from 'ionicons/icons';

/**
 * Returns an Ionicons SVG icon by its camelCase export name.
 * Use with Ionic's `ion-icon` component via the `:icon` prop.
 * @param {string} name - camelCase icon name from ionicons/icons (e.g. "home", "personCircle").
 * @returns {string} SVG icon value, or "" if name is falsy, or undefined if name is unknown.
 * @example
 * <ion-icon :icon="getIcon('home')" />
 */
export default function (name) {
  if (icon && name) {
    return icon[name];
  }
  return "";
}
