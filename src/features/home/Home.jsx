import { getHome } from '../../lib/data/index.js';
import { useData } from '../../lib/useData.js';
import { useNow } from '../../lib/useNow.js';
import { freshnessFor, tierFor } from '../../lib/status.js';
import { Async } from '../../components/ui/States.jsx';
import AlertSuggestion from './AlertSuggestion.jsx';
import CameraPanel from './CameraPanel.jsx';
import LevelCard from './LevelCard.jsx';
import TrendCard from './TrendCard.jsx';
import GateCard from './GateCard.jsx';
import SensorCard from './SensorCard.jsx';
import t from '../../strings/en.js';

function HomeBody({ d }) {
  const now = useNow();
  const interval = d.station.expected_interval_s;
  const sensorFresh = freshnessFor(d.station.last_seen, now, interval, d.settings);
  const gateFresh = freshnessFor(d.gate.last_seen, now, interval, d.settings);
  const tier = tierFor(d.latest.level_cm, d.settings);

  return (
    <>
      <AlertSuggestion tier={tier} level={d.latest.level_cm} lastAlert={d.lastAlert} freshState={sensorFresh.state} now={now} />
      <div className="home-grid">
        <div className="home-main">
          <CameraPanel cameraOk={d.station.camera_ok} />
        </div>
        <div className="home-side">
          <LevelCard d={d} tier={tier} fresh={sensorFresh} />
          <TrendCard d={d} />
          <GateCard gate={d.gate} lastEvent={d.gateLastEvent} fresh={gateFresh} now={now} />
          <SensorCard station={d.station} fresh={sensorFresh} now={now} />
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const state = useData(() => getHome(), ['readings', 'gate', 'station', 'alerts']);
  return (
    <div className="page">
      <h1 className="page-title">{t.home.title}</h1>
      <Async state={state}>{(d) => <HomeBody d={d} />}</Async>
    </div>
  );
}
