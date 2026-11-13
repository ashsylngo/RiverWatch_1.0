# RiverWatch: PLAN.md

> River water level monitoring and SMS flood alerts for Brgy. Maligaya, Rosario, Batangas: a desktop dashboard for barangay officials

Claude: read this file and `CLAUDE.md` at the start of every session. At the end of every session, output an updated **Section 14 (Environment State)** and a new row for **Section 16 (Progress Log)** for the user to paste back in.

## The one prompt

Attach `CLAUDE.md`, `PLAN.md` and the logo files to a new chat, then send:

```
Read CLAUDE.md and PLAN.md, then build the complete RiverWatch demo app in this one session, following the build order in PLAN.md Section 12. The attached images are my logos. Use the defaults in PLAN.md Section 15 instead of asking me questions, build and verify it in the sandbox, then deliver all files at their repo paths with a numbered Manual Steps list and a short list of the assumptions you made.
```

**Update pass (2026-11-08):** the app is already built. To apply the Flat 2.0 design system, the new transparent logo, the English/Filipino toggle and the notification bell, attach `CLAUDE.md`, `PLAN.md`, `design.md`, `riverwatch-logo.png` and the current repo files, then send:

```
Read CLAUDE.md and PLAN.md, then apply the update pass in PLAN.md Section 12b to the attached repo files: the Flat 2.0 design from design.md, the new transparent logo, the English/Filipino toggle and the notification bell. Use the defaults in PLAN.md Section 15 instead of asking me questions, verify in the sandbox, then deliver the complete updated files at their repo paths with a numbered Manual Steps list and a short list of the assumptions you made.
```

Later changes use a short prompt such as: *"Change the History tab so the gate timeline is on the left. Attach the current `src/features/history` files."*

## 1. What this is

RiverWatch is the software side of a flood detection and water level monitoring system for the community around the river bridge in Brgy. Maligaya. It gives barangay officials one screen to:

- watch the river (camera view, current water level, flood status),
- keep a list of residents and their cellphone numbers,
- compose and send SMS flood alerts with evacuation and hotline information, and
- review history: water level over time, alerts sent, and the status of the hydraulic gate.

Research title: *RiverWatch: A Smart Flood Detection and Water Level Monitoring System for Barangay Community Safety.*

**This build is a showcase demo.** It shows the final interface running on **seeded, synthetic data stored locally in the app**. There is no database, no backend, no hardware, no real SMS and no network use. It is deployed on GitHub Pages. Connecting it to the real station is outside this plan.

The user's hand-drawn sketch is the source of truth for the screens:

