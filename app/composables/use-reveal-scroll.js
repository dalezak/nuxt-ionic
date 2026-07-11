// useRevealScroll — scroll an element into view inside an <ion-content>, then
// (optionally) bloom a highlight ring on it and focus its first input. This is
// the shared "take me to this thing and show me WHICH one" interaction: a
// step/table-of-contents jump, an in-page nav to the card a user just tapped,
// "go to the thing you just created". Returns three composable helpers you can
// use together (via scrollToElement) or on their own.
//
// Why not native scrollIntoView: inside an <ion-content> the real scroll
// container lives in shadow DOM, so scrollIntoView is unreliable — elements
// near the bottom won't move at all. scrollToElement drives Ionic's
// scrollToPoint on the content's own scroll element, and only falls back to
// scrollIntoView when the target isn't inside an ion-content.
//
// The flash is a pure-CSS animation (the `.reveal-flash` class in the layer's
// reveal.css). Its colour follows the element's own `--accent-color` when it
// has one (a <section-card accent="…"> exposes it), else --ion-color-primary —
// so a card flashes in its own semantic hue for free.

export function useRevealScroll() {
  // Smooth-scroll an element into view via Ionic's content scroller, then
  // optionally flash it and focus its first input.
  //   focus    — focus the element's first text field afterwards (composers)
  //   flash    — bloom the highlight ring (default on)
  //   offset   — px of breathing room above the target
  //   duration — scroll animation ms (also gates when the flash fires)
  async function scrollToElement(el, { focus = false, flash = true, offset = 16, duration = 350 } = {}) {
    if (!el || !import.meta.client) return;
    const content = el.closest('ion-content');
    if (content?.getScrollElement) {
      const scrollEl = await content.getScrollElement();
      const y = el.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top + scrollEl.scrollTop - offset;
      content.scrollToPoint(0, Math.max(0, y), duration);
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Fire the flash just after the scroll settles so the ring blooms under the
    // eye, not mid-flight.
    if (flash) flashElement(el, { delay: duration + 30 });
    if (focus) focusFirstInput(el);
  }

  // Bloom a brief highlight ring on an element (adds `.reveal-flash`, removed on
  // animationend). Removing + forcing a reflow before re-adding lets a repeated
  // call on the same element replay the animation instead of no-opping.
  function flashElement(el, { delay = 380 } = {}) {
    if (!el || !import.meta.client) return;
    setTimeout(() => {
      el.classList.remove('reveal-flash');
      void el.offsetWidth; // force reflow so the animation can restart
      el.classList.add('reveal-flash');
      el.addEventListener('animationend', () => el.classList.remove('reveal-flash'), { once: true });
    }, delay);
  }

  // Focus the first text field within an element so the user can type straight
  // away. Handles Ionic's <ion-input>/<ion-textarea> (async setFocus after
  // componentOnReady) and falls back to the native control. No-ops gracefully
  // when the element has no field (e.g. a tap-to-open card or a guided player).
  async function focusFirstInput(el) {
    if (!el) return;
    await nextTick();
    const field = el.querySelector('ion-textarea, ion-input');
    if (field) {
      if (typeof field.componentOnReady === 'function') await field.componentOnReady();
      if (typeof field.setFocus === 'function') { field.setFocus(); return; }
    }
    el.querySelector('textarea, input')?.focus();
  }

  return { scrollToElement, flashElement, focusFirstInput };
}
