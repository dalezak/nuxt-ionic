import { isPlatform } from '@ionic/vue';
export default function () {
  const viewport = useViewport();

  const isNarrow = ref(false);
  const isWide = ref(false);

  const isXSmall = ref(false);
  const isSmall = ref(false);
  const isMedium = ref(false);
  const isLarge = ref(false);
  const isXLarge = ref(false);

  const isApp = ref(false);
  const isWeb = ref(false);
  
  const isApple = ref(false);
  const isAndroid = ref(false);
  
  isNarrow.value = viewport.isLessThan('md');
  isWide.value = viewport.isGreaterOrEquals('md');

  isXSmall.value = viewport.isLessThan('sm');
  isSmall.value = viewport.isGreaterOrEquals('sm') && viewport.isLessThan('md');
  isMedium.value = viewport.isGreaterOrEquals('md') && viewport.isLessThan('lg');
  isLarge.value = viewport.isGreaterOrEquals('lg') && viewport.isLessThan('xl');
  isXLarge.value = viewport.isGreaterOrEquals('xl');

  watch(viewport.breakpoint, (newBreakpoint, oldBreakpoint) => {
    isXSmall.value = viewport.isLessThan('sm');
    isSmall.value = viewport.isGreaterOrEquals('sm') && viewport.isLessThan('md');
    isMedium.value = viewport.isGreaterOrEquals('md') && viewport.isLessThan('lg');
    isLarge.value = viewport.isGreaterOrEquals('lg') && viewport.isLessThan('xl');
    isXLarge.value = viewport.isGreaterOrEquals('xl');
  })

  // isApp.value = isPlatform('mobile') || isPlatform('ios') || isPlatform('android');
  // isWeb.value = isPlatform('desktop') || isPlatform("mobileweb");
  isApp.value = viewport.isLessThan('md');
  isWeb.value = viewport.isGreaterOrEquals('md');

  isApple.value = isPlatform('ios');
  isAndroid.value = isPlatform('android');
  
  return { 
    isNarrow,
    isWide,
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