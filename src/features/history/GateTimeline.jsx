import Table from '../../components/ui/Table.jsx';
import { GateStateBadge } from '../../components/ui/Badge.jsx';
import { formatDateTime } from '../../lib/time.js';
import t from '../../strings/en.js';

export default function GateTimeline({ events }) {
  if (events.length === 0) return <p className="muted">{t.gate.noEvents}</p>;
  return (
    <div className="timeline-scroll">
      <Table caption={t.gate.timelineCaption}>
        <thead>
          <tr>
            <th scope="col">{t.gate.colTime}</th>
            <th scope="col">{t.gate.colState}</th>
            <th scope="col">{t.gate.colLevel}</th>
            <th scope="col">{t.gate.colNote}</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id}>
              <td className="nowrap">{formatDateTime(e.occurred_at)}</td>
              <td><GateStateBadge state={e.state} /></td>
              <td>{e.level_cm}</td>
              <td>{e.note}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
