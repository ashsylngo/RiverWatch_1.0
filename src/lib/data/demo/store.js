// In-memory state for the demo source, plus subscriptions, persistence and the read wrapper.
// Components never touch this file. They go through src/lib/data/index.js.
import { generateSeeds } from './generator.js';
import { mulberry32 } from './prng.js';
import { loadState, saveState, clearState } from '../storage.js';
import { demoOfficial } from './seeds.js';
import { freshnessFor } from '../../status.js';
import {
  currentSuggestion, currentTier, isSeedNotification, isValidNotification, makeNotification,
  seedNotifications, sortAndCap, suggestionKey,
} from './notifications.js';

let S = null;
let version = 0;
let snapshot = null;
const subs = new Set();
const pending = new Set();
let scheduled = false;

export const getState = () => S;
export const isUserId = (id) => typeof id === 'string' && id.startsWith('al-u');

/** Tell subscribers which topics changed. Calls in the same tick are merged into one notification. */
export function notify(...topics) {
  version += 1;
  snapshot = null;
  topics.forEach((t) => pending.add(t));
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(() => {
    scheduled = false;
    const changed = [...pending];
    pending.clear();
    subs.forEach((fn) => fn(changed));
  });
}

export function subscribe(fn) {
  subs.add(fn);
  return () => subs.delete(fn);
}

/** Wraps every data call so Demo tools can add a delay or a forced error. */
export async function read(fn) {
  if (S.tools.delayMs > 0) await new Promise((r) => setTimeout(r, S.tools.delayMs));
  if (S.tools.forceError) throw new Error('Simulated data error (Demo tools)');
  return fn();
}

export function persist() {
  if (!S) return;
  saveState({
    residents: S.residents,
    alerts: S.alerts.filter((a) => isUserId(a.id)),
    deliveries: S.deliveries.filter((d) => isUserId(d.alert_id)),
    gateEvents: S.gateEvents.filter((e) => e.id.startsWith('ge-u')),
    // Seeded notifications are rebuilt from the seeds on every load, so only the others are saved.
    notifications: S.notifications.filter((n) => !isSeedNotification(n)),
    notificationsReadAt: S.notificationsReadAt,
  });
}

const isArr = Array.isArray;

function mergePersisted(state, saved) {
  if (!saved) return;
  if (isArr(saved.residents) && saved.residents.every((r) => r && typeof r.id === 'string' && typeof r.name === 'string')) {
    state.residents = saved.residents;
  }
  if (isArr(saved.alerts)) {
    const ok = saved.alerts.filter((a) => a && isUserId(a.id) && typeof a.message === 'string');
    state.alerts.push(...ok);
    if (isArr(saved.deliveries)) {
      const ids = new Set(ok.map((a) => a.id));
      for (const d of saved.deliveries) {
        if (d && ids.has(d.alert_id)) {
          // A reload mid-send finishes the delivery rather than leaving it stuck.
          const final = d.status === 'queued' || d.status === 'sent' ? { ...d, status: 'delivered' } : d;
          state.deliveries.push(final);
        }
      }
      for (const a of ok) {
        const rows = state.deliveries.filter((d) => d.alert_id === a.id);
        if (rows.length) {
          a.delivered_count = rows.filter((d) => d.status === 'delivered').length;
          a.failed_count = rows.filter((d) => d.status === 'failed').length;
        }
      }
    }
  }
  if (isArr(saved.gateEvents)) {
    const ok = saved.gateEvents.filter((e) => e && typeof e.id === 'string' && (e.state === 'open' || e.state === 'closed'));
    if (ok.length) {
      state.gateEvents.push(...ok);
      state.gateEvents.sort((a, b) => Date.parse(a.occurred_at) - Date.parse(b.occurred_at));
      const last = state.gateEvents[state.gateEvents.length - 1];
      state.gate.state = last.state;
      state.gate.changed_at = last.occurred_at;
    }
  }
  // state.notifications still holds only the seeded items here.
  const seedNewest = Math.max(...state.notifications.map((n) => Date.parse(n.created_at)), 0);
  if (isArr(saved.notifications)) {
    state.notifications = sortAndCap([...saved.notifications.filter(isValidNotification), ...state.notifications]);
  }
  if (typeof saved.notificationsReadAt === 'string' && !Number.isNaN(Date.parse(saved.notificationsReadAt))) {
    // Never later than "now", and never earlier than the newest seeded item, so seeded items always start read.
    const savedMs = Math.min(Date.parse(saved.notificationsReadAt), Date.now());
    state.notificationsReadAt = new Date(Math.max(savedMs, seedNewest)).toISOString();
  }
}

