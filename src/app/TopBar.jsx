import { Seal } from './Logo.jsx';
import { brand } from './brand.js';
import { getBarangay } from '../lib/data/index.js';
import { useNow } from '../lib/useNow.js';
import { formatClock, formatDateLong } from '../lib/time.js';
import t from '../strings/en.js';

export default function TopBar() {
  const now = useNow();
  const b = getBarangay();
  return (
    <header className="topbar">
      <div className="topbar-place">
        <Seal src={brand.seal} />
        <span className="place-name">{`${b.name}, ${b.municipality}, ${b.province}`}</span>
      </div>
      <div className="topbar-time" role="timer" aria-label={t.topbar.timeLabel}>
        <span className="clock">{formatClock(now)}</span>
        <span className="date">{formatDateLong(now)}</span>
      </div>
    </header>
  );
}
