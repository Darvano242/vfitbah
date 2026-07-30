# VFitness Production QA Checklist

Every production release must pass the automated Vercel release gate and the GitHub browser smoke tests before promotion to `main`.

## Automated release gates

- Built `index.html` has balanced script tags and valid inline JavaScript.
- The React app mount marker exists and the emergency fallback shell is replaceable.
- Start Here includes the same-origin API, primary Firestore, public Firestore, and hidden-form fallback paths.
- Programs progress deduplicates workout completion IDs and derives completed status at 100%.
- Package Control includes 45-day expiry, pause, resume, audit logging, and paused-session blocking.
- Revenue uses `revenueLedger` and preserves completed package history.
- The service worker does not precache `/` or `/index.html` and always requests fresh code.
- Runtime diagnostics store safe client errors and report them to `clientErrors` when Firestore is available.
- Reduced-motion support is present.
- Direct-link DOM click helpers and Programs DOM observers are prohibited.

## Browser smoke tests

- Homepage replaces the emergency fallback shell.
- Start Your Transformation opens the guided intake.
- The guided intake advances to the next question.
- Client Login opens email and password fields.
- Online Programs reaches the public programs section.
- Serious JavaScript and console errors fail the release.

## Manual mobile verification before a major release

- iPhone Safari homepage, Start Here, login, and Programs.
- Installed iPhone PWA closes and reopens on the latest build.
- Android Chrome homepage and installed PWA.
- Admin Package Control: log, add, pause, resume, invoice.
- Client Programs: open program, start workout, complete set, finish workout, confirm progress.
- Revenue: verify previous months remain after a package is completed.

## Release policy

1. Make changes on a protected branch.
2. Wait for GitHub QA and Vercel preview success.
3. Test the preview on mobile for client-facing changes.
4. Promote the exact verified commit to `main`.
5. Never apply unrelated design and functional changes in the same emergency fix.
