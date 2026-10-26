// Presenter panel. Scenarios change SIMULATED state only. The app itself has no gate control.
import { useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDemoSnapshot, resetDemo, subscribe } from '../../lib/data/index.js';
import { tierFor } from '../../lib/status.js';
import Drawer from '../../components/ui/Drawer.jsx';
import Button from '../../components/ui/Button.jsx';
import Switch from '../../components/ui/Switch.jsx';
import { ConfirmDialog } from '../../components/ui/Modal.jsx';
import { FreshnessBadge, GateStateBadge, StatusBadge } from '../../components/ui/Badge.jsx';
import { useApp } from '../../app/AppContext.jsx';
import * as sc from './scenarios.js';
import t from '../../strings/en.js';

const useSnapshot = () => useSyncExternalStore((cb) => subscribe(() => cb()), getDemoSnapshot);

function Group({ title, hint, children }) {
  return (
    <section className="demo-group">
      <h3>{title}</h3>
      {hint ? <p className="muted small">{hint}</p> : null}
      <div className="row-gap">{children}</div>
    </section>
  );
}

export default function DemoDrawer({ onClose }) {
  const snap = useSnapshot();
  const navigate = useNavigate();
  const { replaySplash } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  const tier = tierFor(snap.level, snap.settings);
  const d = t.demo;

  function sendAlertScenario() {
    navigate(`/alert?level=${tier === 'normal' ? 'test' : tier}`);
    onClose();
  }

  return (
    <Drawer title={d.title} onClose={onClose} modal={false}>
      <div className="demo-state" role="status" aria-live="polite">
        <div><span className="muted small">{d.simLevel}</span> <strong>{Math.round(snap.level)} {t.home.level.unit}</strong></div>
        <StatusBadge tier={tier} />
        <FreshnessBadge state={snap.sensorMode === 'live' ? 'live' : snap.sensorMode} />
        <GateStateBadge state={snap.gateState} />
      </div>
      <p className="muted small">{d.intro}</p>

      <Group title={d.rising} hint={d.risingHint}>
        <Button variant="primary" onClick={sc.riverRising} disabled={snap.scenario === 'ramp'}>{d.risingBtn}</Button>
      </Group>
      <Group title={d.sendAlert} hint={d.sendAlertHint}>
        <Button onClick={sendAlertScenario}>{d.sendAlertBtn}</Button>
      </Group>
      <Group title={d.normal} hint={d.normalHint}>
        <Button onClick={sc.backToNormal} disabled={snap.scenario === 'fall'}>{d.normalBtn}</Button>
      </Group>
      <Group title={d.silent} hint={d.silentHint}>
        <Button onClick={sc.makeStale}>{d.makeStale}</Button>
        <Button onClick={sc.makeOffline}>{d.makeOffline}</Button>
        <Button variant="secondary" onClick={sc.restoreSensor} disabled={snap.sensorMode === 'live'}>{d.restore}</Button>
      </Group>
      <Group title={d.camera} hint={d.cameraHint}>
        <Button onClick={sc.cameraLost} disabled={!snap.cameraOk}>{d.cameraBtn}</Button>
        <Button onClick={sc.restoreCamera} disabled={snap.cameraOk}>{d.restore}</Button>
      </Group>
      <Group title={d.gate} hint={d.gateHint}>
        <Button onClick={sc.toggleGate}>{d.gateBtn}</Button>
      </Group>
      <Group title={d.splash}>
        <Button onClick={() => { onClose(); replaySplash(); }}>{d.splashBtn}</Button>
      </Group>

      <section className="demo-group">
        <h3>{d.states}</h3>
        <p className="muted small">{d.statesHint}</p>
        <div className="field">
          <label htmlFor="demo-delay">{d.delay(snap.tools.delayMs)}</label>
          <input
            id="demo-delay"
            type="range"
            min="0"
            max="3000"
            step="500"
            value={snap.tools.delayMs}
            onChange={(e) => sc.setDelay(Number(e.target.value))}
          />
        </div>
        <Switch checked={snap.tools.forceError} onChange={sc.setForceError} label={d.forceError} />
      </section>

      <Group title={d.reset} hint={d.resetHint}>
        <Button variant="danger" icon="refresh" onClick={() => setConfirmReset(true)}>{d.resetBtn}</Button>
      </Group>

      {confirmReset ? (
        <ConfirmDialog
          title={d.resetConfirmTitle}
          confirmLabel={d.resetConfirm}
          danger
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => { resetDemo(); setConfirmReset(false); }}
        >
          <p>{d.resetConfirmText}</p>
        </ConfirmDialog>
      ) : null}
    </Drawer>
  );
}
