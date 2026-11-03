# Cinematic animation assets: delivery spec for the animator

The site is ready for rendered loops. When files arrive, put them in `vf26/cinematic/` and fill the matching
entry in `VF_CINEMATIC` (top of the CINEMATIC LOOPS section in `vf26/vfit-2026.js`). Empty entries change nothing.

| Slot | Where it shows | Replaces |
|---|---|---|
| `coach` | Homepage, "How coaching works" card | the drawn treadmill scene |
| `strength` | Homepage, new card after it | nothing (new) |

The logo entrance stays as live code (fast, no video), per the entrance brief.

## Files per scene

| File | Spec |
|---|---|
| `<name>-poster.webp` | First frame of the loop, 1600 x 900, under 150 KB. Shown first and for reduced motion. |
| `<name>-tile.mp4` | H.264 High, yuv420p, 1280 x 720, 24 or 30 fps, no audio track, `+faststart`, 6 to 10 s seamless loop, under 2.5 MB. |
| `<name>-full.mp4` | Same loop, 1920 x 1080, no audio, under 8 MB. Loaded only when someone opens "Watch full size". |

Aspect 16:9. Keep important action inside the centre 80 percent (the card crops nothing, but phones show it small).
Headlines and buttons stay as page text beside the video: no text, logos as titles, prices or calls to action
burned into the frames.

## Process

1. Approved still of the coach-and-treadmill scene first (character, clothing, sneakers, equipment, lighting).
   The coach is based on Darvano's reference photos (buzz cut, full beard, broad build, black watch). VFITNESS
   blue as the clothing accent.
2. Animate only after the still is approved. Strength scene: a qualified VFITNESS trainer signs off the movement.
3. Deliver editable source files (3D scene, rigs, textures) and written usage rights for web and social.

## What the site does with them

Poster loads first; the tile video loads and plays muted and inline only when the card is on screen; it pauses
off screen, in a background tab, or when the visitor presses pause. Reduced motion shows the poster only.
The full-size file is fetched only when the dialog opens.
