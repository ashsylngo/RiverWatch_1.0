// Small outline icon set (UI icons only; these are not logos). Decorative by default.
const P = {
  home: <><path d="M3 11 12 3l9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><circle cx="17.5" cy="9" r="2.5" /><path d="M17 14.2c2.7.2 4.5 2.1 4.5 5" /></>,
  message: <><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-8l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" /><path d="M8 10h8M8 13h5" /></>,
  history: <><path d="M3 3v18h18" /><path d="m7 15 4-5 3 3 5-7" /></>,
  gauge: <><path d="M4 18a9 9 0 1 1 16 0" /><path d="m12 14 4-5" /><circle cx="12" cy="14" r="1.5" fill="currentColor" /></>,
  sliders: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="10" cy="18" r="2" /></>,
  camera: <><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" /><circle cx="12" cy="13" r="3.5" /></>,
  cameraOff: <><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" /><circle cx="12" cy="13" r="3.5" /><path d="M3 3l18 18" /></>,
  checkCircle: <><circle cx="12" cy="12" r="10" /><path d="m8 12.5 3 3 5-6" /></>,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  triangle: <><path d="M12 3 2.5 20h19L12 3z" /><path d="M12 9.5v4.5M12 17h.01" /></>,
  octagon: <><path d="M8 2h8l6 6v8l-6 6H8l-6-6V8l6-6z" /><path d="M12 7v6M12 16.5h.01" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 7v5l3 2" /></>,
  radio: <><circle cx="12" cy="12" r="2.5" fill="currentColor" /><path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9" /></>,
  offline: <><circle cx="12" cy="12" r="10" /><path d="m9 9 6 6M15 9l-6 6" /></>,
  gateClosed: <><path d="M3 4v16M21 4v16M3 4h18" /><path d="M8 4v10M12 4v10M16 4v10" /><path d="M3 18c3 2 6-2 9 0s6-2 9 0" /></>,
  gateOpen: <><path d="M3 4v16M21 4v16M3 4h18" /><path d="M3 18c3 2 6-2 9 0s6-2 9 0" /></>,
  download: <><path d="M12 3v12m0 0-4-4m4 4 4-4" /><path d="M4 20h16" /></>,
  upload: <><path d="M12 15V3m0 0-4 4m4-4 4 4" /><path d="M4 20h16" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: <><path d="M4 20h4L19 9l-4-4L4 16v4z" /><path d="m13.5 6.5 4 4" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /><path d="M10 11v6M14 11v6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  close: <path d="M5 5l14 14M19 5 5 19" />,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 11v6M12 7.5h.01" /></>,
  send: <><path d="M21 3 3 10.5l7 2.5 2.5 7L21 3z" /><path d="M10 13 21 3" /></>,
  battery: <><rect x="2" y="7" width="17" height="10" rx="2" /><path d="M22 11v2" /></>,
  signal: <path d="M4 20v-4M9 20v-8M14 20V8M19 20V4" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  refresh: <><path d="M20 11a8 8 0 0 0-14-4.5L4 8" /><path d="M4 4v4h4" /><path d="M4 13a8 8 0 0 0 14 4.5L20 16" /><path d="M20 20v-4h-4" /></>,
};

export default function Icon({ name, size = 20, strokeWidth = 2, className = '' }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {P[name]}
    </svg>
  );
}
