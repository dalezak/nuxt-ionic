// Returns the current period of the day based on local time:
//   'morning'   — midnight to noon (0:00–11:59)
//   'afternoon' — noon to 6pm     (12:00–17:59)
//   'evening'   — 6pm to midnight (18:00–23:59)
//
// Used by the Today tab to pick the default surface — morning + afternoon
// share the morning-style surface (intention + one thing today); evening
// surfaces the bookend (action status + reflection prompts). The user can
// always toggle to see either surface regardless of period.

export default function (date = new Date()) {
  const h = date.getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}
