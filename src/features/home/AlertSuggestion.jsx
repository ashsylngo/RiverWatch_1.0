// The app SUGGESTS an alert. The official reviews the message on the Alert tab and presses Send.
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { suggestAlert, alertLevelLabel } from '../../lib/status.js';
import { timeAgo } from '../../lib/time.js';
import t from '../../strings/en.js';

export default function AlertSuggestion({ tier, level, lastAlert, freshState, now }) {
  const navigate = useNavigate();
  const suggestion = suggestAlert(tier, lastAlert ? lastAlert.level : null);
  if (!suggestion) return null;

  const cm = Math.round(level);
  const lastText = lastAlert
    ? t.home.suggestion.lastAlert(alertLevelLabel(lastAlert.level), timeAgo(lastAlert.sent_at, now))
    : t.home.suggestion.noAlertYet;

  return (
    <section className={`suggestion suggestion-${tier}`} aria-live="polite" aria-label={t.home.suggestion.label}>
      <div className="suggestion-text">
        <div className="suggestion-head">
          <StatusBadge tier={tier} />
          <strong>
            {suggestion.kind === 'raise'
              ? t.home.suggestion.raiseTitle(t.status[tier].label, cm)
              : t.home.suggestion.clearTitle(cm)}
          </strong>
        </div>
        <p>
          {suggestion.kind === 'raise' ? t.home.suggestion.raiseText : t.home.suggestion.clearText}
          {' '}
          {lastText}
          {freshState !== 'live' ? ` ${t.home.suggestion.staleNote}` : ''}
        </p>
      </div>
      <Button variant="primary" icon="message" onClick={() => navigate(`/alert?level=${suggestion.level}`)}>
        {t.home.suggestion.prepare}
      </Button>
    </section>
  );
}
