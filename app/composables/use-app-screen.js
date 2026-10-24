import { isPlatform } from '@ionic/vue';

/**
 * Composable for responsive breakpoint and platform detection.
 * Breakpoints mirror the nuxt-viewport config: xs 320, sm 576, md 768, lg 992, xl 1200.
 *
 * `isApp` / `isWeb` pick the app chrome — tab bar + page headers vs. the
 * nav-bar links. Inside the NATIVE app (Capacitor) it is always app chrome,
 * whatever the width: a phone turned to landscape is ~850–930pt wide, past
 * `md`, and used to flip to the web nav bar and lose its page headers. On the
 * web the width still decides, so a narrow browser or a phone's browser gets
 * the tab bar and a desktop gets the nav bar.
 *
 * `isNative` is the Capacitor shell itself, whatever the width — for what only
 * exists there (haptics, widgets). Not `isApp` (a narrow browser is app
 * chrome too) and not `isApple` (true in Safari on an iPhone).
 * @returns {{
 *   isXSmall: import('vue').Ref<boolean>,
 *   isSmall:  import('vue').Ref<boolean>,
 *   isMedium: import('vue').Ref<boolean>,
 *   isLarge:  import('vue').Ref<boolean>,
 *   isXLarge: import('vue').Ref<boolean>,
 *   isApp:    import('vue').Ref<boolean>,
 *   isWeb:    import('vue').Ref<boolean>,
 *   isNative: boolean,
 *   isApple:  import('vue').Ref<boolean>,
 *   isAndroid: import('vue').Ref<boolean>
 * }}
 */
export function useAppScreen() {
  const viewport = useViewport();

  const isXSmall = ref(false);
  const isSmall = ref(false);
  const isMedium = ref(false);
  const isLarge = ref(false);
  const isXLarge = ref(false);

  const isApp = ref(false);
  const isWeb = ref(false);

  const isApple = ref(false);
  const isAndroid = ref(false);

  // Native shell: always app chrome (see the note above).
  const isNative = isPlatform('capacitor');
  const appChrome = () => isNative || viewport.isLessThan('md');

  isXSmall.value = viewport.isLessThan('sm');
  isSmall.value = viewport.isGreaterOrEquals('sm') && viewport.isLessThan('md');
  isMedium.value = viewport.isGreaterOrEquals('md') && viewport.isLessThan('lg');
  isLarge.value = viewport.isGreaterOrEquals('lg') && viewport.isLessThan('xl');
  isXLarge.value = viewport.isGreaterOrEquals('xl');

  isApp.value = appChrome();
  isWeb.value = !isApp.value;

  isApple.value = isPlatform('ios');
  isAndroid.value = isPlatform('android');
  
  watch(viewport.breakpoint, (newBreakpoint, oldBreakpoint) => {
    isXSmall.value = viewport.isLessThan('sm');
    isSmall.value = viewport.isGreaterOrEquals('sm') && viewport.isLessThan('md');
    isMedium.value = viewport.isGreaterOrEquals('md') && viewport.isLessThan('lg');
    isLarge.value = viewport.isGreaterOrEquals('lg') && viewport.isLessThan('xl');
    isXLarge.value = viewport.isGreaterOrEquals('xl');

    isApp.value = appChrome();
    isWeb.value = !isApp.value;
  })

  return { 
    isXSmall,
    isSmall,
    isMedium,
    isLarge,
    isXLarge,
    isApp,
    isWeb,
    isNative,
    isApple,
    isAndroid
  };
}