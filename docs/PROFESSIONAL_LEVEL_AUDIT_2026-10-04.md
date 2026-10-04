# VFIT Bahamas: product and development audit

Date: 4 October 2026. Baseline: `2648375e9bda73850fe207820c33219b466fb948` in `Darvano242/vfitbah`.

## Why this app should exist

VFIT should turn a prospective coaching client into a consistently coached member. The public site explains services, coaches, prices and results; guided intake connects the person with a suitable coach; the member product manages paid sessions, bookings, training, check-ins and progress. Coaches need a reliable operational workspace, while clients need a trustworthy record of what they purchased and what happens next.

The most useful positioning is **the coaching business's operating system and client portal for Nassau**, with online coaching as an extension. Public copy currently also directs visitors to `vfitnow.app`. Define which product owns login, subscriptions and progress so users do not have to understand two overlapping products.

The product loop to optimize is: qualified application → consultation → verified purchase → first booked session → completed session → recorded progress → renewal. A visual redesign alone will not make this loop trustworthy.

## Assessment

Provisional engineering readiness: **4/10**, before this branch. These are judgment scores, not measured benchmarks or a penetration-test certification.

| Area | Score | Assessment |
| --- | --- | --- |
| Purpose and local differentiation | 8/10 | Clear coaching offering, local locations and coach matching. |
| Public presentation | 7/10 | Cohesive new design, prominent services, prices and intake. Mobile, keyboard and screen-reader coverage still needed. |
| Application architecture | 3/10 | A 1,043,432-byte HTML source contains the compiled application; sequential string transformers build it. |
| Payment and authorization confidence | 3/10 | Browser capture and entitlement writes are visible; deployed Firebase rules and backend reconciliation were not available for verification. |
| Reliability and release assurance | 3/10 | No baseline automated test suite, oversized offline caching and a production-writing legacy workflow. |
| Growth instrumentation | 4/10 | No verified conversion funnel, retention cohort or operational reliability dashboard in the reviewed code. |

A score of 8–9 requires proven private-data access controls, authoritative purchases and bookings, repeatable releases and measured user outcomes. The first hardening PR improves specific failure modes; it does not establish those broader guarantees.

## Evidence and scope

Reviewed the live homepage and public service/results content, navigated the initial guided-intake choices, inspected Vercel project/domain configuration, and reviewed the linked repository and production build chain. No application was submitted, account created, payment made or private client record opened.

The reviewed runtime uses Firebase compat Auth/Firestore/Storage. The repository also contains a Supabase migration kit, but it is not the active runtime in the reviewed HTML. README/platform descriptions need to reflect the actual deployment.

Verified source findings:

- `site/index.html` contains browser PayPal order capture followed by writes to `packages` and `workoutProgramEnrollments`. No authoritative payment creation/capture/reconciliation endpoint was found in this repository. This is a design risk; whether fraudulent writes are currently accepted depends on deployed rules, which were not inspected.
- `ProgressPhotos` stores a data URL in Firestore with `visibility: 'private'`. That field is metadata, not authorization. Raw image size, storage design and effective read rules need verification.
- `vf26/vfit-2026.js` sends media to a Base44 upload endpoint and consumes a returned `file_url`. The reviewed calls relate to public media/email assets. This is a separate hosting dependency; the audit did not establish that private progress photos use it or that returned URLs are protected.
- The original application relay accepted loose fields, had no provider timeout and considered HTTP success sufficient even if the provider reported failure.
- Guided `StartHereFlow` originally used a different Firestore/EmailJS path, rather than the same-origin application relay.
- The original auth listener could commit a stale profile after account switching, allowed database fields to override auth identity, and read onboarding fields from an absent profile.
- The original worker cached arbitrary successful same-origin GET responses, including potential API/query URLs, and returned offline HTML for missing non-HTML resources.
- A legacy `pull_request_target` workflow downloaded mutable external JavaScript/CSS and committed directly to `main` with write permissions.
- Service navigation changes React state while the observed URL remains `/`. Shareable pages, browser history and route-specific metadata need proper routing.
- Runtime dependencies include CDN React, Firebase compat, Tailwind's browser compiler and `lucide@latest`. There is no package manifest or dependency lockfile for the frontend.

