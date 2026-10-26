import { useCallback, useEffect, useRef, useState } from 'react';
import Logo from './Logo.jsx';
import Icon from '../components/ui/Icon.jsx';
import Button from '../components/ui/Button.jsx';
import { brand } from './brand.js';
import { getBarangay } from '../lib/data/index.js';
import t from '../strings/en.js';

const CHECKS = [t.splash.sensor, t.splash.camera, t.splash.sms, t.splash.gate];
const STEP_MS = 650;
const TOTAL_MS = 3200;

export default function Splash({ onDone }) {
  const [shown, setShown] = useState(0);
  const finished = useRef(false);
  const b = getBarangay();

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  useEffect(() => {
    const timers = CHECKS.map((_, i) => setTimeout(() => setShown(i + 1), 500 + i * STEP_MS));
    timers.push(setTimeout(finish, TOTAL_MS));
    const onKey = () => finish();
    window.addEventListener('keydown', onKey);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', onKey);
    };
  }, [finish]);

  return (
    <main className="splash" onClick={finish}>
      <div className="splash-card">
        <div className="splash-logo">
          <Logo src={brand.logo} className="logo-splash" />
        </div>
        <h1 className="splash-title">{t.app.name}</h1>
        <p className="splash-place">{`${b.name}, ${b.municipality}, ${b.province}`}</p>
        <ul className="splash-checks" aria-live="polite">
          {CHECKS.slice(0, shown).map((label) => (
            <li key={label}>
              <Icon name="checkCircle" size={18} />
              <span>{label}</span>
              <span className="splash-ok">{t.splash.simulatedOk}</span>
            </li>
          ))}
        </ul>
        <div className="splash-skip">
          <Button variant="ghost" onClick={finish}>{t.splash.skip}</Button>
          <span className="splash-hint">{t.splash.hint}</span>
        </div>
      </div>
    </main>
  );
}
