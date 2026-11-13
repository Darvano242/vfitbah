# vfitbah.com build specification: status

Tracks the "VFITNESS Website Build and Growth Specification" (Nov 2, 2026) against what is live.
Decisions confirmed by Darvano on Nov 2, 2026: semi private is the flagship, join on your own, up to 4 clients,
60 minute sessions, 1 on 1 by request only, headline "Build strength. See your progress.", 45 day package expiry
(from purchase, paused time added back), 2,000+ clients served is a real company figure.

Status words: DONE (live and checked in a browser), DONE (code) (built and parsed, not exercised end to end),
NEEDS DARVANO (waiting on content or a decision), LATER (its own project).

| # | Section | Status | Notes |
|---|---|---|---|
| 1 | Define success | NEEDS DARVANO | No 80% figure published anywhere. Baseline needs real counts first (see 19). |
| 2 | Operating model | DONE | Semi private leads. 1 on 1 by request. Portal, balances and invoices untouched. |
| 3 | Decision hierarchy | DONE | Home: Train in Nassau or Train online, then level of support, then package. |
| 4 | Positioning | DONE | Hero uses the positioning statement and "Build strength. See your progress." |
| 5 | Homepage opening | DONE | Real team photo, 12 sessions for $195 per person, gym separate, coach confirms time. Badge: Taking consultation requests. |
| 6 | Section order | DONE | Routes, real results (hidden if no photos load), how it works, team, benefits, community, app. |
| 7 | Design system | DONE (existing) | Existing tokens kept. New sections reuse card, button and chip styles. |
| 8 | Mobile | DONE | Checked at 390 px: route rows stack, buttons wrap, no sideways scroll. Landscape and large text not yet checked. |
| 9 | Nassau offer | DONE | How semi private works: join alone, up to 4, 60 min, per person prices, block not membership, preferred time is not a booked slot, 45 day expiry, 24 h cancellation, gym separate. Make up rules: ask your coach. |
| 10 | Honest pricing | DONE | Per session math from published prices. "Best value" is per session, not "most popular". |
| 11 | Online support | DONE | How it fits together: website, VFIT app (browser now, stores soon), Autopilot only suggests, human coach. |
| 12 | Proof with consent | DONE / NEEDS DARVANO | Real photos separate from program examples (labelled). Written case studies need client data and consent. |
| 13 | Team | DONE / NEEDS DARVANO | Unsourced ratings removed. Preference is not a booking note added. Headshots for homepage cards still wanted. |
| 14 | Inquiry questions | DONE | Goal and delivery are separate steps. No "two minutes" claim. 1 on 1 (by request). |
| 15 | Submission and confirmation | DONE (existing + wording) | Success only after the request is saved. Title now "Request received." Not tested with a live submission. |
| 16 | Client portal | NOT CHANGED | No portal code touched. Permission audit is its own task. |
| 17 | Checkout | NOT CHANGED | Payment flow untouched. Needs an approved test purchase before paid traffic. |
| 18 | Scheduling capacity | DONE (code) | Group times on Services (/api/groups to the VFIT backend). One place row per seat, claimed atomically, so a group never exceeds 4. Waitlist with automatic hand over. Admin Groups tab. A held place is confirmed by the coach before payment. |
| 19 | Analytics | DONE | Events go to /api/track and the VFIT backend (siteEvents): page_view, coaching_path_selected, consultation_request_started, inquiry_step_completed, consultation_request_accepted, package_checkout_started, group_place_reserved, group_waitlist_joined. Tab session id only, no cookies, no personal data, portal and admin never tracked. Report: VFIT app, Admin, Growth, Website section. |
| 20 | 80% target | NEEDS DARVANO | Only as an internal attendance target once consultations are logged. |
| 21 | Speed | IMPROVED | Built page 1,041 KB to 759 KB (gzip 241 to 182 KB): 47 unreachable legacy declarations removed from the source, 21 replaced legacy pages stripped at build (scripts/strip-unused-legacy.js, fail safe). Next step: move the app script to a cached file. |
| 22 | Accessibility | DONE (automated + keyboard) | docs/ACCESSIBILITY_REVIEW.md. axe 0 violations on 14 public pages x 2 themes x 2 widths. Screen reader pass by hand still to do. |
| 23 | Search | DONE (code) | Canonical and sitemap on www, real routes in sitemap, truthful structured data (no ratings, no street address), no-JavaScript summary. Search Console inspection still to do. |
| 24 | Locations and contact | DONE | No "our gyms". Map labelled "Illustration, not to scale". |
| 25 | Policies | DONE | Refund policy states 45 day expiry with pause credit. |
| 26 | Content ownership | NEEDS DARVANO | Owner and review date per price, profile, event and policy. Licence date expires Dec 31, 2026. |
| 27 | Testing | DONE for this scope | Build parse checks plus browser checks listed above. No live inquiry, login or payment was run. |
| 28 | Release | DONE | Pushes to Darvano242/vfitbah main deploy to Vercel (vfitbah and vfitness-v2 both succeed). |
| 29 | Improvement cycle | LATER | Review real inquiries in week one. |
| 30 | Acceptance | MET for release 1 | Except live inquiry and checkout tests, and Shred details (start date, guarantee rules). |

