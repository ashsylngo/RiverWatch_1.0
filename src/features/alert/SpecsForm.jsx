import Card from '../../components/ui/Card.jsx';
import Field, { Fieldset } from '../../components/ui/Field.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { ALERT_LEVELS } from '../../lib/status.js';
import t from '../../strings/en.js';

const LEVEL_ICON = { watch: 'eye', warning: 'triangle', critical: 'octagon', all_clear: 'checkCircle', test: 'info' };
const PUROKS = [1, 2, 3, 4, 5, 6];

export default function SpecsForm({ d, form, message, recipientCount, onLevel, onLanguage, onPatch, onMessage, onResetMessage }) {
  const isTest = form.level === 'test';

  function toggleHotline(id) {
    const has = form.hotlineIds.includes(id);
    onPatch({ hotlineIds: has ? form.hotlineIds.filter((x) => x !== id) : [...form.hotlineIds, id] });
  }
  function togglePurok(p) {
    const has = form.puroks.includes(p);
    onPatch({ puroks: has ? form.puroks.filter((x) => x !== p) : [...form.puroks, p] });
  }

  return (
    <Card title={t.alert.specsTitle} className="specs-card">
      <div className="form-stack">
        <Fieldset legend={t.alert.level} hint={t.alert.levelHint}>
          <div className="choice-row" role="radiogroup" aria-label={t.alert.level}>
            {ALERT_LEVELS.map((level) => (
              <label key={level} className={`choice ${form.level === level ? 'is-selected' : ''}`}>
                <input type="radio" name="alert-level" value={level} checked={form.level === level} onChange={() => onLevel(level)} />
                <Icon name={LEVEL_ICON[level]} size={18} />
                <span>{t.alertLevels[level].label}</span>
              </label>
            ))}
          </div>
        </Fieldset>

        <Fieldset legend={t.alert.language} hint={t.alert.languageHint}>
          <div className="choice-row" role="radiogroup" aria-label={t.alert.language}>
            {[['en', t.alert.langEn], ['fil', t.alert.langFil]].map(([value, label]) => (
              <label key={value} className={`choice ${form.language === value ? 'is-selected' : ''}`}>
                <input type="radio" name="alert-language" value={value} checked={form.language === value} onChange={() => onLanguage(value)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </Fieldset>

        <Field
          label={t.alert.message}
          hint={form.override !== null ? (
            <>
              <strong>{t.alert.editedManually}</strong>
              {' '}
              {t.alert.editedNote}
              {' '}
              <button type="button" className="link-btn" onClick={onResetMessage}>{t.alert.resetTemplate}</button>
            </>
          ) : t.alert.messageHint}
        >
          <textarea className="input" rows={7} maxLength={1000} value={message} onChange={(e) => onMessage(e.target.value)} />
        </Field>

        <div className="field">
          <label htmlFor="evac-select">{t.alert.evac}</label>
          <select id="evac-select" className="input" value={form.evacId} onChange={(e) => onPatch({ evacId: e.target.value })}>
            {d.evacuationCenters.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            <option value="custom">{t.alert.evacCustom}</option>
          </select>
          {form.evacId === 'custom' ? (
            <input
              className="input"
              aria-label={t.alert.evacCustomLabel}
              placeholder={t.alert.evacCustomPlaceholder}
              maxLength={100}
              value={form.evacCustom}
              onChange={(e) => onPatch({ evacCustom: e.target.value })}
            />
          ) : null}
          {isTest ? <p className="field-hint">{t.alert.notUsedInTest}</p> : null}
        </div>

        <Field label={t.alert.disaster} hint={isTest ? t.alert.notUsedInTest : t.alert.disasterHint}>
          <textarea className="input" rows={2} maxLength={300} value={form.disaster} onChange={(e) => onPatch({ disaster: e.target.value, override: null })} />
        </Field>

        <Fieldset legend={t.alert.hotlines} hint={isTest ? t.alert.notUsedInTest : t.alert.hotlinesHint}>
          <div className="check-list">
            {d.hotlines.map((h) => (
              <label key={h.id} className="check">
                <input type="checkbox" checked={form.hotlineIds.includes(h.id)} onChange={() => toggleHotline(h.id)} />
                <span>{h.name}</span>
              </label>
            ))}
          </div>
        </Fieldset>

        <Fieldset legend={t.alert.recipients}>
          <div className="choice-row" role="radiogroup" aria-label={t.alert.recipients}>
            <label className={`choice ${form.audience === 'all' ? 'is-selected' : ''}`}>
              <input type="radio" name="alert-audience" checked={form.audience === 'all'} onChange={() => onPatch({ audience: 'all' })} />
              <span>{t.alert.audienceAll}</span>
            </label>
            <label className={`choice ${form.audience === 'puroks' ? 'is-selected' : ''}`}>
              <input type="radio" name="alert-audience" checked={form.audience === 'puroks'} onChange={() => onPatch({ audience: 'puroks' })} />
              <span>{t.alert.audiencePuroks}</span>
            </label>
          </div>
          {form.audience === 'puroks' ? (
            <div className="check-row">
              {PUROKS.map((p) => (
                <label key={p} className="check">
                  <input type="checkbox" checked={form.puroks.includes(p)} onChange={() => togglePurok(p)} />
                  <span>{t.resident.purokName(p)}</span>
                </label>
              ))}
            </div>
          ) : null}
          <p className="recipient-count" role="status">
            <Icon name="users" size={18} />
            {t.alert.recipientCount(recipientCount)}
          </p>
        </Fieldset>
      </div>
    </Card>
  );
}
