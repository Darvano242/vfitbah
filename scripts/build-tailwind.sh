#!/usr/bin/env bash
# Compiles the Tailwind utilities the site uses into site/vf-tw.css (replaces the runtime Play CDN).
# Run after changing class names in site/index.html, site/*.js or vf26/*.js, then commit site/vf-tw.css.
# Usage: scripts/build-tailwind.sh   (needs npx; uses tailwindcss 3.4.17, the same major version the Play CDN served)
set -euo pipefail
cd "$(dirname "$0")/.."
tmp=$(mktemp -d)
cat > "$tmp/in.css" <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;
CSS
cat > "$tmp/tailwind.config.js" <<JS
module.exports = { content: ['$PWD/site/**/*.html', '$PWD/site/*.js', '$PWD/vf26/*.js', '$PWD/scripts/*.js'], theme: { extend: {} }, plugins: [] };
JS
${TAILWIND_BIN:-npx -y tailwindcss@3.4.17} -c "$tmp/tailwind.config.js" -i "$tmp/in.css" -o site/vf-tw.css --minify
rm -rf "$tmp"
