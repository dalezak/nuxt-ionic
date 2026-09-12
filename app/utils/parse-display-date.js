/**
 * Parse a date value for DISPLAY, correctly for both shapes this stack stores.
 *
 * A bare `new Date(value)` is wrong for both of them, in opposite directions,
 * which is why every `text-*` formatter that used one showed the wrong day:
 *
 *   "2026-09-09T04:33:12"  A DB timestamp. Timestamps live in `timestamp
 *                          without time zone` columns holding UTC, and
 *                          PostgREST serializes them with NO offset. `new
 *                          Date()` reads an offset-less date-TIME as LOCAL, so
 *                          a journal entry written at 22:33 Tuesday in UTC-6 —
 *                          stored as 04:33 Wednesday UTC — displayed as
 *                          "Wednesday". Anything written after early evening
 *                          showed tomorrow's date.
 *
 *   "2026-09-09"           A wall-calendar date with no instant attached. `new
 *                          Date()` reads a date-ONLY string as UTC midnight, so
 *                          west of Greenwich it rendered the day BEFORE.
 *                          `textDate`'s own doc example was wrong for this
 *                          reason: '2025-04-05' returned "Friday, Apr 4".
 *
 * So a date-only value is pinned to LOCAL midnight — there is no instant to
 * convert, and shifting it can only introduce an error — while a date-time is
 * read as UTC unless it carries a zone, then rendered in the viewer's.
 *
 * Related but not interchangeable: `parseTimestamp` (nuxt-supabase) does the
 * date-time half only. It is correct for day MATH on DB rows; it mis-handles
 * date-only input, so display formatters need this instead.
 *
 * @param {string|Date|null|undefined} value
 * @returns {Date|null} null for empty or unparseable input.
 */

// A bare calendar date: no time, no zone.
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
// A trailing timezone: "Z", "+05:00", "-0600".
const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;

export default function parseDisplayDate(value) {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  const raw = String(value).trim();
  const normalized = DATE_ONLY.test(raw)
    ? `${raw}T00:00:00`
    // Postgres may use a space separator; ISO needs the "T".
    : (HAS_ZONE.test(raw) ? raw : `${raw.replace(' ', 'T')}Z`);

  const date = new Date(normalized);
  return isNaN(date.getTime()) ? null : date;
}
