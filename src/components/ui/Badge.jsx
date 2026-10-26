// Badges. Status is always icon plus text, never color alone.
import Icon from './Icon.jsx';
import t from '../../strings/en.js';

const TIER_ICON = { normal: 'checkCircle', watch: 'eye', warning: 'triangle', critical: 'octagon' };
const FRESH_ICON = { live: 'radio', stale: 'clock', offline: 'offline' };

/** System status tier: Normal, Watch, Warning, Critical. */
export function StatusBadge({ tier, large = false }) {
  return (
    <span className={`badge status-${tier} ${large ? 'badge-lg' : ''}`}>
      <Icon name={TIER_ICON[tier]} size={large ? 22 : 16} />
      {t.status[tier].label}
    </span>
  );
}

/** Freshness: Live, Stale, Offline. */
export function FreshnessBadge({ state }) {
  return (
    <span className={`badge fresh-${state}`}>
      <Icon name={FRESH_ICON[state]} size={16} />
      {t.freshness[state]}
    </span>
  );
}

/** Alert level chip (Watch, Warning, Critical, All clear, Test). */
export function AlertLevelBadge({ level }) {
  const map = {
    watch: ['status-watch', 'eye'],
    warning: ['status-warning', 'triangle'],
    critical: ['status-critical', 'octagon'],
    all_clear: ['status-normal', 'checkCircle'],
    test: ['badge-neutral', 'info'],
  };
  const [cls, icon] = map[level];
  return (
    <span className={`badge ${cls}`}>
      <Icon name={icon} size={16} />
      {t.alertLevels[level].label}
    </span>
  );
}

/** Hydraulic gate state: Open or Closed (display only). */
export function GateStateBadge({ state, large = false }) {
  return (
    <span className={`badge badge-gate ${large ? 'badge-lg' : ''}`}>
      <Icon name={state === 'open' ? 'gateOpen' : 'gateClosed'} size={large ? 22 : 16} />
      {t.gate.state[state]}
    </span>
  );
}

/** Simulated delivery status for one recipient. */
export function DeliveryStatus({ status, attempts }) {
  const map = {
    queued: ['badge-neutral', 'clock'],
    sent: ['badge-neutral', 'send'],
    delivered: ['status-normal', 'checkCircle'],
    failed: ['status-critical', 'offline'],
  };
  const [cls, icon] = map[status];
  const retry = attempts > 1 && status !== 'failed' && status !== 'delivered';
  return (
    <span className={`badge ${cls}`}>
      <Icon name={icon} size={16} />
      {t.delivery.status[status]}
      {retry ? ` ${t.delivery.retryTag(attempts)}` : ''}
      {attempts > 1 && (status === 'delivered' || status === 'failed') ? ` ${t.delivery.retriedTag}` : ''}
    </span>
  );
}

export function SimulatedTag() {
  return <span className="badge badge-neutral badge-sim">{t.common.simulated}</span>;
}