## Ranked development backlog

Effort is relative engineering size: S (focused change), M (several coordinated components), L (substantial backend or migration work). It is not a delivery quote.

| Rank | Priority | Improvement | Why it matters | Acceptance criterion | Effort |
| --- | --- | --- | --- | --- | --- |
| 1 | P0 | Authoritative payment and entitlement backend | Prevent price tampering, fake activation and inconsistent renewals. | Server selects catalog price/currency, creates/captures orders, verifies provider events, deduplicates payment IDs, reconciles refunds; clients cannot create or change paid entitlements. Sandbox tests cover altered amount, repeated event and refund. | L |
| 2 | P0 | Verify and version Firebase authorization rules | Client-side role UI cannot protect money, personal records or administration. | Rules committed to source with emulator tests: client A cannot read/write client B; trainers see assigned clients only; clients cannot edit role, session balance, payment status or ledger; anonymous intake only creates valid leads. | L |
| 3 | P0 | Private progress-photo and health-data lifecycle | Body photos, measurements and injury notes need controlled access and reliable deletion. | Authenticated private object storage, owner/assigned-coach access, bounded validated uploads, short-lived access URLs where appropriate, consent/retention/deletion flow and access tests. No unbounded base64 images in Firestore. | L |
| 4 | P1 | Reliable application intake | Lost leads and misleading success states hurt revenue. | One server intake service persists a canonical application ID before acknowledgement, queues notification, implements durable deduplication, bot protection and observable retries. First validation/delivery pass is included here. | M |
| 5 | P1 | Atomic booking and session accounting | Double booking and negative balances undermine trust. | Server transactions enforce trainer/location capacity, client ownership, expiry and balance; cancel/reschedule rules and immutable session ledger; concurrent booking tests. | L |
| 6 | P1 | Account lifecycle and failure recovery | Users must not see a previous account's state or endless loading. | Stale callbacks ignored, identity from Auth preserved, missing profiles handled, anonymous intake kept public, timers cleaned up. First pass included here; retry UI and actual multi-account browser tests remain. | M |
| 7 | P1 | Reproducible build and reviewed deployment | Mutable downloads and fragile patch chains make releases risky. | Locked package toolchain, typed source components, protected reviewed PRs, quality checks, staging and rollback. This PR adds tests and build verification and retires automatic legacy writes; migration remains. | L |
| 8 | P1 | Observability and recovery | A professional app needs to detect broken payments, intake and jobs promptly. | Structured redacted server errors, client crash reporting, delivery/payment alerts, tested backups and restoration, documented incident response. | M |
| 9 | P1 | Accessible mobile core journeys | Intake, booking and purchase need to work beyond a desktop mouse. | Keyboard/focus/dialog/error-label audit; touch targets, contrast and reduced motion; manual checks at 360/390/768px and on iOS/Android; automated accessibility checks. | M |
| 10 | P2 | Modular frontend and real routes | Large inline compiled code limits maintainability, testing and SEO. | Vite/React or another deliberately selected build tool; route modules; `/services`, `/coaches`, `/start`, `/login` and member routes; deep links/back/refresh tested; protected routes depend on server authorization. | L |
| 11 | P2 | Measure performance before optimizing | Runtime compilers, large scripts and photos affect mobile acquisition. | Collect mobile field metrics; target LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at the 75th percentile; compile CSS, split member/admin bundles and optimize responsive images. No current metric was measured in this audit. | M |
| 12 | P2 | Clarify website/app relationship and pricing policies | Visitors should know which product to join and what they receive. | One login/upgrade path; clearly state gym membership exclusion, currency, recurring vs session-block fees, expiry/pause and cancellation policy; retain only substantiated claims and consented testimonials. | S–M |
| 13 | P2 | Conversion and retention analytics | Prioritize development based on outcomes, not feature count. | Privacy-conscious funnel events from intake through first session and renewal; weekly conversion, no-show and retention cohorts; owner dashboard with agreed definitions. | M |
| 14 | P3 | Coach efficiency and personalization | Expand after the core service loop is reliable. | Coach workload views, check-in review queue, schedule reminders, progress summaries and consistent messaging; prove reduced admin time and improved adherence. | M |

