import { toastController } from "@ionic/vue";

/**
 * Shows a brief non-blocking Ionic toast notification.
 * Use for lightweight feedback (saved, copied, etc.) that doesn't require acknowledgement.
 * For messages requiring user acknowledgement use `showAlert()`. For
 * pre-colored error/warning toasts use `showToastError()` / `showToastWarning()`.
 *
 * Multi-toast behavior:
 *   - default       — sequential queue; new toasts wait for the stage to
 *                     clear. One toast on screen at a time. Right shape
 *                     for almost every UI confirmation.
 *   - `stack: true` — fill-from-bottom pile, up to `MAX_STACK` slots;
 *                     overflow queues and drains as slots free. Use when
 *                     callers genuinely want parallel feedback (e.g. a
 *                     celebratory cascade).
 *
 * Stack layout: toasts grow upward from the bottom edge. Each new stack
 * toast is placed just above the previously-topmost one, with its
 * offset computed from that toast's *measured* rendered height — so
 * multi-line messages don't overlap their neighbors. Existing toasts
 * never move: once placed, a toast holds its position until it
 * dismisses. The stack resets to offset 0 when it empties between
 * bursts, keeping the pile bounded near the bottom edge during normal
 * use.
 *
 * Why we layer on top of `toastController` rather than rendering our
 * own DOM: Ionic's toast ships with iOS / MD platform-aware theming,
 * accessibility, enter/exit animations, RTL handling, and version-
 * tracked styling. Owning the chrome would lose all of that — we'd be
 * reinventing platform UI per release. Stacking is an after-the-fact
 * transform layered on Ionic's primitive (Ionic doesn't support
 * stacking natively — long-open core issue), with content-aware height
 * estimates seeding the layout so back-to-back bursts read uniformly
 * across single- and multi-line messages.
 *
 * @param {string} message - The text to display.
 * @param {string|null} iconName - Optional Ionicons icon name (camelCase, e.g. "trophy", "bulbOutline"). Resolved via `getIcon()`.
 * @param {string|null} color - Optional Ionic color name (e.g. 'danger', 'warning', 'success').
 * @param {boolean} [stack=false] - When true, allow parallel display up to MAX_STACK; otherwise queue sequentially.
 * @returns {Promise<HTMLIonToastElement|null>}
 * @example
 * showToast('Saved successfully');
 * showToast('Badge earned!', 'trophy');
 * showToast('Heads up', null, 'warning');
 * showToast('Earned: First reflection', 'ribbon', 'tertiary', true);
 */

// Tunables — keep at module scope so all callers share the same stack.
const MAX_STACK = 6;
const TOAST_GAP = 6;        // px between stacked toasts
const DURATION = 3000;

// Approximations of Ionic's toast metrics, used to seed each slot's
// height *before* the real DOM measurement lands at `didPresent`.
// Without this seed, same-tick or near-same-tick bursts compute their
// offsets against an unmeasured neighbor, leaving visibly inconsistent
// gaps once measurements catch up. The seed is replaced with the
// measured value as soon as `didPresent` fires; consumers of
// `slot.height` always see a reasonable number.
const VERT_PADDING = 28;       // approx top + bottom padding on `.toast-wrapper`
const LINE_HEIGHT = 20;        // approx rendered line height
const TOAST_MAX_WIDTH = 700;   // Ionic default `--max-width` on `ion-toast`
const TOAST_VIEWPORT_MARGIN = 32;  // approx left + right margin Ionic leaves around the toast
const HORIZ_RESERVED = 50;     // padding + icon space subtracted from text area
const CHAR_WIDTH = 7;          // approx px per char at 14px font
const MIN_CHARS_PER_LINE = 30; // floor for narrow viewports so the estimate never goes wild

// Chars-per-line varies with viewport: mobile toasts are narrower and
// wrap sooner; desktop toasts are capped at TOAST_MAX_WIDTH and fit
// many more chars per row. Computed per estimate so the seed roughly
// tracks the actual wrap point on whatever device the user is on.
function charsPerLine() {
  const toastWidth = Math.min(TOAST_MAX_WIDTH, window.innerWidth - TOAST_VIEWPORT_MARGIN);
  return Math.max(MIN_CHARS_PER_LINE, Math.floor((toastWidth - HORIZ_RESERVED) / CHAR_WIDTH));
}

function estimateHeight(message) {
  const len = message?.length || 1;
  const lines = Math.max(1, Math.ceil(len / charsPerLine()));
  return VERT_PADDING + lines * LINE_HEIGHT;
}

