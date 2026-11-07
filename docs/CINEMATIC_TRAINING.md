# Cinematic training (home page)

A scroll-scrubbed frame sequence, the same technique as the "exploded car" product sites: a sticky dark stage
holds a canvas, GSAP ScrollTrigger maps the section's scroll to a frame (scrub 0.6 s), and the canvas draws the
nearest loaded frame. Component: `CinematicTraining` in `vf26/vfit-2026.js`; styles under `.vfct` in
`vf26/vfit-2026.css`. It sits on the home page right after the route cards.

The story (no people are shown, nothing is claimed that the coaching does not do):
1. Start with a plan. A loaded barbell on the floor.
2. Log every set. The bar lifts and comes apart plate by plate.
3. Add a little more. A new 5 kg plate flies in on each side, the bar locks back together and settles.

## Frames
- `vf26/cine-train/d/f000.webp ... f149.webp`: 1280x800 (desktop, 16:10).
- `vf26/cine-train/m/f000.webp ... f149.webp`: 720x1280 (phones under 900 px, 9:16).
- The set is picked once on mount. Loading starts when the section is within 1.2 screens, coarse pass first
  (every 8th frame), six requests at a time. The build copies any `vf26/cine-*` folder (webp/jpg/json).
- Reduced motion: the last frame as a still plus the three chapters as a list. No canvas, no scroll work.
- No GSAP (blocked script): a passive scroll listener drives the same progress.

## Re-rendering the barbell
The frames are rendered offline with three.js in headless Chromium (`scripts/cine/barbell-scene.html`):
lathe-profile bumper plates (20 kg in VFIT blue), knurled bar, cool key light, VFIT-blue rim lights, contact
shadows, 2x supersampled then written as WebP.

    npm i --no-save three@0.170.0 playwright && npx playwright install chromium
    node scripts/cine/render-frames.cjs 1280 800 150 vf26/cine-train/d
    node scripts/cine/render-frames.cjs 720 1280 150 vf26/cine-train/m

## Using your own video instead (Google Flow / Veo workflow)
Make a clip from a start frame and an end frame (for example the assembled bar and its exploded view), then:

    scripts/cine/video-to-frames.sh my-clip.mp4 150

Keep `CT_FRAMES` in `vf26/vfit-2026.js` equal to the frame count. Keep each set under about 3 MB.
Never use a clip that shows a real person who has not agreed to it.
- Frames are cached for 30 days (vercel.json). After re-rendering, rename the folder (for example cine-train-2) and update ctSrc so phones fetch the new set.
