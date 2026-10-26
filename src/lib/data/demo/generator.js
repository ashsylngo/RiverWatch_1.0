// Deterministic seed generator. Same shape on every load; timestamps are relative to the load time.
import { mulberry32 } from './prng.js';
import { compose, hotlinesText } from '../../sms.js';
import { tierFor, tierLabel } from '../../status.js';
import {
  barangay, settings, stationBase, gateBase, hotlines, evacuationCenters, alertTemplates,
} from './seeds.js';

const HOUR = 3600 * 1000;
const clone = (v) => JSON.parse(JSON.stringify(v));
const iso = (ms) => new Date(ms).toISOString();
const pad = (n, w) => String(n).padStart(w, '0');
const round1 = (n) => Math.round(n * 10) / 10;

// Storm events, in hours ago. Peaks are about 118, 138, 172 and 214 cm (the last about 20 days ago),
// plus a small bump that stays in the Normal range.
const STORMS = [
  { peakH: 655, peak: 111 },
  { peakH: 590, peak: 139 },
  { peakH: 533, peak: 169 },
  { peakH: 480, peak: 215.5 },
  { peakH: 74, peak: 94 },
];
const RISE_H = 5;
const FALL_H = 11;
const LOAD_TIME_LEVEL = 82;

const baseline = (h) =>
  72 + 11 * Math.sin((2 * Math.PI * h) / 24 + 1.3) + 5 * Math.sin((2 * Math.PI * h) / (24 * 6.5) + 0.4);

function stormAdd(h) {
  let add = 0;
  for (const s of STORMS) {
    const amp = s.peak - baseline(s.peakH);
    const d = h - s.peakH;
    const width = d > 0 ? RISE_H : FALL_H;
    add += amp * Math.exp(-((d / width) ** 2));
  }
  return add;
}

const loadTimeCorrection = (h) => (LOAD_TIME_LEVEL - baseline(0)) * Math.exp(-h / 8);

function generateReadings(nowMs) {
  const rng = mulberry32(20261026);
  const hoursAgo = [];
  for (let h = 720; h >= 49; h -= 1) hoursAgo.push(h); // hourly, days 30 to 2 ago
  for (let k = 288; k >= 0; k -= 1) hoursAgo.push(k / 6); // every 10 minutes, last 2 days
  return hoursAgo.map((h, i) => {
    const noise = h === 0 ? 0 : (rng() - 0.5) * 4;
    const raw = baseline(h) + stormAdd(h) + loadTimeCorrection(h) + noise;
    const level = round1(Math.min(260, Math.max(40, raw)));
    return {
      id: `rd-${i + 1}`,
      station_id: stationBase.id,
      recorded_at: iso(nowMs - h * HOUR),
      level_cm: level,
      status: tierFor(level, settings),
    };
  });
}

function nearestLevel(readings, nowMs, hAgo) {
  const target = nowMs - hAgo * HOUR;
  let best = readings[0];
  let bestD = Infinity;
  for (const r of readings) {
    const d = Math.abs(Date.parse(r.recorded_at) - target);
    if (d < bestD) { best = r; bestD = d; }
  }
  return best.level_cm;
}

// About 12 gate events: closing during storm peaks and reopening afterwards, plus two routine tests.
const GATE_PLAN = [
  [656, 'closed', 'Closed ahead of the storm peak'],
  [641, 'open', 'Reopened after the river level fell'],
  [591, 'closed', 'Closed ahead of the storm peak'],
  [576, 'open', 'Reopened after the river level fell'],
  [534, 'closed', 'Closed ahead of the storm peak'],
  [518, 'open', 'Reopened after the river level fell'],
  [481, 'closed', 'Closed during the storm peak'],
  [463, 'open', 'Reopened after the river level fell'],
  [336, 'closed', 'Routine function test: closed'],
  [335.5, 'open', 'Routine function test: reopened'],
  [216.5, 'closed', 'Routine function test: closed'],
  [216, 'open', 'Routine function test: reopened'],
];

const FIRST_NAMES = ['Maria', 'Jose', 'Ana', 'Juan', 'Liza', 'Pedro', 'Rosa', 'Carlo'];
const INACTIVE = new Set([5, 11, 18, 23, 29, 36, 42, 47]);

function generateResidents(nowMs) {
  const createdAt = iso(nowMs - 40 * 24 * HOUR);
  return Array.from({ length: 48 }, (_, i) => {
    const n = i + 1;
    const purok = Math.floor(i / 8) + 1;
    return {
      id: `r-${n}`,
      name: `${FIRST_NAMES[i % FIRST_NAMES.length]} Demo ${pad(n, 2)}`,
      address: `Purok ${purok}, ${barangay.name}`,
      purok,
      phone: `09XX XXX ${pad(n, 4)}`,
      active: !INACTIVE.has(n),
      created_at: createdAt,
    };
  });
}

