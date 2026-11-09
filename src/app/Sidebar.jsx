import { NavLink } from 'react-router-dom';
import Icon from '../components/ui/Icon.jsx';
import Button from '../components/ui/Button.jsx';
import Logo from './Logo.jsx';
import { brand, DEMO_TOOLS_ENABLED } from './brand.js';
import { useT } from '../lib/i18n.jsx';

const ITEMS = [
  { to: '/home', icon: 'home', key: 'home' },
  { to: '/resident', icon: 'users', key: 'resident' },
  { to: '/alert', icon: 'message', key: 'alert' },
  { to: '/history', icon: 'history', key: 'history' },
  { to: '/control', icon: 'gauge', key: 'control' },
];

export default function Sidebar({ demoOpen, onToggleDemo }) {
  const t = useT();
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Logo src={brand.mark} className="logo-mark" />
      </div>
      <nav aria-label={t.nav.label}>
        <ul className="nav-list">
          {ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
                <Icon name={item.icon} size={20} />
                <span>{t.nav[item.key]}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {DEMO_TOOLS_ENABLED ? (
        <div className="sidebar-foot">
          <Button variant="ghost" icon="sliders" className="btn-block" aria-expanded={demoOpen} onClick={onToggleDemo}>
            {t.nav.demoTools}
          </Button>
        </div>
      ) : null}
    </aside>
  );
}
