import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import DemoDrawer from '../features/demo/DemoDrawer.jsx';
import { DEMO_TOOLS_ENABLED } from './brand.js';
import t from '../strings/en.js';

export default function Shell({ children }) {
  const [demoOpen, setDemoOpen] = useState(false);
  const mainRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [pathname]);

  return (
    <div className={`app ${DEMO_TOOLS_ENABLED && demoOpen ? 'has-drawer' : ''}`}>
      <button type="button" className="skip-link" onClick={() => mainRef.current?.focus()}>
        {t.app.skip}
      </button>
      <Sidebar demoOpen={demoOpen} onToggleDemo={() => setDemoOpen((v) => !v)} />
      <div className="main">
        <TopBar />
        <main id="main" ref={mainRef} className="content" tabIndex={-1}>
          {children}
        </main>
      </div>
      {DEMO_TOOLS_ENABLED && demoOpen ? <DemoDrawer onClose={() => setDemoOpen(false)} /> : null}
    </div>
  );
}
