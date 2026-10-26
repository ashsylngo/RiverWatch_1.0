// Time helpers. Times are stored as UTC ISO strings and shown in Asia/Manila.
import t from '../strings/en.js';

const TZ = 'Asia/Manila';

const clockFmt = new Intl.DateTimeFormat('en-PH', {
  timeZone: TZ, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true,
});
const dateLongFmt = new Intl.DateTimeFormat('en-PH', {
  timeZone: TZ, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});
const dateTimeFmt = new Intl.DateTimeFormat('en-PH', {
  timeZone: TZ, year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
});
const dateTimeSecFmt = new Intl.DateTimeFormat('en-PH', {
  timeZone: TZ, year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true,
});
const shortTimeFmt = new Intl.DateTimeFormat('en-PH', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true });
const shortDateFmt = new Intl.DateTimeFormat('en-PH', { timeZone: TZ, month: 'short', day: 'numeric' });
const stampFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });

const toMs = (v) => (typeof v === 'number' ? v : Date.parse(v));

export const formatClock = (ms) => clockFmt.format(ms);
export const formatDateLong = (ms) => dateLongFmt.format(ms);
export const formatDateTime = (v) => dateTimeFmt.format(toMs(v));
export const formatDateTimeSec = (v) => dateTimeSecFmt.format(toMs(v));
export const formatShortTime = (v) => shortTimeFmt.format(toMs(v));
export const formatShortDate = (v) => shortDateFmt.format(toMs(v));
/** yyyy-mm-dd in Asia/Manila, for file names. */
export const fileStamp = (ms) => stampFmt.format(ms);

/** "12 s ago", "3 min ago", "2 h ago", "9 days ago". */
export function formatAge(ageMs) {
  const s = Math.max(0, Math.round(ageMs / 1000));
  if (s < 5) return t.time.justNow;
  if (s < 60) return t.time.secondsAgo(s);
  const m = Math.floor(s / 60);
  if (m < 60) return t.time.minutesAgo(m);
  const h = Math.floor(m / 60);
  if (h < 48) return t.time.hoursAgo(h);
  return t.time.daysAgo(Math.floor(h / 24));
}

export const timeAgo = (iso, nowMs) => formatAge(nowMs - Date.parse(iso));

/** "3 d 4 h", "5 h 10 min", "12 min" for durations in ms. */
export function formatDuration(ms) {
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 1) return t.time.lessThanMinute;
  const d = Math.floor(totalMin / 1440);
  const h = Math.floor((totalMin % 1440) / 60);
  const m = totalMin % 60;
  if (d > 0) return t.time.durationDH(d, h);
  if (h > 0) return t.time.durationHM(h, m);
  return t.time.durationM(m);
}
