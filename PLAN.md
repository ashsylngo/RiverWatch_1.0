# RiverWatch: PLAN.md

> River water level monitoring and SMS flood alerts for Brgy. Maligaya, Rosario, Batangas: a desktop dashboard for barangay officials

Claude: read this file and `CLAUDE.md` at the start of every session. At the end of every session, output an updated **Section 14 (Environment State)** and a new row for **Section 16 (Progress Log)** for the user to paste back in.

## The one prompt

Attach `CLAUDE.md`, `PLAN.md` and the logo files to a new chat, then send:

```
Read CLAUDE.md and PLAN.md, then build the complete RiverWatch demo app in this one session, following the build order in PLAN.md Section 12. The attached images are my logos. Use the defaults in PLAN.md Section 15 instead of asking me questions, build and verify it in the sandbox, then deliver all files at their repo paths with a numbered Manual Steps list and a short list of the assumptions you made.
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
| 5 | History, with historical reports and data, and "status of hydraulic gate" | History tab |
| | Note at the bottom: "PC Computer" | Platform is a desktop computer |

## 2. Scope

### In scope

- Splash screen, then the four tabs, at final visual quality, desktop first (1366×768 and up, usable at 1024 px).
- Pastel blue and pastel green theme (Section 5), with the user's logos.
- A **simulated live stream** that updates the water level and sensor status every few seconds, with correct freshness badges.
- Home: a **placeholder icon** where the river camera feed will go, current level, flood status, gate state, sensor health, a short trend, and an alert suggestion when the level crosses a threshold.
- Resident: searchable, filterable table with add, edit, delete, CSV import and CSV export.
- Alert: the SMS specifications form, a live SMS preview, recipient selection, and a **simulated** send with per-recipient delivery status.
- History: water level chart and table with date ranges and CSV export, alerts log with delivery detail, and the hydraulic gate status bar with its change timeline.
- **Presenter panel** (Demo tools button) with one-tap scenarios and **Reset demo** (Section 8).
- Loading, empty and error states on every data call.
- `docs/DEMO_SCRIPT.md`: the click path and what to say.
- Deploy to GitHub Pages with GitHub Actions.

### Out of scope

Login and accounts, real SMS, any camera image, video or illustration (the camera panel is a placeholder icon), real sensor data, gate control, a map, notifications outside the app, PWA install and offline mode, a phone layout, a Filipino UI (SMS templates are bilingual, the UI is English), an audit log screen, weekly printable reports, and any backend.

### Small additions beyond the sketch (marked to confirm)

These make the screens usable and are listed so the user can remove any of them:

1. Home: water level number, status badge, gate chip, sensor health and a trend chart next to the camera placeholder.
2. Resident: `purok` column, active/inactive switch, search and purok filter, CSV import and export.
3. Alert: live SMS preview, character and segment count, recipient selector (all active, or by purok), send confirmation, and simulated delivery progress.
4. History: sub-tabs for Water level and Alerts log. The gate status stays as the bottom bar, as sketched.
5. Alert level selector (Watch, Warning, Critical, All clear, Test) that fills a template.

## 3. Hard Rules (never break)

1. **No secrets, no real personal data.** The demo holds synthetic data only (Section 7). The only real place name is the barangay in the header.
2. **No real SMS.** The Alert tab runs a simulated gateway. Every send result and delivery status is labeled **Simulated**.
3. **Demo is never presented as live.** The Demo banner is on every screen. The camera panel is a placeholder icon labeled "Camera feed placeholder (demo)". Nothing claims a connection to a real sensor, camera, gate or SMS gateway.
4. **The gate is display-only.** The app has no open, close or reconfigure control for the hydraulic gate.
5. **The app suggests, the official sends.** When the level crosses a threshold the app suggests an alert. Nothing is sent without the official reviewing the message and confirming.
6. **Every value shows its age.** A reading or gate state is never shown as current without its timestamp. Stale and Offline are marked with icon and text, and a stale value is never drawn as live.
7. **Status is never color alone.** Always icon plus text. Brand colors never mean status.
8. **Not an official warning.** The status badge is labeled "System status (demo thresholds)". The thresholds are defaults pending confirmation.
9. **Thresholds and timing are settings, not code.** Flood thresholds, the stale multiplier and the heartbeat limit are read from the seed settings through the data layer.
10. **No hard-coded UI text.** All text comes from `src/strings/en.js`. SMS templates are data (Section 7).
11. **Screens go through the data layer.** Components never import seed files or `localStorage`. They use `src/lib/data/`.
12. **No network.** No requests except the app's own static files. No CDN fonts or scripts, no tiles, no analytics. Browser storage is versioned (`riverwatch.demo.v1`), wrapped in try/catch, and the app works without saving if storage is blocked.
13. **Plain text only.** User-entered text is rendered as text, never as HTML.
14. **Logos are used as supplied.** No redrawing, recoloring or stretching. Missing logo → plain text wordmark marked TEMP.
15. **Destructive and consequential actions confirm first.** Delete resident, Reset demo and Send alert each ask for confirmation.

## 4. Stack

| Layer | Choice |
|---|---|
| App | React + Vite, `HashRouter` |
| Charts | Recharts |
| Styling | Plain CSS with variables in `src/styles/tokens.css` |
| Text | `src/strings/en.js` (UI), SMS templates as seed data (EN and FIL) |
| Data | `src/lib/data/` with one `demo` source: seeds, generator, simulated stream, simulated SMS gateway |
| Hosting | GitHub Pages via GitHub Actions. The workflow uses `npm install` (no lockfile needed) and sets `VITE_BASE=/${{ github.event.repository.name }}/` so the base path always matches the repo name. `vite.config.js` reads `process.env.VITE_BASE` and defaults to `/` |
| Not used | Supabase, PWA and service worker, i18n library, map library, Tailwind, any CDN |

Routes: `#/home`, `#/resident`, `#/alert`, `#/history`. The splash is shown once per browser session on first load (and when replayed from Demo tools), then goes to `#/home`.

