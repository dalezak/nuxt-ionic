// direction: 'forward' | 'back' | 'root' | 'none'
// action: 'push' | 'pop' | 'replace'
export default function (path, direction = "forward", action = "push") {
  const { $ionRouter } = useNuxtApp();
  consoleLog("showPage", path, direction, action);
  $ionRouter.navigate(path, direction, action);
}