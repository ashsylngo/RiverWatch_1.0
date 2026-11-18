import { useEffect, useState } from 'react';
import Card from '../../components/ui/Card.jsx';
import Icon from '../../components/ui/Icon.jsx';
import Button from '../../components/ui/Button.jsx';
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
 * Camera placeholder. While the camera is OK it cross-fades through five sample photos of the river,
 * labeled "Sample photos (placeholder, not live)". It is never presented as live: no timestamp, no LIVE badge.
 * When the camera is lost it shows the camera-off icon and "No camera signal" (no photos).
 * If the photos cannot load it falls back to the plain icon placeholder.
 * The real stream (for example from the ESP32-CAM) is out of scope and can replace the box later.
 */
export default function CameraPanel({ cameraOk }) {
  const t = useT();
  const [index, setIndex] = useState(0);
  // Auto-advancing content needs a way to pause it. Start paused for people who asked for reduced motion.
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [broken, setBroken] = useState(false);

  const showPhotos = cameraOk && !broken;

  useEffect(() => {
    if (!showPhotos || !playing) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % CAMERA_PHOTOS.length), PHOTO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [showPhotos, playing]);

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
        <>
          <div className="camera-box camera-box-photos" role="group" aria-label={t.home.camera.slideshowLabel}>
            {CAMERA_PHOTOS.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={i === index ? t.home.camera.photoAlt(i + 1, CAMERA_PHOTOS.length) : ''}
                aria-hidden={i === index ? undefined : true}
                className={`camera-photo ${i === index ? 'is-active' : ''}`}
                decoding="async"
                draggable="false"
                onError={() => setBroken(true)}
              />
            ))}
            <span className="camera-caption">{t.home.camera.samplePhotos}</span>
          </div>
          <div className="camera-controls">
            <Button
              icon={playing ? 'pause' : 'play'}
              onClick={() => setPlaying((p) => !p)}
              aria-pressed={!playing}
            >
              {playing ? t.home.camera.pause : t.home.camera.play}
            </Button>
            <span className="camera-dots" aria-hidden="true">
              {CAMERA_PHOTOS.map((src, i) => (
                <span key={src} className={`camera-dot ${i === index ? 'is-active' : ''}`} />
              ))}
            </span>
            <span className="camera-count">{t.home.camera.count(index + 1, CAMERA_PHOTOS.length)}</span>
          </div>
        </>
      ) : (
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
      )}
    </Card>
  );
}
