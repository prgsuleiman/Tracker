---
doc: spec
status: approved
---

# Lost Mode: Technical Spec

> **Process note:** this spec was written from the app as built, without the `4-spec` interview, and the learner read it afterwards and approved it. See the process note in `scope.md`.

## How This Works, In Plain Language
There are two web pages and one shared notebook.

- The **device page** runs on each phone or laptop you want to protect. Every 30 seconds it writes down "I am here, at this time" in the shared notebook, and reads whether you have marked it as lost.
- The **dashboard** is the page you use. It reads the notebook and draws every device on a map. When you press **Lock this device**, it writes "lost = yes, show this message, PIN is this" into the notebook.
- The **shared notebook** is a free online database (Supabase). The two pages never talk to each other directly; they only read and write the notebook.
- When a device reads "lost = yes", it covers its screen with the red lock and your message. The PIN is stored as a scrambled value (a hash), and the device scrambles what you type and compares.

Why this shape: it needs no server code of our own, it runs on free static hosting, and it fits an afternoon. The price is that it is only a web page, with the limits listed below.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.
1. Owner taps Register on a device → `device.html` asks the database to create a row → the row's id is saved in the browser.
2. Every 30 s → `device.html` writes its position and "last seen" to its row and reads the row back.
3. Dashboard every 8 s → `index.html` reads all rows → draws the list and map dots.
4. Owner presses Lock → `index.html` writes `lost = true`, the message, and the PIN hash to the row.
5. Next device check → `device.html` reads `lost = true` → shows the lock overlay and switches to checking every 10 s.
6. Right PIN on the device → it hashes the typed PIN, matches it to `pin_hash`, writes `lost = false`. Or owner presses Mark as found → the dashboard writes `lost = false` → the device removes the lock on its next check.

## Stack
- **HTML, CSS and plain JavaScript**, no framework and no build step. Chosen because the learner's earlier project (Decoy Canary Wallet) is a static site, and for speed.
- **Supabase** (hosted Postgres with a REST interface). Docs: https://supabase.com/docs/guides/api . Learner agreed to use it.
- **Leaflet 1.9.4** for the map. Docs: https://leafletjs.com/reference.html
- **OpenStreetMap tiles** for the map images. Usage policy: https://operations.osmfoundation.org/policies/tiles/
- **GitHub Pages** for hosting (HTTPS is required for the browser location feature).
- **Browser features used:** Geolocation, Screen Wake Lock, Web Crypto (SHA-256), Service Worker, Web App Manifest.
- Unverified on the learner's devices: installing as a home-screen app, and the screen wake lock. Check early in any further work.

## Where It Runs and How Someone Tries It
- Live: https://prgsuleiman.github.io/lostmode/ (dashboard) and https://prgsuleiman.github.io/lostmode/device.html (device page).
- No local build. To run your own copy: create a free Supabase project, run `setup.sql` in its SQL editor, put your project URL and public key in `config.js`, and publish the folder (GitHub Pages or any static host over HTTPS).
- The key in `config.js` is Supabase's **publishable** key, which is designed to be public. Never put the secret or service_role key there.
- For the demo: open the dashboard on a laptop and the device page on a phone, register the phone, press Lock, and watch the phone.

## Look and Feel
Carried from `prd.md > Look and Feel`. Learner decision: "the colours are wonderful" and the current layout is "quite alright", so the existing dark interface, red lock screen and green/grey/red status dots stay. System fonts and the plain-English wording are Claude's choices.

## Components

### Shared database helper (`api.js`)
Small wrapper around the Supabase REST interface: list, get, create, update and remove device rows, plus a SHA-256 helper. Talks to Supabase using the URL and key in `config.js`.
PRD ref: `prd.md > Registering a device`, `prd.md > Reporting position`.

### Device page (`device.html`)
Registers the device, watches its position, reports every 30 s (10 s when lost), requests a screen wake lock, and shows the lock overlay when the row says lost. Checks the typed PIN against the stored hash.
PRD ref: `prd.md > Registering a device`, `prd.md > Reporting position`, `prd.md > Locking a device`.

