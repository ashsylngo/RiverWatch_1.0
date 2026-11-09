// Brand files, used only as supplied from public/brand/. No redrawing, recoloring or stretching.
const base = import.meta.env.BASE_URL;

export const brand = {
  // Full logo: splash screen. Mark: top of the sidebar. One transparent logo is supplied, so both use the same file at different sizes.
  logo: `${base}brand/riverwatch-logo.png`,
  mark: `${base}brand/riverwatch-logo.png`,
  // Optional barangay seal for the top bar. None supplied yet: set to `${base}brand/barangay-seal.png` after adding the file.
  seal: null,
};

export const DEMO_TOOLS_ENABLED = import.meta.env.VITE_DEMO_TOOLS !== 'false';
