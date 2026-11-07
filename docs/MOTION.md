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
keeps .claude, docs and tests out of deployments. The cinematic section is documented in CINEMATIC_TRAINING.md.
