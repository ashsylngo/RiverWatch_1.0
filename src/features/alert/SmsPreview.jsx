import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import { SimulatedTag } from '../../components/ui/Badge.jsx';
import { alertLevelLabel } from '../../lib/status.js';
import { timeAgo } from '../../lib/time.js';
import t from '../../strings/en.js';

export default function SmsPreview({ d, message, segments, recipientCount, canSend, now, onSend, onSendTest }) {
  const last = d.lastSent;
  return (
    <Card title={t.alert.previewTitle} actions={<SimulatedTag />}>
      <div className="phone" aria-label={t.alert.previewLabel}>
        <div className="phone-top">{t.alert.previewFrom(d.barangay.name)}</div>
        <div className="sms-bubble">{message.trim() ? message : t.alert.previewEmpty}</div>
      </div>
      <p className="sms-meta">
        {t.alert.chars(segments.length)}
        {' · '}
        {t.alert.segments(segments.segments, segments.encoding)}
      </p>
      <p className="recipient-line">{t.alert.willSendTo(recipientCount)}</p>
      <div className="stack-actions">
        <Button variant="primary" icon="send" onClick={onSend} disabled={!canSend}>{t.alert.send}</Button>
        <Button icon="send" onClick={onSendTest} disabled={!message.trim()}>{t.alert.sendTest}</Button>
      </div>
      {!canSend && recipientCount === 0 ? <p className="field-hint">{t.alert.noRecipients}</p> : null}
      <p className="muted small last-alert">
        {last
          ? t.alert.lastSent(alertLevelLabel(last.level), timeAgo(last.sent_at, now), last.delivered_count, last.recipient_count)
          : t.alert.noneSent}
      </p>
    </Card>
  );
}
