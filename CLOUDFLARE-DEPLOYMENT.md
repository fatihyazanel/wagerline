# Cloudflare deployment assessment

The current application cannot be deployed unchanged as a static-only Cloudflare Pages site.

## Current runtime requirements

- `wagerline-app/`: Next.js server rendering, dynamic routes, domain redirects and an `/api/*` reverse proxy configured in `next.config.ts`.
- `backend/`: Fastify Node.js service, native SQLite driver, persistent database files, scheduled provider synchronization, authentication and transactional shop orders.
- Static file hosting does not execute these services. Adding `output: 'export'` is not a deployment fix and would require a functional redesign.

## Recommended initial deployment

Run the Next.js server and Fastify backend on a Node.js host with persistent disk, behind Cloudflare DNS/proxy and HTTPS. Build each application with `npm ci` and `npm run build`, then run its `npm start` under a service manager. The root package is a legacy application; use the two application directories above.

Set `API_INTERNAL_URL` on the frontend to the reachable backend address, preserving the same-origin `/api/*` proxy. Configure the production site URL and domain redirects as described in `SEO-DOMAIN-RELEASE.md`. Set backend `APP_ORIGIN` to the public HTTPS origin and register that origin's `/api/v1/personal/google/callback` in Google Cloud. Supply provider and OAuth secrets through the host's secret configuration.

Persist the configured SQLite database location across deployments, back it up, and run migrations and synchronization deliberately. Do not deploy an empty replacement database over existing accounts, points or orders. Databases, local credentials and test sessions are deliberately absent from Git. Review provider quotas and job ownership before running multiple backend instances.

Bypass Cloudflare caching for `/api/*` and authenticated/personal responses. Verify cookies, login/logout, OAuth, personalized rewards, shop checkout and stock/points consistency after deployment. Check SSR pages, robots, sitemap, canonical URLs and live refresh on the final domain.

## Optional Workers migration

Cloudflare Workers with an appropriate OpenNext adapter is a possible frontend migration path; compatibility with this project's exact Next.js version must first be checked and tested. No adapter or Workers deployment has been configured or validated in this change. The existing Fastify/native SQLite backend still requires a suitable server host.

A fully Cloudflare-hosted backend would require explicit work to port persistence to D1 or another supported database, scheduled work to platform services, and verify sessions, migrations and atomic shop operations. D1 is not a drop-in replacement for the current native SQLite integration.

References: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/ and https://developers.cloudflare.com/pages/framework-guides/nextjs/ . These are deployment references, not evidence of a successful deployment of this repository.