### Dashboard (`index.html`)
Lists devices with online/offline/lost tags, draws them on a Leaflet map with an accuracy circle, and provides the lock, mark-as-found and remove controls. For a device that has not reported for 90 seconds, its panel says "Stopped sending signals at [time]" with how long ago and the last position. Refreshes every 8 s.
PRD ref: `prd.md > Knowing when a device stopped sending signals`, `prd.md > Screens and Layout`, `prd.md > Locking a device`, `prd.md > Unlocking from the dashboard`, `prd.md > Removing a device`.

### Installable app files (`manifest-device.json`, `manifest-dashboard.json`, `sw.js`, `icon-192.png`, `icon-512.png`)
Manifests describe the app name, icon and start page; the service worker makes the pages installable and lets them open without a connection (network first, so updates always win). Database calls are never cached.
PRD ref: `prd.md > Installing as an app`.

## Data Model
One table, `devices`, in Supabase:

| column | type | meaning |
|---|---|---|
| id | uuid | device identity, created by the database |
| name | text | shown on the dashboard |
| lat, lng, accuracy | numbers | last reported position and its accuracy in metres |
| last_seen | timestamp | last report time; online means within 90 seconds |
| lost | true/false | whether lost mode is on |
| message | text | what the lock screen shows |
| pin_hash | text | SHA-256 of the PIN |
| created_at | timestamp | when registered |

Data lives in Supabase. A device remembers only its own id in the browser; coming back later reconnects to the same row.

## File Structure
```
lostmode/
├── index.html               # dashboard: list, map, lock controls
├── device.html              # device page: register, report, lock screen
├── api.js                   # shared database helper and SHA-256
├── config.js                # Supabase URL and publishable key
├── setup.sql                # creates the devices table and its policies
├── sw.js                    # service worker (installable, opens offline)
├── manifest-device.json     # install details for the device page
├── manifest-dashboard.json  # install details for the dashboard
├── icon-192.png, icon-512.png
├── README.md                # setup, demo script, honest limits
└── devpost/                 # planning docs: scope.md, prd.md, spec.md
```

## External Services and Dependencies
- **Supabase REST** (`/rest/v1/devices`): GET list/get, POST create, PATCH update, DELETE remove, sent with the publishable key. Docs above. Free tier.
- **Leaflet** from unpkg (CDN). Free.
- **OpenStreetMap tiles**. Free, light use only.
- **GitHub Pages**. Free.

## Important Failure Modes
- **Browser pauses the page (tab in the background, screen off, app closed)** → it stops reporting and cannot learn it was locked. The dashboard shows "offline" and the last known position.
- **Open database access** → the database policies allow anyone with the public key to read and change any row. A stranger could read device positions or lock or unlock devices. Accepted for the proof of concept; fixed by owner sign-in and per-owner policies.
- **A thief closes the page or clears browser data** → the lock disappears. The lock is only a web page.
- **Location is blocked or inaccurate** → the page says it is blocked; indoors positions can be off by hundreds of metres.

## What Was Simplified and Why
- **A web page lock** instead of an operating-system lock. The fuller version needs a native app or device management.
- **Polling every 8 to 30 seconds** instead of live push updates. The fuller version would use Supabase Realtime.
- **A short numeric PIN stored as a plain SHA-256 hash.** A real version would use a slow password hash, and a longer secret.
- **No sign-in.** The fuller version ties each device to its owner.

## Decisions and Open Issues
Learner decisions: both phone and laptop; lock with message plus location; use Supabase; installable app instead of web-only.
Claude's implementation choices, not the learner's: plain JavaScript, Leaflet/OpenStreetMap, timings, PIN hashing, open demo policies, dark look.

**One real moment of uncertainty, and what clarified it:**
- The learner said "it works but only on the web, I want an app". What clarified it: the difference between a web page, an installable web app (PWA), and a native app. A PWA was added now; a native app is listed as the next step because it needs separate tooling and real background access.
- A configuration slip also showed how the pieces connect: the key in `config.js` was pasted without quotation marks, so the page script failed silently and both pages showed nothing. It was found by reading the file as the live site served it, and fixed by adding the quotes.

Unresolved:
- The `4-spec` interview was not run: this spec was written from the build, then read and approved by the learner.
- Installing on the learner's phone has not been confirmed.
- Whether the Devpost skill pack is required for eligibility is not settled; see the process note in `scope.md`.
