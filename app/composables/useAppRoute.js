/**
 * Composable for inspecting the current route.
 * @returns {{
 *   path: string,
 *   params: import('vue').Ref<Record<string, string>>,
 *   isRoot: import('vue').Ref<boolean>,
 *   isPath: (routePath: string) => boolean,
 *   hasParam: (name: string) => boolean
 * }}
 */
export function useAppRoute() {
  const { path, params } = useRoute();

  const isRoot = ref(false);

  isRoot.value = path == "" || path == "/";

  /** Returns true if the current path matches routePath. */
  const isPath = (routePath) => {
    return path == routePath;
  }

  /** Returns true if the named route param is present. */
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