| # | Sketch | Screen |
|---|---|---|
| 1 | Logo in a frame | Splash screen |
| 2 | Home, with sidebar tab bar, barangay name / time / date bar, "Monitoring Cam [River]" | Home tab |
| 3 | Resident, with a table of Name, Address, Cellphone Number | Resident tab |
| 4 | Alert, with "SMS Specifications": message content, evacuation location, disaster info / why, hotlines | Alert tab |
| 5 | History, with historical reports and data | History tab |
| 6 | (added 2026-10-26 at the user's request) Sensor data and "status of hydraulic gate" | Control tab |
| | Note at the bottom: "PC Computer" | Platform is a desktop computer |

## 2. Scope

### In scope

- Splash screen (the logo only), then the five tabs (Home, Resident, Alert, History, Control), at final visual quality, desktop first (1366×768 and up, usable at 1024 px).
- Flat 2.0 / Semi-flat theme from `design.md` (Section 5), with the user's transparent logo.
- **English and Filipino UI**, switched with a toggle in the top bar (Section 6, "Top bar controls").
- **Notification bell** in the top bar: an in-app list of system alerts with an unread count (Section 6, "Top bar controls").
- A **simulated live stream** that updates the water level and sensor status every few seconds, with correct freshness badges.
- Home: a **placeholder icon** where the river camera feed will go, current level, flood status, gate state, a short trend, and an alert suggestion when the level crosses a threshold.
- Resident: searchable, filterable table with add, edit, delete, CSV import and CSV export.
- Alert: the SMS specifications form, a live SMS preview, recipient selection, and a **simulated** send with per-recipient delivery status.
- History: water level chart and table with date ranges and CSV export, alerts log with delivery detail, and nothing about the gate (it moved to Control).
- Control: the sensor data (battery, signal, camera, last seen) and the hydraulic gate status with its full change history, display only.
- **Presenter panel** (Demo tools button) with one-tap scenarios and **Reset demo** (Section 8).
- Loading, empty and error states on every data call.
- `docs/DEMO_SCRIPT.md`: the click path and what to say.
- Deploy to GitHub Pages with GitHub Actions.

### Out of scope

Login and accounts, real SMS, any camera image, video or illustration (the camera panel is a placeholder icon), real sensor data, gate control, a map, notifications outside the app (push, email, SMS or operating-system notifications; the in-app bell is in scope), PWA install and offline mode, a phone layout (so the 768 px collapse rule in `design.md` is not applied), an i18n library, a third language, translating seeded data (names, messages, placeholders), an audit log screen, weekly printable reports, and any backend.

### Small additions beyond the sketch (marked to confirm)

These make the screens usable and are listed so the user can remove any of them:

1. Home: water level number, status badge, gate chip and a trend chart next to the camera placeholder.
2. Resident: `purok` column, active/inactive switch, search and purok filter, CSV import and export.
3. Alert: live SMS preview, character and segment count, recipient selector (all active, or by purok), send confirmation, and simulated delivery progress.
4. History: sub-tabs for Water level and Alerts log. The gate status stays as the bottom bar, as sketched.
5. Alert level selector (Watch, Warning, Critical, All clear, Test) that fills a template.
6. Top bar: language toggle (EN | FIL) and notification bell (added 2026-11-08 at the user's request).

## 3. Hard Rules (never break)

1. **No secrets, no real personal data.** The demo holds synthetic data only (Section 7). The only real place name is the barangay in the header.
2. **No real SMS.** The Alert tab runs a simulated gateway. Every send result and delivery status is labeled **Simulated**.
3. **Demo is never presented as live.** There is no Demo banner (removed at the user's request, 2026-10-26); demo status is shown by the "Simulated" labels, "System status (demo thresholds)" and the camera placeholder label. The camera panel is a placeholder icon labeled "Camera feed placeholder (demo)". Nothing claims a connection to a real sensor, camera, gate or SMS gateway.
4. **The gate is display-only.** The app has no open, close or reconfigure control for the hydraulic gate.
5. **The app suggests, the official sends.** When the level crosses a threshold the app suggests an alert. Nothing is sent without the official reviewing the message and confirming.
6. **Every value shows its age.** A reading or gate state is never shown as current without its timestamp. Stale and Offline are marked with icon and text, and a stale value is never drawn as live.
7. **Status is never color alone.** Always icon plus text. Brand colors never mean status. The accent color (orange) is a brand color and is never used for a status, tier or severity, even though it looks close to the Warning tone.
8. **Not an official warning.** The status badge is labeled "System status (demo thresholds)". The thresholds are defaults pending confirmation.
9. **Thresholds and timing are settings, not code.** Flood thresholds, the stale multiplier and the heartbeat limit are read from the seed settings through the data layer.
10. **No hard-coded UI text, in either language.** All UI text, including aria-labels and error messages, comes from `src/strings/en.js` and `src/strings/fil.js`, which have identical keys. New text is added to both files in the same change. SMS templates are data (Section 7).
11. **Screens go through the data layer.** Components never import seed files or `localStorage`. They use `src/lib/data/`.
12. **No network.** No requests except the app's own static files. No CDN fonts or scripts, no tiles, no analytics. Roboto is self-hosted from `public/fonts/`. Browser storage is versioned (`riverwatch.demo.v1` for demo data, `riverwatch.lang.v1` for the language choice), wrapped in try/catch, and the app works without saving if storage is blocked.
13. **Plain text only.** User-entered text is rendered as text, never as HTML.
14. **Logos are used as supplied.** No redrawing, recoloring or stretching. The logo is a transparent PNG with black lettering: use it only on light surfaces and never put a box or background behind it. Missing logo → plain text wordmark marked TEMP.
15. **Destructive and consequential actions confirm first.** Delete resident, Reset demo and Send alert each ask for confirmation.
16. **Notifications are in-app, derived and never official.** The bell lists system messages built from existing data (status, freshness, camera, gate, alerts sent). It sends nothing, never calls itself an official warning, and every item shows its age and carries the Simulated label. Its only action is **Prepare alert**, which opens the Alert tab and sends nothing.

## 4. Stack

| Layer | Choice |
|---|---|
| App | React + Vite, `HashRouter` |
| Charts | Recharts |
| Styling | Plain CSS with variables in `src/styles/tokens.css`, implementing `design.md` |
| Fonts | Roboto and Roboto Mono, self-hosted as woff2 in `public/fonts/`, with a system-ui fallback. No CDN |
| Text | `src/strings/en.js` and `src/strings/fil.js` (UI, identical keys), SMS templates as seed data (EN and FIL) |
| Language switching | A small custom context in `src/lib/i18n.jsx` (`LocaleProvider`, `useT`). No i18n library. Choice saved under `riverwatch.lang.v1` |
| Data | `src/lib/data/` with one `demo` source: seeds, generator, simulated stream, simulated SMS gateway |
| Hosting | GitHub Pages via GitHub Actions. The workflow uses `npm install` (no lockfile needed) and sets `VITE_BASE=/${{ github.event.repository.name }}/` so the base path always matches the repo name. `vite.config.js` reads `process.env.VITE_BASE` and defaults to `/` |
| Not used | Supabase, PWA and service worker, i18n library, map library, Tailwind, any CDN or web font host |

Routes: `#/home`, `#/resident`, `#/alert`, `#/history`, `#/control`. The splash is shown once per browser session on first load (and when replayed from Demo tools), then goes to `#/home`.

## 5. Theme and brand

**Flat 2.0 / Semi-flat**, defined in `design.md` (kept in the repo root as the source of truth for the visual system). A flat foundation with subtle shadows and depth cues restored, clear affordances, layered white cards on a pale blue-grey page, no skeuomorphic texture. Contrast target is WCAG AA: 4.5:1 for text, 3:1 for UI borders and icons.

```css
/* src/styles/tokens.css  (implements design.md; status tokens are separate and unchanged) */
:root {
  /* Brand (design.md) */
  --primary:        #3f6df0;  /* primary button, active tab, focus ring */
  --on-primary:     #000000;  /* text on primary (as specified in design.md) */
  --accent:         #ff7a45;  /* secondary button, notification count badge */
  --on-accent:      #000000;
  --bg:             #eef1f6;  /* page */
  --surface:        #ffffff;  /* cards, sidebar, top bar, panels */
  --surface-strong: #f4f6fa;  /* table headers, hover, inset areas */
  --border:         #dbe1ea;
  --text:           #1c2430;
  --text-muted:     #5a6472;

  /* Status (separate from brand; always icon + text) */
  --status-normal-fg:   #1B7A3A;  --status-normal-bg:   #E3F4E8;
  --status-watch-fg:    #7A5C00;  --status-watch-bg:    #FFF4CC;
  --status-warning-fg:  #9A4B00;  --status-warning-bg:  #FFE5CF;
  --status-critical-fg: #B3261E;  --status-critical-bg: #FDE3E1;
  --fresh-live-fg:  #1B7A3A;
  --fresh-stale-fg: #9A5B00;
  --fresh-off-fg:   #5B6770;

  /* Type */
  --font:      'Roboto', system-ui, 'Segoe UI', Arial, sans-serif;
  --font-mono: 'Roboto Mono', ui-monospace, Consolas, monospace;

  /* Radius and spacing */
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 16px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px; --space-8: 32px;

  /* Elevation: the six shadow values listed in design.md (under its "Radius scale" heading, which
     really holds shadows) read as three pairs, a tight shadow plus a soft one */
  --shadow-1: 0 1px 2px rgba(28,36,48,0.06), 0 4px 8px rgba(28,36,48,0.06);     /* cards at rest */
  --shadow-2: 0 2px 4px rgba(28,36,48,0.07), 0 10px 24px rgba(28,36,48,0.10);   /* hover, dropdowns, notification panel */
  --shadow-3: 0 4px 8px rgba(28,36,48,0.08), 0 24px 48px rgba(28,36,48,0.14);   /* modals, Demo tools drawer */
  --overlay:  color-mix(in srgb, var(--text) 45%, transparent);                 /* dialog backdrop */
}
```

The old brand variables (`--blue-*`, `--green-*`, `--ink`, `--ink-soft`, `--line`, `--page`, `--sidebar`, `--topbar`, `--demo-banner-*`, `--radius`, `--shadow`) are removed, and every use is switched to the tokens above. No hex values outside `tokens.css`.

Rules:

- **Page and surfaces:** the page is `--bg`. The sidebar, top bar and cards are `--surface` with `--border` lines. Cards have radius `--radius-lg`, 24 px padding and `--shadow-1` at rest (`--shadow-2` on hover only where the card is clickable). Dropdowns and the notification panel use `--shadow-2`. Modals and the Demo tools drawer use `--shadow-3`. Subtle gradients are allowed on buttons if built only from the same tokens plus transparency (no new hues).
- **Active tab:** `--primary` fill with `--on-primary` text.
- **Buttons** (radius `--radius-md`, 16 px horizontal padding, at least 40 px tall): `primary` is `--primary` with `--on-primary`. `secondary` is `--accent` with `--on-accent`. `ghost` is a neutral, outlined low-emphasis button (`--border` outline, `--surface` fill) for Cancel, Close, Previous/Next and similar, so orange stays for real secondary actions. `danger` keeps the critical status colors. In the `Button` component the default variant is `ghost`; `secondary` (orange) is used only for **Send test to myself** and the CSV import **Preview**. Every button has hover, pressed, disabled and a visible `:focus-visible` ring (3 px `--primary`, 2 px offset).
- **Black text on `--primary` is about 4.7:1, so hover and pressed states must not darken the fill.** Use a lift (`--shadow-2`) or a slight lightening instead, and check the contrast of every state.
- **Primary-colored text (links) appears only on `--surface`.** On `--bg` or `--surface-strong` it falls below 4.5:1, so use `--text` with an underline there.
- **Type:** Roboto (400, 600, 700) and Roboto Mono (400). Body is 1rem / 1.6 as in `design.md`; dense tables and lists may use 0.9375rem / 1.45 to fit 1366×768. `design.md`'s h1 (4rem, 700, line-height 1.05) is used for the big water level number only; page and card titles use a smaller scale. Small labels and table headers use `label-caps` (0.75rem, 600, 0.06em letter spacing, uppercase).
- **Fonts:** variable woff2 files, Latin subset, in `public/fonts/`, declared with `@font-face` and `font-display: swap` in `public/fonts/fonts.css`, which `index.html` links (relative `url()`s, so the base path always applies; Vite only prefixes the base for CSS urls of files that exist, which broke the missing-file case). Expected files: `roboto-latin-wght-normal.woff2` and `roboto-mono-latin-400-normal.woff2`. The sandbox has no network, so if the files are not supplied the app falls back to system-ui and the reply names the files to add (Roboto variable and Roboto Mono, Latin subset).
- **Motion:** honor `prefers-reduced-motion`. When set, turn off transitions, the splash fade and animated progress.
- **Forms:** persistent visible labels, textual error messages, visible keyboard focus.
- The four flood tiers use four **distinct icons** (Normal: check circle; Watch: eye; Warning: triangle; Critical: octagon) plus the tier name, so the brand accent is never confused with a status.
- Charts: the level series uses `--primary`. Flood tier bands and threshold lines use the status tokens with labels, not color alone.
- If the supplied logo colors clash with this palette, keep the palette and say so in the reply. Do not recolor the logo.

### Logo files (supplied by the user)

The logo is a **transparent PNG (1526×681) with black lettering**, supplied 2026-11-08. It goes only on light surfaces (the white sidebar and the white splash), never on a dark or colored background, and never inside a box or tile.

| File in `public/brand/` | Where it is used |
|---|---|
| `riverwatch-logo.png` | Splash screen, centered, with clear space. The same file is used for the top of the sidebar at about 64 px tall (natural proportions) |
| `riverwatch-mark.png` | Removed. The old opaque file is deleted and `brand.mark` points to `riverwatch-logo.png` |
| `barangay-seal.*` | Optional, left of the barangay name in the top bar |
| `favicon.png` | Optional. The wide logo cannot be squared without cropping, so the existing favicon stays until a square mark is supplied |

If a logo file is missing, the TEMP text wordmark shows. The sidebar's old logo tile (white box with border) is removed.

## 6. Layout and screens

### Global shell (tabs 2 to 6)

- **Left sidebar (tab bar):** the logo mark at the top, then **Home, Resident, Alert, History, Control**, then a **Demo tools** button at the bottom. The active tab is clearly marked. Fixed width (about 220 px).
- **Top bar:** barangay name on the left ("Brgy. Maligaya, Rosario, Batangas", with the seal if supplied). On the right, in this order: the **current time and date** (Asia/Manila, updating every second), the **language toggle** and the **notification bell**.
- **Content area:** scrolls on its own; the sidebar and top bar stay in place.

### Top bar controls (language toggle and notification bell)

**Language toggle (EN | FIL)**

- A compact segmented control with two buttons, `EN` and `FIL`, in a group labeled "Language" (translated). Each button uses `aria-pressed` and carries its own `lang` attribute. At least 40 px tall. The active segment uses `--primary` with `--on-primary`.
- Switches instantly, with no reload: all UI text, aria-labels, relative times, dates and numbers change. Dates and numbers use `Intl` with `en-PH` or `fil-PH`, still in Asia/Manila and 12-hour time. It also sets `<html lang>` to `en` or `fil`.
- Saved under `riverwatch.lang.v1` (not inside `riverwatch.demo.v1`, so **Reset demo** does not change it). On the first visit it is Filipino if `navigator.language` starts with `fil` or `tl`, otherwise English.
- It does **not** change the SMS message language (the Alert form has its own Language field, default English) and it does not translate seeded data (resident names, past alert messages, hotline and evacuation center names). CSV column headers and file names stay English so exports can be re-imported.
- Filipino wording is natural, not word for word, and uses the terms people actually use (for example baha, antas ng tubig, ilog, floodgate, evacuation center, hotline). Uncertain wording is marked `// TODO(review)` for a native speaker. Filipino text is often longer, so nothing may be cut off or overflow at 1024 px, including status badges, buttons, table headers and the notification panel.

**Notification bell**

- A 40 px icon button at the far right of the top bar. A count badge (`--accent` fill, `--on-accent` number) shows the unread count, is hidden at zero and shows "9+" above 9. The badge is a count, never a severity.
- Clicking opens a popover card under the bell (about 380 px wide, `--shadow-2`) with a header ("Notifications" and a **Mark all as read** button), a scrolling list (newest first, at most 20) and a footer line "System status (demo thresholds). Simulated."
- Each item shows a severity icon **and** text (Info, Watch, Warning or Critical, with the same icons as the flood tiers and the info icon), a title, a short message, its age ("5 min ago", full date on hover), and an unread marker that is a dot plus hidden text "Unread", not color alone. Items about the suggested alert have a **Prepare alert** button that opens the Alert tab prefilled and sends nothing. Items about a sent alert link to History > Alerts log (`#/history?tab=alerts`; History reads the `tab` parameter).
- Empty state: icon and "No new alerts".
- What creates an item:

| Kind | Raised when | Severity |
|---|---|---|
| Level status | The system status changes tier (up or down) | The new tier, or Info for back to Normal |
| Alert suggestion | The same condition that shows the Home suggestion banner | The tier that triggered it |
| Sensor | The reading becomes Stale or Offline, or the camera is lost | Watch for Stale or camera lost, Warning for Offline |
| Gate | The simulated gate state changes (display only) | Info |
| Alert sent | An alert is sent (simulated) | Info |

- Items store a kind, a severity, a time and parameters, **not finished text**. The title and message are built from the strings files when they are shown, so switching language re-translates existing items.
- At load the list holds the last three seeded alerts, already read, so the badge starts at 0. The read state is a timestamp (`notifications_read_at`). Items newer than it are unread. **Mark all as read** sets it to now.
- Accessibility: the bell is a real `<button>` with an aria-label that includes the unread count (translated), `aria-haspopup="dialog"` and `aria-expanded`. The panel has `role="dialog"` and a label. Focus moves into the panel on open. Escape and a click outside close it, and focus returns to the bell. Every control inside is reachable by keyboard.

### 1. Splash

- A full-screen white page with the full logo centered, and nothing else (no text, checklist or buttons). It stays about 2.5 seconds.
- Click or press any key to skip. Then go to Home.

### 2. Home

Two-column layout (about 2/3 and 1/3).

- **Monitoring camera (river), main panel:** a **placeholder icon only**. A large, plain camera icon (inline SVG, outline style, `--text-muted` on a `--surface-strong` panel with a dashed `--border` border, 16:9 aspect ratio) centered in the panel, with the title "Monitoring camera: River" and the line "Camera feed placeholder (demo). A live stream will appear here." No image, video, scene or animation. States: **Online** (camera icon, as above) and **Offline** (camera-off icon, "No camera signal"), shown with icon and text. The panel has no timestamp or freshness badge because it carries no frame.
- **Right column cards:**
  - **Water level:** the current level in cm (large), the system status badge (Normal, Watch, Warning, Critical) labeled "System status (demo thresholds)", the reading's age, and a freshness badge.
  - **Trend:** a small Recharts line chart for the last 6 hours with the threshold lines.
  - **Hydraulic gate:** current state (Open or Closed), when it last changed, freshness badge, and the note "Display only".
- **Alert suggestion banner:** when the status is Watch, Warning or Critical (or returns to Normal after an alert), a banner at the top of the content area says what changed and offers **Prepare alert**, which opens the Alert tab with the level and message prefilled.

### 3. Resident

- **Table** with columns **Name, Address, Cellphone Number** (as sketched), plus **Purok** and **Active**. Phone numbers are shown masked (`09•• ••• 1234`).
- **Toolbar:** search box (name or address), purok filter, **Add resident**, **Import CSV**, **Export CSV**, and a count ("48 residents, 40 active").
- **Add / edit** in a modal: name (required), purok (1 to 6), address (prefilled from the purok, editable), cellphone (11 digits starting with 09), active switch. Inline validation.
- **Delete** with confirmation. **Import CSV** parses locally (columns: name, address, purok, phone), shows a preview with row errors, then confirms. No network.
- Note under the table: "Demo: changes are saved only in this browser. Resident data is personal information (RA 10173)."
- Empty state when no residents match.

### 4. Alert (SMS Specifications)

Two columns: the **specifications form** on the left, the **SMS preview and send** on the right.

Form (the sketch's four items, plus level and recipients):

- **Alert level:** Watch, Warning, Critical, All clear, Test. Choosing one fills the template. When opened from the Home suggestion, the level and current water level are prefilled.
- **Language:** English or Filipino (changes the template).
- **Message content:** an editable text box, filled from the template. Placeholders (`{LEVEL_CM}` and so on) are replaced live. If the official edits the text by hand, a note says "Edited manually" with a **Reset to template** link.
- **Evacuation location:** a dropdown from the seeded evacuation centers, with a "Custom" option and a text field.
- **Disaster info / why:** a short text box, prefilled by level (for example, "Heavy rain upstream is raising the river level") and the current reading. Editable.
- **Hotlines:** checkboxes from the seeded hotline list. The selected ones are written into the message.
- **Recipients:** All active residents, or selected puroks. Shows the count.

Right side:

- **SMS preview** in a phone-style bubble (a plain styled box, no image), showing the final text, the character count and the estimated number of SMS segments (160 characters for one segment, 153 per segment when longer, 70 and 67 if the text has non-GSM characters; shown as an estimate).
- **Send alert (simulated)** button. A confirmation dialog shows the level, recipient count, and the full message. After confirming, a **delivery panel** shows progress: queued, sent, delivered, with a few failed then retried, per the scripted simulation. A summary line shows "Delivered 38, Failed 2 (retried)". Everything is labeled **Simulated**.
- A small line under the button: "Last alert sent: [level], [time ago], [delivered/total]".
- **Send test to myself** option: sends the preview to a single seeded "Demo Official" number (simulated).

### 5. History

- Header with sub-tabs: **Water level** and **Alerts log**.
- **Water level (main area):**
  - Range selector: 24 hours, 7 days, 30 days.
  - Area/line chart of level in cm with the Watch, Warning and Critical thresholds drawn as labeled reference lines.
  - Summary cards: highest level in the range (with time), time spent at each status, number of alerts sent.
  - Data table below (time, level, status), paginated, with **Export CSV**.
- **Alerts log:** table of past alerts (time, level, language, recipients, delivered, failed, sent by). Click a row to open a detail panel with the full message, evacuation location, disaster info, hotlines used, and the per-recipient delivery list. **Export CSV**.
- (The hydraulic gate status moved to the Control tab.)

### 6. Control

Two cards side by side, then the gate history.

- **Sensor data:** battery %, signal strength, camera OK or offline, last seen with age and a freshness badge, sensor id (all simulated).
- **Hydraulic gate:** the current state with icon and text, the age and a freshness badge, the last change and its note. Labeled "Display only". No open, close or reconfigure control.
- **Gate history:** the full gate timeline (time, state, water level at that moment, note).

## 7. Seeded data

Everything is generated by a **deterministic seeded generator** (a small PRNG such as mulberry32 with a fixed seed), so the shape is the same on every load. Timestamps are relative to the load time. Field names follow Section 10.

| Data | Seed |
|---|---|
| Barangay | Name "Brgy. Maligaya", municipality "Rosario", province "Batangas" |
| Station | One river station "Station 1, River Bridge", sensor `RW-DEMO-01`, expected interval 60 s, battery about 82%, signal about 71%, camera OK |
| Water readings | **30 days**: hourly for days 30 to 2 ago, every 10 minutes for the last 2 days. Baseline 55 to 90 cm with gentle daily variation and noise. Four storm events: one reaching about 118 cm (Watch), one about 138 cm (Watch), one about 172 cm (Warning), one about 214 cm (Critical, about 20 days ago). The **load-time state is Normal at about 82 cm** |
| Thresholds (defaults, pending confirmation) | Watch 100 cm, Warning 150 cm, Critical 200 cm |
| Timing settings (defaults) | Stale after 3 expected intervals (180 s). Offline after 600 s |
| Hydraulic gate | One gate "Gate 1". Current state Open, last changed about 9 days ago. **About 12 gate events** over 30 days, closing during storm peaks and reopening afterwards, each with the water level at that moment and a note |
| Residents | **48 synthetic residents** across Purok 1 to 6 (8 per purok), named like "Maria Demo 01", addresses "Purok N, Brgy. Maligaya", phones like `09XX XXX 0001` to `09XX XXX 0048`, 8 marked inactive |
| Hotlines (placeholders) | "Brgy. Maligaya BDRRMC (placeholder)", "Rosario MDRRMO (placeholder)", "Bureau of Fire Protection (placeholder)", "Philippine National Police (placeholder)", "Rural Health Unit (placeholder)", "Philippine Red Cross (placeholder)". Numbers shown as `0000 000 0000 (placeholder)` |
| Evacuation centers (placeholders) | "Barangay Multi-purpose Hall (placeholder)", "Elementary School Gym (placeholder)", "Barangay Covered Court (placeholder)" |
| Alerts | **8 past alerts** across the 30 days, matching the storm events: Test, Watch, Watch, Warning, All clear, Critical, All clear, Test. Each with message, evacuation location, disaster info, hotlines, recipient count, delivered and failed counts, `sent_by` "Demo Official" |
| SMS deliveries | Per-recipient rows for the **two most recent alerts** (statuses: delivered mostly, a few failed then retried). Older alerts keep counts only |
| SMS templates | One per level and language (Section 9), editable text with placeholders |
| Demo Official | One seeded test number (masked placeholder) for "Send test to myself" |

Names, hotlines and evacuation centers are **placeholders**. The user replaces them later with verified real values (open item).

## 8. Presenter panel (Demo tools)

A button at the bottom of the sidebar opens a side drawer. Scenarios are one tap each:

| Scenario | What the audience sees |
|---|---|
| **River rising** | The simulated level ramps up through Watch, Warning and Critical over about 30 seconds. The status badge changes, the trend updates, and the **alert suggestion banner** appears at each tier |
| **Send alert** | Jumps to Alert with the current level prefilled so the full composing and simulated delivery can be shown |
| **Back to normal** | The level falls, the gate state updates, and the banner suggests an **All clear** alert |
| **Sensor goes silent** | Two steps: **Make Stale** (reading age jumps past the stale limit, badge turns Stale, value dims) and **Make Offline** (Offline badge, "No sensor signal"). **Restore** brings it back |
| **Camera lost** | The camera placeholder switches to the camera-off icon and "No camera signal", and the Control tab's sensor data card shows the camera as offline. **Restore** brings it back |
| **Gate toggle** | Flips the **simulated** gate state between Open and Closed and adds an event to the timeline. (The app itself has no gate control) |
| **Replay splash** | Shows the splash screen again |
| **Loading and error states** | A delay slider and an error toggle for data calls, so loading, empty and error states can be shown |
| **Reset demo** | Confirms, then restores all seeds and clears local changes |

The notification bell reacts to every scenario: each tier change, Stale, Offline, camera lost, gate toggle and simulated send adds an item. **Reset demo** clears the list and the read state but keeps the language choice.

The panel also shows the current simulated level and status, so the presenter can see the state at a glance. The panel says "Demo tools" and is hidden if `VITE_DEMO_TOOLS=false` at build time (default true).

## 9. Core logic

- **Status tier:** computed from `level_cm` and the thresholds in settings. `< watch` is Normal, `>= watch` is Watch, `>= warning` is Warning, `>= critical` is Critical. A small hysteresis is not needed.
- **Freshness:** `age = now - last_seen`. Live if age is at most `stale_multiplier × expected_interval_s`, Stale if older, Offline if older than `heartbeat_limit_s`. Shown in the Home level card and gate card, and the Control tab's sensor data and gate cards. The age is displayed ("12 s ago").
- **Simulated stream:** every 5 seconds the demo source appends a small variation to the level and updates `last_seen`, and notifies subscribers (`subscribe`). Scenarios override the target level.
- **Alert suggestion:** a pure function of the latest status and the last alert's level. It suggests when the status is higher than the last alert's level, and suggests All clear when the status is Normal and the last alert was Watch, Warning or Critical.
- **SMS composition:** `compose(template, values)` replaces `{BARANGAY}`, `{LEVEL_LABEL}`, `{LEVEL_CM}`, `{DISASTER_INFO}`, `{EVAC_LOCATION}` and `{HOTLINES}` (names and numbers of the selected hotlines, joined by `;`). Text typed by hand is kept as is.
- **Segment estimate:** if every character is in the basic GSM set, 1 segment up to 160 characters, then 153 per segment. Otherwise 70, then 67. Shown as "estimated".
- **Simulated SMS gateway:** on send, one delivery row per recipient is created as `queued`, moved to `sent` after a short random delay, then to `delivered`. A seeded fraction (about 5%) goes to `failed`, then is retried once and becomes `delivered` or stays `failed`. The alert's counts update as rows change. Every status carries the label **Simulated**.
- **Resident CSV:** headers `name,address,purok,phone`. Rows with a missing name, a purok outside 1 to 6, or an invalid phone are listed as errors, and only valid rows are imported after confirmation.
- **Gate:** display only. State is `open` or `closed`, read from the gate record and its events. The history bar shows the latest event and the last five.
- **Storage:** seeds are bundled. Local changes (residents, alerts sent, scenario state, notifications and their read time) are stored in `riverwatch.demo.v1`, every access in try/catch. The language choice is stored separately in `riverwatch.lang.v1` through the same safe storage wrapper. **Reset demo** clears the key and reloads the seeds.
- **Time:** stored as UTC ISO strings, shown in Asia/Manila in 12-hour time, formatted with `Intl` using `en-PH` or `fil-PH` from the active language. File name stamps stay fixed.
- **Language:** `LocaleProvider` holds the active language. Components get text from `useT()`. Helpers outside components (`tierLabel`, `alertLevelLabel`, time formatters, page counters) take `t` or the language as an argument, with no module-level cached text or formatters. Missing keys fall back to English.
- **Notifications:** the demo source appends a record (`kind`, `severity`, `created_at`, `params`) whenever the simulator or a user action changes the status tier, freshness, camera, gate or sends an alert. The list is capped at 20 and kept in local state. The UI reads it through `getNotifications` and `markNotificationsRead` in `src/lib/data/`, so a real backend can replace the source later. `getNotifications` and `markNotificationsRead` are synchronous and skip the Demo tools delay and error switch, so the bell keeps working while those are on. Seeded items are rebuilt from the seeds on every load; only the other items and the read time are saved. A suggestion item is raised when the Home suggestion appears or changes, and a silent sensor also raises an item when it turns from Stale to Offline with the clock alone.

### SMS templates (seed data; Filipino wording is a draft to be reviewed)

| Level | English | Filipino |
|---|---|---|
| Watch | `{BARANGAY} FLOOD WATCH: River level is {LEVEL_CM} cm ({LEVEL_LABEL}). {DISASTER_INFO} Stay alert. Hotlines: {HOTLINES}` | `BABALA SA BAHA, {BARANGAY}: Antas ng ilog {LEVEL_CM} cm ({LEVEL_LABEL}). {DISASTER_INFO} Maging handa. Hotline: {HOTLINES}` |
| Warning | `{BARANGAY} FLOOD WARNING: River level is {LEVEL_CM} cm ({LEVEL_LABEL}). {DISASTER_INFO} Prepare to evacuate to {EVAC_LOCATION}. Hotlines: {HOTLINES}` | `BABALA SA BAHA, {BARANGAY}: Antas ng ilog {LEVEL_CM} cm ({LEVEL_LABEL}). {DISASTER_INFO} Maghanda sa paglikas sa {EVAC_LOCATION}. Hotline: {HOTLINES}` |
| Critical | `{BARANGAY} CRITICAL FLOOD ALERT: River level is {LEVEL_CM} cm ({LEVEL_LABEL}). {DISASTER_INFO} EVACUATE NOW to {EVAC_LOCATION}. Hotlines: {HOTLINES}` | `KRITIKAL NA BAHA, {BARANGAY}: Antas ng ilog {LEVEL_CM} cm ({LEVEL_LABEL}). {DISASTER_INFO} LUMIKAS NA sa {EVAC_LOCATION}. Hotline: {HOTLINES}` |
| All clear | `{BARANGAY} ALL CLEAR: River level is back to {LEVEL_CM} cm ({LEVEL_LABEL}). {DISASTER_INFO} Stay updated. Hotlines: {HOTLINES}` | `WALA NANG BANTA, {BARANGAY}: Bumalik sa {LEVEL_CM} cm ({LEVEL_LABEL}) ang antas ng ilog. {DISASTER_INFO} Manatiling alerto. Hotline: {HOTLINES}` |
| Test | `{BARANGAY} TEST MESSAGE from RiverWatch. This is only a test. No action needed.` | `PAGSUBOK mula sa RiverWatch, {BARANGAY}. Pagsubok lamang ito. Walang kailangang gawin.` |

Default disaster info text per level (editable): Watch "River level is rising due to rain." Warning "River level is high and may flood the bridge and road." Critical "River has reached a dangerous level. Flooding is happening or imminent." All clear "River level has gone down." (Filipino versions are draft.)

## 10. Data model (seed field names)

The seed files use these names. A real backend, if built later, can derive its schema from them.

| Table | Fields |
|---|---|
| barangay | name, municipality, province, seal_path |
| stations | id, name, sensor_id, expected_interval_s, last_seen, battery_pct, signal_pct, camera_ok |
| water_readings | id, station_id, recorded_at, level_cm, status |
| settings | watch_cm, warning_cm, critical_cm, stale_multiplier, heartbeat_limit_s, is_confirmed (false) |
| gates | id, name, state (`open` / `closed`), changed_at, last_seen |
| gate_events | id, gate_id, state, occurred_at, level_cm, note, note_key (optional: set only by the Demo tools, so the note shows in the UI language; seeded events have none) |
| residents | id, name, address, purok, phone, active, created_at |
| hotlines | id, name, number, kind, active |
| evacuation_centers | id, name, notes |
| alert_templates | level, language (`en` / `fil`), body, default_disaster_info |
| alerts | id, level (`watch` / `warning` / `critical` / `all_clear` / `test`), created_at, sent_at, sent_by, language, message, evacuation_text, disaster_info, hotline_ids, recipient_filter, recipient_count, delivered_count, failed_count |
| sms_deliveries | id, alert_id, resident_id, status (`queued` / `sent` / `delivered` / `failed`), attempts, updated_at |
| notifications (local state, not seeded except 3 read items) | id, kind (`status` / `suggestion` / `sensor` / `gate` / `alert_sent`), severity (`info` / `watch` / `warning` / `critical`), created_at, params (status: from, to, level_cm; suggestion: kind, level, level_cm; sensor: event `stale` / `offline` / `camera`; gate: state; alert_sent: alert_id, level, recipients) |
| notifications_read_at (local state) | ISO timestamp. Items newer than it are unread |

## 11. Folder structure

```
.github/workflows/deploy.yml
docs/DEMO_SCRIPT.md
design.md                (visual system source of truth, copied to the repo root)
public/brand/            (the user's logos)
public/fonts/            (fonts.css plus Roboto and Roboto Mono, self-hosted woff2)
src/app/                 App, routes, layout (sidebar, top bar, LanguageToggle), splash
src/components/ui/       Button, Card, Badge (status, freshness), Table, Modal, Drawer, Field, EmptyState, ErrorState, Spinner
src/features/home/       Home, CameraPanel, LevelCard, TrendCard, GateCard, AlertSuggestion
src/features/resident/   Resident, ResidentTable, ResidentForm, ImportDialog
src/features/alert/      Alert, SpecsForm, SmsPreview, SendDialog, DeliveryPanel
src/features/history/    History, LevelHistory, AlertsLog, AlertDetail
src/features/control/    Control, SensorCard, GateStatus, GateTimeline
src/features/notifications/  NotificationBell, NotificationPanel
src/features/demo/       DemoDrawer, scenarios
src/lib/                 time.js, status.js, sms.js, csv.js, format.js (Intl number and locale helpers), i18n.jsx (LocaleProvider, useT, useLocale)
src/lib/data/            index.js (reads, subscribe, actions), demo/ (seeds, generator, simulator, gateway)
src/strings/en.js, fil.js
src/styles/tokens.css, global.css
index.html, package.json, vite.config.js
```

## 12. Build order (one session)

Claude builds all of this in the single session. The steps are in dependency order. Each has a check that the sandbox can run.

| # | Step | Verify |
|---|---|---|
| 1 | Scaffold: Vite + React, tokens, global CSS, strings file, deploy workflow, `vite.config.js` with `VITE_BASE` | `npm run build` succeeds |
| 2 | Data layer: seed generator (deterministic), seed files, settings, simulated stream, simulated SMS gateway, storage wrapper | Two loads produce identical seeds; storage blocked still works |
| 3 | Shell: HashRouter, sidebar, top bar with clock, splash (logo only), logo handling with fallbacks | All five routes render; splash skips; missing logos show the TEMP wordmark |
| 4 | Home: camera placeholder, level, trend, gate, sensor, alert suggestion | Level change updates badge, trend and suggestion; Camera lost switches the placeholder to the camera-off state |
| 5 | Resident: table, search, filter, add, edit, delete, CSV import and export | Invalid rows are rejected; delete confirms |
| 6 | Alert: specs form, template fill, preview, segments, send dialog, delivery panel | Level change fills the template; send shows per-recipient statuses labeled Simulated |
| 7 | History: charts, table, alerts log with detail, CSV export. Control: sensor data, gate status and history | Range switching works; Control shows sensor and gate cards |
| 8 | Demo tools: drawer, scenarios, reset; `docs/DEMO_SCRIPT.md` | Every scenario in Section 8 works; reset restores the seed |
| 9 | Polish and checks: loading, empty and error states, focus and keyboard pass, contrast check, Section 13 checks | Section 13 passes |

### 12b. Update pass (2026-11-08): design system, logo, language toggle, notification bell

Applied to the existing build, in this order. Same rules as Section 3. Keep every existing feature working.

**Status (2026-11-09):** steps 1 to 6 are done. The update pass is complete.

| # | Step | Verify | Status |
|---|---|---|---|
| 1 | Tokens and fonts: replace `tokens.css` with Section 5, add `@font-face` and the `public/fonts/` files (or report them missing), remove the old variables and the 6 hardcoded `#fff` | `npm run build` succeeds. A code search finds no old variable names and no hex values outside `tokens.css` | Done 2026-11-08 |
| 2 | Restyle the shared kit (Button with `ghost`, Card, Badge, Table, Modal, Drawer, Tabs, Field, Switch) and the shell (sidebar, top bar) to `design.md`. Switch low-emphasis buttons to `ghost`. Add elevation, hover, pressed and focus states, and `prefers-reduced-motion` | All five tabs at 1366×768 and 1024 px show the new look with no overflow. Contrast check passes for every button state | Done 2026-11-08 |
| 3 | Logo: replace `riverwatch-logo.png`, point `brand.mark` to it, delete `riverwatch-mark.png`, remove the logo tile | Logo shows on the white sidebar and splash with no box and no stretching | Done 2026-11-08 |
| 4 | Language: write `fil.js` with the same keys as `en.js`, add `LocaleProvider` and `useT`, convert the 37 files that import `en.js` to `useT()`, make `status.js`, `time.js` and the page counter take `t` or the language, add the toggle, `<html lang>` and saved choice | A key-parity check (a one-off script) shows identical keys. Switching language updates all five tabs, dialogs and aria-labels with no reload. A reload keeps the choice. No English is left in Filipino mode | Done 2026-11-09 |
| 5 | Notifications: add `getNotifications` and `markNotificationsRead` to `src/lib/data/`, the simulator hooks, the bell and panel, and their strings in both files | The checks in Section 13 under Notifications pass | Done 2026-11-09 |
| 6 | Update `docs/DEMO_SCRIPT.md` (language toggle, bell) and run Section 13 | Section 13 passes (sandbox items; the deployed-site check is the user's) | Done 2026-11-09 |

## 13. Acceptance checklist

Claude runs these in the sandbox where possible and states what it could and could not verify. The user verifies the deployed site.

- [ ] `npm install` and `npm run build` succeed with no errors or warnings that matter
- [ ] The built site opens from the `dist` folder served locally with the base path applied, with no console errors
- [ ] Network inspection or a code search shows no requests or URLs except the app's own files (no CDN, no remote fonts, no tiles; Roboto loads from `public/fonts/`)
- [ ] Splash shows, can be skipped, then Home loads. All five tabs reachable by sidebar, keyboard and direct hash URL
- [ ] No Demo banner. Camera panel is a placeholder icon only (no image or video). "Simulated" on every send result
- [ ] Top bar shows the barangay name and a ticking time and date in Asia/Manila
- [ ] Home: level, status badge with icon and text, freshness badge, gate card show correct ages. Control: sensor data and gate cards show correct ages
- [ ] River rising scenario shows Watch, Warning and Critical, and the alert suggestion appears at each
- [ ] Sensor goes silent shows Stale then Offline with icon and text, and Restore works
- [ ] Resident: add, edit, delete (with confirm), search, purok filter, CSV import with an error row, CSV export. Phones displayed masked
- [ ] Alert: all four specification items present and editable, preview updates live, segment estimate shown, send requires confirmation, delivery panel shows per-recipient statuses
- [ ] History: 24 h, 7 d and 30 d ranges, threshold lines, alerts log with detail, CSV export for readings and alerts. Control: gate state, age and full gate history
- [ ] No control anywhere opens or closes the gate
- [ ] Loading, empty and error states can be shown with the presenter panel
- [ ] Reload keeps local changes. **Reset demo** restores the seed. App still works with browser storage blocked
- [ ] Layout is usable at 1366×768, 1920×1080 and 1024 px wide, with no horizontal page scroll
- [ ] WCAG AA: text 4.5:1 (including black on `--primary` and `--accent` and every hover and pressed state), UI borders and icons 3:1, and no status is shown by color alone
- [ ] Design: no old variable names or hardcoded colors outside `tokens.css`. Buttons, cards, radii and shadows follow `design.md`. Primary-colored text appears only on `--surface`. `prefers-reduced-motion` turns off transitions and animation. Roboto loads from `public/fonts/` (or the fallback is reported)
- [ ] Language: the EN | FIL toggle is in the top bar on every tab (not on the splash). It switches all text, aria-labels, dates and numbers instantly. The choice survives a reload and **Reset demo**. `<html lang>` is `en` or `fil`. `en.js` and `fil.js` have identical keys. Filipino text does not overflow at 1024 px. SMS language and CSV headers are unaffected. Uncertain translations are marked `TODO(review)`
- [ ] Notifications: the bell is in the top bar on every tab. The badge is hidden at 0 and shows 9+ above 9. River rising adds items with icon and text severity. **Mark all as read** clears the badge. Stale, Offline, camera lost, gate toggle and a simulated send each add an item. Items re-translate when the language changes. The panel opens, closes with Escape and outside click, returns focus to the bell, and is fully keyboard reachable. **Prepare alert** sends nothing. Reset demo clears the list
- [ ] Logo: the transparent logo shows on the white sidebar and splash with no box, natural proportions and no recoloring
- [ ] Logos appear as supplied (or the TEMP wordmark shows if a file is missing)
- [ ] No seed, file or screenshot contains a real resident, phone number or hotline
- [ ] `docs/DEMO_SCRIPT.md` exists and matches the working scenarios
- [ ] User check: the deployed Pages site loads, and the demo walkthrough runs start to end once

## 14. Environment State

Update after every session. **Never paste keys here.**

| Item | Status / value |
|---|---|
| Build status | Demo app built (five tabs). Demo app built (five tabs). Update pass 12b is complete (steps 1 to 3 on 2026-11-08: tokens, restyled UI kit and shell, new logo; step 4 on 2026-11-09: EN \| FIL toggle, `fil.js`, `LocaleProvider`; steps 5 and 6 on 2026-11-09: notification bell and panel, `docs/DEMO_SCRIPT.md`). `npm install` and `npm run build` pass, no warnings, and the unzipped `Riverwatch_B3_2.0.zip` builds on its own. The deployed Pages site has not been checked yet |
| GitHub repo | Not yet known. Name to be confirmed. The workflow reads the repo name, so no code change is needed |
| Repo visibility | Must be public for GitHub Pages on the free plan. Nothing sensitive may be committed |
| Pages source set to "GitHub Actions" | Not yet. Set under Settings > Pages > Source before the first deploy |
| First deploy run | Not yet. The first run may need to be started by hand (Actions > Deploy to GitHub Pages > Run workflow) |
| Notification bell | Built (2026-11-09). 40 px bell at the far right of the top bar on every tab except the splash, with an `--accent` count badge (hidden at 0, 9+ above 9) and a popover panel (`src/features/notifications/`). Data layer: `getNotifications` and `markNotificationsRead` in `src/lib/data/`; `notifications` (at most 20, newest first) and `notifications_read_at` live in `riverwatch.demo.v1`; the last three seeded alerts start as read items. Items store kind, severity, time and params only, and are translated when shown. Reset demo returns the list to the three seeded read items and keeps the language |
| Files currently in repo | Not known. The project was delivered as `Riverwatch_B3_2.0.zip` (B2 was `Riverwatch_B2_2.0.zip`) (full tree: `src`, `public`, `docs`, `.github`, `design.md`, `CLAUDE.md`, `PLAN.md`, `package.json`, `vite.config.js`, `index.html`, `.gitignore`; no `node_modules`, `dist` or `.git`). Next: upload it to the repo |
| Logos | Transparent `riverwatch-logo.png` in `public/brand/` (splash and sidebar, no box, natural proportions). `riverwatch-mark.png` deleted, `brand.mark` points to the logo. `favicon.png` unchanged. Optional barangay seal and a square favicon mark still to be supplied |
| Fonts | Present. `public/fonts/` holds `fonts.css`, `roboto-latin-wght-normal.woff2` and `roboto-mono-latin-400-normal.woff2` (supplied in the B1 zip; both are valid woff2 files). Roboto is self-hosted and loads from there. Filipino text needs only Latin characters, which these files cover |
| Theme | Flat 2.0 / Semi-flat from `design.md` applied: new `tokens.css`, restyled `global.css`, UI kit and shell. The old pastel variables and all hardcoded colors are gone. No hex values outside `tokens.css` |
| Languages | UI in English and Filipino, switched by the EN \| FIL toggle (saved under `riverwatch.lang.v1`). SMS templates in English and Filipino (data; the Alert form keeps its own Language field). **Filipino review status: not yet reviewed by a native speaker.** `fil.js` is a draft (356 keys, identical to `en.js`), and every uncertain line is marked `// TODO(review)` (33 lines; find them with `grep -n "TODO(review)" src/strings/fil.js`; 14 of them are the bell strings added 2026-11-09). The Filipino SMS templates in `seeds.js` are also still a draft |
| Thresholds | Defaults only (Watch 100 cm, Warning 150 cm, Critical 200 cm), not confirmed |
| Hotlines and evacuation centers | Placeholders in seeds, to be replaced with verified real values |
| Remaining open items | (1) Roboto files: both woff2 files are in `public/fonts/` and Roboto loads in the sandbox, so only your confirmation that these are the files to keep is open (the open-items line in `CLAUDE.md` still says they are missing and is out of date). (2) Native-speaker review of `fil.js` and the Filipino SMS templates. (3) Barangay seal (`public/brand/barangay-seal.png`, then set `brand.seal`). (4) A square favicon mark (the current `favicon.png` stays). (5) Check of the deployed Pages site. (6) The other items in Section 15 (real hotlines, thresholds, gate and send policy, RA 10173) |

## 15. Open items and the defaults used in one-prompt mode

| Open item | Default used |
|---|---|
| Demo date and presenter | Not set. `DEMO_SCRIPT.md` is written to be presenter-neutral |
| Logo files | Use whatever the user attaches (Section 5 table). Missing ones fall back to a TEMP text wordmark |
| Hydraulic gate: monitor-only or automated | **Display-only.** No gate controls in the UI |
| Auto-send or official-confirms | **Official confirms.** The app suggests, the official sends |
| Flood thresholds | 100 / 150 / 200 cm, labeled defaults, not confirmed |
| Hotlines and evacuation centers | Placeholders |
| Resident names in seeds | "Maria Demo 01" style, masked phones, purok-level addresses |
| SMS language default | English, with a Filipino toggle. Filipino wording is draft and needs review |
| UI language | **English and Filipino**, toggle in the top bar. First visit follows the browser (`fil` or `tl` gives Filipino, otherwise English). Independent of the SMS language. Filipino wording is draft |
| Notification bell content | In-app only, derived from existing data (Section 6). Accent badge shows a count only |
| Secondary button color | Accent orange per `design.md`. Low-emphasis actions use the neutral `ghost` button |
| Fonts | Self-hosted Roboto and Roboto Mono. Fallback to system-ui if the files are missing |
| Sidebar logo | Stays in the sidebar (the app has a sidebar, not a top-bar menu). The top bar holds the toggle and bell |
| `design.md` 768 px collapse rule | Not applied. Phone layout stays out of scope, minimum width stays 1024 px |
| Login | None. One role, Barangay Official |
| Platform | Desktop first, no phone layout, no PWA |
| Repo name | Taken from the repo by the workflow |
| Resident data consent and handling (RA 10173) | Demo holds synthetic data only. A consent and handling plan is needed before real resident data is entered |
| Camera panel | Placeholder icon only. Real stream (for example from the ESP32-CAM) is out of scope |
| Real SMS path (GSM module or gateway), sensor ingestion | Out of scope for this build |

## 16. Progress Log

Claude outputs a new row at the end of every session; the user pastes it here.

| Date | Step | Done | Next | Notes / decisions |
|---|---|---|---|---|
| 2026-10-26 | Planning | `CLAUDE.md` and `PLAN.md` drafted for RiverWatch from the user's five-screen sketch, adapted from the Alerto plan files. Single build (no stages): UI plus seeded demo data only | User uploads both files to a new repo, attaches logos, sends the one prompt | Decisions: desktop-first dashboard, pastel blue and green theme, one role and no login, gate display-only, official confirms every alert, simulated SMS, camera panel is a placeholder icon, deterministic seeds relative to load time |
| 2026-11-08 | Planning (update pass) | `CLAUDE.md` and `PLAN.md` updated for the Flat 2.0 design from `design.md`, the transparent logo, the EN/FIL toggle and the notification bell. Section 12b added | Run the update pass prompt with `design.md`, the logo and the current repo attached. Supply the Roboto font files | Decisions: Filipino UI moved into scope (custom context, no library), Roboto self-hosted, accent never means status, bell is in-app and derived, logo stays in the sidebar, phone layout still out of scope, black on-primary text means hover must not darken the fill |
| 2026-11-08 | 12b steps 1 to 3 | Step 1: new `tokens.css` (Section 5), `public/fonts/fonts.css`, old variables and the 6 `#fff` removed. Step 2: `global.css` restyled to `design.md`; Button default is `ghost`, `secondary` is orange; new hover, pressed, disabled and focus states; `prefers-reduced-motion`; shell restyled. Step 3: transparent logo in place, `riverwatch-mark.png` deleted, `brand.mark` repointed, logo tile removed. `CLAUDE.md` theme line corrected. Checked: build passes, no old variables or hex outside `tokens.css`, 5 tabs at 1366×768, 1024 and 1920 with no horizontal overflow, 40 of 40 functional checks pass, contrast measured for every button state | Add the two Roboto files. Then 12b step 4 (language toggle, `fil.js`, `useT`), step 5 (notification bell), step 6 (demo script, Section 13) | Decisions: `@font-face` lives in `public/fonts/fonts.css`, linked from `index.html` (base-path safe, no Vite warning). Font file names follow the Fontsource Latin files. Fonts were not bundled (missing, so fallback used). `ghost` is the default button; orange `secondary` only for Send test to myself and Import Preview; Retry and Demo tools are `ghost`. Filled brand buttons lighten, never darken, on hover and pressed (primary 4.66 rest, 5.69 hover, 6.94 pressed). Disabled buttons are flat neutral with muted text. Badges use `--radius-md`. Weight 800 changed to 700. Dense text is 0.9375rem. Ghost outline is `--border` (decorative, the label carries the contrast); inputs and choices use `--text-muted` borders for 3:1. The logo's teal is not recolored |
| 2026-11-09 | 12b step 4 | `src/strings/fil.js` (same 276 string keys and 52 function keys as `en.js`, uncertain wording marked `// TODO(review)`), `src/lib/i18n.jsx` (`LocaleProvider`, `useT`, `useLocale`; no library; missing keys fall back to English; sets `<html lang>`), `src/lib/format.js` (`Intl` helpers) and `src/app/LanguageToggle.jsx` (EN \| FIL in the top bar, right of the time and date, with a 40 px slot kept for the bell). All 37 files that imported `en.js` now use the hooks. `time.js`, `status.js` and `csv.js` take `t` or the language, and nothing is cached at module level. The choice is saved as `riverwatch.lang.v1` through `src/lib/data/storage.js`, so Reset demo keeps it. First visit uses Filipino for `fil` or `tl`, otherwise English. Checked in the sandbox: build passes; key parity script passes; no leftover imports of `en.js` and no hard-coded UI text; seeded data identical to B1; SMS text, Language field, CSV headers and file names unchanged; toggle markup (aria-pressed, lang, 40 px, colors); instant switch with no reload; reload and Reset demo keep the choice; first-visit detection; blocked storage; 29 views (all tabs, dialogs, Demo drawer, banner) re-translate live and match a fresh Filipino load; no English left in Filipino mode apart from data; no overflow at 1024, 1366 and 1920 px except the two known cases | Step 5 (notification bell: data-layer functions, simulator hooks, bell and panel, strings in both files). Native-speaker review of `fil.js`. Optional: decide how the Demo drawer should behave at 1024 px (see Notes) | Decisions: `useT()` returns the strings and `useLocale()` also gives `lang`, `tFor`, `setLang` and `num`; text helpers take `t` and `Intl` helpers take the language. Numbers inside strings use `Intl` with each file's own locale. The SMS `LEVEL_LABEL` stays English whatever the UI language, and seeded alert messages use the fixed labels in `seeds.js` (`seedLevelLabels`), so SMS and seeds are unchanged. Messages kept in component state (form errors, CSV preview errors, notices, send errors) are stored as codes and translated when drawn, so open dialogs follow a switch. CSV parse errors are now `{ line, codes, arg }` with `csvErrorText(error, t)`. Gate notes made by the Demo tools carry an optional `note_key` (the stored English text is unchanged). Toggle buttons are named "English" and "Filipino" (aria-label) with visible text EN and FIL. The choice is written only when the user toggles; the browser-language default is not saved. Filipino tiers: Normal, Bantay, Babala, Kritikal; "Wala nang banta" for All clear. CSS: a `:lang(fil)` rule tightens the alerts log table so it fits at 1024 px, and the top bar rows wrap when narrow. Known and not changed (same in the English B1): with the Demo drawer open at 1024 px the page behind it is squeezed to about 384 px and some content is cut off; the delivery table in the Alert tab scrolls inside its panel. `CLAUDE.md` unchanged (no rule became wrong; its open item about missing font files is out of date because the fonts are present) |
| 2026-11-09 | 12b steps 5 and 6 | Step 5: data layer `getNotifications`, `markNotificationsRead`, `demo/notifications.js` (record helpers), `addNotification` and `checkTransitions` in `store.js`, hooks in `simulator.js` (status tier, suggestion, Stale and Offline, camera lost, gate change) and `gateway.js` (alert sent); `src/features/notifications/` (`NotificationBell`, `NotificationPanel`, `notificationText.js`); bell icon; `?tab=alerts` on History; `notifications` strings in both files (28 keys; 14 `TODO(review)` lines in `fil.js`); bell and panel CSS from tokens only. Step 6: `docs/DEMO_SCRIPT.md` (language toggle, bell, Section 2b and bell lines in the scenario sections). Checked in the sandbox: build passes, key parity (356 keys each), seeds identical to B2, no hex outside tokens, no network or storage use outside the data layer, 134 browser checks (bell placement and size, badge hidden at 0 and 9+, aria, focus in and back, Escape and outside click, keyboard order, River rising counts up, each Demo tools scenario adds its item, Prepare alert sends nothing, Mark all as read, language re-translation, Reset demo, reload, blocked storage, error switch, cap of 20, reduced motion, 1024 px Filipino, 53 regression checks across all tabs), contrast measured | Deploy and walk through `DEMO_SCRIPT.md` once. Native-speaker review of `fil.js`. Supply barangay seal and square favicon. Decide the Demo drawer behavior at 1024 px (see B2 notes) | Decisions: the bell reads and marks synchronously and ignores the Demo tools delay and error switch so it always works. Only non-seeded items and the read time are saved; the three seeded items are rebuilt on every load and always start read. Reset demo returns to those three read items (list and read state cleared) and keeps the language. A suggestion item is raised when the Home suggestion appears or changes (so falling levels can raise lower-tier suggestions, as the banner does). Stale to Offline on the clock alone also raises an item; Restore, camera restored and a status back to Normal after Warning follow the PLAN table (Normal is Info). Severity words reuse the tier labels (Bantay, Babala, Kritikal) plus Info (Impormasyon). Every item carries the Simulated tag beside its age. The unread marker is a `--primary` dot plus hidden text; the log link uses `--text` underlined because unread rows sit on `--surface-strong`. Escape closes only the panel (Demo tools stays open); tabbing out closes it; a click elsewhere closes it and returns focus to the bell unless the click was on another control. Prepare alert opens `#/alert?level=` like the Home banner. `CLAUDE.md` unchanged (no rule became wrong). Known and not changed: Demo drawer at 1024 px squeezes the page; the delivery table scrolls inside its panel |
