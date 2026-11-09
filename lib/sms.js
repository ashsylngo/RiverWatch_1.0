// SMS composition and segment estimate.

const PLACEHOLDERS = ['BARANGAY', 'LEVEL_LABEL', 'LEVEL_CM', 'DISASTER_INFO', 'EVAC_LOCATION', 'HOTLINES'];

/** Replace {BARANGAY}, {LEVEL_LABEL}, {LEVEL_CM}, {DISASTER_INFO}, {EVAC_LOCATION}, {HOTLINES}. */
export function compose(template, values) {
  let out = template;
  for (const key of PLACEHOLDERS) {
    const v = values[key] == null ? '' : String(values[key]);
    out = out.split(`{${key}}`).join(v);
  }
  return out.replace(/ {2,}/g, ' ').trim();
}

/** "Name number" for each selected hotline, joined by "; ". */
export function hotlinesText(hotlines) {
  if (!hotlines.length) return '-';
  return hotlines.map((h) => `${h.name} ${h.number}`).join('; ');
}

// GSM 03.38 basic character set, and the extension table (each extension char costs 2 units).
const GSM_BASIC =
  '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\u001BÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà';
const GSM_EXT = '^{}\\[~]|€';
const BASIC_SET = new Set(GSM_BASIC);
const EXT_SET = new Set(GSM_EXT);

/**
 * Estimate only. GSM text: 160 chars for one segment, 153 per segment when longer.
 * Text with other characters: 70, then 67.
 */
export function estimateSegments(text) {
  const chars = [...text];
  let isGsm = true;
  let units = 0;
  for (const ch of chars) {
    if (BASIC_SET.has(ch)) units += 1;
    else if (EXT_SET.has(ch)) units += 2;
    else { isGsm = false; break; }
  }
  if (isGsm) {
    const segments = units === 0 ? 0 : units <= 160 ? 1 : Math.ceil(units / 153);
    return { length: chars.length, units, segments, encoding: 'gsm' };
  }
  const len = chars.length;
  const segments = len === 0 ? 0 : len <= 70 ? 1 : Math.ceil(len / 67);
  return { length: len, units: len, segments, encoding: 'unicode' };
}
