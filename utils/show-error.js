export default async function (title, subtitle = null, message = null, buttons = ["Ok"]) {
  consoleError(title, subtitle, message);
  return showAlert(title, subtitle, message, buttons);
}