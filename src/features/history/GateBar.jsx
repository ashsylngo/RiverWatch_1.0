// Hydraulic gate status bar: always visible at the bottom of the History tab. DISPLAY ONLY.
// There is no open, close or reconfigure control anywhere in this component.
import { useState } from 'react';
import { getGate } from '../../lib/data/index.js';
import { useData } from '../../lib/useData.js';
import { useNow } from '../../lib/useNow.js';
import { freshnessFor } from '../../lib/status.js';
import { formatAge, formatDateTime, timeAgo } from '../../lib/time.js';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { FreshnessBadge, GateStateBadge } from '../../components/ui/Badge.jsx';
import { Spinner, ErrorState } from '../../components/ui/States.jsx';
import GateTimeline from './GateTimeline.jsx';
import t from '../../strings/en.js';

function Body({ d }) {
  const now = useNow();
  const [all, setAll] = useState(false);
  const fresh = freshnessFor(d.gate.last_seen, now, d.expectedIntervalS, d.settings);
  const recent = d.events.slice(0, 5);
  const dim = fresh.state !== 'live';
  return (
    <>
      <div className="gatebar-main">
        <div className={`gatebar-state ${dim ? 'is-dim' : ''}`}>
          <GateStateBadge state={d.gate.state} large />
        </div>
        <div className="gatebar-info">
          <div className="level-meta">
            <FreshnessBadge state={fresh.state} />
            <span>{t.gate.updated(formatAge(fresh.ageMs))}</span>
            <span className="chip chip-note">{t.gate.displayOnly}</span>
          </div>
          <p className="small">
            {t.gate.lastChanged}
            {': '}
            {`${formatDateTime(d.gate.changed_at)} (${timeAgo(d.gate.changed_at, now)})`}
          </p>
          {dim ? (
            <p className={`notice ${fresh.state === 'stale' ? 'notice-stale' : 'notice-off'}`}>
              <Icon name={fresh.state === 'stale' ? 'clock' : 'offline'} size={16} />
              {fresh.state === 'stale' ? t.gate.staleNote : t.gate.offlineNote}
            </p>
          ) : null}
        </div>
        <Button icon={all ? 'chevronDown' : 'chevronRight'} aria-expanded={all} aria-controls="gate-timeline" onClick={() => setAll((v) => !v)}>
          {all ? t.gate.hideAll : t.gate.viewAll(d.events.length)}
        </Button>
      </div>
      <div className="gatebar-recent">
        <h3 className="gatebar-h">{t.gate.lastFive}</h3>
        <ul className="gate-chips">
          {recent.map((e) => (
            <li key={e.id} className="gate-chip">
              <GateStateBadge state={e.state} />
              <span className="gate-chip-time">{formatDateTime(e.occurred_at)}</span>
              <span className="muted small">{t.gate.chipLevel(e.level_cm)}</span>
            </li>
          ))}
        </ul>
      </div>
      {all ? (
        <div id="gate-timeline" className="gatebar-full">
          <h3 className="gatebar-h">{t.gate.fullTimeline(d.events.length)}</h3>
          <GateTimeline events={d.events} />
        </div>
      ) : null}
    </>
  );
}

export default function GateBar() {
  const state = useData(() => getGate(), ['gate', 'readings']);
  return (
    <section className="gatebar" aria-label={t.gate.barLabel}>
      <h2 className="gatebar-title">{t.gate.title}</h2>
      {state.status === 'error' ? <ErrorState onRetry={state.reload} />
        : state.status === 'loading' && !state.data ? <Spinner />
        : <Body d={state.data} />}
    </section>
  );
}
