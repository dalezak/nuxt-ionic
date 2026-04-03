import { isPlatform } from '@ionic/vue';

/**
 * Composable for responsive breakpoint and platform detection.
 * Breakpoints mirror the nuxt-viewport config: xs 320, sm 576, md 768, lg 992, xl 1200.
 * @returns {{
 *   isXSmall: import('vue').Ref<boolean>,
 *   isSmall:  import('vue').Ref<boolean>,
 *   isMedium: import('vue').Ref<boolean>,
 *   isLarge:  import('vue').Ref<boolean>,
 *   isXLarge: import('vue').Ref<boolean>,
 *   isApp:    import('vue').Ref<boolean>,
 *   isWeb:    import('vue').Ref<boolean>,
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

  isXSmall.value = viewport.isLessThan('sm');
  isSmall.value = viewport.isGreaterOrEquals('sm') && viewport.isLessThan('md');
  isMedium.value = viewport.isGreaterOrEquals('md') && viewport.isLessThan('lg');
  isLarge.value = viewport.isGreaterOrEquals('lg') && viewport.isLessThan('xl');
  isXLarge.value = viewport.isGreaterOrEquals('xl');

  isApp.value = viewport.isLessThan('md');
  isWeb.value = viewport.isGreaterOrEquals('md');

  isApple.value = isPlatform('ios');
  isAndroid.value = isPlatform('android');
  
  watch(viewport.breakpoint, (newBreakpoint, oldBreakpoint) => {
    isXSmall.value = viewport.isLessThan('sm');
    isSmall.value = viewport.isGreaterOrEquals('sm') && viewport.isLessThan('md');
    isMedium.value = viewport.isGreaterOrEquals('md') && viewport.isLessThan('lg');
    isLarge.value = viewport.isGreaterOrEquals('lg') && viewport.isLessThan('xl');
    isXLarge.value = viewport.isGreaterOrEquals('xl');

    isApp.value = viewport.isLessThan('md');
    isWeb.value = viewport.isGreaterOrEquals('md');
  })

  return { 
    isXSmall,
    isSmall,
    isMedium,
    isLarge,
    isXLarge,
    isApp,
    isWeb,
    isApple,
    isAndroid
  };
}