#!/usr/bin/env bash
# Turn your own clip (for example a Google Flow / Veo start-frame to end-frame video) into the frame sets the
# cinematic training section plays. Usage: scripts/cine/video-to-frames.sh clip.mp4 [frames=150]
# Writes vf26/cine-train/d (1280x800) and vf26/cine-train/m (720x1280, centre crop). Needs ffmpeg.
set -euo pipefail
IN="$1"; N="${2:-150}"; OUT="$(dirname "$0")/../../vf26/cine-train"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
FPS=$(python3 -c "print($N/$DUR)")
for set in d m; do
  if [ "$set" = d ]; then VF="scale=1280:800:force_original_aspect_ratio=increase,crop=1280:800"; else VF="scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280"; fi
  rm -rf "$OUT/$set"; mkdir -p "$OUT/$set"
  ffmpeg -loglevel error -i "$IN" -vf "fps=$FPS,$VF" -frames:v "$N" -c:v libwebp -quality 74 -start_number 0 "$OUT/$set/f%03d.webp"
done
ls "$OUT/d" | wc -l
echo "If the count is not $N, set CT_FRAMES in vf26/vfit-2026.js to match."
