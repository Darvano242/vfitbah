# VFIT: buttons, animation and layout review — first pass

Reviewed 4 October 2026, America/Nassau. Public production UI: `https://www.vfitbah.com/`. Source baseline: `df1085c418f5e3b7739b8d3f3eff7a6a10406dd0`. This is an interaction review, separate from the engineering hardening audit.

## What was actually tested

Live desktop Chrome at 1363 × 936 CSS pixels, using visible controls, accessibility observations, screenshots and read-only DOM measurements. No credentials, personal client details, payments, applications or outbound messages were submitted. Source inspection supports findings explicitly marked below; it is not a replacement for live testing.

| Screen or control | Action | Observed result |
| --- | --- | --- |
| Homepage | Open and inspect layout | Clear two-column hero, prominent CTAs and consistent header. No page-width overflow in the measured view. |
| Hero pricing CTA | Click View services and pricing | Pricing screen opens and document title updates; URL remains `/`. |
| Session tabs | Switch to Semi private | Package prices update and selected tab changes. Incorrect discount badge appears on 8 sessions. |
| Online billing tabs | Switch Monthly → Annual | All three plans update prices and annual saving copy. Arithmetic matches displayed monthly/annual totals. |
| Billing-tab keyboard | Left Arrow on selected Annual tab | Selection and focus remain on Annual; expected tab arrow-key navigation is absent. |
| Pricing FAQ | Expand Can I choose my trainer? | That answer expands; previous answer collapses; expanded state is exposed. |
| Package selection | Select 12-session semi-private package while signed out | Native alert requests sign-in; dismissing it opens client login. No purchase was made. |
| Login recovery | Click first recovery control with no email | Inline instruction appears and email input receives focus. Two recovery controls are visible. |
| Team navigation | Click Team | All four coach profiles appear; only Darvano has a photo, other profiles use initials. This is a consistency opportunity, not a broken image. |
| Coach CTA | Click Train with Chavese | Guided intake opens. |
| Guided intake | Goal → training type → trainer → location | Each choice advances to the expected next screen. |
| Contact step | Click Continue with empty details | Inline name/contact error appears; progression is blocked. |
| Intake Back | Go Back after contact validation error | Location choices return, but the contact error remains visible on that screen. |
| Results | Open and allow gallery to load | Real gallery images and eight unnamed dot buttons appear; slideshow changes images automatically. |
| Result dot | Click first dot | First transformation is displayed. Manual selection functions. |
| Contact | Open Contact | WhatsApp, email and telephone links are present; link destinations inspected without sending/calling. |
| Free consultation | Click Book a free consult | Opens generic sign-in rather than a public consultation form. |
| Company | Click Company | About/company content opens. |
| Company refresh | Refresh while viewing Company | Returns to homepage because page state is not encoded in the URL. |
| Refund information | Click Refunds and Cancellations | Policy content opens. No acceptance or legal action taken. |

Not every repeated header/footer CTA was independently exercised. External app signup, social platforms, mail, telephone and WhatsApp were not executed. Theme toggle was inspected for a label, not changed. Real mobile viewports and authenticated journeys remain pending.

## Ranked findings

