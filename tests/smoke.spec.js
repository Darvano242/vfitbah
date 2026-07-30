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
      const center=Math.max(0,event.startLine||0);
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
    if(/favicon|net::ERR_|Failed to load resource|third.?party|firebase.*network|Could not reach Cloud Firestore backend|client will operate in offline mode|code=unavailable/i.test(text))return;
    const location=message.location();
    errors.push(text+(location&&location.url?' @ '+location.url+':'+((location.lineNumber||0)+1):''));
  });

  return {errors,pending};
}

async function waitForApp(page,path='/'){
  await page.goto(baseURL+path,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>{
    const root=document.getElementById('root');
    if(!root)return false;
    const text=root.textContent||'';
    return !text.includes('VFITNESS Coaching Built From Real Client Work')&&text.length>120;
  },null,{timeout:20000});
}

async function expectNoErrors(page,capture){
  await new Promise(resolve=>setTimeout(resolve,300));
  await Promise.allSettled(capture.pending);
  const diagnostics=await page.evaluate(()=>window.VFitnessDiagnostics&&window.VFitnessDiagnostics.getErrors?window.VFitnessDiagnostics.getErrors():[]);
  const seriousDiagnostics=diagnostics.filter(entry=>!(/firestore|network|unavailable|offline/i.test(String(entry.message||''))));
  if(seriousDiagnostics.length)console.log('VFITNESS_DIAGNOSTICS '+JSON.stringify(seriousDiagnostics));
  if(capture.errors.length)console.log('VFITNESS_BROWSER_ERRORS '+JSON.stringify(capture.errors));
  expect(capture.errors).toEqual([]);
  expect(seriousDiagnostics).toEqual([]);
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
  await expect(page).toHaveURL(/\/start$/);
  await expect(page.getByRole('heading',{name:'What is your main goal?'})).toBeVisible();
  await page.getByRole('button',{name:'Weight loss',exact:true}).click();
  await expect(page.getByRole('heading',{name:'How do you want to train?'})).toBeVisible();
  await expectNoErrors(page,capture);
});

test('Client Login opens a usable authentication form',async({page})=>{
  const capture=await collectSeriousErrors(page);
  await waitForApp(page);
  await primaryLogin(page).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator('#root input[type="email"]')).toBeVisible({timeout:10000});
  await expect(page.locator('#root input[type="password"]')).toBeVisible();
  await expectNoErrors(page,capture);
});

test('direct Programs route survives a full refresh',async({page})=>{
  const capture=await collectSeriousErrors(page);
  await waitForApp(page,'/programs');
  await expect(page).toHaveURL(/\/programs$/);
  await expect(page.getByRole('heading',{name:/WORKOUT PROGRAMS/i})).toBeVisible({timeout:10000});
  await expect(page.getByText(/HOME 30/i).first()).toBeVisible();
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('root')&&(document.getElementById('root').textContent||'').includes('WORKOUT PROGRAMS'));
  await expect(page).toHaveURL(/\/programs$/);
  await expectNoErrors(page,capture);
});

test('specific public program URL opens the requested program flow',async({page})=>{
  const capture=await collectSeriousErrors(page);
  await waitForApp(page,'/programs/home-30day');
  await expect(page).toHaveURL(/\/programs\/home-30day$/);
  await expect(page.getByText(/HOME 30/i).first()).toBeVisible({timeout:10000});
  await expect(page.getByText(/Login Required|Continue to PayPal|You are about to start/i).first()).toBeVisible({timeout:10000});
  await expectNoErrors(page,capture);
});

test('protected My Programs route sends signed-out visitors to login',async({page})=>{
  const capture=await collectSeriousErrors(page);
  await waitForApp(page,'/my-programs');
  await expect(page).toHaveURL(/\/login$/,{timeout:15000});
  await expect(page.locator('#root input[type="email"]')).toBeVisible({timeout:10000});
  const returnPath=await page.evaluate(()=>sessionStorage.getItem('vfit_return_path'));
  expect(returnPath).toBe('/my-programs');
  await expectNoErrors(page,capture);
});

test('program completion service commits status and logs atomically',async({page})=>{
  const capture=await collectSeriousErrors(page);
  await waitForApp(page);
  const result=await page.evaluate(async()=>{
    const state={id:'enrollment-1',status:'active',currentWeek:1,completedWorkouts:[],setLogs:{}};
    const captured={update:null};
    const ref={id:'enrollment-1'};
    const transaction={
      get:async()=>({exists:true,id:'enrollment-1',data:()=>state}),
      update:(_ref,update)=>{captured.update=update;}
    };
    const db={
      collection:()=>({doc:()=>ref}),
      runTransaction:async callback=>callback(transaction)
    };
    const firebase={firestore:{FieldValue:{serverTimestamp:()=>('__SERVER_TIMESTAMP__')}}};
    const program={id:'test-program',weeklyPlans:[{week:1,workouts:[{name:'Test Workout',exercises:[]}]}]};
    const response=await window.VFitnessProgramCore.completeWorkout({
      db,firebase,enrollment:state,program,week:1,workoutIndex:0,
      sessionKey:'test-session',log:{duration:120,sets:{}}
    });
    return {response,update:captured.update};
  });
  expect(result.response.status).toBe('completed');
  expect(result.update.status).toBe('completed');
  expect(result.update.completedWorkouts).toEqual(['week1-day0']);
  expect(result.update.completionSchema).toBe('zero-based-v2');
  expect(result.update.completedAt).toBe('__SERVER_TIMESTAMP__');
  expect(result.update.setLogs['test-session'].workoutKey).toBe('week1-day0');
  await expectNoErrors(page,capture);
});

test('Programs layout remains usable at iPhone viewport width',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  const capture=await collectSeriousErrors(page);
  await waitForApp(page,'/programs');
  await expect(page.getByRole('heading',{name:/WORKOUT PROGRAMS/i})).toBeVisible();
  const dimensions=await page.evaluate(()=>({viewport:window.innerWidth,scroll:document.documentElement.scrollWidth}));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport+2);
  await expectNoErrors(page,capture);
});
