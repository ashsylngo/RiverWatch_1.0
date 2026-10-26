// CSV helpers. Everything runs locally in the browser. No network.
import t from '../strings/en.js';
import { fileStamp } from './time.js';
import { normalizePhone } from './phone.js';

const MAX_ROWS = 2000;
export const MAX_CSV_BYTES = 1024 * 1024;

/** Parse CSV text into an array of rows (arrays of strings). Handles quotes, CRLF and a BOM. */
export function parseCsv(text) {
  const src = text.replace(/^﻿/, '');
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') { cell += '"'; i += 1; } else inQuotes = false;
      } else cell += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i += 1;
      row.push(cell); cell = '';
      rows.push(row); row = [];
    } else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

/** Guard against spreadsheet formula injection when a cell starts with = + - @ */
const safeCell = (v) => {
  const s = v == null ? '' : String(v);
  return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
};
const quote = (v) => {
  const s = safeCell(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const toCsv = (rows) => rows.map((r) => r.map(quote).join(',')).join('\r\n');

/** Download a CSV built in the browser (a blob URL, not a network request). */
export function downloadCsv(baseName, rows) {
  const blob = new Blob([`﻿${toCsv(rows)}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${baseName}-${fileStamp(Date.now())}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const isValidPurok = (n) => Number.isInteger(n) && n >= 1 && n <= 6;

/**
 * Parse resident CSV text. Headers: name,address,purok,phone.
 * Returns { valid: [...], errors: [{ line, message }], total }.
 */
export function parseResidentsCsv(text, defaultAddress) {
  const rows = parseCsv(text);
  if (rows.length === 0) return { valid: [], errors: [{ line: 1, message: t.csv.empty }], total: 0 };
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = {
    name: header.indexOf('name'),
    address: header.indexOf('address'),
    purok: header.indexOf('purok'),
    phone: header.indexOf('phone'),
  };
  if (idx.name < 0 || idx.purok < 0 || idx.phone < 0) {
    return { valid: [], errors: [{ line: 1, message: t.csv.badHeader }], total: 0 };
  }
  const body = rows.slice(1, MAX_ROWS + 1);
  const valid = [];
  const errors = [];
  body.forEach((r, i) => {
    const line = i + 2;
    const name = (r[idx.name] ?? '').trim();
    const purok = Number.parseInt((r[idx.purok] ?? '').trim(), 10);
    const phone = normalizePhone(r[idx.phone]);
    const address = idx.address >= 0 ? (r[idx.address] ?? '').trim() : '';
    const problems = [];
    if (!name) problems.push(t.csv.missingName);
    else if (name.length > 80) problems.push(t.csv.nameTooLong);
    if (!isValidPurok(purok)) problems.push(t.csv.badPurok);
    if (!phone) problems.push(t.csv.badPhone);
    if (problems.length) errors.push({ line, message: problems.join(' ') });
    else valid.push({ name, address: address || defaultAddress(purok), purok, phone });
  });
  if (rows.length - 1 > MAX_ROWS) errors.push({ line: MAX_ROWS + 2, message: t.csv.tooManyRows(MAX_ROWS) });
  return { valid, errors, total: body.length };
}
