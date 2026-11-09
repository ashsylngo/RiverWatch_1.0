import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import Card from '../../components/ui/Card.jsx';
import { formatShortTime } from '../../lib/time.js';
import { useLocale } from '../../lib/i18n.jsx';

const SIX_HOURS = 6 * 3600 * 1000;
const tick = { fontSize: 11, fill: 'var(--text-muted)' };

export default function TrendCard({ d }) {
  const { t, lang, num } = useLocale();
  const { series, settings: s, latest } = d;
  const end = series.length ? series[series.length - 1].t : Date.parse(latest.recorded_at);
  const start = end - SIX_HOURS;
  const max = series.reduce((m, p) => Math.max(m, p.level_cm), 0);
  const yMax = Math.ceil(Math.max(s.critical_cm * 1.15, max * 1.1) / 50) * 50;
  const yTicks = Array.from({ length: yMax / 50 + 1 }, (_, i) => i * 50);
  const lines = [
    ['watch', s.watch_cm, 'var(--status-watch-fg)'],
    ['warning', s.warning_cm, 'var(--status-warning-fg)'],
    ['critical', s.critical_cm, 'var(--status-critical-fg)'],
  ];
  return (
    <Card title={t.home.trend.title}>
      <p className="muted small trend-caption">{t.home.trend.caption}</p>
      <div className="chart-box" role="img" aria-label={t.home.trend.chartLabel(Math.round(latest.level_cm))}>
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={series} margin={{ top: 6, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="t"
              type="number"
              scale="time"
              domain={[start, end]}
              tickFormatter={(v) => formatShortTime(v, lang)}
              tick={tick}
              tickCount={4}
              stroke="var(--border)"
            />
            <YAxis domain={[0, yMax]} ticks={yTicks} tick={tick} width={38} stroke="var(--border)" />
            {lines.map(([tier, y, color]) => (
              <ReferenceLine
                key={tier}
                y={y}
                stroke={color}
                strokeDasharray="5 3"
                label={{ value: `${t.status[tier].label} ${num(y)}`, position: 'insideTopLeft', fontSize: 10, fill: color }}
              />
            ))}
            <Line type="linear" dataKey="level_cm" stroke="var(--primary)" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
