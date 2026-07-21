# Acceptance criteria

Behavioral acceptance criteria for dod.ngo. Criteria backed by a test file are
enforced automatically via `yarn test`; regression lines capture specific
defects so they cannot quietly return.

## Recurring event skips

Recurring meetups are computed by `getNextMonthlyWeekdayDate`
(`lib/recurringEvents.ts`) from per-series skip lists. The "next" occurrence
must never land in a month listed for that series, and the same skip list must
be applied in every render path (the events page and the inline date component).

- [regression 2026-07-01] **DoD Stammtisch** (3rd Wednesday) skips **July 2026
  (DWeb Camp)** and **August 2026 (summer break)**. From a 2026-07-01 reference
  date the next Stammtisch is **2026-09-16**, not July 15.
  Data: `data/skippedStammtisch.js`. Render paths: `app/events/EventsList.tsx`,
  `app/NextStammtisch.tsx`. Test: `lib/recurringEvents.test.ts`.
- [regression 2026-07-01] **Berlin Chaos Mesh** (2nd Wednesday) skips **July 2026
  (DWeb Camp)** and **August 2026 (summer break)**. From a 2026-07-01 reference
  date the next meetup is **2026-09-09**, not July 8.
  Data: `data/skippedBerlinMesh.js`. Render paths: `app/events/EventsList.tsx`,
  `app/NextBerlinMeshMeetup.tsx`. Test: `lib/recurringEvents.test.ts`.

## Events list

- The **Neocypherpunk Summit** (2026-06-14, Funkhaus Berlin,
  https://s26ber.web3privacy.info/) is present in `data/dodEvents.ts`. Its date is
  in the past relative to today (2026-07-01), so it renders under "Past events".
