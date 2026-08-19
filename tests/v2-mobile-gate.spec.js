const {test,expect}=require('@playwright/test');
const baseURL=process.env.VF_BASE_URL||'http://127.0.0.1:4173';

async function openHome(page,width,height=844){
  await page.setViewportSize({width,height});
  await page.goto(baseURL+'/',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#vf-v2-public-shell',{state:'visible',timeout:20000});
  await page.evaluate(()=>document.fonts&&document.fonts.ready);
}

for(const width of [360,375,390]){
  test(`V2 homepage ship gate at ${width}px`,async({page})=>{
    await openHome(page,width);
    const result=await page.evaluate(()=>{
      const hero=document.querySelector('.vf-v2-hero');
      const all=[...document.querySelectorAll('#vf-v2-public-shell *')];
      const serif=all.filter(el=>{
        const f=(getComputedStyle(el).fontFamily||'').toLowerCase();
        return /times|georgia|serif/.test(f)&&!/sans-serif/.test(f);
      }).map(el=>(el.textContent||'').trim().slice(0,60)).filter(Boolean).slice(0,5);
      const tinyTargets=[...document.querySelectorAll('#vf-v2-public-shell a,#vf-v2-public-shell button')].filter(el=>{
        const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
        if(cs.display==='none'||cs.visibility==='hidden'||r.width===0||r.height===0)return false;
        return r.height<44||r.width<44;
      }).map(el=>({label:(el.textContent||el.getAttribute('aria-label')||'').trim(),w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height}));
      const images=[...document.images].filter(img=>img.closest('#vf-v2-public-shell')&&img.getBoundingClientRect().width>0).map(img=>({w:img.getBoundingClientRect().width,h:img.getBoundingClientRect().height}));
      return {
        viewportW:innerWidth,viewportH:innerHeight,scrollW:document.documentElement.scrollWidth,
        heroBottom:hero.getBoundingClientRect().bottom,
        primaryCount:document.querySelectorAll('.vf-v2-hero .vf-v2-primary').length,
        serif,tinyTargets,images,
        menuVisible:getComputedStyle(document.querySelector('.vf-v2-menu')).display!=='none',
        navHidden:getComputedStyle(document.querySelector('.vf-v2-navlinks')).display==='none'
      };
    });
    expect(result.scrollW).toBeLessThanOrEqual(result.viewportW+2);
    expect(result.heroBottom).toBeLessThanOrEqual(result.viewportH+2);
    expect(result.primaryCount).toBe(1);
    expect(result.serif).toEqual([]);
    expect(result.tinyTargets).toEqual([]);
    expect(result.menuVisible).toBe(true);
    expect(result.navHidden).toBe(true);
    for(const img of result.images){expect(img.w).toBeGreaterThan(0);expect(img.h).toBeGreaterThan(0);}
  });
}

test('V2 desktop nav does not wrap at 1280 and 1920',async({page})=>{
  for(const width of [1280,1920]){
    await openHome(page,width,900);
    const nav=await page.locator('.vf-v2-navlinks').evaluate(el=>{
      const r=el.getBoundingClientRect();
      const kids=[...el.children].map(x=>x.getBoundingClientRect());
      return {h:r.height,tops:[...new Set(kids.map(x=>Math.round(x.top)))]};
    });
    expect(nav.tops.length).toBe(1);
  }
});
