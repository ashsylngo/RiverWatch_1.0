import Icon from './Icon.jsx';

/** variant: primary | secondary | ghost | danger */
export default function Button({ variant = 'secondary', icon, children, className = '', ...rest }) {
  return (
    <button type="button" className={`btn btn-${variant} ${className}`} {...rest}>
      {icon ? <Icon name={icon} size={18} /> : null}
      {children}
    </button>
  );
}

/** Icon-only button. `label` is required for screen readers. */
export function IconButton({ icon, label, className = '', ...rest }) {
  return (
    <button type="button" className={`btn btn-icon ${className}`} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={18} />
    </button>
  );
}
