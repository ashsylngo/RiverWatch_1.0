// Per-recipient delivery list and summary. Everything it shows is SIMULATED.
import Table from './Table.jsx';
import { DeliveryStatus } from './Badge.jsx';
import { maskPhone } from '../../lib/phone.js';
import t from '../../strings/en.js';

/** Counts for a set of delivery rows. A row is "done" when delivered, or failed after a retry. */
export function deliverySummary(rows) {
  const s = { total: rows.length, queued: 0, sent: 0, delivered: 0, failed: 0, done: 0, retried: false };
  for (const r of rows) {
    s[r.status] += 1;
    if (r.attempts > 1) s.retried = true;
    if (r.status === 'delivered' || (r.status === 'failed' && r.attempts > 1)) s.done += 1;
  }
  return s;
}

export default function DeliveryTable({ rows }) {
  return (
    <div className="delivery-scroll">
      <Table caption={t.delivery.tableCaption}>
        <thead>
          <tr>
            <th scope="col">{t.delivery.colName}</th>
            <th scope="col">{t.delivery.colPhone}</th>
            <th scope="col">{t.delivery.colStatus}</th>
            <th scope="col">{t.delivery.colAttempts}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.name ?? t.delivery.removed}</td>
              <td className="nowrap">{r.phone ? maskPhone(r.phone) : '-'}</td>
              <td><DeliveryStatus status={r.status} attempts={r.attempts} /></td>
              <td>{r.attempts}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
