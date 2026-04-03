export default function (theme = "default", dark = false) {
  if (process.client) {
    consoleLog('settingsTheme', theme, dark);
    if (dark) {
      document.body.classList.add('dark');
    }
    else {
      document.body.classList.remove('dark');
    }
  }
}