// 8 past alerts matching the storm events.
const ALERT_PLAN = [
  { id: 'al-1', h: 696, level: 'test', language: 'en', filter: 'all', evac: 0, hot: ['hl-1'], failed: 1 },
  { id: 'al-2', h: 658, level: 'watch', language: 'en', filter: 'all', evac: 0, hot: ['hl-1', 'hl-2'], cm: 112, failed: 0 },
  { id: 'al-3', h: 593, level: 'watch', language: 'fil', filter: 'purok:1,2,3', evac: 0, hot: ['hl-1', 'hl-2'], cm: 131, failed: 1 },
  { id: 'al-4', h: 536, level: 'warning', language: 'en', filter: 'all', evac: 1, hot: ['hl-1', 'hl-2', 'hl-3'], cm: 165, failed: 1 },
  { id: 'al-5', h: 515, level: 'all_clear', language: 'en', filter: 'all', evac: 1, hot: ['hl-1', 'hl-2'], cm: 88, failed: 0 },
  { id: 'al-6', h: 483, level: 'critical', language: 'fil', filter: 'all', evac: 0, hot: ['hl-1', 'hl-2', 'hl-3'], cm: 208, failed: 2 },
  { id: 'al-7', h: 462, level: 'all_clear', language: 'en', filter: 'all', evac: 0, hot: ['hl-1', 'hl-2'], cm: 84, failed: 1, detail: [3, 17] },
  { id: 'al-8', h: 140, level: 'test', language: 'en', filter: 'all', evac: 0, hot: ['hl-1'], failed: 1, detail: [8, 21] },
];

export function recipientsForFilter(residents, filter) {
  const active = residents.filter((r) => r.active);
  if (filter === 'all') return active;
  if (filter.startsWith('purok:')) {
    const set = new Set(filter.slice(6).split(',').map(Number));
    return active.filter((r) => set.has(r.purok));
  }
  return [];
}

function generateAlerts(nowMs, residents) {
  const alerts = [];
  const deliveries = [];
  for (const p of ALERT_PLAN) {
    const tpl = alertTemplates.find((t) => t.level === p.level && t.language === p.language);
    const chosen = hotlines.filter((h) => p.hot.includes(h.id));
    const cm = p.cm ?? LOAD_TIME_LEVEL;
    const message = compose(tpl.body, {
      BARANGAY: barangay.name,
      LEVEL_LABEL: tierLabel(tierFor(cm, settings)),
      LEVEL_CM: cm,
      DISASTER_INFO: tpl.default_disaster_info,
      EVAC_LOCATION: evacuationCenters[p.evac].name,
      HOTLINES: hotlinesText(chosen),
    });
    const recipients = recipientsForFilter(residents, p.filter);
    const sentAt = nowMs - p.h * HOUR;
    const alert = {
      id: p.id,
      level: p.level,
      created_at: iso(sentAt - 2 * 60 * 1000),
      sent_at: iso(sentAt),
      sent_by: 'Demo Official',
      language: p.language,
      message,
      evacuation_text: evacuationCenters[p.evac].name,
      disaster_info: tpl.default_disaster_info,
      hotline_ids: p.hot,
      recipient_filter: p.filter,
      recipient_count: recipients.length,
      delivered_count: recipients.length - p.failed,
      failed_count: p.failed,
    };
    alerts.push(alert);

    if (p.detail) {
      // Per-recipient rows for the two most recent alerts. The first failed row was retried and
      // delivered; the second stayed failed after a retry.
      const [retriedOk, stayedFailed] = p.detail;
      recipients.forEach((r, i) => {
        let status = 'delivered';
        let attempts = 1;
        if (i === retriedOk) attempts = 2;
        if (i === stayedFailed) { status = 'failed'; attempts = 2; }
        deliveries.push({
          id: `sd-${p.id}-${r.id}`,
          alert_id: p.id,
          resident_id: r.id,
          status,
          attempts,
          updated_at: iso(sentAt + ((i % 7) + 1) * 1000),
        });
      });
    }
  }
  return { alerts, deliveries };
}

export function generateSeeds(nowMs) {
  const readings = generateReadings(nowMs);
  const last = readings[readings.length - 1];

  const gateEvents = GATE_PLAN.map(([h, state, note], i) => ({
    id: `ge-${i + 1}`,
    gate_id: gateBase.id,
    state,
    occurred_at: iso(nowMs - h * HOUR),
    level_cm: nearestLevel(readings, nowMs, h),
    note,
  }));
  const lastEvent = gateEvents[gateEvents.length - 1];

  const residents = generateResidents(nowMs);
  const { alerts, deliveries } = generateAlerts(nowMs, residents);

  return {
    barangay: clone(barangay),
    settings: clone(settings),
    station: { ...clone(stationBase), last_seen: last.recorded_at },
    readings,
    gate: { ...clone(gateBase), state: lastEvent.state, changed_at: lastEvent.occurred_at, last_seen: last.recorded_at },
    gateEvents,
    residents,
    hotlines: clone(hotlines),
    evacuationCenters: clone(evacuationCenters),
    alertTemplates: clone(alertTemplates),
    alerts,
    deliveries,
    baselineLevel: last.level_cm,
  };
}
