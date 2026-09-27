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
  const { path } = useRoute();
  const router = useRouter();

  // LIVE params, read through router.currentRoute at access time — not the
  // snapshot `useRoute().params` hands out at setup. On a cold / deep load
  // of a `[slug]` page the setup-time route is the tab parent with EMPTY
  // params (see use-ion-page.js); anything that read `params.id` then
  // captured undefined for the life of the page. A Proxy keeps the familiar
  // `params.id` spelling in templates and functions while each read resolves
  // the current route, so a loader that runs after `router.isReady()` sees
  // the real id. Composables that need the id at SETUP should take a getter
  // (`() => params.id`) rather than the value.
  // `.value` is also answered (with the whole params object) so callers that
  // treat `params` as a ref — `params.value.id`, the useIonPage() spelling —
  // keep working unchanged.
  const params = new Proxy({}, {
    get: (_, key) => key === 'value'
      ? router.currentRoute.value.params
      : router.currentRoute.value.params[key],
    has: (_, key) => key in router.currentRoute.value.params,
    ownKeys: () => Reflect.ownKeys(router.currentRoute.value.params),
    getOwnPropertyDescriptor: (_, key) => ({ enumerable: true, configurable: true, value: router.currentRoute.value.params[key] }),
  });

  const isRoot = ref(false);

  isRoot.value = path == "" || path == "/";

  /** Returns true if the current path matches routePath. */
  const isPath = (routePath) => {
    return path == routePath;
  }

  /** Returns true if the named route param is present. */
  const hasParam = (name) => {
    return params[name] != undefined;
  }

  return {
    path,
    params,
    isPath,
    isRoot,
    hasParam
  };
}