Still open from Darvano: Shred next start date and guarantee rules, coach headshots, case study details, a test
inquiry and an approved test purchase.

## Redesign brief (Nov 2, 2026, round 2)

| Brief section | Status | Notes |
|---|---|---|
| 4 Design system | DONE | Public-page tokens (spacing, radii, motion, sand surface, brief palette) in vfit-2026.css. Portal keeps its own look (data-vf-area="portal"). |
| 6 Desktop split | DONE | Sticky introduction panel (32vw) with location, portal link, headline, actions, facts, navigation and policy links, beside a staggered six-panel gallery. Headline kept as Darvano chose: "Build strength. See your progress." |
| 7 Gallery panels | DONE | Team (dialog with full photo), semi private on sand (dialog with terms), VFIT app (dialog: app tools, automated guidance, human coaching; sample data labelled), Pink Beach Burn (story page), founder (team page), client results (uses the first published gallery photo). |
| 9 Interactions | DONE | Dialogs: focus moves in and stays in, Escape closes, focus returns, background locked. Restrained hover, none under reduced motion. |
| 10 Mobile | DONE | Introduction, then the two ways to train, then the gallery in one column (two on tablets). |
| 12 Services | DONE | Train in Nassau / Train online choice at the top; gym fee beside the semi private offer. |
| 15 Inquiry | DONE | Goals and delivery lists match the brief; confirmation wording from the brief. |
| 16 Contact | DONE | "VFITNESS coaching hours" separated from gym opening hours. |
| Session length | 60 minutes | Brief mentions 45; Darvano confirmed 60 on Nov 2. |

## Pricing and retention update (Nov 13, 2026)

Decisions from Darvano on Nov 13, 2026: semi private is now 1 for $35, 4 for $110, 6 for $140, 8 for $180 and 12 for $215
(was $22, $87, $130, $173, $195); 1 on 1 packages unchanged with the single session at $50;
3 month commitment of 36 semi private sessions for $495 paid up front, used within 105 days, for new clients and
clients returning after 30 days or more away, offered until December 20, 2026.

| Item | Status | Notes |
|---|---|---|
| Single session prices | RUNTIME VERIFIED (stand-in data) | Services page, admin Add Package form and legacy lists. Savings badges are computed from the single price, so they now read against $35 and $50. |
| 3 month commitment | RUNTIME VERIFIED (stand-in data) / NEEDS TESTING (payment) | Services page card, home page line, terms row, admin form option. 105 day validity is written on the package at purchase and kept by the expiry migration and by pause and resume. The Services page checks the signed-in client's own packages before checkout; staff are asked to confirm before assigning it to a client who is neither new nor returning. Everything hides itself after December 20, 2026 23:59 Nassau time. No live PayPal purchase was run. |
| Existing client price | RUNTIME VERIFIED (stand-in data) | Clients who had a package before November 13, 2026 keep 12 semi private sessions for $195 until March 1, 2027. Applied on the Services page for the signed-in client and in the admin Add Package form for the selected client; it ends by itself on March 1. The 1, 4, 6 and 8 session prices apply to everyone now. |
| VFIT app included | RUNTIME VERIFIED (copy only) | Decision Nov 13, 2026: all package holders have full access to the VFIT app (nutrition planning, weight tracking, online training). Stated on the homepage, Services page, package terms, 3 month commitment card and the no-JavaScript summary. The access itself is granted in the VFIT app, not by this website: NEEDS DARVANO to confirm package holders are unlocked there. |
| Retention tab | RUNTIME VERIFIED (stand-in data) | Business dashboard > Retention: renewals due (2 or fewer left, or expiring within 7 days), lapsed clients (recent first), open group places. Read only; messages open in WhatsApp or email for the coach to send. Not yet opened with a real staff login. |
| Homepage coaches and results | RUNTIME VERIFIED (stand-in data) | Coach names and roles on the page, and up to three more published gallery photos (section hidden when there are fewer than two). Headshots still wanted. |
