const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../vf26/vfit-2026.js'), 'utf8');
const start = source.indexOf('function HomePage(');
const component = source.slice(start, source.indexOf('/* ================= FOOTER', start));
function setup() {
  let selected = null;
  const actions = [];
  const React = { Fragment: 'fragment', useState: () => [selected, v => { selected = v; }], useRef: () => ({ current: null }), useEffect: () => {} };
  const h = (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity).filter(v => v !== null && v !== false && v !== undefined) });
  const HomePage = Function('React','h','useDialog','go','lead','toOnlinePlans','navA','icon','vfTrack',component + ';return HomePage;')(
    React,h,() => {},(_set,page) => () => actions.push(['page',page]),(_set,data) => () => actions.push(['lead',data.vf_lead_type]),() => () => actions.push(['online']),
    (page,run,props,children) => h('a',{...props,href:'/'+page,onClick:run},children),() => h('svg',{}),() => {}
  );
  return { render: () => HomePage({setCurrentPage: () => {}}), actions };
}
function all(tree) {
  if (!tree || typeof tree !== 'object') return [];
  return [tree, ...tree.children.flatMap(all)];
}
function text(tree) { return typeof tree === 'string' ? tree : tree && typeof tree === 'object' ? tree.children.map(text).join(' ') : ''; }
test('gallery has real local assets and all six detail buttons have accessible names', () => {
  const nodes = all(setup().render());
  const cards = nodes.filter(n => n.type === 'button' && /vfe-card vfe-card-/.test(n.props.className));
  assert.equal(cards.length, 6);
  for (const card of cards) assert.ok(card.props['aria-label']);
  for (const node of nodes.filter(n => n.type === 'img' && n.props.src?.startsWith('/'))) {
    assert.ok(fs.existsSync(path.join(__dirname, '../vf26', node.props.src.replace('/vf26/', ''))), node.props.src);
  }
});
test('coaching details retain price disclosure and initiate the existing semi-private inquiry', () => {
  const app = setup();
  const offer = all(app.render()).find(n => n.props.className === 'vfe-card vfe-card-offer');
  offer.props.onClick();
  const dialog = all(app.render()).find(n => n.props.role === 'dialog');
  assert.ok(dialog);
  assert.equal(dialog.props['aria-modal'], 'true');
  assert.ok(text(dialog).includes('12 sessions · $195 per person'));
  assert.ok(text(dialog).includes('Gym membership is separate'));
  const action = all(dialog).find(n => n.type === 'button' && n.props.className === 'vfe-primary');
  action.props.onClick();
  assert.deepEqual(app.actions, [['lead','Semi private']]);
  assert.ok(!all(app.render()).some(n => n.props.role === 'dialog'));
});
test('online details use the plan comparison, and footer policies remain reachable on mobile', () => {
  const app = setup();
  all(app.render()).find(n => n.props.className === 'vfe-card vfe-card-app').props.onClick();
  const dialog = all(app.render()).find(n => n.props.role === 'dialog');
  all(dialog).find(n => n.type === 'button' && n.props.className === 'vfe-primary').props.onClick();
  assert.deepEqual(app.actions, [['online']]);
  const footer = all(app.render()).find(n => n.type === 'footer');
  for (const page of ['privacy','terms','refund']) assert.ok(all(footer).some(n => n.type === 'a' && n.props.href === '/'+page));
});
