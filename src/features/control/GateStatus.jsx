// Hydraulic gate status. DISPLAY ONLY: there is no open, close or reconfigure control here or anywhere in the app.
import Card from '../../components/ui/Card.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { FreshnessBadge, GateStateBadge } from '../../components/ui/Badge.jsx';
import { formatAge, formatDateTime, timeAgo } from '../../lib/time.js';
import t from '../../strings/en.js';

export default function GateStatus({ gate, lastEvent, fresh, now }) {
  const dim = fresh.state !== 'live';
  return (
    <Card title={t.gate.title} className="gate-status" actions={<span className="chip chip-note">{t.gate.displayOnly}</span>}>
      <div className={`gate-row ${dim ? 'is-dim' : ''}`}>
        <GateStateBadge state={gate.state} large />
      </div>
      <div className="level-meta">
        <FreshnessBadge state={fresh.state} />
        <span>{t.gate.updated(formatAge(fresh.ageMs))}</span>
      </div>
      {dim ? (
        <p className={`notice ${fresh.state === 'stale' ? 'notice-stale' : 'notice-off'}`}>
          <Icon name={fresh.state === 'stale' ? 'clock' : 'offline'} size={16} />
          {fresh.state === 'stale' ? t.gate.staleNote : t.gate.offlineNote}
        </p>
      ) : null}
      <dl className="kv">
        <dt>{t.gate.lastChanged}</dt>
        <dd>{`${formatDateTime(gate.changed_at)} (${timeAgo(gate.changed_at, now)})`}</dd>
        {lastEvent ? (
          <>
            <dt>{t.gate.lastNote}</dt>
            <dd>{lastEvent.note}</dd>
          </>
        ) : null}
      </dl>
      <p className="muted small">{t.control.note}</p>
    </Card>
  );
}
