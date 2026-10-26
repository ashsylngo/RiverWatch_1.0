import { useId } from 'react';

export default function Card({ title, actions, children, className = '', as: Tag = 'section' }) {
  const id = useId();
  return (
    <Tag className={`card ${className}`} aria-labelledby={title ? id : undefined}>
      {(title || actions) && (
        <header className="card-header">
          {title ? <h2 id={id} className="card-title">{title}</h2> : <span />}
          {actions ? <div className="card-actions">{actions}</div> : null}
        </header>
      )}
      {children}
    </Tag>
  );
}
