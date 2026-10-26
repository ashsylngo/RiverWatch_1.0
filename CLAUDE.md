# CLAUDE.md

This file has two parts.

- **Part 1: Behavioral guidelines** to reduce common LLM coding mistakes. These apply to every task.
- **Part 2: RiverWatch project specifications.** The scope, rules, stack, workflow and brand rules for this project.

Read `PLAN.md` at the start of every session. It holds the full plan, the build order, the seeded data specification, the environment state and the progress log.

If Part 1 and Part 2 ever seem to conflict, Part 2 wins for safety, delivery format and project rules, and Part 1 wins for how much code to write and how much to change. Section "How the two parts fit together" explains the common cases.

---

# PART 1: Behavioral Guidelines

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# PART 2: RiverWatch Project Specifications

**Project:** RiverWatch, a desktop-first web dashboard for **Brgy. Maligaya, Rosario, Batangas**. It shows the river water level and flood status, a monitoring camera panel (a placeholder icon in the demo), the resident SMS contact list, an SMS flood-alert composer, and history (water level, alerts sent, hydraulic gate status). It has **one user type: the Barangay Official**, and no login.

This is a **showcase demo on seeded, synthetic data**, built in one pass and deployed on GitHub Pages. There is **no backend, no database, no hardware, no real SMS, no camera feed (a placeholder icon stands in for it), no network calls and no map**. The UI is the final design. Full specification: `PLAN.md`.

This is a monitoring and decision-support prototype. The flood status is computed from threshold values that are **defaults pending confirmation**. It is not an official PAGASA, NDRRMC or MDRRMO warning. The app never controls the hydraulic gate.

## Project facts

- Research title: *RiverWatch: A Smart Flood Detection and Water Level Monitoring System for Barangay Community Safety.*
- Barangay shown in the header: **Brgy. Maligaya, Rosario, Batangas**. This is the only real place name in the repo.
- Platform: **desktop first** (laptop and PC browsers, target 1366×768 and up, usable down to 1024 px wide). A phone layout is not in scope.
- The real system, which is **not** in this repo: a river-side station (ultrasonic water level sensor, ESP32, GSM module, ESP32-CAM, solar and battery), SMS sent through the GSM module, and a hydraulic gate. In the demo, all of this is simulated inside the app and labeled as simulated.
- GitHub Pages deploy from GitHub Actions. The Vite `base` comes from the repo name through the workflow (see `PLAN.md` Section 4), so the repo name is not hard-coded.
- Display time zone is Asia/Manila. Seed timestamps are generated relative to the moment the app loads.

## Stack

- React + Vite, `HashRouter` (deep links work on GitHub Pages)
- Charts: Recharts
- Plain CSS with variables in `src/styles/tokens.css` (no UI framework, no Tailwind)
- Language: UI text in English from one strings file; SMS templates in English and Filipino
- Data layer: one module, `src/lib/data/`, with a `demo` source (seeds, generator, simulated live stream, simulated SMS gateway)
- No PWA, no service worker, no i18n library, no map library, no Supabase

**Constraint:** keep the app light and fast to open. Ask before adding any dependency beyond `react`, `react-dom`, `react-router-dom`, `recharts`, `vite` and `@vitejs/plugin-react`. Avoid large images.

## Screens (the user's sketch is the source of truth)

1. **Splash:** the logo, shown first.
2. **Home:** left sidebar tab bar with logo at the top; top bar with barangay name, time and date; main area is the **monitoring camera (river)**, shown in the demo as a **placeholder icon** (no image, video or illustration).
3. **Resident:** table of resident info (name, address, cellphone number).
4. **Alert:** SMS specifications (message content, evacuation location, disaster info and why, hotlines).
5. **History:** historical reports and data, with the **status of the hydraulic gate**.

Do not add tabs or pages that are not in this list. Small additions inside these screens are listed in `PLAN.md` and are marked as additions to confirm.

## Never do

