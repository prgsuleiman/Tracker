---
doc: scope
status: approved
---

# Lost Mode

Software that helps guard a person's belongings from people with malicious intentions, by watching a device's position and locking it when it is lost or stolen.

> **Process note (honest):** The first version of this app was built in a Claude chat on 26 Oct 2026 before the Devpost Learn skill pack's instructions were used. Afterwards, `1-start`, `2-scope` and the interview part of `3-prd` were run with the learner in the same chat. The pack was read and followed from its `SKILL.md` files, not installed in a coding agent. `4-spec` was written from the build without an interview, and `5-build` and `6-ship` were not run. Each document's `status` line shows what the learner has approved.

## The Unique Kernel
In the learner's words: "a software that helps guard a person's belongings from people with malicious thoughts", and "everyone can use it, and that is the fun thing about it."
Concretely: it actively monitors a device's position and shows **the time the device stopped sending signals** (and where it was then), so the owner knows when and where to look. And the owner can lock the device with a message of their own.
Phones already have Find My Device (Android) and Find My (iPhone); the learner's angle is that it is open to anyone, on any device, from a web page.

## Who It's For
"Everyone." For this proof of concept: one owner and their own devices (a phone and a laptop). Letting any person sign up and see only their own devices is a later step; the learner chose "the easier option".
What they do today instead: not stated.

## The Core Loop
1. Register a phone or laptop once. It keeps sending its position.
2. The owner watches the dashboard. When a device stops sending signals, the dashboard shows when it stopped and the last position.
3. The owner locks the device with a message and a PIN.
4. The device gets locked and shows the message. When it is recovered, the PIN or **Mark as found** unlocks it.

## Inspiration & Identity
Not specified by the learner. Context only: the learner's earlier project, Decoy Canary Wallet (https://prgsuleiman.github.io/DecoyCanaryWallet/), is a plain, honest static site. The dark look is Claude's assumption.

## Why This Matters to the Learner
"To guard a person's belongings from people with malicious thoughts", originally "a tracker app to deal with thieves and misplaced devices".

## What "Working" Looks Like
The 1 to 3 minute video shows **how the device gets locked**: the owner marks the device lost on the dashboard, and the device screen turns into the lock with the owner's message; a wrong PIN is rejected and the right one unlocks it. Before that, the dashboard shows the device's position and the time it last reported.

## The POC Boundary
In:
- Register a phone or laptop; it sends its position regularly.
- Dashboard with a map and device list showing online or offline, the time the device last sent a signal, and its last position.
- Lock with a message and PIN; unlock by PIN or from the dashboard.
- Installable as a home-screen app (the learner asked for "an app").

## Later
- Sign-in so anyone can use it and see only their own devices.
- Alerts when a device goes quiet or moves.
- Location history trail.
- A native Android app for real background tracking.

## Explicitly Cut
- **Operating-system lock** — a web page can only cover its own screen; it needs a native app.
- **Tracking when the app is closed or the screen is off** — browsers pause pages.
- **Photo capture / evidence** — not needed to prove the idea.
- **Multi-user accounts** — the learner chose the easier, single-owner option for now.
