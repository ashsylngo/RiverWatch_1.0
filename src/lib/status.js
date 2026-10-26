// Status tier, freshness and alert-suggestion logic. Pure functions.
// Thresholds and timing are never hard-coded here: they are passed in from the data layer settings.
import t from '../strings/en.js';

export const TIERS = ['normal', 'watch', 'warning', 'critical'];
const TIER_RANK = { normal: 0, watch: 1, warning: 2, critical: 3 };

/** Alert levels ranked against status tiers. `test` does not take part in suggestions. */
const ALERT_RANK = { all_clear: 0, watch: 1, warning: 2, critical: 3 };

export const tierRank = (tier) => TIER_RANK[tier] ?? 0;
export const tierLabel = (tier) => t.status[tier].label;

/** < watch is Normal, >= watch Watch, >= warning Warning, >= critical Critical. */
export function tierFor(levelCm, settings) {
  if (levelCm >= settings.critical_cm) return 'critical';
  if (levelCm >= settings.warning_cm) return 'warning';
  if (levelCm >= settings.watch_cm) return 'watch';
  return 'normal';
}

/**
 * Freshness from last_seen: Live while age <= stale_multiplier x expected interval,
 * Stale past that, Offline past the heartbeat limit.
 */
export function freshnessFor(lastSeenIso, nowMs, expectedIntervalS, settings) {
  const ageMs = Math.max(0, nowMs - Date.parse(lastSeenIso));
  const ageS = ageMs / 1000;
  let state = 'live';
  if (ageS > settings.heartbeat_limit_s) state = 'offline';
  else if (ageS > settings.stale_multiplier * expectedIntervalS) state = 'stale';
  return { state, ageMs };
}

/**
 * The app suggests, the official sends.
 * - Suggest a raise when the status is higher than the level of the last real alert.
 * - Suggest All clear when the status is Normal and the last real alert was Watch, Warning or Critical.
 * `lastAlertLevel` is the level of the most recent non-test alert (or null).
 */
export function suggestAlert(status, lastAlertLevel) {
  const statusRank = tierRank(status);
  const lastRank = lastAlertLevel ? ALERT_RANK[lastAlertLevel] ?? 0 : 0;
  if (statusRank > lastRank && statusRank > 0) return { kind: 'raise', level: status };
  if (statusRank === 0 && lastRank > 0) return { kind: 'all_clear', level: 'all_clear' };
  return null;
}

export const ALERT_LEVELS = ['watch', 'warning', 'critical', 'all_clear', 'test'];
export const alertLevelLabel = (level) => t.alertLevels[level].label;
