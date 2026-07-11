/**
 * Fires a single, quiet haptic tap as tactile confirmation of a meaningful
 * moment (a check-in saved, a reflection committed). Deliberately minimal —
 * one impact, used sparingly, so the feedback stays "felt" rather than noisy.
 *
 * Resilient by design: the `@capacitor/haptics` plugin is loaded lazily and
 * every failure path (plugin not installed, web with no Taptic engine, user
 * setting off) silently no-ops. This keeps the util safe to call from any app
 * consuming the layer, whether or not it ships haptics.
 *
 * @param {'light'|'medium'|'heavy'|'success'} [style='medium'] intensity/kind of tap.
 *   `light|medium|heavy` map to impact styles; `success` fires a notification haptic.
 * @returns {Promise<void>} resolves once the tap fires or is skipped.
 * @example
 * await haptic();          // quiet medium confirmation
 * await haptic('light');   // a lighter touch for low-stakes taps
 * await haptic('success'); // a richer pattern for an earned moment
 */
export default async function (style = 'medium') {
  try {
    const { Haptics, ImpactStyle, NotificationType } = await import('@capacitor/haptics');
    if (style === 'success') {
      await Haptics.notification({ type: NotificationType.Success });
      return;
    }
    const impact = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    }[style] ?? ImpactStyle.Medium;
    await Haptics.impact({ style: impact });
  } catch (_) {
    // Plugin absent or unsupported surface (web, etc.) — feedback is a nicety,
    // never required, so a missing Taptic engine is a no-op not an error.
  }
}
