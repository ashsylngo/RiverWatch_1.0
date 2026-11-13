// Notification bell: a 40 px button at the far right of the top bar with a count badge (a count, never a severity).
// The panel is a popover dialog. Escape and a click outside close it, and focus returns to the bell.
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Icon from '../../components/ui/Icon.jsx';
import { getNotifications, subscribe } from '../../lib/data/index.js';
import { useLocale } from '../../lib/i18n.jsx';
import NotificationPanel from './NotificationPanel.jsx';

const subscribeToList = (cb) => subscribe(() => cb());

export default function NotificationBell() {
  const { t } = useLocale();
  const data = useSyncExternalStore(subscribeToList, getNotifications);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  // `returnFocus`: give focus back to the bell (Escape, or a click that left focus nowhere).
  const close = useCallback((returnFocus) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    function onKey(e) {
      if (e.key !== 'Escape') return;
      e.stopImmediatePropagation(); // so an open Demo tools panel does not close at the same time
      close(true);
    }
    function onClick(e) {
      if (wrapRef.current && wrapRef.current.contains(e.target)) return;
      close(false);
      // Focus goes back to the bell, unless the click was on a control that should keep it.
      const onControl = e.target instanceof Element && e.target.closest('a[href],button,input,select,textarea,label,[role="button"],[role="tab"]');
      if (!onControl) buttonRef.current?.focus();
    }
    // A mouse press outside moves focus first and clicks later. The click handler owns that case, so focus-out ignores it.
    let pressing = false;
    const onDown = () => { pressing = true; };
    const onUp = () => { setTimeout(() => { pressing = false; }, 0); };
    function onFocusOut() {
      // Tabbing out of the popover closes it without taking focus from where the user is going.
      setTimeout(() => {
        if (!pressing && wrapRef.current && !wrapRef.current.contains(document.activeElement)) close(false);
      }, 0);
    }
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('pointerup', onUp, true);
    const wrap = wrapRef.current;
    wrap?.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('pointerup', onUp, true);
      wrap?.removeEventListener('focusout', onFocusOut);
    };
  }, [open, close]);

  return (
    <div className="bell" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-ghost btn-icon bell-btn"
        aria-label={t.notifications.bellLabel(data.unread)}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="bell" size={20} />
        {data.unread > 0 ? <span className="bell-badge" aria-hidden="true">{t.notifications.badge(data.unread)}</span> : null}
      </button>
      {open ? <NotificationPanel data={data} panelRef={panelRef} onNavigate={() => close(false)} /> : null}
    </div>
  );
}
