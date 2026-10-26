---
doc: prd
status: approved
---

# Lost Mode: Product Requirements

Software that lets an owner see when and where a device stopped sending signals, and lock it with a message of their own. For one owner's phone and laptop in this proof of concept.
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

## The Core Journey
1. The owner opens the device page on each phone or laptop, taps **Register this device**, and allows location. (`scope.md > The Core Loop`, step 1)
2. The device page shows "connected" and keeps sending its position every 30 seconds.
3. The owner opens the dashboard. Each device is a dot on the map and a row in the list.
4. If a device stops sending signals, its panel shows **the time it stopped** and its last position. (`scope.md > The Unique Kernel`)
5. The owner selects the device, writes a message, sets a 4 to 8 digit PIN, and presses **Lock this device**.
6. The device gets locked: its screen turns into the red lock with the owner's message. (`scope.md > What "Working" Looks Like`)
7. When recovered, the PIN on the device, or **Mark as found** on the dashboard, unlocks it.

## Screens and Layout
The learner said of the current screens: "how it is now is quite alright". So the layout stays as built:
- **Dashboard** (`index.html`): header, left panel with the device list and control panel, map on the right (map below on narrow screens). Each device row shows its name, "seen N ago", a status dot and a tag: online, offline, or lost.
- **Device page** (`device.html`): register box on first use, then a status card (device name, connection, location, last report) with an **Unregister this device** button.
- **Lock screen**: full-screen overlay on the device page.
- Both pages install as home-screen apps.

## Look and Feel
Learner decision: "the colours are wonderful", so the existing look stays: dark interface, green for online, grey for offline, red for lost, a solid red lock screen with a white padlock and large message text. The app icon is a white padlock on dark red.

## Features and Behavior

### Registering a device
- The device page suggests a name from the browser and the owner can change it. The device remembers its own record in the browser.
- [ ] After Register and Allow, the status card shows "connected" and "Location: OK, within N m".
- [ ] The device appears on the dashboard within about 10 seconds.

### Reporting position
- Every 30 seconds (10 seconds in lost mode) while the page is open; the screen is asked to stay awake.
- [ ] "Last report" on the device page changes about every 30 seconds.
- [ ] Moving the device moves its dot on the dashboard after the next report.

### Knowing when a device stopped sending signals
- A device counts as online if it reported in the last 90 seconds. Otherwise the panel says **"Stopped sending signals at [time]"**, with how long ago and the last position (map link included).
- [ ] After a device is closed or offline for 90 seconds, the dashboard tag says offline and the panel shows the time of its last signal as "Stopped sending signals at ...".

### Locking a device
- A message and a 4 to 8 digit PIN are required. The message is remembered for next time.
- [ ] Without a message, or with a PIN that is not 4 to 8 digits, the dashboard refuses and says why.
- [ ] After pressing Lock, the device shows the red lock with the exact message within about 30 seconds.
- [ ] A wrong PIN shows "Wrong PIN."; the right PIN removes the lock.

### Unlocking from the dashboard
- [ ] **Mark as found (unlock)** removes the lock on the device within about 30 seconds.

### Removing a device
- **Remove device** on the dashboard deletes it after a confirmation. A device whose record was removed returns to the register screen.

### Installing as an app
- The learner asked for "an app": either page installs to the home screen and opens full screen.
- [ ] After installing, the Lost Mode icon opens the app without the browser bar.

## States and Boundaries
Learner said "I don't know" about these, so they are **Claude's assumptions**, listed for the learner to accept or change:
- **A device that has never sent a signal** — its panel says "No location reported yet." and its row says "seen never".
- **A locked device that loses its connection** — the lock screen stays on its screen, because it is already showing, but the dashboard cannot reach it, so it shows the last position and the time it stopped sending signals.
- **Lock confirmation** — the dashboard marks the device "lost" straight away, but the device only receives the lock on its next check (about 30 seconds, or never if offline). The dashboard does not yet show "lock confirmed on the device". See Open Questions.
- **Location blocked** — the Location line says it is blocked and to allow location for the site.
- **Database unreachable or not configured** — a red banner explains it.
- **What persists** — device records live in the shared database; each device remembers its own id in its browser.

## Product Decisions
- **Both phones and laptops** — learner: "both".
- **Lock it and display the message, and see where the device is** — learner's two chosen goals.
- **The device-stopped time is the heart of the monitoring** — learner: "the time when the device stopped sending signals".
- **One owner's devices for the proof of concept** — learner chose "the easier option" over letting everyone sign up and see only their own devices.
- **The video shows how the device gets locked** — learner's definition of working.
- **Keep the current layout and colours** — learner: "how it is now is quite alright", "the colours are wonderful".
- **An installable app instead of web-only** — learner: "I want an app".
- **Claude's assumptions, not learner decisions:** the 30- and 10-second intervals, the 90-second online threshold, the PIN length, and the edge-case behaviour listed under States and Boundaries.

## What We're Building
Register a device, report its position, show the time it stopped sending signals, lock it with a message and PIN, unlock by PIN or from the dashboard, installable as an app.

## Deferred From the POC
- **Sign-in so anyone can use it and see only their own devices** — needs accounts and per-owner access rules.
- **Alerts when a device goes quiet or moves** — needs a server that watches for missed reports.
- **Lock confirmation from the device** — needs the device to report back that it received the lock.
- **A native app** — needed for real locking and background tracking.

## Possible Later Enhancements
Location history trail, sound alarm on the device, photo capture.

## Non-Goals
- Replacing Find My Device or Find My.
- Stopping a thief who simply closes the page or clears browser data.

## Open Questions
- Should the dashboard say "lock pending" until the device confirms it received the lock? Assumed no for the proof of concept. Can wait; does not block the spec.
