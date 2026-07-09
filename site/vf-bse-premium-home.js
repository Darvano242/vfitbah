// VFITNESS x BSE premium homepage rearrange layer
// Front-end only. Does not touch Firebase, PayPal, auth, package, trainer, or server logic.
(function(){
  const HOME_PATHS = ['/', '/index.html', ''];
  const isPublicHome = () => HOME_PATHS.includes(location.pathname) && !location.hash.includes('admin') && !location.hash.includes('dashboard');
  const byText = (selector, text) => Array.from(document.querySelectorAll(selector)).find(el => (el.textContent || '').trim().toLowerCase().includes(text.toLowerCase()));
  const clickExisting = (labels) => {
    for (const label of labels) {
      const el = byText('button,a,[role="button"]', label);
      if (el) { el.click(); return true; }
    }
    return false;
  };
  const openStart = () => {
    if (clickExisting(['Start Here','Apply','Get Started','Online Coaching'])) return;
    const target = document.querySelector('#start,#apply,#programs,[data-page="start"]');
    if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
  };
  const openLogin = () => {
    if (clickExisting(['Member Login','Login','Sign In','Client Login'])) return;
    location.hash = '#login';
  };
  function buildHome(){
    if (!isPublicHome() || document.getElementById('vf-bse-home-cleanup')) return;
    const root = document.getElementById('root') || document.body;
    const home = document.createElement('section');
    home.id = 'vf-bse-home-cleanup';
    home.className = 'vf-bse-home-cleanup';
    home.innerHTML = `
      <div class="vf-bse-shell">
        <div class="vf-bse-hero">
          <div>
            <div class="vf-bse-kicker">The Bahamas Transformation System</div>
            <h1 class="vf-bse-title">TRAIN SMART.<span>TRAIN ELITE.</span></h1>
            <p class="vf-bse-copy">Online coaching, in-person training, nutrition, progress tracking, and real accountability — built in The Bahamas for people who want structure, not guesswork.</p>
            <div class="vf-bse-actions">
              <button class="vf-bse-btn vf-bse-primary" type="button" data-vf-start>Start Here →</button>
              <button class="vf-bse-btn vf-bse-secondary" type="button" data-vf-login>Member Login</button>
            </div>
            <div class="vf-bse-proof" aria-label="VFitness proof points">
              <div class="vf-bse-proof-card"><strong>500+</strong><span>Clients Coached</span></div>
              <div class="vf-bse-proof-card"><strong>9+</strong><span>Programs</span></div>
              <div class="vf-bse-proof-card"><strong>4.9★</strong><span>Client Rating</span></div>
            </div>
          </div>
          <div class="vf-bse-visual" aria-label="VFitness premium coaching preview">
            <div class="vf-bse-photo"></div>
            <div class="vf-bse-device">
              <div class="vf-bse-device-top"><b>VFITNESS OS</b><span class="vf-bse-pill">Live System</span></div>
              <div class="vf-bse-row"><div><b>Training Plan</b><small>Built for your goal and schedule</small></div><span class="vf-bse-check">✓</span></div>
              <div class="vf-bse-row"><div><b>Nutrition Support</b><small>Meal guidance included with packages</small></div><span class="vf-bse-check">✓</span></div>
              <div class="vf-bse-row"><div><b>Progress Tracking</b><small>Sessions, invoices, photos, and check-ins</small></div><span class="vf-bse-check">✓</span></div>
            </div>
          </div>
        </div>
        <div class="vf-bse-section">
          <div class="vf-bse-mini"><div class="vf-bse-icon">01</div><b>Start With Structure</b><p>Tell us your goal, training history, schedule, and preferred coaching style.</p></div>
          <div class="vf-bse-mini"><div class="vf-bse-icon">02</div><b>Get Matched</b><p>We connect you with the right trainer and program under the VFitness system.</p></div>
          <div class="vf-bse-mini"><div class="vf-bse-icon">03</div><b>Track Everything</b><p>Sessions, packages, invoices, progress photos, meals, and workouts stay organized.</p></div>
          <div class="vf-bse-mini"><div class="vf-bse-icon">04</div><b>See The Result</b><p>Weekly accountability keeps your body recomposition journey moving forward.</p></div>
        </div>
        <div class="vf-bse-strip">
          <p>VFitness is not a gym. VFitness is the system behind the result.</p>
          <span>Nassau • Online Coaching • In-Person Training</span>
        </div>
      </div>`;
    const startBtn = home.querySelector('[data-vf-start]');
    const loginBtn = home.querySelector('[data-vf-login]');
    startBtn.addEventListener('click', openStart);
    loginBtn.addEventListener('click', openLogin);
    const nav = document.querySelector('nav,header');
    if (nav && nav.parentNode === root) root.insertBefore(home, nav.nextSibling);
    else root.insertBefore(home, root.firstChild);
    cleanupOldHome(home);
  }
  function cleanupOldHome(newHome){
    const root = document.getElementById('root') || document.body;
    const candidates = Array.from(root.children).filter(el => el !== newHome && !['SCRIPT','STYLE','LINK'].includes(el.tagName));
    candidates.forEach(el => {
      const txt = (el.textContent || '').slice(0,1500).toLowerCase();
      const looksOldHome = txt.includes('train smart') || txt.includes('start here') || txt.includes('member login') || txt.includes('500+') || txt.includes('programs');
      const isNav = el.matches && el.matches('nav,header');
      if (looksOldHome && !isNav && el.id !== 'vf-bse-home-cleanup') el.classList.add('vf-bse-hide-old-home');
    });
  }
  function ensure(){
    buildHome();
    const obs = new MutationObserver(() => buildHome());
    obs.observe(document.documentElement, {childList:true, subtree:true});
    setTimeout(() => cleanupOldHome(document.getElementById('vf-bse-home-cleanup')), 1200);
    setTimeout(() => cleanupOldHome(document.getElementById('vf-bse-home-cleanup')), 2800);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensure);
  else ensure();
})();