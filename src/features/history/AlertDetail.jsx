// Side panel with the full record of one past alert. Everything shown was simulated.
import { getAlertDetail } from '../../lib/data/index.js';
import { useData } from '../../lib/useData.js';
import { formatDateTimeSec } from '../../lib/time.js';
import Drawer from '../../components/ui/Drawer.jsx';
import DeliveryTable, { deliverySummary } from '../../components/ui/DeliveryTable.jsx';
import { AlertLevelBadge, SimulatedTag } from '../../components/ui/Badge.jsx';
import { Async, EmptyState } from '../../components/ui/States.jsx';
import t from '../../strings/en.js';

function Body({ detail }) {
  if (!detail) return <EmptyState icon="info" title={t.delivery.missingTitle} text={t.delivery.missingText} />;
  const { alert: a, deliveries, hotlines } = detail;
  const s = deliverySummary(deliveries);
  return (
    <>
      <dl className="kv kv-wide">
        <dt>{t.history.colSent}</dt>
        <dd>{formatDateTimeSec(a.sent_at)}</dd>
        <dt>{t.history.colAlertLevel}</dt>
        <dd><AlertLevelBadge level={a.level} /></dd>
        <dt>{t.history.colLanguage}</dt>
        <dd>{a.language === 'en' ? t.alert.langEn : t.alert.langFil}</dd>
        <dt>{t.history.colSentBy}</dt>
        <dd>{a.sent_by}</dd>
        <dt>{t.history.detailRecipients}</dt>
        <dd>{t.history.detailCounts(a.recipient_count, a.delivered_count, a.failed_count)}</dd>
      </dl>

      <h3 className="detail-h">{t.history.detailMessage}</h3>
      <div className="sms-bubble">{a.message}</div>

      <h3 className="detail-h">{t.alert.evac}</h3>
      <p>{a.evacuation_text || t.history.notUsed}</p>

      <h3 className="detail-h">{t.alert.disaster}</h3>
      <p>{a.disaster_info || t.history.notUsed}</p>

      <h3 className="detail-h">{t.alert.hotlines}</h3>
      {hotlines.length ? (
        <ul className="plain-list">
          {hotlines.map((h) => <li key={h.id}>{`${h.name}: ${h.number}`}</li>)}
        </ul>
      ) : <p>{t.history.notUsed}</p>}

      <h3 className="detail-h">{t.history.detailDeliveries} <SimulatedTag /></h3>
      {deliveries.length ? (
        <>
          <p className="muted small">{t.delivery.summary(s.delivered, s.failed, s.retried)}</p>
          <DeliveryTable rows={deliveries} />
        </>
      ) : (
        <p className="muted">{t.history.countsOnly}</p>
      )}
    </>
  );
}

export default function AlertDetail({ alertId, onClose }) {
  const state = useData(() => getAlertDetail(alertId), ['alerts'], [alertId]);
  return (
    <Drawer title={t.history.detailTitle} onClose={onClose} size="lg">
      <Async state={state}>{(detail) => <Body detail={detail} />}</Async>
    </Drawer>
  );
}
