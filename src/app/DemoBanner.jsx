import Icon from '../components/ui/Icon.jsx';
import t from '../strings/en.js';

export default function DemoBanner() {
  return (
    <div className="demo-banner" role="note">
      <Icon name="info" size={18} />
      <span>{t.demoBanner.text}</span>
    </div>
  );
}
