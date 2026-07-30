const {test,expect}=require('@playwright/test');

const baseURL=process.env.VF_BASE_URL||'http://127.0.0.1:4173';

async function collectSeriousErrors(page){
  const errors=[];
  const pending=[];
  const cdp=await page.context().newCDPSession(page);
  await Promise.all([cdp.send('Runtime.enable'),cdp.send('Debugger.enable')]);

  cdp.on('Debugger.scriptFailedToParse',event=>{
    const task=(async()=>{
      let source='';
      try{source=(await cdp.send('Debugger.getScriptSource',{scriptId:event.scriptId})).scriptSource||'';}catch(_){}
      const lines=source.split('\n');
      const resultsLine=lines.findIndex(line=>/results/i.test(line));
      const center=resultsLine>=0?resultsLine:0;
      const excerpt=lines.slice(Math.max(0,center-2),center+3).join('\n').slice(0,1600);
      errors.push('SCRIPT_FAILED_TO_PARSE '+(event.url||'inline')+' startLine='+(event.startLine+1)+' startColumn='+(event.startColumn+1)+' excerpt='+excerpt);
    })();
    pending.push(task);
  });

  cdp.on('Runtime.exceptionThrown',event=>{
    const details=event.exceptionDetails||{};
    const frame=details.stackTrace&&details.stackTrace.callFrames&&details.stackTrace.callFrames[0];
    const description=(details.exception&&details.exception.description)||details.text||'Unknown browser exception';
    const url=details.url||(frame&&frame.url)||'unknown';
    const line=(details.lineNumber!=null?details.lineNumber:(frame&&frame.lineNumber)||0)+1;
    const column=(details.columnNumber!=null?details.columnNumber:(frame&&frame.columnNumber)||0)+1;
    errors.push(description+' @ '+url+':'+line+':'+column);
  });

  page.on('console',message=>{
    if(message.type()!=='error')return;
    const text=message.text();
    if(/favicon|net::ERR_|Failed to load resource|third.?party|firebase.*network/i.test(text))return;
    const location=message.location();
    errors.push(text+(location&&location.url?' @ '+location.url+':'+((location.lineNumber||0)+1):''));
  });

  return {errors,pending};
}

async function waitForApp(page){
  await page.goto(baseURL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>{
    const root=document.getElementById('root');
    if(!root)return false;
    const text=root.textContent||'';
    return !text.includes('VFITNESS Coaching Built From Real Client Work')&&text.length>120;
  },null,{timeout:20000});
}

async function expectNoErrors(page,capture){
  await new Promise(resolve=>setTimeout(resolve,250));
  await Promise.allSettled(capture.pending);
  const diagnostics=await page.evaluate(()=>window.VFitnessDiagnostics&&window.VFitnessDiagnostics.getErrors?window.VFitnessDiagnostics.getErrors():[]);
  if(diagnostics.length)console.log('VFITNESS_DIAGNOSTICS '+JSON.stringify(diagnostics));
  if(capture.errors.length)console.log('VFITNESS_BROWSER_ERRORS '+JSON.stringify(capture.errors));
  expect(capture.errors).toEqual([]);
}

const primaryStart=page=>page.getByRole('button',{name:'Start Your Transformation',exact:true}).first();
const primaryLogin=page=>page.getByRole('button',{name:'Client Login',exact:true}).first();
const primaryPrograms=page=>page.getByRole('button',{name:'Online Programs',exact:true}).first();

test('homepage mounts and primary actions render',async({page})=>{
  const capture=await collectSeriousErrors(page);
  await waitForApp(page);
  await expect(primaryStart(page)).toBeVisible();
  await expect(primaryLogin(page)).toBeVisible();
  await expect(primaryPrograms(page)).toBeVisible();
  await expectNoErrors(page,capture);
});

test('Start Here guided intake opens and advances',async({page})=>{
  const capture=await collectSeriousErrors(page);
  await waitForApp(page);
  await primaryStart(page).click();
  await expect(page.getByRole('heading',{name:'What is your main goal?'})).toBeVisible();
  await page.getByRole('button',{name:'Weight loss',exact:true}).click();
  await expect(page.getByRole('heading',{name:'How do you want to train?'})).toBeVisible();
  await expectNoErrors(page,capture);
});

test('Client Login opens a usable authentication form',async({page})=>{
  const capture=await collectSeriousErrors(page);
  await waitForApp(page);
  await primaryLogin(page).click();
  await expect(page.locator('#root input[type="email"]')).toBeVisible({timeout:10000});
  await expect(page.locator('#root input[type="password"]')).toBeVisible();
  await expectNoErrors(page,capture);
});

test('Online Programs button reaches the public program section',async({page})=>{
  const capture=await collectSeriousErrors(page);
  await waitForApp(page);
  await primaryPrograms(page).click();
  const section=page.locator('#vf-online-programs');
  await expect(section).toBeVisible({timeout:10000});
  await expect(section).toContainText(/program/i);
  await expectNoErrors(page,capture);
});
