// One shared one-second clock for the whole app (top bar, ages, freshness).
import { useSyncExternalStore } from 'react';

let now = Date.now();
let timer = null;
const subs = new Set();

function subscribe(fn) {
  subs.add(fn);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      subs.forEach((f) => f());
    }, 1000);
  }
  return () => {
    subs.delete(fn);
    if (subs.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export function useNow() {
  return useSyncExternalStore(subscribe, () => now);
}