| ID | Priority | Evidence | Issue and reproduction | Required improvement |
| --- | --- | --- | --- | --- |
| VF-01 | P1 | Live + source | On Semi private, the 8-session card says SAVE 8%, price $173, base $22/session and You save $3. $3 ÷ $176 is approximately 1.7%, not 8%. | Compute percentage from the same prices used for the saving amount; test every package/billing combination. |
| VF-02 | P1 | Live + source | Pricing, team, intake, results, contact and company all share `/`; refreshing Company opens Home. | Real routes, browser history, refresh/deep links and route-specific metadata. Preserve intake state deliberately. |
| VF-03 | P1 | Live DOM | Contact-step visible inputs/select have no associated HTML label or aria-label. Nearby visual label text does not programmatically name them. Error feedback has no alert/live region. | Stable IDs and label associations; required indicators; field-specific errors linked with aria-describedby; announce validation and step headings. |
| VF-04 | P1 | Live + source | Results gallery exposes eight blank buttons. In the measured state each target was 8 × 42px. Source renders only the first eight dot destinations even when the gallery has more items. | Name controls uniquely, expose active state, use adequately spaced targets (aim for 44 × 44px), and provide accessible previous/next/all-item navigation. |
| VF-05 | P1 | Source + isolated handler check | Guided intake accepts name plus **WhatsApp or email**. The current API requires `phone`. An email-only payload returned 400 in an isolated check with network delivery disabled. | Agree one contact rule across UI, API and primary persistence service; cover email-only, phone-only, invalid contact and neither. Do not loosen one layer without checking the others. |
| VF-06 | P2 | Live + source | Anonymous package selection shows a blocking native alert before generic sign-in. Package selection is stored only after the anonymous guard, so the chosen package is not retained there. Consultation also leads to generic sign-in. | Friendly inline/sign-in dialog, explain account requirement and preserve package/consultation intent through authentication. Verify return flow with a test account. |
| VF-07 | P2 | Live | Login has both Forgot password? Recover account and Forgot Password? controls. | One named recovery entry and consistent error/success behavior. |
| VF-08 | P2 | Live | Contact-step error remains after Back to Preferred location. | Clear or scope errors when changing steps; move focus to the active heading/error. |
| VF-09 | P2 | Live + source | Pricing tabs have tab roles but Left Arrow did not switch tabs. Source has click handlers, without a keyboard tab implementation. | Use a tested tab primitive or implement roving focus, Left/Right/Home/End and linked tabpanels. |
| VF-10 | P2 | Live + source | Legacy results slideshow advances every 4.5 seconds without pause, keyboard/focus pause or a reduced-motion guard. Homepage reel has reduced-motion and hover pause, but no persistent pause control or keyboard-focus pause. | One carousel component, explicit Pause/Play, focus/touch controls, reduced-motion behavior and bounded announcements. |
| VF-11 | P2 | Live link + source | Generic contact WhatsApp link pre-fills an online-program-specific message. Public mail links use `vfitnessbah@gmail.com`; application relay fallback uses `vfitnessbahamas@gmail.com`. | Contextual messages and owner-approved canonical contact configuration. The audit cannot determine whether both inboxes are intentional. |
| VF-12 | P2 | Source only | Train here writes `vf_lead_location`; StartHereFlow's prefill reads goal/trainer/package/type but not location. Mobile menu is a custom dialog without visible focus-trap, Escape or focus-return implementation in its source. | Consume location prefill; verify selected value in summary. Implement and test menu keyboard/focus lifecycle at a narrow viewport. |
| VF-13 | P3 | Visual judgment | Cohesive homepage, but team photo/initial treatment differs; pages use large vertical spacing, and primary actions vary between account creation, intake and generic sign-in. | Keep a consistent coach-card system and one clearly explained acquisition path; assess density on real phones before changing spacing. |

P1 here means a high-priority interaction/conversion problem, not a claim of a security exploit. No public-layout bug in this report has been fixed by this documentation-only change.

## Animation assessment

The newer design layer has reveal transitions, count-up statistics, animated icons, pricing-card entrance motion, a moving result reel/marquee and explicit reduced-motion handling. CSS makes reveal content visible in reduced-motion mode; JavaScript also avoids count-up and homepage reel auto-advance under that preference. Those are good source-level provisions.

The older results component is inconsistent: its interval continues independently of the newer preference flag. Static screenshots and a few interactions do not prove frame-rate quality. No FPS, low-end-device, offscreen timer, battery-use or reduced-motion browser-emulation test was performed. Do not call the animation system fully audited yet.

## Remaining verification matrix

| Area | Next checks | Access or equipment |
| --- | --- | --- |
| Responsive layout | 360/390px phones, 768px tablet, landscape, long text, overflow, fixed header/menu, safe areas, touch/swipe | Real narrow viewport and iOS/Android devices; not tested live in this pass |
| Keyboard/accessibility | Menu open/close, focus trap/return, all tab keys, carousel pause, errors, screen reader | Browser/device accessibility testing |
| Client portal | Login/logout/back/refresh, session cards, booking/rescheduling, invoices, progress uploads, messages | Dedicated client test account |
| Coach/admin | Navigation, filtering, edits, dialogs, assignment, review queue | Dedicated coach/admin test accounts with test data |
| Purchases | Catalog → sign-in → coach → checkout → receipt; cancellation/failure/retry; preserve selected package | Payment sandbox and test entitlements |
| Intake completion | Contact alternatives, next/back persistence, review summary, timeout/retry/success | Non-production intake sink; no real emails/leads |
| Motion | Reduced motion, keyboard-focus pause, background tab, slow device, failed image loading | Controlled preference/device tests |

Completion gate: every important CTA has an expected destination; every form has validation, loading, error, success and retry coverage; each modal/menu passes keyboard focus checks; critical journeys survive Back and refresh; mobile layout and authenticated journeys are demonstrated rather than inferred from source.
