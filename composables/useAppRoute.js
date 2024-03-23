export function useAppRoute() {
  const { path } = useRoute();

  const isRoot = ref(false);

  isRoot.value = path == "" || path == "/";

  const isPath = (path) => {
    return path == path;
  }

  return { 
    isPath,
    isRoot
  };
}