## 5. Theme and brand

**Pastel blue and pastel green**, calm and readable for long monitoring sessions. Pastels are used for surfaces and accents. Text and primary buttons use the deeper tones so contrast stays high. All values are draft and are verified for contrast during the build (target 4.5:1 for text, 3:1 for UI borders and icons).

```css
/* src/styles/tokens.css  (palette is a draft; adjust only after the user's logo colors are known) */
:root {
  /* Brand: pastel blue */
  --blue-50:  #F2F9FD;
  --blue-100: #DDEFFA;
  --blue-200: #BFE0F5;
  --blue-300: #9CCDEC;
  --blue-600: #2F6F9F;   /* primary button, links (white text on it) */
  --blue-700: #245A82;

  /* Brand: pastel green */
  --green-50:  #F2FAF5;
  --green-100: #DDF3E4;
  --green-200: #BFE8CC;
  --green-300: #9AD9B0;
  --green-600: #2E7D5B;  /* secondary accent (white text on it) */
  --green-700: #236349;

  /* Neutrals */
  --ink:       #1E3A4C;  /* main text, dark navy */
  --ink-soft:  #4B6477;  /* secondary text */
  --line:      #C9DCE8;  /* borders */
  --surface:   #FFFFFF;
  --page:      #F2F9FD;  /* app background (blue-50) */
  --sidebar:   #DDEFFA;  /* blue-100 */
  --topbar:    #DDF3E4;  /* green-100 */

  /* Status (separate from brand; always icon + text) */
  --status-normal-fg:   #1B7A3A;  --status-normal-bg:   #E3F4E8;
  --status-watch-fg:    #7A5C00;  --status-watch-bg:    #FFF4CC;
  --status-warning-fg:  #9A4B00;  --status-warning-bg:  #FFE5CF;
  --status-critical-fg: #B3261E;  --status-critical-bg: #FDE3E1;
  --fresh-live-fg:  #1B7A3A;
  --fresh-stale-fg: #9A5B00;
  --fresh-off-fg:   #5B6770;
  --demo-banner-bg: #FFF4CC;  --demo-banner-fg: #5C4500;

  /* Type and spacing */
  --font: system-ui, "Segoe UI", Roboto, Arial, sans-serif;  /* no web fonts */
  --radius: 12px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px; --space-8: 32px;
}
```

Rules:

