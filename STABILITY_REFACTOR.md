# VFitness Stability Refactor

## Production safeguards implemented

1. The Programs build-time source rewriter is no longer part of the Vercel build. The checked-in Programs bundle is now the production source of truth.
2. The service worker uses a versioned cache and network-first navigation handling so stale HTML cannot keep a broken release alive.
3. A visible update prompt allows installed PWAs to activate a new service worker safely.
4. Global JavaScript and promise failures are recorded locally and, when Firestore is available, in `clientErrors`.
5. Deployments run a preflight and post-build verification that checks required Programs files, removes unsafe direct-route helpers, and validates service-worker update behavior.
6. The stability runtime is isolated from React business logic and does not scan, click, or mutate application navigation.

## Rules for future upgrades

- Do not reintroduce `apply-vfp-programs.js` into the production build.
- Do not implement routes by automatically clicking buttons or opening the menu.
- Do not add global MutationObservers that rewrite React-rendered content.
- Make Programs changes directly in `site/vfp-programs.js` and validate them before deployment.
- Keep HTML and service-worker responses uncached; cache versioned static assets only.
- Every new client-facing feature must expose a recoverable error state and log a referenceable failure.

## Remaining migration path

The current single-page application should be migrated incrementally into source-controlled React modules and real routes. That migration should happen behind preview deployments and automated smoke checks rather than through production string replacement.
