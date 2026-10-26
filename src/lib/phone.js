// Phone helpers. Numbers are shown masked in tables.

/** 11 digits starting with 09, after removing spaces, dashes and brackets. Returns digits or null. */
export function normalizePhone(value) {
  const digits = String(value ?? '').replace(/[\s\-().]/g, '');
  return /^09\d{9}$/.test(digits) ? digits : null;
}

/** "09•• ••• 1234": only the last four characters are shown. Works for masked placeholders too. */
export function maskPhone(value) {
  const compact = String(value ?? '').replace(/\s+/g, '');
  const last4 = compact.slice(-4);
  return `09•• ••• ${last4}`;
}
