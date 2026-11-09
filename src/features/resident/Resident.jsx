import { useEffect, useMemo, useState } from 'react';
import {
  addResident, deleteResident, getResidents, importResidents, updateResident,
} from '../../lib/data/index.js';
import { useData } from '../../lib/useData.js';
import { downloadCsv } from '../../lib/csv.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { Async, EmptyState } from '../../components/ui/States.jsx';
import { ConfirmDialog } from '../../components/ui/Modal.jsx';
import ResidentTable from './ResidentTable.jsx';
import ResidentForm from './ResidentForm.jsx';
import ImportDialog from './ImportDialog.jsx';
import { useT } from '../../lib/i18n.jsx';

const PUROKS = [1, 2, 3, 4, 5, 6];

function ResidentBody({ d }) {
  const t = useT();
  const [query, setQuery] = useState('');
  const [purok, setPurok] = useState('all');
  const [form, setForm] = useState(null); // { mode: 'add' | 'edit', resident? }
  const [removing, setRemoving] = useState(null);
  const [importing, setImporting] = useState(false);
  const [notice, setNotice] = useState(null); // { key, arg }: kept as a code so it follows a language switch
  const [actionError, setActionError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [removeError, setRemoveError] = useState(false);

  useEffect(() => {
    if (!notice) return undefined;
    const id = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(id);
  }, [notice]);

  const defaultAddress = (p) => `Purok ${p}, ${d.barangay.name}`;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return d.residents.filter((r) => {
      if (purok !== 'all' && String(r.purok) !== purok) return false;
      if (!q) return true;
      return r.name.toLowerCase().includes(q) || r.address.toLowerCase().includes(q);
    });
  }, [d.residents, query, purok]);

  const total = d.residents.length;
  const activeCount = d.residents.filter((r) => r.active).length;

  async function onToggle(resident, active) {
    setActionError(false);
    try {
      await updateResident(resident.id, { active });
    } catch {
      setActionError(true);
    }
  }

  async function confirmDelete() {
    setBusy(true);
    setRemoveError(false);
    try {
      await deleteResident(removing.id);
      setNotice({ key: 'deleted', arg: removing.name });
      setRemoving(null);
    } catch {
      setRemoveError(true);
    } finally {
      setBusy(false);
    }
  }

  function exportCsv() {
    const rows = [['name', 'address', 'purok', 'phone', 'active']];
    d.residents.forEach((r) => rows.push([r.name, r.address, r.purok, r.phone, r.active ? 'yes' : 'no']));
    downloadCsv('riverwatch-residents', rows);
  }

  return (
    <>
      <Card>
        <div className="toolbar">
          <div className="toolbar-filters">
            <div className="search-box">
              <Icon name="search" size={18} />
              <input
                type="search"
                className="input"
                aria-label={t.resident.searchLabel}
                placeholder={t.resident.searchPlaceholder}
                value={query}
                maxLength={80}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select className="input" aria-label={t.resident.purokFilter} value={purok} onChange={(e) => setPurok(e.target.value)}>
              <option value="all">{t.resident.allPuroks}</option>
              {PUROKS.map((p) => <option key={p} value={String(p)}>{t.resident.purokName(p)}</option>)}
            </select>
          </div>
          <div className="toolbar-actions">
            <Button variant="primary" icon="plus" onClick={() => setForm({ mode: 'add' })}>{t.resident.add}</Button>
            <Button icon="upload" onClick={() => setImporting(true)}>{t.resident.import}</Button>
            <Button icon="download" onClick={exportCsv} disabled={total === 0}>{t.resident.export}</Button>
          </div>
        </div>

        <p className="count-line">
          {t.resident.count(total, activeCount)}
          {filtered.length !== total ? ` ${t.resident.showing(filtered.length)}` : ''}
        </p>

        <div role="status" className="inline-status">
          {notice ? <span className="notice notice-ok"><Icon name="checkCircle" size={16} />{t.resident[notice.key](notice.arg)}</span> : null}
        </div>
        {actionError ? <p className="field-error" role="alert"><Icon name="octagon" size={16} />{t.resident.actionError}</p> : null}

        {total === 0 ? (
          <EmptyState icon="users" title={t.resident.emptyNoneTitle} text={t.resident.emptyNoneText}
            action={<Button variant="primary" icon="plus" onClick={() => setForm({ mode: 'add' })}>{t.resident.add}</Button>} />
        ) : filtered.length === 0 ? (
          <EmptyState icon="search" title={t.resident.emptyTitle} text={t.resident.emptyText}
            action={<Button onClick={() => { setQuery(''); setPurok('all'); }}>{t.resident.clearFilters}</Button>} />
        ) : (
          <ResidentTable
            residents={filtered}
            onEdit={(r) => setForm({ mode: 'edit', resident: r })}
            onDelete={(r) => { setRemoveError(false); setRemoving(r); }}
            onToggle={onToggle}
          />
        )}
        <p className="muted small table-note">{t.resident.note}</p>
      </Card>

      {form ? (
        <ResidentForm
          mode={form.mode}
          resident={form.resident}
          defaultAddress={defaultAddress}
          onClose={() => setForm(null)}
          onSave={async (values) => {
            if (form.mode === 'add') {
              await addResident(values);
              setNotice({ key: 'added', arg: values.name });
            } else {
              await updateResident(form.resident.id, values);
              setNotice({ key: 'updated', arg: values.name });
            }
            setForm(null);
          }}
        />
      ) : null}

      {removing ? (
        <ConfirmDialog
          title={t.resident.deleteTitle}
          confirmLabel={t.resident.deleteConfirm}
          danger
          icon="trash"
          busy={busy}
          error={removeError ? t.resident.actionError : undefined}
          onCancel={() => setRemoving(null)}
          onConfirm={confirmDelete}
        >
          <p>{t.resident.deleteText(removing.name)}</p>
        </ConfirmDialog>
      ) : null}

      {importing ? (
        <ImportDialog
          defaultAddress={defaultAddress}
          onClose={() => setImporting(false)}
          onImport={async (rows) => {
            const n = await importResidents(rows);
            setNotice({ key: 'imported', arg: n });
            setImporting(false);
          }}
        />
      ) : null}
    </>
  );
}

export default function Resident() {
  const t = useT();
  const state = useData(() => getResidents(), ['residents']);
  return (
    <div className="page">
      <h1 className="page-title">{t.resident.title}</h1>
      <Async state={state}>{(d) => <ResidentBody d={d} />}</Async>
    </div>
  );
}
