// Five real photos of the river, supplied by the user, shown as the camera placeholder.
// They are sample photos, not a live feed. Files live in public/camera/ (1280 px wide, EXIF removed).
const base = import.meta.env.BASE_URL;

export const CAMERA_PHOTOS = [1, 2, 3, 4, 5].map((n) => `${base}camera/river-${n}.jpg`);

// How long each photo stays on screen, and how long the cross-fade takes (keep in step with .camera-photo in global.css).
export const PHOTO_INTERVAL_MS = 5000;
