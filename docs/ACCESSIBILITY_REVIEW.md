# vfitbah.com accessibility review (WCAG 2.2 AA)

Date: November 2, 2026. Scope: every public page (home, services, team, results, company, contact, start,
login, sign up, consultation, privacy, terms, refund policy, PINK Beach Burn), in dark and light themes,
at 390 px and 1280 px. The client portal and admin pages were not changed in this pass.

## How it was checked

- axe-core 4.10 with the WCAG 2.0/2.1/2.2 A and AA rules plus best practice, after scrolling each page so
  every section has rendered. 56 page and theme combinations.
- Keyboard: tab order on home (desktop and phone), menu open and close with Escape, photo dialog on the event
  page (focus moves in, stays in, Escape closes, focus returns to the photo), skip link.
- Text at 200% on a 640 px window (Services page): no sideways scrolling.
- Reduced motion: all content shows without animation.

## What the first scan found, and the fix

| Issue | Where | Fix |
|---|---|---|
| Low contrast small text (738 elements) | Labels, notes, stats captions, kickers, blue buttons, event pink text, legacy links in light theme | Raised the muted and secondary text tokens in both themes, darkened the light theme blue, dark text on blue buttons in the dark theme, contrast-safe accent colours for coach roles, contact links and event text |
| Light theme legacy text invisible | "Welcome back." on sign in, goal buttons on Start here | Legacy white text and chips follow the theme inside the public pages |
| Light theme dark band | "How it works" and route sections on home | The page root now uses the theme background instead of a fixed near black |
| No main landmark | Start, sign in, sign up, consultation, privacy, terms | These pages now render inside `main` |
| No page heading | Sign in, sign up, consultation | A level one heading names the page |
| Heading levels skipped | Footer column titles (h5), contact cards | Footer titles are h2, contact cards sit under a section heading |
| List markup | "Three steps" list | Items are real list items |
| Scroll area not reachable by keyboard | App walkthrough strip | The strip can take focus and has a name |
| Form fields without labels | Sign up and other legacy forms | Labels are linked to their fields automatically |
| Photo dialog let focus escape | PINK Beach Burn photos | The dialog uses the shared dialog behaviour (focus trap, Escape, focus return, background locked) |
| No skip link | All pages | "Skip to main content" is the first Tab stop |

## Result after the fixes

axe reports 0 violations on all 56 combinations. Keyboard checks above pass.

## Not covered by automated checks (still to do by hand)

- Screen reader pass (VoiceOver on iPhone, NVDA on Windows) through Start here to a submitted request.
- Captions or transcripts if video is added.
- Client portal and admin pages (their own review).
- Wording and reading level of policy pages.
