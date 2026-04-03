export default async function (title, message) {
  consoleLog(title, message);
  if (process.client) {
    return await showAlert(title, message);
  }
  return null;
}