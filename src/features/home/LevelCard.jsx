import Card from '../../components/ui/Card.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { FreshnessBadge, StatusBadge } from '../../components/ui/Badge.jsx';
import { formatAge, formatShortTime } from '../../lib/time.js';
import t from '../../strings/en.js';

export default function LevelCard({ d, tier, fresh }) {
  const s = d.settings;
  const dim = fresh.state !== 'live';
  return (
    <Card title={t.home.level.title}>
      <div className={`level ${dim ? 'is-dim' : ''}`}>
        <div className="level-value">
          <span className="level-num">{Math.round(d.latest.level_cm)}</span>
          <span className="level-unit">{t.home.level.unit}</span>
        </div>
        <div className="level-status">
          <span className="level-status-label">{t.home.level.statusLabel}</span>
          <StatusBadge tier={tier} large />
        </div>
      </div>
      <div className="level-meta">
        <FreshnessBadge state={fresh.state} />
        <span>{t.home.level.updated(formatAge(fresh.ageMs), formatShortTime(d.station.last_seen))}</span>
      </div>
      {fresh.state === 'stale' ? (
        <p className="notice notice-stale"><Icon name="clock" size={16} />{t.home.level.staleNote}</p>
      ) : null}
      {fresh.state === 'offline' ? (
        <p className="notice notice-off"><Icon name="offline" size={16} />{t.home.level.offlineNote}</p>
      ) : null}
      <p className="muted small">
        {t.home.level.thresholds(s.watch_cm, s.warning_cm, s.critical_cm)}
        {s.is_confirmed ? '' : ` ${t.home.level.unconfirmed}`}
      </p>
    </Card>
  );
}
