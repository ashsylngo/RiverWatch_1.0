// Live view of a SIMULATED send: queued, sent, delivered, with failures retried once.
import { getAlertDetail } from '../../lib/data/index.js';
import { useData } from '../../lib/useData.js';
import Card from '../../components/ui/Card.jsx';
import DeliveryTable, { deliverySummary } from '../../components/ui/DeliveryTable.jsx';
import { SimulatedTag } from '../../components/ui/Badge.jsx';
import { Async, EmptyState } from '../../components/ui/States.jsx';
import t from '../../strings/en.js';

function PanelBody({ detail }) {
  if (!detail) return <EmptyState icon="info" title={t.delivery.missingTitle} text={t.delivery.missingText} />;
  const s = deliverySummary(detail.deliveries);
  const finished = s.total > 0 && s.done === s.total;
  return (
    <>
      <p className="delivery-summary" role="status">
        {finished ? t.delivery.summary(s.delivered, s.failed, s.retried) : t.delivery.progress(s.done, s.total)}
        {' '}
        <SimulatedTag />
      </p>
      <progress className="progress" max={s.total || 1} value={s.done} aria-label={t.delivery.progressLabel} />
      <ul className="count-chips">
        <li>{t.delivery.counts.queued(s.queued)}</li>
        <li>{t.delivery.counts.sent(s.sent)}</li>
        <li>{t.delivery.counts.delivered(s.delivered)}</li>
        <li>{t.delivery.counts.failed(s.failed)}</li>
      </ul>
      <DeliveryTable rows={detail.deliveries} />
    </>
  );
}

export default function DeliveryPanel({ alertId }) {
  const state = useData(() => getAlertDetail(alertId), ['alerts'], [alertId]);
  return (
    <Card title={t.delivery.title} actions={<SimulatedTag />}>
      <Async state={state}>{(detail) => <PanelBody detail={detail} />}</Async>
    </Card>
  );
}
