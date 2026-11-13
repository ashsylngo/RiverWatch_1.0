// The popover under the bell. In-app only: it lists system messages and sends nothing.
// Its only action is Prepare alert, which opens the Alert tab prefilled and sends nothing.
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { EmptyState } from '../../components/ui/States.jsx';
import { markNotificationsRead } from '../../lib/data/index.js';
import { useLocale } from '../../lib/i18n.jsx';
import { useNow } from '../../lib/useNow.js';
import { formatAge, formatDateTimeSec } from '../../lib/time.js';
import { SEVERITY_ICON, notificationText, severityLabel } from './notificationText.js';

function Item({ item, now, onNavigate }) {
  const { t, lang } = useLocale();
  const { title, message } = notificationText(item, t);
  const created = Date.parse(item.created_at);
  const tone = item.severity === 'info' ? 'badge-neutral' : `status-${item.severity}`;
  const navigate = useNavigate();

  return (
    <li className={`notif-item ${item.unread ? 'is-unread' : ''}`}>
      <div className="notif-head">
        <span className={`badge ${tone}`}>
          <Icon name={SEVERITY_ICON[item.severity]} size={16} />
          {severityLabel(item.severity, t)}
        </span>
        {item.unread ? (
          <span className="notif-unread">
            <span className="notif-dot" aria-hidden="true" />
            <span className="sr-only">{t.notifications.unread}</span>
          </span>
        ) : null}
      </div>
      <h3 className="notif-title">{title}</h3>
      <p className="notif-text">{message}</p>
      <p className="notif-meta small muted">
        <time dateTime={item.created_at} title={formatDateTimeSec(created, lang)}>{formatAge(now - created, t)}</time>
        <span aria-hidden="true"> · </span>
        <span>{t.common.simulated}</span>
      </p>
      {item.kind === 'suggestion' ? (
        <div className="notif-actions">
          <Button
            variant="primary"
            icon="message"
            onClick={() => { navigate(`/alert?level=${item.params.level}`); onNavigate(); }}
          >
            {t.notifications.prepare}
          </Button>
        </div>
      ) : null}
      {item.kind === 'alert_sent' ? (
        <div className="notif-actions">
          <Link className="notif-link" to="/history?tab=alerts" onClick={onNavigate}>{t.notifications.viewLog}</Link>
        </div>
      ) : null}
    </li>
  );
}

export default function NotificationPanel({ data, panelRef, onNavigate }) {
  const { t } = useLocale();
  const now = useNow();
  const ownRef = useRef(null);
  const ref = panelRef || ownRef;

  // Focus moves into the panel when it opens. The panel itself takes focus; Tab then reaches every control inside.
  useEffect(() => {
    ref.current?.focus();
  }, [ref]);

  // The button turns disabled once everything is read, which would drop keyboard focus, so the panel takes it back.
  function markAllRead() {
    markNotificationsRead();
    ref.current?.focus();
  }

  return (
    <div ref={ref} className="notif-panel" role="dialog" aria-modal="false" aria-label={t.notifications.panelLabel} tabIndex={-1}>
      <header className="notif-header">
        <h2 className="notif-heading">{t.notifications.title}</h2>
        <Button onClick={markAllRead} disabled={data.unread === 0}>{t.notifications.markAllRead}</Button>
      </header>
      {data.items.length === 0 ? (
        <EmptyState icon="bell" title={t.notifications.emptyTitle} />
      ) : (
        <ul className="notif-list" role="list" aria-label={t.notifications.listLabel}>
          {data.items.map((item) => <Item key={item.id} item={item} now={now} onNavigate={onNavigate} />)}
        </ul>
      )}
      <footer className="notif-footer small muted">{t.notifications.footer}</footer>
    </div>
  );
}