// Active slots ordered oldest-first by insertion. Each slot is
// `{ offsetPx, height }`:
//   - `offsetPx` — the negative translateY value assigned at push time,
//     based on the topmost existing toast's height. Stable for the
//     slot's lifetime so the toast never visually shifts.
//   - `height`   — seeded synchronously at push time via
//     `estimateHeight()` so concurrent slots have a usable value, then
//     overwritten with the measured `.toast-wrapper` height once
//     `didPresent` fires.
//
// Slots are pushed *synchronously* at call time so concurrent
// `showToast()` calls see consistent state when they compute their own
// offsets. The toast element itself is held via closure in
// `createAndPresent`; the slot only needs to carry the geometry.
const active = [];

// Pending toasts awaiting their turn. Each entry is `{ create, stack }`:
// `create()` builds + presents the toast at drain time, `stack` carries
// the per-toast drain condition. FIFO — head is checked first; if its
// condition isn't met we wait rather than skip ahead.
const pending = [];

// Single source of truth for "is the relevant stage full for this mode?"
// Used at both entry time (decide whether to queue) and drain time
// (decide whether a pending head can present) so the two paths can't
// disagree.
function isFull(stack) {
  return stack ? active.length >= MAX_STACK : active.length > 0;
}

function nextOffsetPx() {
  if (active.length === 0) return 0;
  // Topmost = most negative offsetPx. The new toast slots in just above
  // it, separated by TOAST_GAP, using the topmost's height — which is
  // either the measured value (from `didPresent`) or the content-aware
  // seed set at push time. Either way we have a usable number.
  const topmost = active.reduce((a, b) => b.offsetPx < a.offsetPx ? b : a);
  return topmost.offsetPx - topmost.height - TOAST_GAP;
}

// Called after every dismissal. Drains the head of `pending` if its
// drain condition is now satisfied; otherwise leaves it for the next
// dismissal. Each call drains at most one — successive dismissals fire
// successive drainPending() calls, which lines up naturally with the
// rate at which slots become available.
async function drainPending() {
  if (pending.length === 0) return;
  const next = pending[0];
  if (isFull(next.stack)) return;
  pending.shift();
  await next.create();
}

export default async function (message, iconName = null, color = null, stack = false) {
  if (!import.meta.client) return null;
  const icon = iconName ? getIcon(iconName) : null;

  // Recipe: reserves a slot synchronously, builds + presents the toast
  // with Ionic's native enter animation (iOS/MD-correct fade), then
  // measures the rendered height so the next stack toast can place
  // itself above without overlap. `present()` resolves once the enter
  // animation completes, so by the time we measure the toast is in
  // its final laid-out state.
  const createAndPresent = async () => {
    // Seed the slot's height with a content-aware estimate *before*
    // pushing, so any toast that fires before our `didPresent` lands
    // computes its offset against a reasonable value instead of a
    // fixed fallback. Same-tick bursts (where Ionic's ~400ms enter
    // animation hasn't completed by the time the next toast arrives)
    // would otherwise stack with visibly inconsistent gaps.
    const slot = {
      offsetPx: stack ? nextOffsetPx() : 0,
      height: estimateHeight(message),
    };
    active.push(slot);

    const toast = await toastController.create({
      message,
      duration: DURATION,
      ...(icon && { icon }),
      ...(color && { color }),
    });
    toast.style.transform = `translateY(${slot.offsetPx}px)`;
    toast.addEventListener('didDismiss', () => {
      const idx = active.indexOf(slot);
      if (idx !== -1) active.splice(idx, 1);
      drainPending();
    });
    // Measure on `didPresent` — Ionic emits this once the enter
    // animation has fully landed, so the visible card is at its final
    // layout. We don't need to await this; the seeded `slot.height`
    // covers any back-to-back toast that fires before the measurement
    // lands, and subsequent toasts read the refined value once
    // `didPresent` updates it.
    //
    // Measure the *visible card* — `.toast-wrapper` inside Ionic's
    // shadow DOM. `toast.clientHeight` / `toast.getBoundingClientRect()`
    // both return the viewport size because the ion-toast host is
    // `position: fixed; inset: 0`; the shadow-DOM wrapper is what
    // actually tracks the card's rendered height.
    toast.addEventListener('didPresent', () => {
      const wrapper = toast.shadowRoot?.querySelector('.toast-wrapper');
      const h = wrapper?.getBoundingClientRect().height;
      if (h) slot.height = h;
    }, { once: true });
    await toast.present();
    return toast;
  };

  if (isFull(stack)) {
    pending.push({ create: createAndPresent, stack });
    return null;
  }
  return createAndPresent();
}
