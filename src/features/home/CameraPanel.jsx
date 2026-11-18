import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { useT } from '../../lib/i18n.jsx';
import { CAMERA_PHOTOS, PHOTO_INTERVAL_MS } from './cameraPhotos.js';

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * River camera view. While the camera is OK it cross-fades through the photos in public/camera/, one after
 * another, with no end. No timestamp and no freshness badge, because it carries no real frame.
 * People who asked for reduced motion see the first photo and nothing moves.
 * When the camera is lost, or the photos cannot load, it shows the camera-off icon and "No camera signal".
 * The real stream (for example from the ESP32-CAM) is out of scope and can replace the box later.
 */
export default function CameraPanel({ cameraOk }) {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState(false);
  const [still] = useState(prefersReducedMotion);

  const showPhotos = cameraOk && !broken;

  useEffect(() => {
    if (!showPhotos || still) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % CAMERA_PHOTOS.length), PHOTO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [showPhotos, still]);

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
      {showPhotos ? (
        <div className="camera-box camera-box-photos">
          {CAMERA_PHOTOS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={i === index ? t.home.camera.photoAlt : ''}
              aria-hidden={i === index ? undefined : true}
              className={`camera-photo ${i === index ? 'is-active' : ''}`}
              decoding="async"
              draggable="false"
              onError={() => setBroken(true)}
            />
          ))}
        </div>
      ) : (
        <div className="camera-box is-off">
          <Icon name="cameraOff" size={112} strokeWidth={1.4} />
          <p className="camera-line">{t.home.camera.noSignal}</p>
        </div>
      )}
    </Card>
  );
}
