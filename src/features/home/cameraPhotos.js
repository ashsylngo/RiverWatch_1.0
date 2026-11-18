// Five photos of the river, supplied by the user, shown in the camera panel one after another.
// Files live in public/camera/ (1200 px wide, EXIF removed). A real stream can replace them later.
const base = import.meta.env.BASE_URL;

export const CAMERA_PHOTOS = [1, 2, 3, 4, 5].map((n) => `${base}camera/river-${n}.jpg`);

// How long each photo stays on screen. The cross-fade (1.2 s) is set in .camera-photo in global.css.
export const PHOTO_INTERVAL_MS = 5000;
