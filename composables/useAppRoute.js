export function useAppRoute() {
  const { path, params } = useRoute();

  const isRoot = ref(false);

  isRoot.value = path == "" || path == "/";

  const isPath = (path) => {
    return path == path;
  }

  const hasParam = (name) => {
    return params.value[name] != undefined;
  } 

  return { 
    path,
    params,
    isPath,
    isRoot,
    hasParam
  };
}