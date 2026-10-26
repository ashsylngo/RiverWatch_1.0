import Card from '../../components/ui/Card.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { FreshnessBadge } from '../../components/ui/Badge.jsx';
import { formatAge, formatDateTime } from '../../lib/time.js';
import t from '../../strings/en.js';

export default function SensorCard({ station, fresh }) {
  return (
    <Card title={t.home.sensor.title} actions={<span className="chip chip-note">{t.common.simulated}</span>}>
      <dl className="kv">
        <dt><Icon name="battery" size={16} />{t.home.sensor.battery}</dt>
        <dd>{`${station.battery_pct}%`}</dd>
        <dt><Icon name="signal" size={16} />{t.home.sensor.signal}</dt>
        <dd>{`${station.signal_pct}%`}</dd>
        <dt><Icon name={station.camera_ok ? 'camera' : 'cameraOff'} size={16} />{t.home.sensor.camera}</dt>
        <dd>{station.camera_ok ? t.home.sensor.cameraOk : t.home.sensor.cameraOffline}</dd>
        <dt><Icon name="clock" size={16} />{t.home.sensor.lastSeen}</dt>
        <dd>
          {`${formatDateTime(station.last_seen)} (${formatAge(fresh.ageMs)})`}
          {' '}
          <FreshnessBadge state={fresh.state} />
        </dd>
        <dt>{t.home.sensor.sensorId}</dt>
        <dd>{`${station.sensor_id} (${station.name})`}</dd>
      </dl>
    </Card>
  );
}
