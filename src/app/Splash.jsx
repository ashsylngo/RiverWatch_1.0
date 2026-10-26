import { useCallback, useEffect, useRef } from 'react';
import Logo from './Logo.jsx';
import { brand } from './brand.js';
import t from '../strings/en.js';

const SHOW_MS = 2500;

/** The splash is the logo, nothing else. Click or press any key to skip. */
export default function Splash({ onDone }) {
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  useEffect(() => {
    const timer = setTimeout(finish, SHOW_MS);
    window.addEventListener('keydown', finish);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', finish);
    };
  }, [finish]);

  return (
    <main className="splash" onClick={finish}>
      <h1 className="sr-only">{t.app.name}</h1>
      <Logo src={brand.logo} className="logo-splash" />
    </main>
  );
}
