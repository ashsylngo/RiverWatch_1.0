/** On/off switch built on a real checkbox, so it is keyboard reachable with a visible focus ring. */
export default function Switch({ checked, onChange, label, hideLabel = false, disabled = false }) {
  return (
    <label className={`switch ${disabled ? 'is-disabled' : ''}`}>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={hideLabel ? label : undefined}
      />
      <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
      {hideLabel ? null : <span className="switch-label">{label}</span>}
    </label>
  );
}
