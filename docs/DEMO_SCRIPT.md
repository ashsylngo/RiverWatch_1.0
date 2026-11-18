# RiverWatch demo script

A walkthrough of about 10 minutes. It works for any presenter. Everything on screen is **simulated**: the data, the camera placeholder, the gate and the SMS gateway. Say so at the start.

Open the site, then keep **Demo tools** (bottom of the sidebar) handy. It opens a side panel that does not block the page.

## 1. Splash (20 s)

- The logo appears on its own for about 2.5 seconds. Click or press any key to skip.
- Say: "This is RiverWatch for Brgy. Maligaya, Rosario, Batangas. This demo runs on made-up data. Nothing here is connected to a real sensor, camera, gate or SMS gateway."

## 2. Home (2 min)

- Point to the barangay name and the live Manila time and date. At the far right of the top bar are the **EN | FIL** language toggle and the **notification bell** (covered in the next section).
- **Camera panel:** five sample photos of the river fade into each other. Say: "These are sample photos, a placeholder. A live stream, for example from the camera at the bridge, will appear here." The caption on the photo says the same, and **Pause** stops the slideshow.
- **Water level card:** level in cm, the badge "System status (demo thresholds)", and the reading age with a **Live** badge. "The thresholds are defaults, pending confirmation. This is not an official warning."
- **Trend:** last 6 hours with the Watch, Warning and Critical lines.
- **Hydraulic gate:** state, age, last change, and "Display only". "The app cannot open or close the gate."

## 2b. Language toggle and notification bell (1.5 min)

**Language toggle (EN | FIL)**

1. Click **FIL** in the top bar, to the right of the time and date. Everything on screen changes at once with no reload: tab names, cards, buttons, dates and the bell. Click **EN** to switch back.
2. The audience should see the whole screen in Filipino (for example "Residente", "Alerto", "Kasaysayan", "Kontrol") and the active button (EN or FIL) filled in blue.
3. Say: "The Filipino wording is a draft that still needs a native speaker's review." The choice is remembered when the page is reloaded, and **Reset demo** does not change it.
4. The SMS language is separate. The Alert tab has its own **Language** field, and CSV file headers stay in English.

**Notification bell**

1. Click the **bell** at the far right of the top bar. A panel opens under it with the heading **Notifications** and, at first, three older items ("Alert sent") with no number on the bell. The audience should see that nothing is unread yet. The footer says "System status (demo thresholds). Simulated."
2. Close it with **Esc** or by clicking elsewhere. Focus returns to the bell, so it works from the keyboard too.
3. Start **River rising** (next section) and watch the bell. A small orange number appears and counts up. It is only a count, and orange never means a status. Open the panel and show that each item has an icon **and** a word (Info, Watch, Warning or Critical), a title, a short message, its age (hover the age to see the full date), and an unread dot with the word "Unread" for screen readers.
4. Say: "These are in-app messages built from the same data as the screen. They are not official warnings, and the bell never sends anything."
5. On an "Alert suggested" item, click **Prepare alert**. The Alert tab opens with the level filled in, and nothing is sent. On an "Alert sent" item, click **View in Alerts log** to open History > Alerts log.
6. Click **Mark all as read**. The number disappears from the bell.
7. With the panel open, click **FIL**. The items are rewritten in Filipino, ages included.

## 3. River rising (2 min)

1. Demo tools > **Start river rising**. Close or leave the panel open.
2. Over about 30 seconds the level climbs. The badge changes to **Watch**, **Warning** and **Critical**, each with its own icon and word.
3. A suggestion banner appears at each tier: "Consider sending an alert. You review the message and press Send."
4. The simulated gate closes when the level reaches Warning, and the event is added to History.
5. Watch the bell: each tier change, each suggestion and the gate closing add an item, so the number counts up (it shows **9+** above nine).
6. Click **Prepare alert** on the banner.

## 4. Alert (2 min)

- The level and the level's template are prefilled. Point to the four specification items: **message content**, **evacuation location**, **disaster info and why**, **hotlines**. Change one and watch the SMS preview update.
- Switch **Language** to Filipino. Say the wording is a draft that still needs review.
- Show the character count and the estimated SMS segments. Type in the message box to show "Edited manually" and **Reset to template**.
- Choose recipients: all active residents, or selected puroks.
- Press **Send alert (simulated)**. A confirmation shows the full message. Confirm.
- The delivery panel shows each resident moving through Queued, Sent and Delivered. A few fail, are retried once, and the summary reads for example "Delivered 38, Failed 2 (retried)". Every status is labeled **Simulated**.
- Optional: **Send test to myself** sends only to the Demo Official number.

## 5. Back to normal (30 s)

- Demo tools > **Back to normal**. The level falls, the gate reopens, and the banner now suggests **All clear**. The bell adds an item for each tier change, the gate and the suggestion.

## 6. Sensor goes silent and camera lost (1 min)

- Demo tools > **Make Stale**: the badge turns **Stale** and the value dims. Then **Make Offline**: **Offline**, "No sensor signal". **Restore** brings it back.
- Demo tools > **Camera lost**: the photos are replaced by the camera-off icon and "No camera signal". **Restore** brings it back.
- Each of these (Stale, Offline, Camera lost) adds an item to the bell: Watch for Stale and Camera lost, Warning for Offline. **Restore** adds nothing.

## 7. Resident (1 min)

- 48 made-up residents. Phone numbers are masked. Search by name, filter by purok.
- Add, edit and delete a resident (delete asks for confirmation). Toggle Active.
- **Import CSV** > **Use a sample with one error row** shows the preview with the rejected row. **Export CSV** downloads the list.
- Say: "Resident data is personal information under RA 10173. The real list needs a consent and handling plan."

## 8. History (1 min)

- **Water level:** switch 24 hours, 7 days, 30 days. Point to the threshold lines and bands, the highest level, time at each status, and the table. **Export CSV**.
- **Alerts log:** click **Details** on a row to see the full message, evacuation location, hotlines and per-recipient deliveries (the two most recent seeded alerts keep them).

## 8b. Control (1 min)

- **Sensor data:** battery, signal, camera status, last seen with its age and a **Live** badge. All simulated.
- **Hydraulic gate:** current state and age, marked **Display only**, with the full gate history below it. "The app cannot open or close the gate."
- Optional: Demo tools > **Make Stale** shows **Stale** on both cards, and **Camera lost** shows the camera as Offline in the sensor data. **Restore** brings them back.
- Optional: Demo tools > **Toggle simulated gate** flips the simulated gate state and adds an item to the gate history and to the bell ("Hydraulic gate: Closed").

## 9. Loading and error states, and reset (30 s)

- Demo tools > move the **Data delay** slider, then change tabs to show the loading state. Turn on **Force data errors** to show the error state with **Try again**. Turn it off.
- Demo tools > **Reset demo** (asks first) restores the seeded data. The bell goes back to its three older items with no number. The language choice stays.
- **Replay splash** shows the splash again.

## Notes for the presenter

- There is no Demo banner. Say out loud that the data is simulated. The "Simulated" tags and the camera placeholder label stay on screen.
- Hotlines, evacuation centers and resident names are placeholders.
- The bell is in-app only. Nothing in it is an official warning, and its only action is **Prepare alert**, which sends nothing.
- Changes you make are saved in this browser only. Reset demo clears them.