- Never put secrets, API keys or tokens in any file. The demo has none.
- Never include a real resident, phone number, address, hotline number or evacuation center in the repo. Synthetic data only: residents named like "Maria Demo 01", masked placeholder phone numbers like `09XX XXX 0001`, addresses at purok level only ("Purok 3, Brgy. Maligaya"), hotlines and evacuation centers labeled "(placeholder)". The user replaces them with verified real values later.
- Never send a real SMS. The app has no SMS path. The Alert tab runs a **simulated gateway**, and every send result is labeled "Simulated".
- Never present demo data as live. A **Demo banner is visible on every screen**. The camera panel is a placeholder icon labeled "Camera feed placeholder (demo)". Nothing claims a connection to a real sensor, camera, gate or SMS gateway.
- Never draw a fake camera picture, river scene, bridge illustration or video loop. The camera panel is a **placeholder icon only** (see `PLAN.md` Section 6), so it can be swapped for a real stream later.
- Never add a control that opens, closes or reconfigures the hydraulic gate. The gate is **display-only** in the app. (The presenter panel may change the *simulated* gate state to demonstrate the display.)
- Never apply or send anything automatically. The app may **suggest** an alert when the level crosses a threshold, and the official reviews and presses Send.
- Never word the flood status as an official warning. Use "System status (demo thresholds)" near the status badge, and keep the sample SMS signed as from the barangay.
- Never show a reading or gate state without its age. Past the expected interval it is marked **Stale**, and past the heartbeat limit **Offline**. A stale value is never drawn as live.
- Never show status by color alone. Status is always **icon plus text**.
- **Brand colors never mean status.** Status uses the separate status tokens in `PLAN.md` Section 5.
- Never hard-code flood thresholds, the stale multiplier or the heartbeat limit. They live in the seed settings, are labeled **defaults, pending confirmation**, and are read from the data layer.
- Never hard-code UI text in components. Use the strings file.
- Never let a screen or component import seed files or `localStorage` directly. Go through `src/lib/data/`.
- Never add `@supabase/supabase-js`, a network request to anything but the app's own static files (no CDN fonts, no CDN scripts, no map tiles, no analytics), or any outside call. All state is bundled seeds plus versioned browser storage (key `riverwatch.demo.v1`). Every read and write is in try/catch, and the app works without saving if storage is blocked.
- Never render user-entered text (names, addresses, messages, notes) as HTML. No `dangerouslySetInnerHTML`.
- Never invent a logo, recreate one in CSS or SVG, or choose brand colors yourself (see "Logo and brand").
- Never include a developer-only page (such as `/#/design`) in the delivered build.

## Logo and brand

- **The user supplies the logos.** Expected files, copied as supplied into `public/brand/`:
  - `riverwatch-logo.*` the full logo, used on the splash screen
  - `riverwatch-mark.*` the small logo for the top of the sidebar (if only one logo is supplied, use it for both, sized differently)
  - `barangay-seal.*` optional, shown beside the barangay name in the top bar
  - `favicon.png` optional
- Use each logo **only as supplied**: no redrawing, recoloring, stretching, effects or retyping. Keep clear space around it.
- If a logo file is missing, show a plain text wordmark "RiverWatch" marked **TEMP** in the code, and say so in the reply. Do not draw a substitute. Missing images fall back gracefully with no broken-image icon.
- **Theme: pastel blue and pastel green.** Surfaces and accents come from the palette in `PLAN.md` Section 5. Text stays dark navy for contrast. All values live in `src/styles/tokens.css` as CSS variables. If a task needs a color that is not a token, ask first.
- No dark theme.
- The app name in text is `RiverWatch`, from the strings file, never typed inline.

## Always do

- Show a **freshness badge** (Live, Stale, Offline) with the sensor reading and the gate state, computed from `last_seen` and the expected interval.
- Build **loading, empty and error states** for every data call. The demo source offers an optional delay and an error toggle in the presenter panel, so these states can be shown.
- Generate seed data with a **deterministic seeded generator** (same shape every load), with timestamps relative to the load time, and keep a **Reset demo** control.
- Keep the **presenter panel** (Demo tools button) available in the demo build, with the scenarios in `PLAN.md` Section 8.
- Use desktop-first layouts with the sidebar always visible at 1024 px and wider.
- Make controls at least 40 px tall, keyboard reachable, with visible focus.
- Use CSS variables from `src/styles/tokens.css` for all colors, spacing and type.
- Use Asia/Manila for display, cm for water level, and 12-hour time with date in the top bar.
- Confirm before any destructive demo action (delete resident, reset demo) and before sending an alert.
- Run the checks in `PLAN.md` Section 13 in the sandbox before delivering.

## Conventions

