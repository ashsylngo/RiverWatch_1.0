// Dialog core shared by Modal, Drawer and ConfirmDialog.
// Moves focus in, traps Tab (when modal), closes on Escape, and restores focus on close.
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button, { IconButton } from './Button.jsx';
import Icon from './Icon.jsx';
import t from '../../strings/en.js';

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Overlay({ title, onClose, children, footer, variant = 'modal', modal = true, size = 'md' }) {
  const titleId = useId();
  const boxRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement;
    const box = boxRef.current;
    const target = box.querySelector('[data-autofocus]') || box.querySelector('.dialog-body ' + FOCUSABLE.split(',').join(',.dialog-body ')) || box.querySelector(FOCUSABLE) || box;
    target.focus();

    function onKey(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab' || !modal) return;
      const items = [...box.querySelectorAll(FOCUSABLE)];
      if (items.length === 0) { e.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (previous && previous.focus) previous.focus();
    };
  }, [modal]);

  const box = (
    <div
      ref={boxRef}
      className={`dialog dialog-${variant} dialog-${size}`}
      role="dialog"
      aria-modal={modal ? 'true' : 'false'}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <header className="dialog-header">
        <h2 id={titleId} className="dialog-title">{title}</h2>
        <IconButton icon="close" label={t.common.close} onClick={() => closeRef.current()} />
      </header>
      <div className="dialog-body">{children}</div>
      {footer ? <footer className="dialog-footer">{footer}</footer> : null}
    </div>
  );

  return createPortal(modal ? <div className="overlay">{box}</div> : box, document.body);
}

export function Modal(props) {
  return <Overlay variant="modal" modal {...props} />;
}

/** Confirmation dialog for destructive or consequential actions. */
export function ConfirmDialog({
  title, children, confirmLabel, cancelLabel = t.common.cancel, danger = false, busy = false, error, icon,
  onConfirm, onCancel,
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      size="md"
      footer={(
        <>
          <Button variant="secondary" onClick={onCancel} disabled={busy} data-autofocus>{cancelLabel}</Button>
          <Button variant={danger ? 'danger' : 'primary'} icon={icon} onClick={onConfirm} disabled={busy}>
            {busy ? t.common.working : confirmLabel}
          </Button>
        </>
      )}
    >
      {children}
      {error ? (
        <p className="field-error" role="alert"><Icon name="octagon" size={16} />{error}</p>
      ) : null}
    </Modal>
  );
}
