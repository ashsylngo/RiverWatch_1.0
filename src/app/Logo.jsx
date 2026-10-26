import { useState } from 'react';
import t from '../strings/en.js';

/**
 * Shows a supplied logo exactly as it is (natural proportions, no recoloring).
 * TEMP: if the file is missing or fails to load, a plain text wordmark is shown instead.
 * The fallback is never a drawn substitute. Supply the logo file to remove it.
 */
export default function Logo({ src, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <span className={`wordmark-temp ${className}`}>{t.app.name}</span>;
  }
  return (
    <img
      className={`logo-img ${className}`}
      src={src}
      alt={t.brand.logoAlt}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

/** Optional barangay seal. Renders nothing if there is no file or it fails to load (no broken-image icon). */
export function Seal({ src }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return <img className="seal-img" src={src} alt={t.brand.sealAlt} onError={() => setFailed(true)} />;
}
