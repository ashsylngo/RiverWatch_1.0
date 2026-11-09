// Confirmation before any send. Shows exactly what will be sent (a snapshot taken when the dialog opened).
import { ConfirmDialog } from '../../components/ui/Modal.jsx';
import { AlertLevelBadge, SimulatedTag } from '../../components/ui/Badge.jsx';
import { useT } from '../../lib/i18n.jsx';

export default function SendDialog({ pending, busy, error, onCancel, onConfirm }) {
  const t = useT();
  return (
    <ConfirmDialog
      title={pending.toSelf ? t.alert.confirmTestTitle : t.alert.confirmTitle}
      confirmLabel={t.alert.confirmSend}
      icon="send"
      busy={busy}
      error={error}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <dl className="kv kv-wide">
        <dt>{t.alert.level}</dt>
        <dd><AlertLevelBadge level={pending.toSelf ? 'test' : pending.level} /></dd>
        <dt>{t.alert.language}</dt>
        <dd>{pending.language === 'en' ? t.alert.langEn : t.alert.langFil}</dd>
        <dt>{t.alert.recipients}</dt>
        <dd>{pending.toSelf ? t.alert.confirmSelf : t.alert.recipientCount(pending.recipientCount)}</dd>
      </dl>
      <p className="confirm-label">{t.alert.confirmMessage}</p>
      <div className="sms-bubble">{pending.message}</div>
      <p className="notice notice-sim"><SimulatedTag />{t.alert.confirmSimulated}</p>
    </ConfirmDialog>
  );
}
