// Alert tab: SMS specifications on the left, preview and simulated send on the right.
// The app suggests; the official reviews the message and confirms every send.
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { countRecipients, getAlertForm, sendAlert } from '../../lib/data/index.js';
import { useData } from '../../lib/useData.js';
import { useNow } from '../../lib/useNow.js';
import { ALERT_LEVELS, suggestAlert, tierFor, tierLabel } from '../../lib/status.js';
import { compose, estimateSegments, hotlinesText } from '../../lib/sms.js';
import { Async } from '../../components/ui/States.jsx';
import SpecsForm from './SpecsForm.jsx';
import SmsPreview from './SmsPreview.jsx';
import SendDialog from './SendDialog.jsx';
import DeliveryPanel from './DeliveryPanel.jsx';
import t from '../../strings/en.js';

const templateFor = (d, level, language) => d.templates.find((x) => x.level === level && x.language === language);

function initialForm(level, d) {
  return {
    level,
    language: 'en',
    override: null, // text typed by hand; null means "use the template"
    evacId: d.evacuationCenters[0].id,
    evacCustom: '',
    disaster: templateFor(d, level, 'en').default_disaster_info,
    hotlineIds: d.hotlines.slice(0, 2).map((h) => h.id),
    audience: 'all',
    puroks: [],
  };
}

function AlertBody({ d }) {
  const [params] = useSearchParams();
  const now = useNow();
  const tier = tierFor(d.latest.level_cm, d.settings);
  const suggestion = suggestAlert(tier, d.lastAlert ? d.lastAlert.level : null);
  const paramLevel = params.get('level');

  // Default is Test when nothing is suggested, so a real alert is never one click from the default.
  const startLevel = ALERT_LEVELS.includes(paramLevel) ? paramLevel : suggestion ? suggestion.level : 'test';
  const [form, setForm] = useState(() => initialForm(startLevel, d));
  const [pending, setPending] = useState(null); // payload waiting for confirmation
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [activeAlertId, setActiveAlertId] = useState(null);

  const patch = (p) => setForm((f) => ({ ...f, ...p }));
  const chooseLevel = (level) => setForm((f) => ({
    ...f, level, override: null, disaster: templateFor(d, level, f.language).default_disaster_info,
  }));
  const chooseLanguage = (language) => setForm((f) => ({
    ...f, language, override: null, disaster: templateFor(d, f.level, language).default_disaster_info,
  }));

  // Opened from the Home suggestion or a Demo tools scenario: prefill the level.
  useEffect(() => {
    if (ALERT_LEVELS.includes(paramLevel)) chooseLevel(paramLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramLevel]);

  const tpl = templateFor(d, form.level, form.language);
  const center = d.evacuationCenters.find((e) => e.id === form.evacId);
  const evacName = form.evacId === 'custom' ? form.evacCustom.trim() : center ? center.name : '';
  const chosenHotlines = d.hotlines.filter((h) => form.hotlineIds.includes(h.id));
  const filter = form.audience === 'all' ? 'all' : `purok:${[...form.puroks].sort().join(',')}`;
  const recipientCount = countRecipients(d.residents, filter);

  const composed = useMemo(() => compose(tpl.body, {
    BARANGAY: d.barangay.name,
    LEVEL_LABEL: tierLabel(tier),
    LEVEL_CM: Math.round(d.latest.level_cm),
    DISASTER_INFO: form.disaster.trim(),
    EVAC_LOCATION: evacName || '-',
    HOTLINES: hotlinesText(chosenHotlines),
  }), [tpl, d.barangay.name, tier, d.latest.level_cm, form.disaster, evacName, chosenHotlines]);

  const message = form.override ?? composed;
  const segments = estimateSegments(message);
  const canSend = message.trim().length > 0 && recipientCount > 0;

  function snapshot(toSelf) {
    return {
      level: form.level,
      language: form.language,
      message,
      evacuation_text: evacName,
      disaster_info: form.disaster.trim(),
      hotline_ids: form.hotlineIds,
      recipient_filter: toSelf ? 'demo_official' : filter,
      recipientCount: toSelf ? 1 : recipientCount,
      toSelf,
    };
  }

  async function confirmSend() {
    setSending(true);
    setSendError('');
    try {
      const { recipientCount: _count, toSelf: _toSelf, ...payload } = pending;
      const id = await sendAlert(payload);
      setActiveAlertId(id);
      setPending(null);
    } catch {
      setSendError(t.alert.sendError);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="alert-grid">
      <SpecsForm
        d={d}
        form={form}
        message={message}
        recipientCount={recipientCount}
        onLevel={chooseLevel}
        onLanguage={chooseLanguage}
        onPatch={patch}
        onMessage={(text) => patch({ override: text })}
        onResetMessage={() => patch({ override: null })}
      />
      <div className="alert-side">
        <SmsPreview
          d={d}
          message={message}
          segments={segments}
          recipientCount={recipientCount}
          canSend={canSend}
          now={now}
          onSend={() => { setSendError(''); setPending(snapshot(false)); }}
          onSendTest={() => { setSendError(''); setPending(snapshot(true)); }}
        />
        {activeAlertId ? <DeliveryPanel alertId={activeAlertId} /> : null}
      </div>
      {pending ? (
        <SendDialog
          pending={pending}
          busy={sending}
          error={sendError}
          onCancel={() => setPending(null)}
          onConfirm={confirmSend}
        />
      ) : null}
    </div>
  );
}

export default function Alert() {
  const state = useData(() => getAlertForm(), ['readings', 'residents', 'alerts']);
  return (
    <div className="page">
      <h1 className="page-title">{t.alert.title}</h1>
      <Async state={state}>{(d) => <AlertBody d={d} />}</Async>
    </div>
  );
}
