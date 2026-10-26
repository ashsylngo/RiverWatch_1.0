import Table from '../../components/ui/Table.jsx';
import Switch from '../../components/ui/Switch.jsx';
import { IconButton } from '../../components/ui/Button.jsx';
import { maskPhone } from '../../lib/phone.js';
import t from '../../strings/en.js';

// Names, addresses and phone numbers are plain text. React escapes them; nothing is rendered as HTML.
export default function ResidentTable({ residents, onEdit, onDelete, onToggle }) {
  return (
    <Table caption={t.resident.tableCaption} className="table-residents">
      <thead>
        <tr>
          <th scope="col">{t.resident.colName}</th>
          <th scope="col">{t.resident.colAddress}</th>
          <th scope="col">{t.resident.colPhone}</th>
          <th scope="col">{t.resident.colPurok}</th>
          <th scope="col">{t.resident.colActive}</th>
          <th scope="col"><span className="sr-only">{t.resident.colActions}</span></th>
        </tr>
      </thead>
      <tbody>
        {residents.map((r) => (
          <tr key={r.id} className={r.active ? '' : 'is-inactive'}>
            <td>{r.name}</td>
            <td>{r.address}</td>
            <td className="nowrap">{maskPhone(r.phone)}</td>
            <td>{r.purok}</td>
            <td>
              <Switch
                checked={r.active}
                onChange={(v) => onToggle(r, v)}
                label={t.resident.activeToggle(r.name)}
                hideLabel
              />
              <span className="switch-text">{r.active ? t.resident.active : t.resident.inactive}</span>
            </td>
            <td className="row-actions">
              <IconButton icon="edit" label={t.resident.editLabel(r.name)} onClick={() => onEdit(r)} />
              <IconButton icon="trash" label={t.resident.deleteLabel(r.name)} onClick={() => onDelete(r)} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
