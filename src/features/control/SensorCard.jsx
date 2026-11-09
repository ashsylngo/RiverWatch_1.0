import Card from '../../components/ui/Card.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { FreshnessBadge } from '../../components/ui/Badge.jsx';
import { formatAge, formatDateTime } from '../../lib/time.js';
import { useLocale } from '../../lib/i18n.jsx';

export default function SensorCard({ station, fresh }) {
  const { t, lang, num } = useLocale();
  return (
    <Card title={t.control.sensorTitle} actions={<span className="chip chip-note">{t.common.simulated}</span>}>
      <dl className="kv">
        <dt><Icon name="battery" size={16} />{t.home.sensor.battery}</dt>
        <dd>{`${num(station.battery_pct)}%`}</dd>
        <dt><Icon name="signal" size={16} />{t.home.sensor.signal}</dt>
        <dd>{`${num(station.signal_pct)}%`}</dd>
        <dt><Icon name={station.camera_ok ? 'camera' : 'cameraOff'} size={16} />{t.home.sensor.camera}</dt>
        <dd>{station.camera_ok ? t.home.sensor.cameraOk : t.home.sensor.cameraOffline}</dd>
        <dt><Icon name="clock" size={16} />{t.home.sensor.lastSeen}</dt>
        <dd>
          {`${formatDateTime(station.last_seen, lang)} (${formatAge(fresh.ageMs, t)})`}
          {' '}
          <FreshnessBadge state={fresh.state} />
        </dd>
        <dt>{t.home.sensor.sensorId}</dt>
        <dd>{`${station.sensor_id} (${station.name})`}</dd>
      </dl>
    </Card>
  );
}
