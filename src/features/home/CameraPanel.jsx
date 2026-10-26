import Card from '../../components/ui/Card.jsx';
import Icon from '../../components/ui/Icon.jsx';
import t from '../../strings/en.js';

/**
 * Placeholder icon only. No image, video, scene or animation.
 * The real stream (for example from the ESP32-CAM) is out of scope and can replace the box later.
 * It carries no frame, so it has no timestamp or freshness badge.
 */
export default function CameraPanel({ cameraOk }) {
  return (
    <Card
      title={t.home.camera.title}
      className="camera-card"
      actions={(
        <span className={`chip ${cameraOk ? 'chip-live' : 'chip-off'}`}>
          <Icon name={cameraOk ? 'camera' : 'cameraOff'} size={16} />
          {cameraOk ? t.home.camera.online : t.home.camera.offline}
        </span>
      )}
    >
      <div className={`camera-box ${cameraOk ? '' : 'is-off'}`}>
        <Icon name={cameraOk ? 'camera' : 'cameraOff'} size={112} strokeWidth={1.4} />
        {cameraOk ? (
          <p className="camera-line">{t.home.camera.placeholderLine}</p>
        ) : (
          <>
            <p className="camera-line">{t.home.camera.noSignal}</p>
            <p className="camera-sub">{t.home.camera.placeholderLabel}</p>
          </>
        )}
      </div>
    </Card>
  );
}