- Sidebar is `--sidebar` with the active tab in `--blue-600` and white text. The top bar is `--topbar`. Cards are white with `--line` borders and a soft radius.
- The four flood tiers use four **distinct icons** (Normal: check circle; Watch: eye; Warning: triangle; Critical: octagon) plus the tier name, so the pastel brand green is never confused with the Normal status.
- Flood tier bands on the history chart use the status background tokens with labels, not color alone.
- If the supplied logo colors clash with this palette, keep the palette and say so in the reply. Do not recolor the logo.

### Logo files (supplied by the user)

| File in `public/brand/` | Where it is used |
|---|---|
| `riverwatch-logo.*` | Splash screen, centered, with clear space |
| `riverwatch-mark.*` | Top of the sidebar (about 40 px tall) |
| `barangay-seal.*` | Optional, left of the barangay name in the top bar |
| `favicon.png` | Optional; if missing, no favicon is drawn |

If only one logo image is attached, use it for the splash and the sidebar at different sizes, and say which file was used for what.

## 6. Layout and screens

### Global shell (tabs 2 to 5)

- **Left sidebar (tab bar):** the logo mark at the top, then **Home, Resident, Alert, History**, then a **Demo tools** button at the bottom. The active tab is clearly marked. Fixed width (about 220 px).
- **Top bar:** barangay name on the left ("Brgy. Maligaya, Rosario, Batangas", with the seal if supplied), and on the right the **current time and date** (Asia/Manila, updating every second).
- **Demo banner:** a slim bar under the top bar on every screen: "DEMO: simulated data. Not connected to a real sensor, camera, gate or SMS gateway."
- **Content area:** scrolls on its own; the sidebar and top bar stay in place.

### 1. Splash

- Full-screen pastel gradient (blue to green), the full logo centered, the text "RiverWatch" and the barangay name under it.
- A short, simulated start-up checklist appears line by line: Water level sensor, Monitoring camera, SMS gateway, Hydraulic gate, each ending in "Simulated OK". Total about 3 seconds.
- Click or press any key to skip. Then go to Home.

### 2. Home

Two-column layout (about 2/3 and 1/3).

- **Monitoring camera (river), main panel:** a **placeholder icon only**. A large, plain camera icon (inline SVG, outline style, `--ink-soft` on a `--blue-100` panel with a dashed `--line` border, 16:9 aspect ratio) centered in the panel, with the title "Monitoring camera: River" and the line "Camera feed placeholder (demo). A live stream will appear here." No image, video, scene or animation. States: **Online** (camera icon, as above) and **Offline** (camera-off icon, "No camera signal"), shown with icon and text. The panel has no timestamp or freshness badge because it carries no frame.
- **Right column cards:**
  - **Water level:** the current level in cm (large), the system status badge (Normal, Watch, Warning, Critical) labeled "System status (demo thresholds)", the reading's age, and a freshness badge.
  - **Trend:** a small Recharts line chart for the last 6 hours with the threshold lines.
  - **Hydraulic gate:** current state (Open or Closed), when it last changed, freshness badge, and the note "Display only".
  - **Sensor health:** battery %, signal strength, camera OK or offline, last seen (all simulated).
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
- **Hydraulic gate status bar (bottom, as sketched), always visible on this tab:** the current state with icon and text, the age and a freshness badge, the last change, and the last 5 changes. A **View all** control expands the full gate timeline (time, state, water level at that moment, note). The bar says "Display only".

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
| **Camera lost** | The camera placeholder switches to the camera-off icon and "No camera signal", and the sensor health card shows the camera as offline. **Restore** brings it back |
| **Gate toggle** | Flips the **simulated** gate state between Open and Closed and adds an event to the timeline. (The app itself has no gate control) |
| **Replay splash** | Shows the splash screen again |
| **Loading and error states** | A delay slider and an error toggle for data calls, so loading, empty and error states can be shown |
| **Reset demo** | Confirms, then restores all seeds and clears local changes |

The panel also shows the current simulated level and status, so the presenter can see the state at a glance. The panel says "Demo tools" and is hidden if `VITE_DEMO_TOOLS=false` at build time (default true).

## 9. Core logic

