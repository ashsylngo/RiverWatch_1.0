// Builds the title, message and severity word of a notification from its stored kind, severity and params.
// Nothing here is cached: it takes the strings `t` for the active language, so switching language re-translates old items.
import { alertLevelLabel, tierLabel } from '../../lib/status.js';

export const SEVERITY_ICON = { info: 'info', watch: 'eye', warning: 'triangle', critical: 'octagon' };

/** Info, or the flood tier word (Watch, Warning, Critical) so the bell uses the same words as the status badge. */
export const severityLabel = (severity, t) => (severity === 'info' ? t.notifications.info : tierLabel(severity, t));

export function notificationText(item, t) {
  const p = item.params;
  const text = t.notifications;
  switch (item.kind) {
    case 'status':
      return {
        title: text.status.title(tierLabel(p.to, t)),
        message: text.status.message(tierLabel(p.from, t), tierLabel(p.to, t), p.level_cm),
      };
    case 'suggestion':
      return p.kind === 'raise'
        ? { title: text.suggestion.titleRaise(tierLabel(p.level, t)), message: text.suggestion.messageRaise(p.level_cm) }
        : { title: text.suggestion.titleClear, message: text.suggestion.messageClear(p.level_cm) };
    case 'sensor':
      return { title: text.sensor[`${p.event}Title`], message: text.sensor[`${p.event}Message`] };
    case 'gate':
      return { title: text.gate.title(t.gate.state[p.state]), message: text.gate.message };
    case 'alert_sent':
      return { title: text.alertSent.title(alertLevelLabel(p.level, t)), message: text.alertSent.message(p.recipients) };
    default:
      return { title: '', message: '' };
  }
}