function buildState(useSaved) {
  const seeds = generateSeeds(Date.now());
  const state = {
    ...seeds,
    seedReadingCount: seeds.readings.length,
    demoOfficial: { ...demoOfficial },
    tools: { delayMs: 0, forceError: false },
    // Notifications (newest first, at most 20). At load: the last three seeded alerts, already read, so the badge starts at 0.
    notifications: seedNotifications(seeds.alerts),
    notificationsReadAt: new Date().toISOString(),
    sim: {
      level: seeds.baselineLevel,
      base: seeds.baselineLevel,
      target: seeds.baselineLevel,
      mode: 'idle', // idle | ramp | fall
      t: 0,
      dur: 0,
      from: 0,
      to: 0,
      secs: 0,
      counter: 0,
      sensorMode: 'live', // live | stale | offline
      autoClosed: false,
      rng: mulberry32(7301),
    },
  };
  if (useSaved) mergePersisted(state, loadState());
  // What the notification hooks compare against. Set after loading so a reload never raises an item by itself.
  state.sim.lastTier = currentTier(state);
  state.sim.lastSuggestion = suggestionKey(currentSuggestion(state));
  state.sim.lastFresh = 'live';
  return state;
}

export function init() {
  if (!S) S = buildState(true);
  return S;
}

/** Reset demo: clear saved changes and rebuild every seed. */
export function resetState() {
  clearState();
  S = buildState(false);
  notify('reset');
}

export function getDemoSnapshot() {
  if (!snapshot) {
    const last = S.readings[S.readings.length - 1];
    snapshot = {
      version,
      level: Math.round(S.sim.level * 10) / 10,
      lastRecorded: last.level_cm,
      settings: S.settings,
      sensorMode: S.sim.sensorMode,
      cameraOk: S.station.camera_ok,
      gateState: S.gate.state,
      scenario: S.sim.mode,
      tools: { ...S.tools },
    };
  }
  return snapshot;
}

// ---- Notifications (appended by the simulator and by user actions) -----------------------------

let notificationSeq = 0;

/** Add one record (kind, severity, time, params). The list stays newest first and capped at 20. */
export function addNotification(kind, severity, params = {}) {
  notificationSeq += 1;
  const record = makeNotification(kind, severity, params, Date.now(), notificationSeq);
  S.notifications = sortAndCap([record, ...S.notifications]);
  persist();
  notify('notifications');
}

/** Compare the current state with the last one seen and add a record for each change worth showing. */
export function checkTransitions() {
  const sim = S.sim;
  const latest = S.readings[S.readings.length - 1];

  // Status tier changed (up or down). Severity is the new tier, or Info for back to Normal.
  const tier = currentTier(S);
  if (tier !== sim.lastTier) {
    const from = sim.lastTier;
    sim.lastTier = tier;
    addNotification('status', tier === 'normal' ? 'info' : tier, { from, to: tier, level_cm: Math.round(latest.level_cm) });
  }

  // The condition that shows the Home suggestion banner is met (a new suggestion, or a different one).
  const suggestion = currentSuggestion(S);
  const key = suggestionKey(suggestion);
  if (key !== sim.lastSuggestion) {
    sim.lastSuggestion = key;
    if (suggestion) {
      addNotification('suggestion', suggestion.kind === 'raise' ? suggestion.level : 'info', {
        kind: suggestion.kind,
        level: suggestion.level,
        level_cm: Math.round(latest.level_cm),
      });
    }
  }

  // The reading became Stale or Offline (Watch for Stale, Warning for Offline).
  const fresh = freshnessFor(S.station.last_seen, Date.now(), S.station.expected_interval_s, S.settings).state;
  if (fresh !== sim.lastFresh) {
    sim.lastFresh = fresh;
    if (fresh === 'stale') addNotification('sensor', 'watch', { event: 'stale' });
    if (fresh === 'offline') addNotification('sensor', 'warning', { event: 'offline' });
  }
}