- **Status tier:** computed from `level_cm` and the thresholds in settings. `< watch` is Normal, `>= watch` is Watch, `>= warning` is Warning, `>= critical` is Critical. A small hysteresis is not needed.
- **Freshness:** `age = now - last_seen`. Live if age is at most `stale_multiplier × expected_interval_s`, Stale if older, Offline if older than `heartbeat_limit_s`. Shown in the Home level card, the sensor health card, the gate card and the history gate bar. The age is displayed ("12 s ago").
- **Simulated stream:** every 5 seconds the demo source appends a small variation to the level and updates `last_seen`, and notifies subscribers (`subscribe`). Scenarios override the target level.
- **Alert suggestion:** a pure function of the latest status and the last alert's level. It suggests when the status is higher than the last alert's level, and suggests All clear when the status is Normal and the last alert was Watch, Warning or Critical.
- **SMS composition:** `compose(template, values)` replaces `{BARANGAY}`, `{LEVEL_LABEL}`, `{LEVEL_CM}`, `{DISASTER_INFO}`, `{EVAC_LOCATION}` and `{HOTLINES}` (names and numbers of the selected hotlines, joined by `;`). Text typed by hand is kept as is.
- **Segment estimate:** if every character is in the basic GSM set, 1 segment up to 160 characters, then 153 per segment. Otherwise 70, then 67. Shown as "estimated".
- **Simulated SMS gateway:** on send, one delivery row per recipient is created as `queued`, moved to `sent` after a short random delay, then to `delivered`. A seeded fraction (about 5%) goes to `failed`, then is retried once and becomes `delivered` or stays `failed`. The alert's counts update as rows change. Every status carries the label **Simulated**.
- **Resident CSV:** headers `name,address,purok,phone`. Rows with a missing name, a purok outside 1 to 6, or an invalid phone are listed as errors, and only valid rows are imported after confirmation.
- **Gate:** display only. State is `open` or `closed`, read from the gate record and its events. The history bar shows the latest event and the last five.
- **Storage:** seeds are bundled. Local changes (residents, alerts sent, scenario state) are stored in `riverwatch.demo.v1`, every access in try/catch. **Reset demo** clears the key and reloads the seeds.
- **Time:** stored as UTC ISO strings, shown in Asia/Manila.

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
| gate_events | id, gate_id, state, occurred_at, level_cm, note |
| residents | id, name, address, purok, phone, active, created_at |
| hotlines | id, name, number, kind, active |
| evacuation_centers | id, name, notes |
| alert_templates | level, language (`en` / `fil`), body, default_disaster_info |
| alerts | id, level (`watch` / `warning` / `critical` / `all_clear` / `test`), created_at, sent_at, sent_by, language, message, evacuation_text, disaster_info, hotline_ids, recipient_filter, recipient_count, delivered_count, failed_count |
| sms_deliveries | id, alert_id, resident_id, status (`queued` / `sent` / `delivered` / `failed`), attempts, updated_at |

## 11. Folder structure

```
.github/workflows/deploy.yml
docs/DEMO_SCRIPT.md
public/brand/            (the user's logos)
src/app/                 App, routes, layout (sidebar, top bar, demo banner), splash
src/components/ui/       Button, Card, Badge (status, freshness), Table, Modal, Drawer, Field, EmptyState, ErrorState, Spinner
src/features/home/       Home, CameraPanel, LevelCard, TrendCard, GateCard, SensorCard, AlertSuggestion
src/features/resident/   Resident, ResidentTable, ResidentForm, ImportDialog
src/features/alert/      Alert, SpecsForm, SmsPreview, SendDialog, DeliveryPanel
src/features/history/    History, LevelHistory, AlertsLog, AlertDetail, GateBar, GateTimeline
src/features/demo/       DemoDrawer, scenarios
src/lib/                 time.js, status.js, sms.js, csv.js
src/lib/data/            index.js (reads, subscribe, actions), demo/ (seeds, generator, simulator, gateway)
src/strings/en.js
src/styles/tokens.css, global.css
index.html, package.json, vite.config.js
```

## 12. Build order (one session)

Claude builds all of this in the single session. The steps are in dependency order. Each has a check that the sandbox can run.

