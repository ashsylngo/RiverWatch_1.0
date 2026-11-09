// Time helpers. Times are stored as UTC ISO strings and shown in Asia/Manila, 12-hour time.
// Nothing is cached at module level: formatters take the UI language ('en' or 'fil') and text helpers take `t`.
import { intlLocale } from './format.js';

const TZ = 'Asia/Manila';

const fmt = (lang, options) => new Intl.DateTimeFormat(intlLocale(lang), { timeZone: TZ, ...options });
const toMs = (v) => (typeof v === 'number' ? v : Date.parse(v));

export const formatClock = (ms, lang) => fmt(lang, { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).format(ms);
export const formatDateLong = (ms, lang) => fmt(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(ms);
export const formatDateTime = (v, lang) => fmt(lang, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(toMs(v));
export const formatDateTimeSec = (v, lang) => fmt(lang, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).format(toMs(v));
export const formatShortTime = (v, lang) => fmt(lang, { hour: 'numeric', minute: '2-digit', hour12: true }).format(toMs(v));
export const formatShortDate = (v, lang) => fmt(lang, { month: 'short', day: 'numeric' }).format(toMs(v));
/** yyyy-mm-dd in Asia/Manila, for file names. Fixed format: file names do not follow the UI language. */
export const fileStamp = (ms) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(ms);

/** "12 s ago", "3 min ago", "2 h ago", "9 days ago" (or the Filipino text), from the strings `t`. */
export function formatAge(ageMs, t) {
  const s = Math.max(0, Math.round(ageMs / 1000));
  if (s < 5) return t.time.justNow;
  if (s < 60) return t.time.secondsAgo(s);
  const m = Math.floor(s / 60);
  if (m < 60) return t.time.minutesAgo(m);
  const h = Math.floor(m / 60);
  if (h < 48) return t.time.hoursAgo(h);
  return t.time.daysAgo(Math.floor(h / 24));
}

export const timeAgo = (iso, nowMs, t) => formatAge(nowMs - Date.parse(iso), t);

/** "3 d 4 h", "5 h 10 min", "12 min" for durations in ms. */
export function formatDuration(ms, t) {
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 1) return t.time.lessThanMinute;
  const d = Math.floor(totalMin / 1440);
  const h = Math.floor((totalMin % 1440) / 60);
  const m = totalMin % 60;
  if (d > 0) return t.time.durationDH(d, h);
  if (h > 0) return t.time.durationHM(h, m);
  return t.time.durationM(m);
}
