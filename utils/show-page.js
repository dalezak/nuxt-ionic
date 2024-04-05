export default function (path, push = true, root = false) {
  const { $ionRouter } = useNuxtApp();
  if (root) {
    $ionRouter.navigate(path, "root", "replace");
  }
  else if (push) {
    $ionRouter.navigate(path, "forward", "push");
  }
  else {
    $ionRouter.navigate(path, "back", "pop");
  }
}