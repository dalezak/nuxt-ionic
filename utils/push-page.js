// direction: 'forward' | 'back' | 'root' | 'none'
// action: 'push' | 'pop' | 'replace'
export default function (path) {
  const { $ionRouter } = useNuxtApp();
  $ionRouter.navigate(path, 'forward', 'push');
}