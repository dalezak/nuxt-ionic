import * as icon from 'ionicons/icons';
export default function (name) {
  if (icon && name) {
    return icon[name];
  }
  return "";
}