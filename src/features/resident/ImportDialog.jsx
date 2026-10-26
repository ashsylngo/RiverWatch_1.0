// CSV import. Parsed locally in the browser, previewed with row errors, then confirmed. No network.
import { useState } from 'react';
import { Modal } from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Table from '../../components/ui/Table.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { MAX_CSV_BYTES, parseResidentsCsv } from '../../lib/csv.js';
import { maskPhone } from '../../lib/phone.js';
import t from '../../strings/en.js';

const MAX_ERRORS_SHOWN = 12;

export default function ImportDialog({ defaultAddress, onImport, onClose }) {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState(null);
  const [fileError, setFileError] = useState('');
  const [busy, setBusy] = useState(false);
  const [importError, setImportError] = useState('');

  async function onFile(e) {
    const file = e.target.files && e.target.files[0];
    setFileError('');
    setResult(null);
    if (!file) return;
    if (file.size > MAX_CSV_BYTES) {
      setFileError(t.resident.importTooBig);
      return;
    }
    try {
      const content = await file.text();
      setText(content);
      setFileName(file.name);
    } catch {
      setFileError(t.resident.importReadError);
    }
  }

  const preview = () => setResult(parseResidentsCsv(text, defaultAddress));

  function useSample() {
    setFileName('');
    setText(t.resident.importSample);
    setResult(parseResidentsCsv(t.resident.importSample, defaultAddress));
  }

  async function confirm() {
    setBusy(true);
    setImportError('');
    try {
      await onImport(result.valid);
    } catch {
      setImportError(t.resident.importFailed);
      setBusy(false);
    }
  }

  return (
    <Modal
      title={t.resident.importTitle}
      size="lg"
      onClose={onClose}
      footer={(
        <>
          <Button onClick={onClose} disabled={busy}>{t.common.cancel}</Button>
          <Button variant="primary" icon="upload" onClick={confirm} disabled={busy || !result || result.valid.length === 0}>
            {busy ? t.common.working : t.resident.importConfirm(result ? result.valid.length : 0)}
          </Button>
        </>
      )}
    >
      <p>{t.resident.importIntro}</p>
      <div className="form-stack">
        <div className="field">
          <label htmlFor="csv-file">{t.resident.importFile}</label>
          <input id="csv-file" className="input" type="file" accept=".csv,text/csv" onChange={onFile} data-autofocus />
          {fileName ? <p className="field-hint">{fileName}</p> : null}
          {fileError ? <p className="field-error" role="alert"><Icon name="octagon" size={16} />{fileError}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="csv-text">{t.resident.importPaste}</label>
          <textarea
            id="csv-text"
            className="input mono"
            rows={5}
            value={text}
            onChange={(e) => { setText(e.target.value); setResult(null); }}
            spellCheck={false}
          />
        </div>
        <div className="row-gap">
          <Button onClick={preview} disabled={!text.trim()}>{t.resident.importPreview}</Button>
          <Button variant="ghost" onClick={useSample}>{t.resident.importUseSample}</Button>
        </div>
      </div>

      {result ? (
        <div className="import-result" role="status">
          <p className="import-summary">
            <Icon name="checkCircle" size={18} />{t.resident.importValid(result.valid.length)}
            {' '}
            <Icon name="octagon" size={18} />{t.resident.importErrors(result.errors.length)}
          </p>
          {result.errors.length > 0 ? (
            <ul className="error-list">
              {result.errors.slice(0, MAX_ERRORS_SHOWN).map((er) => (
                <li key={`${er.line}-${er.message}`}>{t.resident.importLine(er.line, er.message)}</li>
              ))}
              {result.errors.length > MAX_ERRORS_SHOWN ? <li>{t.resident.importMore(result.errors.length - MAX_ERRORS_SHOWN)}</li> : null}
            </ul>
          ) : null}
          {result.valid.length > 0 ? (
            <Table caption={t.resident.importPreviewCaption}>
              <thead>
                <tr>
                  <th scope="col">{t.resident.colName}</th>
                  <th scope="col">{t.resident.colAddress}</th>
                  <th scope="col">{t.resident.colPurok}</th>
                  <th scope="col">{t.resident.colPhone}</th>
                </tr>
              </thead>
              <tbody>
                {result.valid.slice(0, 5).map((r) => (
                  <tr key={`${r.name}-${r.phone}`}>
                    <td>{r.name}</td>
                    <td>{r.address}</td>
                    <td>{r.purok}</td>
                    <td className="nowrap">{maskPhone(r.phone)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : null}
        </div>
      ) : null}
      {importError ? <p className="field-error" role="alert"><Icon name="octagon" size={16} />{importError}</p> : null}
    </Modal>
  );
}
