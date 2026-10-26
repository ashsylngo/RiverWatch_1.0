// Simulated live stream and demo scenarios. Nothing here talks to hardware.
// The gate is display-only: the only way its simulated state changes is a Demo tools scenario.
import { getState, notify, persist } from './store.js';
import { tierFor } from '../../status.js';

const RISE_SECONDS = 30;
const FALL_SECONDS = 20;
const READINGS_CAP = 2000; // live readings kept in memory on top of the seeds

const round1 = (n) => Math.round(n * 10) / 10;

function recordReading() {
  const S = getState();
  const sim = S.sim;
  const level = round1(sim.level);
  const nowIso = new Date().toISOString();
  sim.counter += 1;
  S.readings.push({
    id: `rd-live-${sim.counter}`,
    station_id: S.station.id,
    recorded_at: nowIso,
    level_cm: level,
    status: tierFor(level, S.settings),
  });
  if (S.readings.length - S.seedReadingCount > READINGS_CAP) S.readings.splice(S.seedReadingCount, 1);
  S.station.last_seen = nowIso;
  S.gate.last_seen = nowIso;
  S.station.signal_pct = 69 + Math.floor(sim.rng() * 5);
}

function addGateEvent(state, note, byUser) {
  const S = getState();
  const nowIso = new Date().toISOString();
  S.sim.counter += 1;
  const id = `${byUser ? 'ge-u' : 'ge-s'}${Date.now().toString(36)}${S.sim.counter}`;
  S.gateEvents.push({
    id,
    gate_id: S.gate.id,
    state,
    occurred_at: nowIso,
    level_cm: round1(S.sim.level),
    note,
  });
  S.gate.state = state;
  S.gate.changed_at = nowIso;
  if (byUser) persist();
  notify('gate');
}

function autoGate() {
  const S = getState();
  const sim = S.sim;
  if (sim.mode === 'ramp' && S.gate.state === 'open' && sim.level >= S.settings.warning_cm) {
    sim.autoClosed = true;
    addGateEvent('closed', 'Simulated: closed when the level reached Warning (River rising scenario)', false);
  } else if (sim.mode === 'fall' && sim.autoClosed && S.gate.state === 'closed' && sim.level < S.settings.watch_cm) {
    sim.autoClosed = false;
    addGateEvent('open', 'Simulated: reopened when the level fell below Watch (Back to normal scenario)', false);
  }
}

/** One tick per second. The baseline stream emits every 5 s; a scenario emits every second. */
export function tick() {
  const S = getState();
  if (!S) return;
  const sim = S.sim;
  sim.secs += 1;
  let moved = false;

  if (sim.mode === 'ramp' || sim.mode === 'fall') {
    sim.t += 1;
    const p = Math.min(1, sim.t / sim.dur);
    const wobble = p < 1 ? (sim.rng() - 0.5) * 1.6 : 0;
    sim.level = sim.from + (sim.to - sim.from) * p + wobble;
    if (p >= 1) {
      sim.target = sim.to;
      sim.mode = 'idle';
    }
    moved = true;
  } else if (sim.secs % 5 === 0) {
    sim.level += (sim.target - sim.level) * 0.25 + (sim.rng() - 0.5) * 1.4;
    moved = true;
  }
  if (!moved) return;

  autoGate();
  if (sim.sensorMode === 'live') {
    recordReading();
    notify('readings', 'gate', 'station', 'sim');
  } else {
    // The sensor is silent: nothing is recorded and last_seen is not updated.
    notify('sim');
  }
}

export function startSimulator() {
  if (globalThis.__riverwatchTimer) clearInterval(globalThis.__riverwatchTimer);
  globalThis.__riverwatchTimer = setInterval(tick, 1000);
}

/** Scenario: River rising. Ramps from the current level to just above Critical in about 30 s. */
export function startRiverRising() {
  const S = getState();
  const sim = S.sim;
  const to = S.settings.critical_cm + 15;
  if (sim.level >= to) return;
  Object.assign(sim, { mode: 'ramp', t: 0, dur: RISE_SECONDS, from: sim.level, to, autoClosed: false });
  notify('sim');
}

/** Scenario: Back to normal. The level falls to the starting baseline in about 20 s. */
export function startBackToNormal() {
  const S = getState();
  const sim = S.sim;
  Object.assign(sim, { mode: 'fall', t: 0, dur: FALL_SECONDS, from: sim.level, to: sim.base });
  notify('sim');
}

/** Scenario: Sensor goes silent. 'stale' and 'offline' jump the reading age; 'live' restores. */
export function setSensorMode(mode) {
  const S = getState();
  const nowMs = Date.now();
  const { stale_multiplier, heartbeat_limit_s } = S.settings;
  S.sim.sensorMode = mode;
  if (mode === 'stale') {
    const ageMs = (stale_multiplier * S.station.expected_interval_s + 20) * 1000;
    S.station.last_seen = new Date(nowMs - ageMs).toISOString();
    S.gate.last_seen = S.station.last_seen;
  } else if (mode === 'offline') {
    const ageMs = (heartbeat_limit_s + 30) * 1000;
    S.station.last_seen = new Date(nowMs - ageMs).toISOString();
    S.gate.last_seen = S.station.last_seen;
  } else {
    recordReading();
  }
  notify('readings', 'gate', 'station', 'sim');
}

/** Scenario: Camera lost. */
export function setCameraOk(ok) {
  getState().station.camera_ok = ok;
  notify('station', 'sim');
}

/** Scenario: Gate toggle. Flips the SIMULATED gate state. The app itself has no gate control. */
export function toggleSimulatedGate() {
  const S = getState();
  const next = S.gate.state === 'open' ? 'closed' : 'open';
  S.sim.autoClosed = false;
  addGateEvent(next, 'Simulated: toggled from Demo tools', true);
}

export function setTools(patch) {
  const S = getState();
  S.tools = { ...S.tools, ...patch };
  notify('tools', 'sim');
}
