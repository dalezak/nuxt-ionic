import { arrowForwardOutline } from 'ionicons/icons';

// The frame every "follow-ups" surface shares: a list of `{ kind, slug, … }`
// items on a piece of content (a lesson, a reading, a sitting — three layers
// carry the same JSONB shape) resolved into the view-models
// <lesson-followup-card> renders.
//
// love-well and best-self had each written this frame in full — the same
// iteration, the same reactive view-model, the same filter — around a hand-
// written switch over kinds. The frame is here; the KINDS are a map the app
// composes, so that each kind's resolver can live with the layer that owns
// its opener (journal → nuxt-journals, check-in → nuxt-checkins, practice →
// nuxt-practices) and an app's private kinds (a sitting, a morning intention)
// sit inline in the app. No layer imports another; the app is the only place
// that knows the whole set.
//
// A kind resolver is `async (f, i, ctx) => fields | null`, where `fields` are
// what the card needs — icon, iconColor, eyebrow, title, subtitle, actionLabel,
// ctaIcon, doneLabel?, oneShot?, perform — and null drops the item (unknown
// slug, disabled template). `perform` returns true when the follow-up is
// DONE (the card marks it), false when it merely opened something.
//
// `ctx.goTo(path)` routes, dismissing the current modal first when
// `closeBeforeRoute` is set — lesson follow-ups run inside a modal, reading
// follow-ups on a page; only the caller knows which.
export function createFollowupResolver({ kinds = {}, closeBeforeRoute = false } = {}) {
  const router = useRouter();

  async function goTo(path) {
    if (closeBeforeRoute) await hideModal({});
    router.push(path);
    return false;
  }

  const ctx = { goTo, closeBeforeRoute };

  async function resolveOne(f, i) {
    const resolve = f?.kind ? kinds[f.kind] : null;
    if (!resolve) return null;
    const vm = reactive({
      key: `${f.kind}:${f.slug ?? i}:${i}`,
      kind: f.kind,
      note: f.note ?? null,
      busy: false,
      done: false,
      oneShot: false,
    });
    const fields = await resolve(f, i, ctx);
    return fields ? Object.assign(vm, fields) : null;
  }

  // Accepts the content row (reads `.followups`) or the array itself.
  async function resolveFollowups(input) {
    const items = Array.isArray(input)
      ? input
      : (Array.isArray(input?.followups) ? input.followups : []);
    const resolved = await Promise.all(items.map((f, i) => resolveOne(f, i)));
    return resolved.filter(Boolean);
  }

  return { resolveFollowups };
}

// `{ kind: 'route', slug: '/path' }` — the one kind that is pure navigation
// and so belongs to the frame's own layer.
export function routeFollowup() {
  return async (f, _i, ctx) => {
    if (!f.slug) return null;
    return {
      icon: arrowForwardOutline, iconColor: 'primary',
      eyebrow: f.eyebrow ?? null, title: f.label || f.slug, subtitle: f.subtitle ?? null,
      actionLabel: f.cta || 'Open', ctaIcon: arrowForwardOutline,
      perform: () => ctx.goTo(f.slug),
    };
  };
}
