// Public acquisition copy only. Existing accounts, payments and package balances
// remain controlled by the original application. Idempotent after the site layer.
const fs = require('node:fs');
const vm = require('node:vm');
const path = 'site/index.html';
let html = fs.readFileSync(path, 'utf8');
const replacements = [
 ['const GOALS=withChoice(["Flat stomach + glutes","Flat stomach + chest and arms","Weight loss","Body recomposition","Muscle gain","Athletic performance","Online coaching","Group training","Not sure yet"],data.goal);', 'const GOALS=withChoice(["Flat stomach + glutes","Flat stomach + chest and arms","Weight loss","Body recomposition","Muscle gain","Athletic performance","Not sure yet"],data.goal);'],
 ['const TYPES=withChoice(["1 on 1","Semi private","Group training","Online coaching","Not sure yet"],data.trainingType);', 'const TYPES=withChoice(["Semi private","Group training","Online coaching","Not sure yet"],data.trainingType);']
];
for (const [before, after] of replacements) {
  if (html.includes(after)) continue;
  if (html.split(before).length !== 2) throw new Error('Acquisition form changed: review conversion patch.');
  html = html.replace(before, after);
}
for (const [i, match] of [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g)].entries()) {
  new vm.Script(match[1], { filename: 'conversion-inline-' + i });
}
fs.writeFileSync(path, html);
console.log('Acquisition choices separated goals from service preferences; legacy records preserved.');
