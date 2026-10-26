# Lost Mode

Mark a lost or stolen device from a dashboard. The device locks its screen with your message and a PIN prompt, and the dashboard shows where it last reported from.

A proof of concept built for Devpost "Build With AI: Basics".

## How it works

- `device.html`: open once on each phone or laptop and tap Register. It sends its location to the database every 30 s (every 10 s in lost mode) and checks whether it has been marked lost.
- `index.html`: the owner dashboard. Map of all devices, last-seen time, and a "Lock this device" button with a message and PIN.
- Supabase (free) stores one row per device. No server code.

## Setup (about 10 minutes)

1. Create a free project at https://supabase.com.
2. SQL Editor, New query, paste the contents of `setup.sql`, Run.
3. Project Settings, API. Copy the **Project URL** and the **anon public** key (or the publishable key). Paste both into `config.js`. Never use the service_role / secret key.
4. Push this folder to a GitHub repo and turn on GitHub Pages (Settings, Pages, deploy from branch). You need HTTPS for location to work on phones.
5. On your phone, open `https://YOUR-USER.github.io/YOUR-REPO/device.html`, name the device, tap Register, allow location.
6. On your laptop, open the same site's `index.html`.

## Demo script (for the Devpost video)

1. Phone: register it. Laptop: the device appears on the map.
2. Walk a few metres, wait ~30 s, watch the marker move.
3. Dashboard: type a message and a PIN, press "Lock this device".
4. Phone: within ~10 s the screen turns red with your message.
5. Enter a wrong PIN (rejected), then the right one (unlocks), or press "Mark as found" on the dashboard.

## Honest limits

- **This is a web page, not an operating system lock.** It covers the screen of the browser tab. A thief can close the tab, switch apps, restart, or wipe the browser. Real locking needs a native app or device management.
- **The device page must stay open.** Browsers pause location and timers in background tabs and when the screen is off. This prototype asks the browser to keep the screen awake, but that is not guaranteed.
- **No protection against a thief who goes offline.** If the device has no connection, it cannot learn that it was marked lost. The last known location is all you get.
- **Demo-grade security.** Anyone with the public key can read and change rows (see `setup.sql`). A real version needs sign-in and policies that tie each device to its owner. The PIN is stored as a SHA-256 hash, which a short numeric PIN does not survive against brute force.
- **Location is approximate.** It comes from GPS, Wi-Fi and cell data via the browser, and indoors it can be off by hundreds of metres.
- **Phones already have Find My Device and Find My.** This project's value is the idea and the workflow, not replacing them.

## Planning docs

The `devpost/` folder holds `scope.md`, `prd.md` and `spec.md`, written for the Devpost "Build With AI: Basics" hackathon. Each has a process note and a `status` line saying what was interviewed and what the learner approved.

## Next steps

Sign-in per owner, alerts when a device goes offline or moves, a native or PWA service-worker version, photo capture, a location history trail.
