import Table from '../../components/ui/Table.jsx';
import { GateStateBadge } from '../../components/ui/Badge.jsx';
import { formatDateTime } from '../../lib/time.js';
import { useLocale } from '../../lib/i18n.jsx';

export default function GateTimeline({ events }) {
  const { t, lang, num } = useLocale();
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
              <td className="nowrap">{formatDateTime(e.occurred_at, lang)}</td>
              <td><GateStateBadge state={e.state} /></td>
              <td>{num(e.level_cm)}</td>
              <td>{e.note_key ? t.gate.notes[e.note_key] : e.note}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
