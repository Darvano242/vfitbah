// Final build step: hook the VFIT ALIGN layer (vfit-align.css / vfit-align.js)
// into the built site. Runs after every other transform so it never disturbs
// their anchors. Idempotent.
const fs = require('node:fs');

const INDEX = 'site/index.html';
let html = fs.readFileSync(INDEX, 'utf8');

const CSS_TAG = '<link rel="stylesheet" href="/vfit-align.css?v=20261123">';
const JS_TAG = '<script defer src="/vfit-align.js?v=20261123"></script>';

if (!html.includes('/vfit-align.css')) {
  const anchor = html.match(/<link rel="stylesheet" href="\/vf-tw\.css[^"]*">/);
  if (!anchor) throw new Error('vfit-align: vf-tw.css link not found');
  html = html.replace(anchor[0], anchor[0] + '\n' + CSS_TAG);
}
if (!html.includes('/vfit-align.js')) {
  const i = html.lastIndexOf('</body>');
  if (i < 0) throw new Error('vfit-align: </body> not found');
  html = html.slice(0, i) + JS_TAG + '\n' + html.slice(i);
}
fs.writeFileSync(INDEX, html);

for (const tag of ['/vfit-align.css', '/vfit-align.js']) {
  if (!fs.readFileSync(INDEX, 'utf8').includes(tag)) throw new Error('vfit-align: ' + tag + ' not hooked');
}
for (const f of ['site/vfit-align.css', 'site/vfit-align.js']) {
  if (!fs.existsSync(f)) throw new Error('vfit-align: missing ' + f);
}
console.log('Hooked VFIT ALIGN layer (palette harmonization + motion).');
