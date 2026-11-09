// The `demo` data source: reads and actions used by the screens. Everything is local and simulated.
import { getState, read, persist, notify, resetState, getDemoSnapshot as snapshotFn } from './store.js';
import { sendSimulated, resetGateway } from './gateway.js';
import { recipientsForFilter } from './generator.js';

const HOUR = 3600 * 1000;
const RANGES = { '24h': 24, '7d': 168, '30d': 720 };

const latestReading = (S) => S.readings[S.readings.length - 1];
const bySentDesc = (a, b) => Date.parse(b.sent_at) - Date.parse(a.sent_at);

function lastRealAlert(S) {
  return S.alerts.filter((a) => a.level !== 'test').sort(bySentDesc)[0] ?? null;
}

// ---- Reads ---------------------------------------------------------------------------------

export const getBarangay = () => ({ ...getState().barangay });
export const getDemoSnapshot = snapshotFn;

export function getHome() {
  return read(() => {
    const S = getState();
    const latest = latestReading(S);
    const end = Date.parse(latest.recorded_at);
    const since = end - 6 * HOUR;
    const series = [];
    for (let i = S.readings.length - 1; i >= 0; i -= 1) {
      const t = Date.parse(S.readings[i].recorded_at);
      if (t < since) break;
      series.push({ t, level_cm: S.readings[i].level_cm });
    }
    series.reverse();
    const lastEvent = S.gateEvents[S.gateEvents.length - 1];
    return {
      barangay: { ...S.barangay },
      settings: { ...S.settings },
      station: { ...S.station },
      latest: { ...latest },
      series,
      gate: { ...S.gate },
      gateLastEvent: lastEvent ? { ...lastEvent } : null,
      lastAlert: lastRealAlert(S) ? { ...lastRealAlert(S) } : null,
    };
  });
}

export function getResidents() {
  return read(() => {
    const S = getState();
    return { barangay: { ...S.barangay }, residents: S.residents.map((r) => ({ ...r })) };
  });
}

export function getAlertForm() {
  return read(() => {
    const S = getState();
    const sent = S.alerts.slice().sort(bySentDesc)[0] ?? null;
    return {
      barangay: { ...S.barangay },
      settings: { ...S.settings },
      latest: { ...latestReading(S) },
      station: { ...S.station },
      hotlines: S.hotlines.filter((h) => h.active).map((h) => ({ ...h })),
      evacuationCenters: S.evacuationCenters.map((e) => ({ ...e })),
      templates: S.alertTemplates.map((t) => ({ ...t })),
      residents: S.residents.map((r) => ({ id: r.id, purok: r.purok, active: r.active })),
      lastSent: sent ? { ...sent } : null,
      lastAlert: lastRealAlert(S) ? { ...lastRealAlert(S) } : null,
      demoOfficial: { ...S.demoOfficial },
    };
  });
}

export function getAlertDetail(id) {
  return read(() => {
    const S = getState();
    const alert = S.alerts.find((a) => a.id === id);
    if (!alert) return null;
    const people = new Map(S.residents.map((r) => [r.id, r]));
    people.set(S.demoOfficial.id, S.demoOfficial);
    const rows = S.deliveries
      .filter((d) => d.alert_id === id)
      .map((d) => {
        const p = people.get(d.resident_id);
        return { ...d, name: p ? p.name : null, phone: p ? p.phone : null };
      });
    const hotlines = S.hotlines.filter((h) => alert.hotline_ids.includes(h.id)).map((h) => ({ ...h }));
    return { alert: { ...alert }, deliveries: rows, hotlines };
  });
}

export function getHistory(range) {
  return read(() => {
    const S = getState();
    const nowMs = Date.now();
    const since = nowMs - (RANGES[range] ?? 24) * HOUR;
    const readings = S.readings
      .filter((r) => Date.parse(r.recorded_at) >= since)
      .map((r) => ({ id: r.id, t: Date.parse(r.recorded_at), recorded_at: r.recorded_at, level_cm: r.level_cm, status: r.status }));
    const alerts = S.alerts.filter((a) => Date.parse(a.sent_at) >= since).map((a) => ({ id: a.id, level: a.level }));
    return { range, since, until: nowMs, settings: { ...S.settings }, readings, alerts };
  });
}

export function getAlertsLog() {
  return read(() => {
    const S = getState();
    return { alerts: S.alerts.slice().sort(bySentDesc).map((a) => ({ ...a })) };
  });
}

export function getGate() {
  return read(() => {
    const S = getState();
    return {
      settings: { ...S.settings },
      expectedIntervalS: S.station.expected_interval_s,
      gate: { ...S.gate },
      events: S.gateEvents.slice().sort((a, b) => Date.parse(b.occurred_at) - Date.parse(a.occurred_at)).map((e) => ({ ...e })),
    };
  });
}

// ---- Actions (resident and alert data go through the same delay and error wrapper) ----------

const clean = (v, max) => String(v ?? '').trim().slice(0, max);
const newId = () => `r-u${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;

export function addResident(input) {
  return read(() => {
    const S = getState();
    const r = {
      id: newId(),
      name: clean(input.name, 80),
      address: clean(input.address, 120),
      purok: Number(input.purok),
      phone: clean(input.phone, 20),
      active: input.active !== false,
      created_at: new Date().toISOString(),
    };
    S.residents.push(r);
    persist();
    notify('residents');
    return r.id;
  });
}

export function updateResident(id, patch) {
  return read(() => {
    const S = getState();
    const r = S.residents.find((x) => x.id === id);
    if (!r) throw new Error('Resident not found');
    if ('name' in patch) r.name = clean(patch.name, 80);
    if ('address' in patch) r.address = clean(patch.address, 120);
    if ('purok' in patch) r.purok = Number(patch.purok);
    if ('phone' in patch) r.phone = clean(patch.phone, 20);
    if ('active' in patch) r.active = Boolean(patch.active);
    persist();
    notify('residents');
  });
}

export function deleteResident(id) {
  return read(() => {
    const S = getState();
    S.residents = S.residents.filter((r) => r.id !== id);
    persist();
    notify('residents');
  });
}

export function importResidents(rows) {
  return read(() => {
    const S = getState();
    const created = new Date().toISOString();
    rows.forEach((row) => {
      S.residents.push({
        id: newId(),
        name: clean(row.name, 80),
        address: clean(row.address, 120),
        purok: Number(row.purok),
        phone: clean(row.phone, 20),
        active: true,
        created_at: created,
      });
    });
    persist();
    notify('residents');
    return rows.length;
  });
}

/** Simulated send. Returns the new alert id. */
export function sendAlert(payload) {
  return read(() => sendSimulated(payload));
}

export const countRecipients = (residents, filter) => recipientsForFilter(residents, filter).length;

// ---- Demo controls (synchronous; they must keep working while the error toggle is on) -------

export function resetDemo() {
  resetGateway();
  resetState();
}
