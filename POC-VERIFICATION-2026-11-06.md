# POC implementation and API verification — 2026-11-06

This report supersedes the earlier claim that football statistics and odds required a new provider credential.

## Verified configured providers

Actual HTTP requests with existing credentials confirmed:
- SportScore: HTTP 200; schema is `{sport,count,matches,updated}`, not `{data}`. Latest operational import received 50 football matches, imported all 50, skipped none. Refresh every 120 seconds. Supports upcoming/live/finished normalization, stable event URL tracking, scores and team/competition images.
- SportDB: HTTP 200. Country → competition → current season → fixtures/results/standings discovery works. Match stats, incidents and full-time home/draw/away odds work. Bulk import uses 6.5-second request spacing and backs off on HTTP 429.
- TheSportsDB: backend credential verified HTTP 200. The distinct root-level credential returned HTTP 400. The application now uses the configured backend key rather than silently forcing public key 123.
- MLB, NHL, Jolpi Formula 1: public endpoints HTTP 200. NHL/MLB refresh every 60 seconds.
- ESPN: HTTP 403 in this environment. API-Sports backend credential is empty, root value is a placeholder; neither is presented as an operational account.

Configuration loads backend .env first and root .env only as fallback. SportScore and TheSportsDB API_KEY/KEY variable aliases are recognised. Placeholder API-Sports credentials are excluded. No credentials are included in reports or browser responses.

## Imported and reconciled data

SportDB imported/upserted 1,451 matches and 132 provider standings rows across Süper Lig, Premier League, La Liga, Serie A, Bundesliga, Ligue 1 and Eredivisie, season 2026–2027. The seven imports completed without errors. See backend/artifacts/sportdb-import.json.

Provider team IDs are retained separately from existing team IDs. Twenty-three reviewed name aliases link provider names to canonical existing clubs (including Turkish spelling variants). Original records remain recoverable; redundant provider-only teams are inactive. Twenty-five duplicate event representations are linked through event_aliases; source rows are retained, lists show canonical fixtures and personal result calculations resolve the same aliases. See provider-alias-reconciliation.json and event-aliases.json.

SportDB match enrichment is available on demand with a one-hour cache, request spacing and identity checks. Verified example: workspace/matches/18679 returned 70 match statistic values, 19 incidents and a bookmaker's actual 1-X-2 odds. Three cached match details currently persist 198 total statistics (including prior NHL values), 19 incidents and 3 bookmaker odds records. Unpublished lineups/player ratings are not invented. Retained source snapshots identify data provenance.

110 new team images and 23 new competition images were cached locally during this change. The white Eredivisie crest received a contrasting navy backing, preserving its original image under artifacts/original-white-logos.

## Product changes

- Seven illustrated primary menu items; horizontally scrollable actual league logo navigation. League shortcuts open the selected competition and sport.
- Stadium/sports imagery, navy and gold matchday hero, featured fixtures from leagues with provider standings, match-specific prediction links, compact sport navigation and scrollable fixture boards.
- Prediction cards use club crests and sports styling; model output remains optional and is never fabricated. Existing confidence filters, match details, saves and prediction editing are preserved.
- Match detail includes actual last-five W/D/L form. League tables use provider standings, with source label, instead of presenting incomplete locally calculated totals as complete standings.
- Personal Rewards retains real profile, favourite club logo, XP, achievements, claims and saved prediction history.

## Validation

Both production builds pass. Fresh database migration and repeated seed pass. Foreign key check: zero violations; quick_check: OK.

Browser checks on eight routes at 1440 and 390 px: no visible broken images, viewport overflow or runtime errors. Navigation test verifies 7 menu icons, real league-logo deep link, 18 Süper Lig standings, match-specific prediction modal and a populated live football list. Full reward journey verifies save → claim → 60 XP → favourite-team logo → persistence. Personal API tests verify isolation, validation, kickoff lock and concurrent claim idempotence.

Screenshots: artifacts/workspace/poc-home-1440.png, poc-league-1440.png and updated-*-390.png.

Running: frontend http://localhost:3000; backend http://localhost:3001.
Manual current-season refresh: `cd backend` then `npm.cmd run sync:sportdb`. League-wide SportDB refresh is a manual job; live football and NHL/MLB refresh automatically. API status: /api/v1/integrations/status and /api/v1/health.

Remaining explicit limitations: ESPN access is denied; complete provider lineups/player ratings are not guaranteed; no connected AI prediction model or cross-device authenticated account. This is a functioning personal prediction/rewards POC, not a real-money wagering or production account system.

Final live-feed correction: /api/v1/live and /api/v1/live/stream now read the same canonical database fixtures as the public live page. SSE sends a real initial snapshot and refreshed snapshots every 15 seconds; the former unstarted in-memory engine is no longer the snapshot source. Match minute stays null when not supplied. scripts/test-live-feed.cjs checks REST/page count agreement and receives both initial and periodic SSE events.
