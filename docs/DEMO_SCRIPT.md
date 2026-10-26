# RiverWatch demo script

A walkthrough of about 8 minutes. It works for any presenter. Everything on screen is **simulated**: the data, the camera placeholder, the gate and the SMS gateway. Say so at the start.

Open the site, then keep **Demo tools** (bottom of the sidebar) handy. It opens a side panel that does not block the page.

## 1. Splash (20 s)

- The logo appears with a start-up checklist, each line ending "Simulated OK". Click or press any key to skip.
- Say: "This is RiverWatch for Brgy. Maligaya, Rosario, Batangas. This demo runs on made-up data. Nothing here is connected to a real sensor, camera, gate or SMS gateway."

## 2. Home (2 min)

- Point to the yellow **DEMO** banner, the barangay name, and the live Manila time and date.
- **Camera panel:** a placeholder icon. "A live stream, for example from the camera at the bridge, will appear here."
- **Water level card:** level in cm, the badge "System status (demo thresholds)", and the reading age with a **Live** badge. "The thresholds are defaults, pending confirmation. This is not an official warning."
- **Trend:** last 6 hours with the Watch, Warning and Critical lines.
- **Hydraulic gate:** state, age, last change, and "Display only". "The app cannot open or close the gate."
- **Sensor health:** battery, signal, camera status, last seen.

## 3. River rising (2 min)

1. Demo tools > **Start river rising**. Close or leave the panel open.
2. Over about 30 seconds the level climbs. The badge changes to **Watch**, **Warning** and **Critical**, each with its own icon and word.
3. A suggestion banner appears at each tier: "Consider sending an alert. You review the message and press Send."
4. The simulated gate closes when the level reaches Warning, and the event is added to History.
5. Click **Prepare alert** on the banner.

## 4. Alert (2 min)

- The level and the level's template are prefilled. Point to the four specification items: **message content**, **evacuation location**, **disaster info and why**, **hotlines**. Change one and watch the SMS preview update.
- Switch **Language** to Filipino. Say the wording is a draft that still needs review.
- Show the character count and the estimated SMS segments. Type in the message box to show "Edited manually" and **Reset to template**.
- Choose recipients: all active residents, or selected puroks.
- Press **Send alert (simulated)**. A confirmation shows the full message. Confirm.
- The delivery panel shows each resident moving through Queued, Sent and Delivered. A few fail, are retried once, and the summary reads for example "Delivered 38, Failed 2 (retried)". Every status is labeled **Simulated**.
- Optional: **Send test to myself** sends only to the Demo Official number.

## 5. Back to normal (30 s)

- Demo tools > **Back to normal**. The level falls, the gate reopens, and the banner now suggests **All clear**.

## 6. Sensor goes silent and camera lost (1 min)

- Demo tools > **Make Stale**: the badge turns **Stale** and the value dims. Then **Make Offline**: **Offline**, "No sensor signal". **Restore** brings it back.
- Demo tools > **Camera lost**: the placeholder shows the camera-off icon and "No camera signal". **Restore** brings it back.

## 7. Resident (1 min)

- 48 made-up residents. Phone numbers are masked. Search by name, filter by purok.
- Add, edit and delete a resident (delete asks for confirmation). Toggle Active.
- **Import CSV** > **Use a sample with one error row** shows the preview with the rejected row. **Export CSV** downloads the list.
- Say: "Resident data is personal information under RA 10173. The real list needs a consent and handling plan."

## 8. History (1 min)

- **Water level:** switch 24 hours, 7 days, 30 days. Point to the threshold lines and bands, the highest level, time at each status, and the table. **Export CSV**.
- **Alerts log:** click **Details** on a row to see the full message, evacuation location, hotlines and per-recipient deliveries (the two most recent seeded alerts keep them).
- **Gate bar (bottom, always visible):** current state and age, the last 5 changes, and **View all** for the full timeline. "Display only."

## 9. Loading and error states, and reset (30 s)

- Demo tools > move the **Data delay** slider, then change tabs to show the loading state. Turn on **Force data errors** to show the error state with **Try again**. Turn it off.
- Demo tools > **Reset demo** (asks first) restores the seeded data.
- **Replay splash** shows the splash again.

## Notes for the presenter

- The Demo banner is on every screen on purpose.
- Hotlines, evacuation centers and resident names are placeholders.
- Changes you make are saved in this browser only. Reset demo clears them.
