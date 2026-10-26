import { useState } from 'react';
import { Modal } from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Field from '../../components/ui/Field.jsx';
import Switch from '../../components/ui/Switch.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { normalizePhone } from '../../lib/phone.js';
import t from '../../strings/en.js';

const PUROKS = [1, 2, 3, 4, 5, 6];

export default function ResidentForm({ mode, resident, defaultAddress, onSave, onClose }) {
  const editing = mode === 'edit';
  const [name, setName] = useState(editing ? resident.name : '');
  const [purok, setPurok] = useState(editing ? resident.purok : 1);
  const [address, setAddress] = useState(editing ? resident.address : defaultAddress(1));
  const [addressTouched, setAddressTouched] = useState(editing);
  const [phone, setPhone] = useState(editing ? resident.phone : '');
  const [active, setActive] = useState(editing ? resident.active : true);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState('');

  function onPurokChange(value) {
    const p = Number(value);
    setPurok(p);
    if (!addressTouched) setAddress(defaultAddress(p));
  }

  function validate() {
    const e = {};
    if (!name.trim()) e.name = t.resident.errName;
    else if (name.trim().length > 80) e.name = t.resident.errNameLong;
    if (!PUROKS.includes(Number(purok))) e.purok = t.resident.errPurok;
    const unchangedPlaceholder = editing && phone.trim() === resident.phone;
    if (!normalizePhone(phone) && !unchangedPlaceholder) e.phone = t.resident.errPhone;
    return e;
  }

  async function submit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    setSaveError('');
    try {
      await onSave({
        name: name.trim(),
        purok: Number(purok),
        address: address.trim() || defaultAddress(Number(purok)),
        phone: normalizePhone(phone) || phone.trim(),
        active,
      });
    } catch {
      setSaveError(t.resident.saveError);
      setBusy(false);
    }
  }

  return (
    <Modal
      title={editing ? t.resident.editTitle : t.resident.addTitle}
      onClose={onClose}
      footer={(
        <>
          <Button onClick={onClose} disabled={busy}>{t.common.cancel}</Button>
          <Button type="submit" form="resident-form" variant="primary" disabled={busy}>
            {busy ? t.common.working : t.common.save}
          </Button>
        </>
      )}
    >
      <form id="resident-form" className="form-stack" onSubmit={submit} noValidate>
        <Field label={t.resident.fieldName} error={errors.name}>
          <input className="input" value={name} maxLength={80} autoComplete="off" data-autofocus onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label={t.resident.fieldPurok} error={errors.purok}>
          <select className="input" value={purok} onChange={(e) => onPurokChange(e.target.value)}>
            {PUROKS.map((p) => <option key={p} value={p}>{t.resident.purokName(p)}</option>)}
          </select>
        </Field>
        <Field label={t.resident.fieldAddress} hint={t.resident.addressHint}>
          <input
            className="input"
            value={address}
            maxLength={120}
            autoComplete="off"
            onChange={(e) => { setAddress(e.target.value); setAddressTouched(true); }}
          />
        </Field>
        <Field label={t.resident.fieldPhone} hint={t.resident.phoneHint} error={errors.phone}>
          <input className="input" inputMode="tel" value={phone} maxLength={20} autoComplete="off" onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Switch checked={active} onChange={setActive} label={t.resident.fieldActive} />
        {saveError ? <p className="field-error" role="alert"><Icon name="octagon" size={16} />{saveError}</p> : null}
      </form>
    </Modal>
  );
}
