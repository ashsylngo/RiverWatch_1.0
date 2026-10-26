import { Children, cloneElement, useId } from 'react';
import Icon from './Icon.jsx';

/** Label, control, hint and inline error for a single control. `children` is one input, select or textarea. */
export default function Field({ label, hint, error, children, className = '' }) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
  const child = Children.only(children);
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>{label}</label>
      {cloneElement(child, { id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {hint ? <p id={hintId} className="field-hint">{hint}</p> : null}
      {error ? (
        <p id={errorId} className="field-error" role="alert"><Icon name="octagon" size={16} />{error}</p>
      ) : null}
    </div>
  );
}

export function Fieldset({ legend, hint, children, className = '' }) {
  return (
    <fieldset className={`fieldset ${className}`}>
      <legend>{legend}</legend>
      {hint ? <p className="field-hint">{hint}</p> : null}
      {children}
    </fieldset>
  );
}
