import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Tabs from '../../components/ui/Tabs.jsx';
import LevelHistory from './LevelHistory.jsx';
import AlertsLog from './AlertsLog.jsx';
import { useT } from '../../lib/i18n.jsx';

export default function History() {
  const t = useT();
  const TABS = [
    { id: 'level', label: t.history.tabLevel },
    { id: 'alerts', label: t.history.tabAlerts },
  ];
  const [params] = useSearchParams();
  const { key } = useLocation();
  // The notification bell links to History > Alerts log with ?tab=alerts.
  const [tab, setTab] = useState(params.get('tab') === 'alerts' ? 'alerts' : 'level');
  useEffect(() => {
    if (params.get('tab') === 'alerts') setTab('alerts');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
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
    </div>
  );
}