## Changes included in this PR

1. **Application API:** JSON/type/length/body limits; required-field, phone/email/date checks; origin allowlist; optional honeypot; allowlisted relay payload; 10-second upstream timeout; explicit provider acknowledgement; no personal/provider-body logs; no-store responses; bounded warm-instance quota and retry deduplication.
2. **Guided intake:** Uses the same-origin API with a 15-second browser timeout and explicit `ok: true` acceptance. Keeps the existing Firestore save as a valid success path and removes its direct EmailJS delivery. Anonymous intake auth no longer redirects to a member dashboard. Existing intake health details remain in the Firestore application; the relay sends only the mapped contact/preferences and goal note.
3. **Older application page:** Adds a request timeout and explicit API acknowledgement. Its existing legacy fallback remains and must be consolidated in the canonical-intake work.
4. **Account lifecycle:** Guards asynchronous profile responses by current auth identity and generation; bounds profile loading; handles missing profiles; gives Auth UID/email precedence; cancels prompts/timers on signout, account change and unmount; preserves post-signup program navigation.
5. **Worker:** Caches four explicit public offline assets only, bypasses APIs and other resources, serves offline HTML only to navigation, and deletes only obsolete VFIT-owned caches. Cache-write failure does not discard a successful network response.
6. **Release quality:** 25 automated checks plus a full production build in an isolated temporary directory, inline-script parsing and repeat-patch verification. Adds PR/main quality workflow and changes the legacy upgrade workflow to read-only manual verification of checked-in code.
7. **Log hygiene:** Removes the replaced auth profile logs and exact payment-success/appointment-data debug calls. This is a targeted reduction, not a complete logging audit.

The hardening transformer deliberately fails when expected application blocks disappear. It is an interim compatibility measure; replacing the patch architecture remains a priority.

## Validation and remaining limits

Commands: `node --test tests/*.test.cjs`, `node scripts/verify-professional-build.js`, and `git diff --check`.

All 25 tests passed locally. Coverage includes rejected relay fields/origins/body sizes, false provider acknowledgement, timeouts, concurrent retries, quota expiry, logout/account-switch races, missing profiles, anonymous visitors, guided-intake acceptance, offline response types, API bypass and cache ownership. The production build parsed 15 inline scripts and repeated the hardening step without changes. Tests mock the notification provider; no external email or payment was sent.

Rate limiting and deduplication are process-local, not durable across Vercel instances or restarts. Origin checking does not authenticate requests and cannot replace bot protection. A timed-out provider may still have delivered an email. Durable intake should store first, queue delivery and acknowledge a saved application independently of email.

Account guards are browser correctness fixes, not backend authorization. Payment and data-access blockers remain open. No live Firebase rules, PayPal sandbox, production private storage, backups or performance telemetry were verified. This PR is reviewable work, not a declaration that production has been secured.

## Suggested delivery order

- **Phase 1 — trust:** ship reviewed hardening; verify Firebase rules; move payment and session authority to the server; protect private uploads; add delivery/payment monitoring.
- **Phase 2 — maintainability:** introduce a locked source build and typed modules, real routes, staging, accessibility checks and end-to-end account/intake/booking/payment tests.
- **Phase 3 — growth:** clarify the vfitnow relationship, instrument the service loop, establish retention cohorts and improve coach efficiency using measured bottlenecks.

Release gate for calling VFIT professional-grade: the ranked P0 items are demonstrated in tests and staging; critical core journeys pass on mobile; monitoring and restore procedures are exercised; a purchase, booking, completed session, cancellation/refund and renewal reconcile to the same authoritative records.
