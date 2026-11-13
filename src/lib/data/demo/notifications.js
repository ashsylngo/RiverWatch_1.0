// Notification records for the bell. Pure helpers: no state, no storage, no text.
// A record holds a kind, a severity, a time and parameters only. The title and message are built from the
// strings files when the item is shown, so switching language re-translates existing items.
import { tierFor, suggestAlert } from '../../status.js';

const NOTIFICATION_CAP = 20;
const KINDS = ['status', 'suggestion', 'sensor', 'gate', 'alert_sent'];
const SEVERITIES = ['info', 'watch', 'warning', 'critical'];

/** A new record. `seq` keeps ids unique when two records are made in the same millisecond. */
export function makeNotification(kind, severity, params, nowMs, seq) {
  return {
    id: `nf-u${nowMs.toString(36)}${seq}`,
    kind,
    severity,
    created_at: new Date(nowMs).toISOString(),
    params: { ...params },
  };
}

/** The last three seeded alerts, as already-read "alert sent" items (newest first). */
export function seedNotifications(alerts) {
  return alerts
    .slice()
    .sort((a, b) => Date.parse(b.sent_at) - Date.parse(a.sent_at))
    .slice(0, 3)
    .map((a) => ({
      id: `nf-s${a.id}`,
      kind: 'alert_sent',
      severity: 'info',
      created_at: a.sent_at,
      params: { alert_id: a.id, level: a.level, recipients: a.recipient_count },
    }));
}

export const isSeedNotification = (n) => typeof n.id === 'string' && n.id.startsWith('nf-s');

/** Saved records are checked before use. Anything malformed is dropped. */
export function isValidNotification(n) {
  return Boolean(
    n
    && typeof n.id === 'string'
    && KINDS.includes(n.kind)
    && SEVERITIES.includes(n.severity)
    && typeof n.created_at === 'string'
    && !Number.isNaN(Date.parse(n.created_at))
    && n.params && typeof n.params === 'object',
  );
}

export function sortAndCap(list) {
  return list
    .slice()
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, NOTIFICATION_CAP);
}

/** The latest reading's tier, the same value the Home screen shows. */
export const currentTier = (S) => tierFor(S.readings[S.readings.length - 1].level_cm, S.settings);

/** The alert suggestion the Home banner shows right now (same function), or null. */
export function currentSuggestion(S) {
  const real = S.alerts
    .filter((a) => a.level !== 'test')
    .sort((a, b) => Date.parse(b.sent_at) - Date.parse(a.sent_at))[0];
  return suggestAlert(currentTier(S), real ? real.level : null);
}

export const suggestionKey = (s) => (s ? `${s.kind}:${s.level}` : null);
