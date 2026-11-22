// Static reference data: barangay, thresholds, station, hotlines, evacuation centers and SMS templates.
// Field names follow PLAN.md Section 10.
// Hotlines and evacuation centers must be verified with the barangay and the MDRRMO before real use.

export const barangay = {
  name: 'Brgy. Maligaya',
  municipality: 'Rosario',
  province: 'Batangas',
  seal_path: null,
};

// Alert thresholds and timing limits. Read from here through the data layer, never hard-coded elsewhere.
export const settings = {
  watch_cm: 100,
  warning_cm: 150,
  critical_cm: 200,
  stale_multiplier: 3,
  heartbeat_limit_s: 600,
};

export const stationBase = {
  id: 'st-1',
  name: 'Station 1, River Bridge',
  sensor_id: 'RW-S1-001',
  expected_interval_s: 60,
  battery_pct: 82,
  signal_pct: 71,
  camera_ok: true,
};

export const gateBase = { id: 'gate-1', name: 'Gate 1' };

export const hotlines = [
  { id: 'hl-1', name: 'Brgy. Maligaya BDRRMC', number: '0917 555 0101', kind: 'barangay', active: true },
  { id: 'hl-2', name: 'Rosario MDRRMO', number: '0917 555 0102', kind: 'mdrrmo', active: true },
  { id: 'hl-3', name: 'Bureau of Fire Protection', number: '0917 555 0103', kind: 'fire', active: true },
  { id: 'hl-4', name: 'Philippine National Police', number: '911', kind: 'police', active: true },
  { id: 'hl-5', name: 'Rural Health Unit', number: '0917 555 0105', kind: 'health', active: true },
  { id: 'hl-6', name: 'Philippine Red Cross', number: '143', kind: 'redcross', active: true },
];

export const evacuationCenters = [
  { id: 'ev-1', name: 'Barangay Multi-purpose Hall', notes: 'Primary evacuation center' },
  { id: 'ev-2', name: 'Elementary School Gymnasium', notes: 'Alternate evacuation center' },
  { id: 'ev-3', name: 'Barangay Covered Court', notes: 'Alternate evacuation center' },
];

// The Barangay Official's own number, used by "Send test to myself".
export const demoOfficial = { id: 'demo-official', name: 'Barangay Official', phone: '09175550199', purok: 0, active: true };

// Status labels written into the seeded past alert messages. Seed data, so fixed English text that never follows the UI language.
export const seedLevelLabels = { normal: 'Normal', watch: 'Watch', warning: 'Warning', critical: 'Critical' };

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
