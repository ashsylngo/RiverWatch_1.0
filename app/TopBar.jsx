import { Seal } from './Logo.jsx';
import LanguageToggle from './LanguageToggle.jsx';
import { brand } from './brand.js';
import { getBarangay } from '../lib/data/index.js';
import { useNow } from '../lib/useNow.js';
import { useLocale } from '../lib/i18n.jsx';
import { formatClock, formatDateLong } from '../lib/time.js';

export default function TopBar() {
  const now = useNow();
  const { t, lang } = useLocale();
  const b = getBarangay();
  return (
    <header className="topbar">
      <div className="topbar-place">
        <Seal src={brand.seal} />
        <span className="place-name">{`${b.name}, ${b.municipality}, ${b.province}`}</span>
      </div>
      <div className="topbar-controls">
        <div className="topbar-time" role="timer" aria-label={t.topbar.timeLabel}>
          <span className="clock">{formatClock(now, lang)}</span>
          <span className="date">{formatDateLong(now, lang)}</span>
        </div>
        <LanguageToggle />
        {/* Room for the notification bell (a 40 px button at the far right), added in step 5 (B3). */}
        <span className="topbar-bell-slot" aria-hidden="true" />
      </div>
    </header>
  );
}
