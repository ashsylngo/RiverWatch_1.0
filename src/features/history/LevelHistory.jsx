import { useMemo, useState } from 'react';
import {
  Area, AreaChart, CartesianGrid, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { getHistory } from '../../lib/data/index.js';
import { useData } from '../../lib/useData.js';
import { downloadCsv } from '../../lib/csv.js';
import { TIERS, tierLabel } from '../../lib/status.js';
import { formatDateTime, formatDuration, formatShortDate, formatShortTime } from '../../lib/time.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Table from '../../components/ui/Table.jsx';
import { StatusBadge } from '../../components/ui/Badge.jsx';
import { Async, EmptyState } from '../../components/ui/States.jsx';
import t from '../../strings/en.js';

const RANGES = ['24h', '7d', '30d'];
const PAGE_SIZE = 12;
const tick = { fontSize: 11, fill: 'var(--ink-soft)' };

function summarize(d) {
  const { readings, settings: s } = d;
  if (readings.length === 0) return null;
  let peak = readings[0];
  const ms = { normal: 0, watch: 0, warning: 0, critical: 0 };
  for (let i = 0; i < readings.length; i += 1) {
    const r = readings[i];
    if (r.level_cm > peak.level_cm) peak = r;
    const next = readings[i + 1] ? readings[i + 1].t : d.until;
    ms[r.status] += Math.max(0, next - r.t);
  }
  return { peak, ms, alerts: d.alerts.filter((a) => a.level !== 'test').length, tests: d.alerts.filter((a) => a.level === 'test').length, s };
}

function Chart({ d }) {
  const { settings: s, readings, range } = d;
  const max = readings.reduce((m, r) => Math.max(m, r.level_cm), 0);
  const yMax = Math.ceil(Math.max(s.critical_cm * 1.2, max * 1.08) / 50) * 50;
  const yTicks = Array.from({ length: yMax / 50 + 1 }, (_, i) => i * 50);
  const bands = [
    ['normal', 0, s.watch_cm],
    ['watch', s.watch_cm, s.warning_cm],
    ['warning', s.warning_cm, s.critical_cm],
    ['critical', s.critical_cm, yMax],
  ];
  const fmt = range === '24h' ? formatShortTime : formatShortDate;
  const lines = [
    ['watch', s.watch_cm, 'var(--status-watch-fg)'],
    ['warning', s.warning_cm, 'var(--status-warning-fg)'],
    ['critical', s.critical_cm, 'var(--status-critical-fg)'],
  ];
  // Recharts draws thousands of points slowly; thin the series for the chart only. The table keeps everything.
  const step = Math.max(1, Math.ceil(readings.length / 400));
  const data = readings.filter((_, i) => i % step === 0 || i === readings.length - 1);
  return (
    <div className="chart-box" role="img" aria-label={t.history.chartLabel(t.history.range[range])}>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
          {bands.map(([tier, y1, y2]) => (
            <ReferenceArea key={tier} y1={y1} y2={y2} fill={`var(--status-${tier}-bg)`} fillOpacity={0.55} ifOverflow="hidden" />
          ))}
          <XAxis dataKey="t" type="number" scale="time" domain={[d.since, d.until]} tickFormatter={fmt} tick={tick} tickCount={7} stroke="var(--line)" />
          <YAxis domain={[0, yMax]} ticks={yTicks} tick={tick} width={42} stroke="var(--line)" />
          {lines.map(([tier, y, color]) => (
            <ReferenceLine
              key={tier}
              y={y}
              stroke={color}
              strokeDasharray="5 3"
              label={{ value: `${tierLabel(tier)} ${y} cm`, position: 'insideTopRight', fontSize: 11, fill: color }}
            />
          ))}
          <Tooltip
            labelFormatter={(v) => formatDateTime(v)}
            formatter={(v) => [`${v} cm`, t.history.levelCm]}
            contentStyle={{ borderRadius: 8, border: '1px solid var(--line)', color: 'var(--ink)' }}
          />
          <Area type="monotone" dataKey="level_cm" stroke="var(--blue-600)" strokeWidth={2} fill="var(--blue-300)" fillOpacity={0.45} dot={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function Body({ d, range }) {
  const [page, setPage] = useState(0);
  const sum = useMemo(() => summarize(d), [d]);
  const rowsDesc = useMemo(() => d.readings.slice().reverse(), [d.readings]);
  const pages = Math.max(1, Math.ceil(rowsDesc.length / PAGE_SIZE));
  const safePage = Math.min(page, pages - 1);
  const shown = rowsDesc.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  if (!sum) return <EmptyState icon="history" title={t.history.emptyTitle} text={t.history.emptyText} />;

  function exportCsv() {
    const rows = [['recorded_at', 'level_cm', 'status']];
    d.readings.forEach((r) => rows.push([r.recorded_at, r.level_cm, r.status]));
    downloadCsv(`riverwatch-water-level-${range}`, rows);
  }

  return (
    <>
      <div className="summary-grid">
        <Card title={t.history.highest}>
          <p className="big-num">{sum.peak.level_cm}<span className="level-unit"> {t.home.level.unit}</span></p>
          <p className="muted small">{t.history.at(formatDateTime(sum.peak.t))}</p>
          <StatusBadge tier={sum.peak.status} />
        </Card>
        <Card title={t.history.timeAtStatus}>
          <ul className="time-list">
            {TIERS.map((tier) => (
              <li key={tier}>
                <StatusBadge tier={tier} />
                <span>{sum.ms[tier] > 0 ? formatDuration(sum.ms[tier]) : t.history.none}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title={t.history.alertsSent}>
          <p className="big-num">{sum.alerts}</p>
          <p className="muted small">{t.history.alertsRangeNote(sum.tests)}</p>
        </Card>
      </div>

      <Card title={t.history.chartTitle}>
        <Chart d={d} />
        <p className="muted small">{t.history.chartNote}</p>
      </Card>

      <Card
        title={t.history.tableTitle}
        actions={<Button icon="download" onClick={exportCsv}>{t.history.exportCsv}</Button>}
      >
        <Table caption={t.history.tableCaption}>
          <thead>
            <tr>
              <th scope="col">{t.history.colTime}</th>
              <th scope="col">{t.history.colLevel}</th>
              <th scope="col">{t.history.colStatus}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                <td>{formatDateTime(r.t)}</td>
                <td>{r.level_cm}</td>
                <td><StatusBadge tier={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="pager">
          <Button icon="chevronLeft" onClick={() => setPage(safePage - 1)} disabled={safePage === 0}>{t.common.previous}</Button>
          <span role="status">{t.common.pageOf(safePage + 1, pages)}</span>
          <Button onClick={() => setPage(safePage + 1)} disabled={safePage >= pages - 1}>{t.common.next}</Button>
        </div>
      </Card>
    </>
  );
}

export default function LevelHistory() {
  const [range, setRange] = useState('24h');
  const state = useData(() => getHistory(range), ['alerts'], [range]);
  return (
    <>
      <div className="toolbar">
        <div className="seg" role="group" aria-label={t.history.rangeLabel}>
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              className={`seg-btn ${range === r ? 'is-active' : ''}`}
              aria-pressed={range === r}
              onClick={() => setRange(r)}
            >
              {t.history.range[r]}
            </button>
          ))}
        </div>
      </div>
      <Async state={state}>{(d) => <Body key={d.range} d={d} range={range} />}</Async>
    </>
  );
}
