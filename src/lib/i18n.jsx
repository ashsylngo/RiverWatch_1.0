// Language switching without an i18n library: a small context that holds the active language.
// Components call useT() (or useLocale()) for text. Helpers outside components take `t` or `lang` as an argument.
// Missing keys in fil.js fall back to English.
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import en from '../strings/en.js';
import fil from '../strings/fil.js';
import { formatNumber } from './format.js';
import { loadLang, saveLang } from './data/index.js';

/** Copy of `base` where every key present in `primary` (with the same type) uses the primary value. */
function withFallback(primary, base) {
  const out = {};
  for (const key of Object.keys(base)) {
    const b = base[key];
    const p = primary ? primary[key] : undefined;
    if (b && typeof b === 'object') out[key] = withFallback(p && typeof p === 'object' ? p : undefined, b);
    else out[key] = p !== undefined && typeof p === typeof b ? p : b;
  }
  return out;
}

/** The saved choice, else Filipino when the browser language starts with fil or tl, else English. */
function startLang() {
  const saved = loadLang();
  if (saved) return saved;
  const nav = (typeof navigator !== 'undefined' && navigator.language ? navigator.language : '').toLowerCase();
  return nav.startsWith('fil') || nav.startsWith('tl') ? 'fil' : 'en';
}

const LocaleContext = createContext({
  lang: 'en', t: en, tFor: () => en, setLang: () => {}, num: (v, o) => formatNumber(v, 'en', o),
});

export function LocaleProvider({ children }) {
  const [lang, setLangState] = useState(startLang);
  const tFil = useMemo(() => withFallback(fil, en), []);

  const setLang = useCallback((next) => {
    if (next !== 'en' && next !== 'fil') return;
    setLangState(next);
    saveLang(next);
  }, []);

  // <html lang> follows the UI language ("en" or "fil").
  useLayoutEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => {
    const tFor = (code) => (code === 'fil' ? tFil : en);
    return { lang, t: tFor(lang), tFor, setLang, num: (v, o) => formatNumber(v, lang, o) };
  }, [lang, tFil, setLang]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/** { lang, t, tFor(code), setLang, num(value) } */
export const useLocale = () => useContext(LocaleContext);
/** The strings object for the active language. */
export const useT = () => useContext(LocaleContext).t;
