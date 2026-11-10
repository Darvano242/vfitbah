# Motion tools: GSAP, Lenis, React Bits

- **GSAP 3.15.1 + ScrollTrigger** and **Lenis 1.3.27** are self-hosted in `vf26/` (`vendor-*.js`, `vendor-lenis-*.css`),
  loaded with `defer` before `vfit-2026.js` (see `vf26/apply-vfit-2026-site.js`). Globals: `gsap`, `ScrollTrigger`, `Lenis`.
- Smooth wheel scrolling starts on DOMContentLoaded at the end of `vf26/vfit-2026.js`, on public pages only (home,
  results, team, pricing, contact, locations, about, programs, events, legal). Off in the portal, admin, sign-in and the
  consultation and application forms, and under reduced motion. Touch scrolling stays native. Add `data-lenis-prevent`
  to any element that must keep native scrolling. `window.VF26Motion.lenis` gives the instance.
- Animate with `gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', ...)` so reduced motion is respected.
- React Bits components are React + build-tool components; this site has no bundler, so port a component by hand into
  `vfit-2026.js` (plain `React.createElement`, no JSX) if one is wanted.
- Upgrading: replace the vendor files and update the four tags in `apply-vfit-2026-site.js`.

## Skills installed for this repo (dev only, not deployed)
`.claude/skills/` holds: the official GreenSock gsap-* skills, CloudAI-X threejs-* skills, LottieFiles motion-design,
design-dna, and Genjutsu (cast, paint, bunshin, _jutsu). Licences sit next to them (LICENSE-*). `.vercelignore`
keeps .claude, docs and tests out of deployments.

## Mobile performance (Nov 8 2026)

- The barbell "Cinematic training" section was removed (frames, component, styles).
- Tailwind is compiled ahead of time into `site/vf-tw.css` by `scripts/build-tailwind.sh` (the runtime Play CDN recompiled
  styles in the browser on every DOM change). Run it and commit the CSS after adding new Tailwind class names.
- Lenis never starts on touch screens; the old full-screen depth-field canvas never runs when hidden or on touch screens.
- Chart.js and Lucide load with `defer`; `Ico` and `ProgressChart` redraw on the `vf-lib` event when they arrive.
- Static JS/CSS cache for 1 hour (stale-while-revalidate 1 day), images and video for 1 day, vendor files for a year.
  HTML, sw.js, manifest and version.json stay no-store.

## Website design skills (Nov 10 2026)

Added in `.claude/skills/` (dev only, MIT): design-taste-frontend (taste-skill 2.5 with shader effects, scenes and a browser finish
gate), tailwind-design-system, design-motion-principles, modern-web-design, motion-framer, lightweight-3d-effects,
scroll-reveal-libraries. VFitness brand rules win over the skills: Geist type, azure to violet brand, no dashes in copy, real contact
details (taste-skill's ".example contacts" rule is for demo sites), never "our gyms", keep "Build strength. See your progress."
Keep the mobile performance rules above: effects and scenes are desktop only and never under reduced motion.
