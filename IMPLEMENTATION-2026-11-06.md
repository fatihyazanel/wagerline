# Personal Rewards, logos and verified data — 2026-11-06

Implemented and running at http://localhost:3000 (production build), API :3001.

- Rewards: server-backed anonymous profile identified by an HttpOnly, SameSite cookie; editable name and favourite team; actual team logo; persistent pre-match predictions; result-based XP; four configured levels and three claimable achievements. Atomic conditional claim insertion prevents duplicate XP. No fictional user history or leaderboard.
- PredictionDesk uses the personal API. Existing local predictions for upcoming matches migrate without trusting client timestamps. Closed-match legacy picks remain in local storage; they do not earn retrospective XP.
- Visual design: clubhouse hero, club crest, XP ring, coloured illustrated achievement medals, progress bars, hover/reveal transitions, reduced-motion support, responsive journal and task cards. League directory and prediction cards display real competition logos. Rosters render available player portraits.
- 12 competition badges fetched from identity-checked TheSportsDB league records and cached locally. 233 existing team logos remain cached. No upcoming fixture has a missing team logo/asset. 38 historical/F1 team records still lack verified badges.
- NHL/MLB official refresh runs every 60 seconds; validates event and both team provider IDs before writing. Status at /api/v1/integrations/status and admin API health. Latest run: 48 mapped events, no provider errors. Only these providers have automatic live refresh; football/news imports remain explicit jobs.
- Football import updated 12 verified records, skipped 2 unverified mappings. Süper Lig refresh linked 175 verified players across 18 teams; 25 new player records, total 4,073. Public provider returns limited squads, not complete rosters.
- Filled 8,810 missing match participant links from existing home/away team references.
- Archived 9,144 orphan rows losslessly in legacy_orphan_archive, including source table, original row ID, complete row JSON and FK error details. Removed only those orphan rows from active tables. Full pre-change backup: backend/artifacts/before-orphan-quarantine-1793951775572.db. No guessed player identity remapping. FK violations now 0; quick_check OK. Report: backend/artifacts/orphan-quarantine.json. Restore the full backup only with the application stopped and after separately preserving subsequent personal/data changes; archive also retains individual original rows for reviewed recovery.

Validation:
- Frontend and backend production builds pass.
- Fresh database migration and repeated seeding pass.
- scripts/test-personal.cjs: profile isolation, input validation, persistent picks, kickoff lock, concurrent claim idempotence and XP pass.
- wagerline-app/scripts/test-reward-journey.cjs: browser save/claim/XP/favourite logo/reload persistence pass; test profile/picks/claims removed afterwards.
- wagerline-app/scripts/review-personal.cjs: all eight routes at 1440 and 390 px; no viewport overflow, visible broken images or runtime errors. Screenshots: artifacts/workspace/updated-*.png.

External gaps remain explicit: API-Football credentials absent; NewsAPI previously returned 401; odds/injuries/full football live coverage require a working entitled provider. No AI prediction model is connected; published prediction count remains zero. Authentication across devices is not implemented; the new profile is personal to its browser session cookie. Catalogue values and XP rules are product configuration, not fabricated activity.
