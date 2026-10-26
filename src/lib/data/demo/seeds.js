// Static seed data. Everything here is synthetic or a placeholder.
// Field names follow PLAN.md Section 10.
// Hotlines, evacuation centers and resident names are PLACEHOLDERS to be replaced with verified real values.

export const barangay = {
  name: 'Brgy. Maligaya',
  municipality: 'Rosario',
  province: 'Batangas',
  seal_path: null,
};

// Defaults, pending confirmation. Read from here through the data layer, never hard-coded elsewhere.
export const settings = {
  watch_cm: 100,
  warning_cm: 150,
  critical_cm: 200,
  stale_multiplier: 3,
  heartbeat_limit_s: 600,
  is_confirmed: false,
};

export const stationBase = {
  id: 'st-1',
  name: 'Station 1, River Bridge',
  sensor_id: 'RW-DEMO-01',
  expected_interval_s: 60,
  battery_pct: 82,
  signal_pct: 71,
  camera_ok: true,
};

export const gateBase = { id: 'gate-1', name: 'Gate 1' };

const NUMBER = '0000 000 0000 (placeholder)';
export const hotlines = [
  { id: 'hl-1', name: 'Brgy. Maligaya BDRRMC (placeholder)', number: NUMBER, kind: 'barangay', active: true },
  { id: 'hl-2', name: 'Rosario MDRRMO (placeholder)', number: NUMBER, kind: 'mdrrmo', active: true },
  { id: 'hl-3', name: 'Bureau of Fire Protection (placeholder)', number: NUMBER, kind: 'fire', active: true },
  { id: 'hl-4', name: 'Philippine National Police (placeholder)', number: NUMBER, kind: 'police', active: true },
  { id: 'hl-5', name: 'Rural Health Unit (placeholder)', number: NUMBER, kind: 'health', active: true },
  { id: 'hl-6', name: 'Philippine Red Cross (placeholder)', number: NUMBER, kind: 'redcross', active: true },
];

export const evacuationCenters = [
  { id: 'ev-1', name: 'Barangay Multi-purpose Hall (placeholder)', notes: 'Placeholder' },
  { id: 'ev-2', name: 'Elementary School Gym (placeholder)', notes: 'Placeholder' },
  { id: 'ev-3', name: 'Barangay Covered Court (placeholder)', notes: 'Placeholder' },
];

// Masked placeholder number for "Send test to myself".
export const demoOfficial = { id: 'demo-official', name: 'Demo Official', phone: '09XX XXX 9999', purok: 0, active: true };

// SMS templates. The Filipino wording is a draft to be reviewed.
export const alertTemplates = [
  {
    level: 'watch', language: 'en',
    body: '{BARANGAY} FLOOD WATCH: River level is {LEVEL_CM} cm ({LEVEL_LABEL}). {DISASTER_INFO} Stay alert. Hotlines: {HOTLINES}',
    default_disaster_info: 'River level is rising due to rain.',
  },
  {
    level: 'watch', language: 'fil',
    body: 'BABALA SA BAHA, {BARANGAY}: Antas ng ilog {LEVEL_CM} cm ({LEVEL_LABEL}). {DISASTER_INFO} Maging handa. Hotline: {HOTLINES}',
    default_disaster_info: 'Tumataas ang antas ng ilog dahil sa ulan.',
  },
  {
    level: 'warning', language: 'en',
    body: '{BARANGAY} FLOOD WARNING: River level is {LEVEL_CM} cm ({LEVEL_LABEL}). {DISASTER_INFO} Prepare to evacuate to {EVAC_LOCATION}. Hotlines: {HOTLINES}',
    default_disaster_info: 'River level is high and may flood the bridge and road.',
  },
  {
    level: 'warning', language: 'fil',
    body: 'BABALA SA BAHA, {BARANGAY}: Antas ng ilog {LEVEL_CM} cm ({LEVEL_LABEL}). {DISASTER_INFO} Maghanda sa paglikas sa {EVAC_LOCATION}. Hotline: {HOTLINES}',
    default_disaster_info: 'Mataas ang antas ng ilog at maaaring bahain ang tulay at kalsada.',
  },
  {
    level: 'critical', language: 'en',
    body: '{BARANGAY} CRITICAL FLOOD ALERT: River level is {LEVEL_CM} cm ({LEVEL_LABEL}). {DISASTER_INFO} EVACUATE NOW to {EVAC_LOCATION}. Hotlines: {HOTLINES}',
    default_disaster_info: 'River has reached a dangerous level. Flooding is happening or imminent.',
  },
  {
    level: 'critical', language: 'fil',
    body: 'KRITIKAL NA BAHA, {BARANGAY}: Antas ng ilog {LEVEL_CM} cm ({LEVEL_LABEL}). {DISASTER_INFO} LUMIKAS NA sa {EVAC_LOCATION}. Hotline: {HOTLINES}',
    default_disaster_info: 'Umabot na sa mapanganib na antas ang ilog. Nagaganap o malapit nang maganap ang pagbaha.',
  },
  {
    level: 'all_clear', language: 'en',
    body: '{BARANGAY} ALL CLEAR: River level is back to {LEVEL_CM} cm ({LEVEL_LABEL}). {DISASTER_INFO} Stay updated. Hotlines: {HOTLINES}',
    default_disaster_info: 'River level has gone down.',
  },
  {
    level: 'all_clear', language: 'fil',
    body: 'WALA NANG BANTA, {BARANGAY}: Bumalik sa {LEVEL_CM} cm ({LEVEL_LABEL}) ang antas ng ilog. {DISASTER_INFO} Manatiling alerto. Hotline: {HOTLINES}',
    default_disaster_info: 'Bumaba na ang antas ng ilog.',
  },
  {
    level: 'test', language: 'en',
    body: '{BARANGAY} TEST MESSAGE from RiverWatch. This is only a test. No action needed.',
    default_disaster_info: '',
  },
  {
    level: 'test', language: 'fil',
    body: 'PAGSUBOK mula sa RiverWatch, {BARANGAY}. Pagsubok lamang ito. Walang kailangang gawin.',
    default_disaster_info: '',
  },
];
