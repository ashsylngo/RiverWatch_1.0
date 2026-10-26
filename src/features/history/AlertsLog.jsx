import { useState } from 'react';
import { getAlertsLog } from '../../lib/data/index.js';
import { useData } from '../../lib/useData.js';
import { downloadCsv } from '../../lib/csv.js';
import { formatDateTime } from '../../lib/time.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Table from '../../components/ui/Table.jsx';
import { AlertLevelBadge } from '../../components/ui/Badge.jsx';
import { Async, EmptyState } from '../../components/ui/States.jsx';
import AlertDetail from './AlertDetail.jsx';
import t from '../../strings/en.js';

export default function AlertsLog() {
  const state = useData(() => getAlertsLog(), ['alerts']);
  const [openId, setOpenId] = useState(null);

  return (
    <Async state={state}>
      {(d) => {
        function exportCsv() {
          const rows = [['sent_at', 'level', 'language', 'recipients', 'delivered', 'failed', 'sent_by']];
          d.alerts.forEach((a) => rows.push([a.sent_at, a.level, a.language, a.recipient_count, a.delivered_count, a.failed_count, a.sent_by]));
          downloadCsv('riverwatch-alerts', rows);
        }
        return (
          <Card
            title={t.history.alertsTitle}
            actions={<Button icon="download" onClick={exportCsv} disabled={d.alerts.length === 0}>{t.history.exportCsv}</Button>}
          >
            {d.alerts.length === 0 ? (
              <EmptyState icon="message" title={t.history.alertsEmptyTitle} text={t.history.alertsEmptyText} />
            ) : (
              <Table caption={t.history.alertsCaption} className="table-clickable">
                <thead>
                  <tr>
                    <th scope="col">{t.history.colSent}</th>
                    <th scope="col">{t.history.colAlertLevel}</th>
                    <th scope="col">{t.history.colLanguage}</th>
                    <th scope="col">{t.history.colRecipients}</th>
                    <th scope="col">{t.history.colDelivered}</th>
                    <th scope="col">{t.history.colFailed}</th>
                    <th scope="col">{t.history.colSentBy}</th>
                    <th scope="col"><span className="sr-only">{t.history.colDetails}</span></th>
                  </tr>
                </thead>
                <tbody>
                  {d.alerts.map((a) => (
                    <tr key={a.id}>
                      <td>{formatDateTime(a.sent_at)}</td>
                      <td><AlertLevelBadge level={a.level} /></td>
                      <td>{a.language === 'en' ? t.alert.langEn : t.alert.langFil}</td>
                      <td>{a.recipient_count}</td>
                      <td>{a.delivered_count}</td>
                      <td>{a.failed_count}</td>
                      <td>{a.sent_by}</td>
                      <td><Button onClick={() => setOpenId(a.id)} aria-label={t.history.openDetail(formatDateTime(a.sent_at))}>{t.history.details}</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            <p className="muted small table-note">{t.history.alertsNote}</p>
            {openId ? <AlertDetail alertId={openId} onClose={() => setOpenId(null)} /> : null}
          </Card>
        );
      }}
    </Async>
  );
}
