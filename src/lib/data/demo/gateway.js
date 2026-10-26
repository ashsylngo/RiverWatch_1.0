// SIMULATED SMS gateway. No real SMS is ever sent and there is no network path.
// On send, one delivery row per recipient is created as `queued`, moved to `sent` after a short random
// delay, then to `delivered`. A seeded ~5% fraction goes to `failed`, is retried once, and then becomes
// `delivered` or stays `failed`. Alert counts update as rows change.
import { getState, notify, persist } from './store.js';
import { mulberry32, shuffle } from './prng.js';
import { recipientsForFilter } from './generator.js';

let jobs = [];
let timer = null;
let sequence = 0;

const rand = (rng, min, max) => min + rng() * (max - min);

function recount(alert, rows) {
  alert.delivered_count = rows.filter((r) => r.status === 'delivered').length;
  alert.failed_count = rows.filter((r) => r.status === 'failed').length;
}

function processJobs() {
  const nowMs = Date.now();
  let changed = false;
  for (const job of jobs) {
    let touched = false;
    while (job.steps.length && job.steps[0].at <= nowMs) {
      const step = job.steps.shift();
      job.row.status = step.status;
      job.row.attempts = step.attempts;
      job.row.updated_at = new Date(step.at).toISOString();
      touched = true;
    }
    if (touched) {
      recount(job.alert, job.rows);
      changed = true;
    }
  }
  const before = jobs.length;
  jobs = jobs.filter((j) => j.steps.length > 0);
  if (changed) notify('alerts');
  if (jobs.length === 0 && timer) {
    clearInterval(timer);
    timer = null;
    if (before > 0) persist();
  }
}

/** Stop all simulated deliveries (used by Reset demo). */
export function resetGateway() {
  jobs = [];
  if (timer) clearInterval(timer);
  timer = null;
}

/**
 * Simulated send. `payload`: { level, language, message, evacuation_text, disaster_info,
 * hotline_ids, recipient_filter } or { test_to_self: true, message, ... }.
 * Returns the new alert id. Throws if there is nobody to send to.
 */
export function sendSimulated(payload) {
  const S = getState();
  const toSelf = payload.recipient_filter === 'demo_official';
  const recipients = toSelf ? [S.demoOfficial] : recipientsForFilter(S.residents, payload.recipient_filter);
  if (recipients.length === 0) throw new Error('No recipients');
  if (!payload.message || !payload.message.trim()) throw new Error('Empty message');

  sequence += 1;
  const rng = mulberry32(5000 + sequence);
  const nowMs = Date.now();
  const id = `al-u${nowMs.toString(36)}${sequence}`;
  const alert = {
    id,
    level: toSelf ? 'test' : payload.level,
    created_at: new Date(nowMs).toISOString(),
    sent_at: new Date(nowMs).toISOString(),
    sent_by: S.demoOfficial.name,
    language: payload.language,
    message: payload.message,
    evacuation_text: payload.evacuation_text,
    disaster_info: payload.disaster_info,
    hotline_ids: payload.hotline_ids,
    recipient_filter: payload.recipient_filter,
    recipient_count: recipients.length,
    delivered_count: 0,
    failed_count: 0,
  };

  const rows = recipients.map((r) => ({
    id: `sd-${id}-${r.id}`,
    alert_id: id,
    resident_id: r.id,
    status: 'queued',
    attempts: 0,
    updated_at: alert.sent_at,
  }));

  // Seeded failures: about 5% of recipients, at least one when there are 10 or more.
  const failCount = recipients.length >= 10 ? Math.max(1, Math.round(recipients.length * 0.05)) : 0;
  const failing = new Set(shuffle(rows.map((_, i) => i), rng).slice(0, failCount));
  let failureIndex = 0;

  rows.forEach((row, i) => {
    const sentAt = nowMs + rand(rng, 400, 2600);
    const steps = [{ at: sentAt, status: 'sent', attempts: 1 }];
    if (failing.has(i)) {
      const failedAt = sentAt + rand(rng, 500, 1700);
      steps.push({ at: failedAt, status: 'failed', attempts: 1 });
      steps.push({ at: failedAt + 1400, status: 'sent', attempts: 2 });
      // The first failure is delivered on retry; the next stays failed.
      steps.push({ at: failedAt + 2600, status: failureIndex % 2 === 0 ? 'delivered' : 'failed', attempts: 2 });
      failureIndex += 1;
    } else {
      steps.push({ at: sentAt + rand(rng, 300, 1800), status: 'delivered', attempts: 1 });
    }
    jobs.push({ alert, rows, row, steps });
  });

  S.alerts.push(alert);
  S.deliveries.push(...rows);
  persist();
  if (!timer) timer = setInterval(processJobs, 200);
  notify('alerts');
  return id;
}
