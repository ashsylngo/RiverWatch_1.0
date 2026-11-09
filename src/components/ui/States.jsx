// Loading, empty and error states, plus Async which switches between them.
import Button from './Button.jsx';
import Icon from './Icon.jsx';
import { useT } from '../../lib/i18n.jsx';

export function Spinner({ label }) {
  const t = useT();
  return (
    <div className="spinner-wrap" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label ?? t.common.loading}</span>
    </div>
  );
}

export function EmptyState({ icon = 'info', title, text, action }) {
  return (
    <div className="state state-empty">
      <Icon name={icon} size={36} strokeWidth={1.5} />
      <h3 className="state-title">{title}</h3>
      {text ? <p className="state-text">{text}</p> : null}
      {action || null}
    </div>
  );
}

export function ErrorState({ title, text, onRetry }) {
  const t = useT();
  return (
    <div className="state state-error" role="alert">
      <Icon name="octagon" size={36} strokeWidth={1.5} />
      <h3 className="state-title">{title ?? t.common.errorTitle}</h3>
      <p className="state-text">{text ?? t.common.errorText}</p>
      {onRetry ? <Button variant="ghost" icon="refresh" onClick={onRetry}>{t.common.retry}</Button> : null}
    </div>
  );
}

/** Renders loading, error or the ready content. `state` comes from useData. */
export function Async({ state, children, loadingLabel }) {
  if (state.status === 'error') return <ErrorState onRetry={state.reload} />;
  if (state.status === 'loading' && !state.data) return <Spinner label={loadingLabel} />;
  return children(state.data);
}
