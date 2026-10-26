import { useState } from 'react';
import Tabs from '../../components/ui/Tabs.jsx';
import LevelHistory from './LevelHistory.jsx';
import AlertsLog from './AlertsLog.jsx';
import GateBar from './GateBar.jsx';
import t from '../../strings/en.js';

const TABS = [
  { id: 'level', label: t.history.tabLevel },
  { id: 'alerts', label: t.history.tabAlerts },
];

export default function History() {
  const [tab, setTab] = useState('level');
  return (
    <div className="page page-history">
      <h1 className="page-title">{t.history.title}</h1>
      <Tabs tabs={TABS} value={tab} onChange={setTab} label={t.history.tabsLabel} idPrefix="history" />
      <div
        className="tab-panel"
        role="tabpanel"
        id={`history-panel-${tab}`}
        aria-labelledby={`history-tab-${tab}`}
      >
        {tab === 'level' ? <LevelHistory /> : <AlertsLog />}
      </div>
      <GateBar />
    </div>
  );
}
