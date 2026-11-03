# Cinematic animation assets: delivery spec for the animator

The site is ready for rendered loops. When files arrive, put them in `vf26/cinematic/` and fill the matching
entry in `VF_CINEMATIC` (top of the CINEMATIC LOOPS section in `vf26/vfit-2026.js`). Empty entries change nothing.

| Slot | Where it shows | Replaces |
|---|---|---|
| `semi` | Homepage, semi-private card (right side) | the drawn coaching scene and scenario buttons |
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

## Semi-private card: chaptered scene (`semi`)

One coach, four clients, charcoal background (#131516) matching the treadmill card, VFITNESS blue accents.
20 to 24 s loop, wide view at start and end, camera moves in for each chapter.

| # | key | Button label | Caption (page text, below the video) | Action |
|---|---|---|---|---|
| 1 | demo | Demonstration | Know what to do. | Coach demonstrates a controlled squat; client 1 follows while the coach watches. |
| 2 | weight | Weight selection | The right challenge for you. | Coach hands client 2 a dumbbell; hands meet the handle, client takes the weight, coach releases. |
| 3 | form | Form coaching | Guidance through every rep. | Client 3 performs a dumbbell exercise; coach gives a visual cue; the next rep is adjusted. |
| 4 | progress | Progress review | A starting point. A plan forward. | Coach watches client 4, checks a tablet, discusses the next step. |
| end | | | One coach. Up to four clients. Individual guidance. | Wide view, everyone training, coach attentive; returns to the opening frame. |

Files: `semi-full.mp4` (whole loop, 1280 x 720, no audio, under 6 MB), `semi-poster.webp`, and one clip per chapter
`semi-demo.mp4`, `semi-weight.mp4`, `semi-form.mp4`, `semi-progress.mp4` (4 to 6 s each, looping, under 2 MB),
each with an optional `-poster.webp`. Supply each chapter's start time in seconds within the full loop.

Entry to paste into `VF_CINEMATIC`:

    semi:{full:'/vf26/cinematic/semi-full.mp4',poster:'/vf26/cinematic/semi-poster.webp',
     alt:'One VFITNESS coach guiding four clients in a semi-private session',
     chapters:[{key:'demo',label:'Demonstration',caption:'Know what to do.',start:2,src:'/vf26/cinematic/semi-demo.mp4'},
      {key:'weight',label:'Weight selection',caption:'The right challenge for you.',start:7,src:'/vf26/cinematic/semi-weight.mp4'},
      {key:'form',label:'Form coaching',caption:'Guidance through every rep.',start:12,src:'/vf26/cinematic/semi-form.mp4'},
      {key:'progress',label:'Progress review',caption:'A starting point. A plan forward.',start:17,src:'/vf26/cinematic/semi-progress.mp4'}]}

Approval steps for this scene: character design, then a rough animated storyboard, then the final render.
