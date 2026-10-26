// Control tab: sensor data and the hydraulic gate status with its history. Monitoring only.
import { getGate, getHome } from '../../lib/data/index.js';
import { useData } from '../../lib/useData.js';
import { useNow } from '../../lib/useNow.js';
import { freshnessFor } from '../../lib/status.js';
import Card from '../../components/ui/Card.jsx';
import { Async } from '../../components/ui/States.jsx';
import SensorCard from './SensorCard.jsx';
import GateStatus from './GateStatus.jsx';
import GateTimeline from './GateTimeline.jsx';
import t from '../../strings/en.js';

function Body({ home, gate }) {
  const now = useNow();
  const interval = home.station.expected_interval_s;
  const sensorFresh = freshnessFor(home.station.last_seen, now, interval, home.settings);
  const gateFresh = freshnessFor(home.gate.last_seen, now, interval, home.settings);
  return (
    <>
      <div className="control-grid">
        <SensorCard station={home.station} fresh={sensorFresh} />
        <GateStatus gate={home.gate} lastEvent={home.gateLastEvent} fresh={gateFresh} now={now} />
      </div>
      <Card title={t.gate.historyTitle(gate.events.length)}>
        <GateTimeline events={gate.events} />
      </Card>
    </>
  );
}

export default function Control() {
  const home = useData(() => getHome(), ['readings', 'gate', 'station']);
  const gate = useData(() => getGate(), ['gate']);
  const state = {
    status: home.status === 'error' || gate.status === 'error' ? 'error'
      : home.data && gate.data ? 'ready' : 'loading',
    data: home.data && gate.data ? { home: home.data, gate: gate.data } : null,
    reload: () => { home.reload(); gate.reload(); },
  };
  return (
    <div className="page">
      <h1 className="page-title">{t.control.title}</h1>
      <Async state={state}>{(d) => <Body home={d.home} gate={d.gate} />}</Async>
    </div>
  );
}
