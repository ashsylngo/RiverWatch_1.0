// Hydraulic gate: DISPLAY ONLY. There is no control here that opens, closes or reconfigures the gate.
import Card from '../../components/ui/Card.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { FreshnessBadge, GateStateBadge } from '../../components/ui/Badge.jsx';
import { formatAge, formatDateTime, timeAgo } from '../../lib/time.js';
import { useLocale } from '../../lib/i18n.jsx';

export default function GateCard({ gate, lastEvent, fresh, now }) {
  const { t, lang } = useLocale();
  const dim = fresh.state !== 'live';
  return (
    <Card title={t.gate.title} actions={<span className="chip chip-note">{t.gate.displayOnly}</span>}>
      <div className={`gate-row ${dim ? 'is-dim' : ''}`}>
        <GateStateBadge state={gate.state} large />
      </div>
      <div className="level-meta">
        <FreshnessBadge state={fresh.state} />
        <span>{t.gate.updated(formatAge(fresh.ageMs, t))}</span>
      </div>
      {dim ? (
        <p className={`notice ${fresh.state === 'stale' ? 'notice-stale' : 'notice-off'}`}>
          <Icon name={fresh.state === 'stale' ? 'clock' : 'offline'} size={16} />
          {fresh.state === 'stale' ? t.gate.staleNote : t.gate.offlineNote}
        </p>
      ) : null}
      <dl className="kv">
        <dt>{t.gate.lastChanged}</dt>
        <dd>{`${formatDateTime(gate.changed_at, lang)} (${timeAgo(gate.changed_at, now, t)})`}</dd>
        {lastEvent ? (
          <>
            <dt>{t.gate.lastNote}</dt>
            <dd>{lastEvent.note_key ? t.gate.notes[lastEvent.note_key] : lastEvent.note}</dd>
          </>
        ) : null}
      </dl>
    </Card>
  );
}