| # | Step | Verify |
|---|---|---|
| 1 | Scaffold: Vite + React, tokens, global CSS, strings file, deploy workflow, `vite.config.js` with `VITE_BASE` | `npm run build` succeeds |
| 2 | Data layer: seed generator (deterministic), seed files, settings, simulated stream, simulated SMS gateway, storage wrapper | Two loads produce identical seeds; storage blocked still works |
| 3 | Shell: HashRouter, sidebar, top bar with clock, Demo banner, splash, logo handling with fallbacks | All four routes render; splash skips; missing logos show the TEMP wordmark |
| 4 | Home: camera placeholder, level, trend, gate, sensor, alert suggestion | Level change updates badge, trend and suggestion; Camera lost switches the placeholder to the camera-off state |
| 5 | Resident: table, search, filter, add, edit, delete, CSV import and export | Invalid rows are rejected; delete confirms |
| 6 | Alert: specs form, template fill, preview, segments, send dialog, delivery panel | Level change fills the template; send shows per-recipient statuses labeled Simulated |
| 7 | History: charts, table, alerts log with detail, gate bar and timeline, CSV export | Range switching works; gate bar always visible |
| 8 | Demo tools: drawer, scenarios, reset; `docs/DEMO_SCRIPT.md` | Every scenario in Section 8 works; reset restores the seed |
| 9 | Polish and checks: loading, empty and error states, focus and keyboard pass, contrast check, Section 13 checks | Section 13 passes |

## 13. Acceptance checklist

Claude runs these in the sandbox where possible and states what it could and could not verify. The user verifies the deployed site.

- [ ] `npm install` and `npm run build` succeed with no errors or warnings that matter
- [ ] The built site opens from the `dist` folder served locally with the base path applied, with no console errors
- [ ] Network inspection or a code search shows no requests or URLs except the app's own files (no CDN, no fonts, no tiles)
- [ ] Splash shows, can be skipped, then Home loads. All four tabs reachable by sidebar, keyboard and direct hash URL
- [ ] Demo banner on every screen. Camera panel is a placeholder icon only (no image or video). "Simulated" on every send result
- [ ] Top bar shows the barangay name and a ticking time and date in Asia/Manila
- [ ] Home: level, status badge with icon and text, freshness badge, gate card and sensor card show correct ages
- [ ] River rising scenario shows Watch, Warning and Critical, and the alert suggestion appears at each
- [ ] Sensor goes silent shows Stale then Offline with icon and text, and Restore works
- [ ] Resident: add, edit, delete (with confirm), search, purok filter, CSV import with an error row, CSV export. Phones displayed masked
- [ ] Alert: all four specification items present and editable, preview updates live, segment estimate shown, send requires confirmation, delivery panel shows per-recipient statuses
- [ ] History: 24 h, 7 d and 30 d ranges, threshold lines, alerts log with detail, gate bar with last 5 changes and View all, CSV export for readings and alerts
- [ ] No control anywhere opens or closes the gate
- [ ] Loading, empty and error states can be shown with the presenter panel
- [ ] Reload keeps local changes. **Reset demo** restores the seed. App still works with browser storage blocked
- [ ] Layout is usable at 1366×768, 1920×1080 and 1024 px wide, with no horizontal page scroll
- [ ] Text contrast meets 4.5:1 and no status is shown by color alone
- [ ] Logos appear as supplied (or the TEMP wordmark shows if a file is missing)
- [ ] No seed, file or screenshot contains a real resident, phone number or hotline
- [ ] `docs/DEMO_SCRIPT.md` exists and matches the working scenarios
- [ ] User check: the deployed Pages site loads, and the demo walkthrough runs start to end once

## 14. Environment State

Update after every session. **Never paste keys here.**

| Item | Status / value |
|---|---|
| Build status | Not started |
| GitHub repo | Not yet known. Name to be confirmed. The workflow reads the repo name, so no code change is needed |
| Repo visibility | Must be public for GitHub Pages on the free plan. Nothing sensitive may be committed |
| Pages source set to "GitHub Actions" | Not yet. Set under Settings > Pages > Source before the first deploy |
| First deploy run | Not yet. The first run may need to be started by hand (Actions > Deploy to GitHub Pages > Run workflow) |
| Files currently in repo | Not yet known. Next: upload `CLAUDE.md` and `PLAN.md` to the repo root, run the one prompt |
| Logos | To be supplied by the user: full logo, small mark, optional barangay seal, optional favicon |
| Theme | Pastel blue and pastel green, draft palette in Section 5 |
| Thresholds | Defaults only (Watch 100 cm, Warning 150 cm, Critical 200 cm), not confirmed |
| Hotlines and evacuation centers | Placeholders in seeds, to be replaced with verified real values |

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
| UI language | English only |
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
