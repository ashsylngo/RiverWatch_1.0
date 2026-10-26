import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Shell from './Shell.jsx';
import Splash from './Splash.jsx';
import { AppProvider } from './AppContext.jsx';
import Home from '../features/home/Home.jsx';
import Resident from '../features/resident/Resident.jsx';
import Alert from '../features/alert/Alert.jsx';
import History from '../features/history/History.jsx';
import Control from '../features/control/Control.jsx';
import { hasSeenSplash, markSplashSeen } from '../lib/data/index.js';
import t from '../strings/en.js';

export default function App() {
  const [showSplash, setShowSplash] = useState(() => !hasSeenSplash());
  const navigate = useNavigate();

  useEffect(() => {
    document.title = t.app.name;
  }, []);

  const finishSplash = useCallback(() => {
    markSplashSeen();
    setShowSplash(false);
    navigate('/home', { replace: true });
  }, [navigate]);

  const ctx = useMemo(() => ({ replaySplash: () => setShowSplash(true) }), []);

  if (showSplash) return <Splash onDone={finishSplash} />;

  return (
    <AppProvider value={ctx}>
      <Shell>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/resident" element={<Resident />} />
          <Route path="/alert" element={<Alert />} />
          <Route path="/history" element={<History />} />
          <Route path="/control" element={<Control />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Shell>
    </AppProvider>
  );
}
