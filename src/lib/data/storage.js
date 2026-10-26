// Versioned browser storage. Every access is in try/catch.
// If storage is blocked, the app keeps working and simply does not save.
const KEY = 'riverwatch.demo.v1';
const SPLASH_KEY = `${KEY}.splash`;

let splashSeenInMemory = false;

export function loadState() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.v === 1 ? parsed : null;
  } catch {
    return null;
  }
}

export function saveState(value) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ v: 1, ...value }));
    return true;
  } catch {
    return false;
  }
}

export function clearState() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* storage blocked: nothing to clear */
  }
}

/** The splash shows once per browser session. */
export function hasSeenSplash() {
  if (splashSeenInMemory) return true;
  try {
    return window.sessionStorage.getItem(SPLASH_KEY) === '1';
  } catch {
    return false;
  }
}

export function markSplashSeen() {
  splashSeenInMemory = true;
  try {
    window.sessionStorage.setItem(SPLASH_KEY, '1');
  } catch {
    /* storage blocked: the in-memory flag is enough for this page load */
  }
}
