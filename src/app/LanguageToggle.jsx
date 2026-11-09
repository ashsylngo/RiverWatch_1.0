import { useLocale } from '../lib/i18n.jsx';

// Each button shows the short code and is named in its own language, so it reads correctly whichever language is active.
const OPTIONS = [
  { code: 'en', short: 'EN', nameKey: 'langEnName' },
  { code: 'fil', short: 'FIL', nameKey: 'langFilName' },
];

/** EN | FIL segmented control. Switches instantly, no reload. */
export default function LanguageToggle() {
  const { lang, setLang, t } = useLocale();
  return (
    <div className="seg lang-toggle" role="group" aria-label={t.topbar.languageLabel}>
      {OPTIONS.map((o) => {
        const active = lang === o.code;
        return (
          <button
            key={o.code}
            type="button"
            lang={o.code}
            className={`seg-btn ${active ? 'is-active' : ''}`}
            aria-pressed={active}
            aria-label={t.topbar[o.nameKey]}
            title={t.topbar[o.nameKey]}
            onClick={() => setLang(o.code)}
          >
            {o.short}
          </button>
        );
      })}
    </div>
  );
}
