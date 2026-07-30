const {test,expect}=require('@playwright/test');

const baseURL=process.env.VF_BASE_URL||'http://127.0.0.1:4173';

function collectSeriousErrors(page){
  const errors=[];
  page.on('pageerror',error=>errors.push(String(error&&error.message||error)));
  page.on('console',message=>{
    if(message.type()!=='error')return;
    const text=message.text();
    if(/favicon|net::ERR_|Failed to load resource|third.?party|firebase.*network/i.test(text))return;
    errors.push(text);
  });
  return errors;
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

test('homepage mounts and primary actions render',async({page})=>{
  const errors=collectSeriousErrors(page);
  await waitForApp(page);
  await expect(page.getByRole('button',{name:/Start Your Transformation/i})).toBeVisible();
  await expect(page.getByRole('button',{name:/Client Login/i})).toBeVisible();
  await expect(page.getByRole('button',{name:/Online Programs/i})).toBeVisible();
  expect(errors).toEqual([]);
});

test('Start Here guided intake opens and advances',async({page})=>{
  const errors=collectSeriousErrors(page);
  await waitForApp(page);
  await page.getByRole('button',{name:/Start Your Transformation/i}).click();
  await expect(page.getByRole('heading',{name:'What is your main goal?'})).toBeVisible();
  await page.getByRole('button',{name:'Weight loss',exact:true}).click();
  await expect(page.getByRole('heading',{name:'How do you want to train?'})).toBeVisible();
  expect(errors).toEqual([]);
});

test('Client Login opens a usable authentication form',async({page})=>{
  const errors=collectSeriousErrors(page);
  await waitForApp(page);
  await page.getByRole('button',{name:/Client Login/i}).click();
  await expect(page.locator('input[type="email"]')).toBeVisible({timeout:10000});
  await expect(page.locator('input[type="password"]')).toBeVisible();
  expect(errors).toEqual([]);
});

test('Online Programs button reaches the public program section',async({page})=>{
  const errors=collectSeriousErrors(page);
  await waitForApp(page);
  await page.getByRole('button',{name:/Online Programs/i}).click();
  const section=page.locator('#vf-online-programs');
  await expect(section).toBeVisible({timeout:10000});
  await expect(section).toContainText(/program/i);
  expect(errors).toEqual([]);
});
