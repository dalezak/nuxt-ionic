import { useAppTabs } from "../composables/useAppTabs";

export default function () {
  const { path } = useRoute();
  const appTabs = useAppTabs();
  consoleLog("showPageIndex", "tabs", appTabs);
  if (appTabs.length > 0) {
    const tab = appTabs[0];
    consoleLog("showPageIndex", "path", tab.path);
    showPage(tab.path, false);
  }
  else if (path != "" || page != "/") {
    consoleLog("showPageIndex", "path", "/");
    showPage("/", false);
  }
}