- Folders: `src/app` (routing, layout, splash), `src/components/ui` (shared kit), `src/features/home`, `src/features/resident`, `src/features/alert`, `src/features/history`, `src/features/demo` (presenter panel), `src/lib` (helpers: time, status, sms, csv), `src/lib/data` (interface, `demo` source, seeds, generator, simulator), `src/strings`, `src/styles`, `docs` (`DEMO_SCRIPT.md`), `public/brand`, `.github/workflows`.
- Seed files use the table and field names in `PLAN.md` Section 10.
- Dependencies: ask first.
- Data privacy: resident information is personal information under the Data Privacy Act (RA 10173). The demo holds synthetic data only. The first real use needs a consent and handling plan (open item).

## One-prompt mode

The user wants to build this app from **one prompt** (see the top of `PLAN.md`). In that mode:

- Do not stop to ask about open items. Every open item in `PLAN.md` Section 15 has a **default**. Use the default, and list the assumptions you made in a short list at the end of the reply.
- Stop and ask only if you are blocked (for example, an attached file cannot be read).
- Build the whole app in one session, following the build order in `PLAN.md` Section 12, verify it in the sandbox, then deliver.

## How the two parts fit together

| Situation | What to do |
|---|---|
| Part 1 says "state assumptions and ask" | In one-prompt mode, state the assumptions at the end instead of stopping, using the defaults in `PLAN.md` Section 15. Outside one-prompt mode, ask first for anything touching SMS wording, resident data, the hydraulic gate or flood thresholds. |
| Part 1 says "simplicity first" | Keep code minimal. The rules in Part 2 (Demo banner, freshness, icon plus text, no real SMS, no gate control, data-layer boundary, strings file) are requirements, not "extra features", so they are never cut for brevity. |
| Part 1 says "surgical changes" | Change only what the request needs, but still deliver the **complete updated file** (the user cannot apply diffs). Tell the user which lines changed. |
| Part 1 says "write tests, then make them pass" | Build in the sandbox and run the checks in `PLAN.md` Section 13. |
| Part 1 says "mention unrelated dead code, don't delete it" | Mention it in the reply. The user decides. |
| Part 1 says "state a brief plan with verify steps" | Give the plan first, then the files, then the Manual Steps, where each step has a "verify" line the user can check. |
| Part 1 says "no abstractions for single-use code" | The `src/lib/data/` interface is required even though only one source exists, so a real backend can replace it later. Do not add other abstractions. |

## How you work with this user

- You have **no access** to the user's GitHub repo. The user uploads your files to GitHub themselves.
- Never assume what is in the repo. If you need the current contents of a file, ask for it. Check Environment State in `PLAN.md` first.
- When changing an existing file, output the **complete updated file**, not a diff or a partial snippet, so the user can replace it directly. Keep the change itself surgical (Part 1, section 3).
- Deliver files in the sandbox output folder with the same folder structure as the repo, grouped so each upload is manageable (the GitHub web uploader handles about 100 files at a time and cannot unzip). Say which folders to drag in. Mention hidden folders such as `.github`, which the web uploader may skip (create that file with **Add file > Create new file** instead).
- After the files, give a numbered **Manual Steps** list: what to upload where, what to change in the GitHub dashboard (Pages source set to GitHub Actions), and how to test it, each with a "verify" line.
- Build and test the front end in the sandbox before delivering. State plainly what you verified and what the user must verify (the deployed Pages site).
- Do not tell the user to paste secrets into chat or files. If the user reports an error, ask for the exact error text and the relevant file. Explain the cause first, then give the fixed complete file.

## End of every session

Output two things for the user to paste into `PLAN.md`:

1. An updated **Environment State** table (what exists now: files in repo, logos supplied, deploy status).
2. A new **Progress Log** row: date, step, what was done, what is next, decisions made.

## Open items (defaults are in `PLAN.md` Section 15; do not change them yourself outside one-prompt mode)

- Demo date and who presents
- Logo files (RiverWatch logo, mark, barangay seal) and any brand color changes
- Real hotline numbers and evacuation centers, verified with the barangay and MDRRMO
- Flood threshold values in cm, calibrated to the real bridge and river
- Whether the hydraulic gate is monitor-only or automated in the real system
- Auto-send or official-confirms for real alerts
- Resident data source, consent and handling under RA 10173
- Default SMS language and Filipino wording review
- Placeholder names used in the seeds
- Repo name and visibility
