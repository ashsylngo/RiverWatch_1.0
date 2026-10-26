import { NavLink } from 'react-router-dom';
import Icon from '../components/ui/Icon.jsx';
import Button from '../components/ui/Button.jsx';
import Logo from './Logo.jsx';
import { brand, DEMO_TOOLS_ENABLED } from './brand.js';
import t from '../strings/en.js';

const ITEMS = [
  { to: '/home', icon: 'home', label: t.nav.home },
  { to: '/resident', icon: 'users', label: t.nav.resident },
  { to: '/alert', icon: 'message', label: t.nav.alert },
  { to: '/history', icon: 'history', label: t.nav.history },
];

export default function Sidebar({ demoOpen, onToggleDemo }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-tile">
          <Logo src={brand.mark} className="logo-mark" />
        </div>
      </div>
      <nav aria-label={t.nav.label}>
        <ul className="nav-list">
          {ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {DEMO_TOOLS_ENABLED ? (
        <div className="sidebar-foot">
          <Button variant="secondary" icon="sliders" className="btn-block" aria-expanded={demoOpen} onClick={onToggleDemo}>
            {t.nav.demoTools}
          </Button>
        </div>
      ) : null}
    </aside>
  );
}
