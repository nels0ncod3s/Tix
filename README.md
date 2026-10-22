# Tix

A SvelteKit ticket marketplace with Supabase host accounts and persistent events.

## Run locally

Requires Node.js 22.12+ (Node.js 24 recommended).

```sh
npm ci
cp .env.example .env.local
# Fill in the two public Supabase settings in .env.local.
npm run dev
```

Set `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_PUBLISHABLE_KEY` in every deployed environment. Use a publishable key, or the legacy anon key for compatibility. Never use a service-role/secret key. The app uses cookie-based server authentication and the signed-in user's database permissions.

The initial schema is in `supabase/migrations/20261022170352_tix_host_events.sql`. It has been applied to the selected First Layer project. It creates only Tix-prefixed objects, enables row-level security, and grants hosts access to their own records. It does not modify other applications' tables or auth settings. Users share that project's Supabase Auth directory, while Tix uses its own `tix-auth` session cookie and event ownership rules.

## Host accounts

- `/auth/signup`: create a host account with email and password.
- `/auth/login`: sign in; dashboard routes and save actions validate the user on the server.
- `/auth/logout`: POST-only sign out of this browser session.
- `/auth/callback`: finish the PKCE email-confirmation flow.

In Supabase Authentication > URL Configuration, add `https://YOUR-TIX-DOMAIN/auth/callback` and `http://localhost:5173/auth/callback` to the redirect allowlist. Add a preview callback URL if testing signup on a preview. Preserve existing redirect entries for the other apps sharing this project. Configure a production SMTP provider if the project does not have one. Email confirmation remains enabled; the app does not weaken shared auth settings.

## Events

Hosts can save a partially completed private draft, reopen it from My Events, edit it, and publish it once all required details and ticket tiers are complete. Initial draft saves redirect to an edit URL; subsequent saves update the same record. Prices may be zero for free events. Public routes load published records from Supabase; the old sample event files are not used as live inventory.

Ticket sales close at **midnight in Africa/Lagos after the event date**. For example, an event on 22 October stays on sale through 23:59:59 on 22 October Lagos time and closes at 00:00 on 23 October. Past event URLs remain readable with a Sales closed state, but they are excluded from discovery. Both adding to the cart and the server cart-validation endpoint enforce the cutoff. Checkout validates current prices and combined quantities against stored inventory; client prices are never authoritative.

## Payments

Payments and ticket issuance are not connected yet. The previous simulated paid confirmation has been removed. Validating a cart neither charges the buyer nor reserves inventory or creates an order. The cart remains in memory for the current visit. Dashboard sales and revenue show zero until real order reporting is available.

For the proposed Bachs integration, use server-created checkout sessions and verified, idempotent webhook fulfilment. Implement transactional inventory reservations and real unique tickets alongside payments. For a marketplace collecting for multiple hosts, review Bachs Connect account onboarding, platform fees, refunds, and production capability approval first.

## Checks

```sh
npm test
npm run build
npm run test:integration
```

The integration test builds the app and exercises its real HTTP routes against an isolated Supabase Auth/Data API double. It checks login cookies, protected routes, private drafts, publishing, edits, cross-host access, expired-event checkout, request origins, and logout. It does not send emails or contact production payment systems. Database RLS was separately tested against the selected project in a rolled-back transaction. Browser visual testing requires a separately installed browser.
