const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync}=require('node:child_process');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'vfit-auth-test-'));
fs.mkdirSync(path.join(temporary,'site'));
fs.copyFileSync(path.join(__dirname,'../site/index.html'),path.join(temporary,'site/index.html'));
try { execFileSync(process.execPath,[path.join(__dirname,'../scripts/apply-professional-hardening.js')],{cwd:temporary}); } catch(error) { fs.rmSync(temporary,{recursive:true,force:true});throw error; }
const html=fs.readFileSync(path.join(temporary,'site/index.html'),'utf8');
fs.rmSync(temporary,{recursive:true,force:true});
const start=html.indexOf('useEffect(()=>{/* VFIT_AUTH_LIFECYCLE_20261004');
const end=html.indexOf('unsubscribe();};},[]);',start)+'unsubscribe();};},[]);'.length;
const effect=html.slice(start,end);
function setup(getProfile){
  const state={},timers=new Map();let listener,cleanup,sequence=0;
  const auth={currentUser:null,onAuthStateChanged(fn){listener=fn;return()=>state.unsubscribed=true;}};
  const context={auth,db:{collection:()=>({doc:uid=>({get:()=>getProfile(uid)})})},console:{error:()=>{}},Promise,Error,window:{},Notification:{permission:'default'},confirm:()=>true,localStorage:{getItem:()=>null,removeItem:()=>{}},setTimeout:fn=>{const id=++sequence;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id),useEffect:fn=>cleanup=fn()};
  for(const name of ['User','IsAdmin','ShowOnboarding','ShowNotificationPrompt','Loading','CurrentPage','DashboardTab'])context['set'+name]=value=>state[name]=value;
  vm.runInNewContext(effect,context);
  return {state,timers,auth,cleanup,change(user){auth.currentUser=user;return listener(user);}};
}
function deferred(){let resolve;const promise=new Promise(r=>resolve=r);return{promise,resolve};}
test('late profile result cannot restore an account after logout',async()=>{
  const d=deferred(),app=setup(()=>d.promise);const pending=app.change({uid:'a'});await app.change(null);d.resolve({exists:true,data:()=>({role:'admin'})});await pending;
  assert.equal(app.state.User,null);assert.equal(app.state.IsAdmin,false);assert.equal(app.timers.size,0);
});
test('account switch accepts only latest profile; database cannot override auth identity',async()=>{
  const first=deferred(),second=deferred(),app=setup(uid=>uid==='a'?first.promise:second.promise);
  const a=app.change({uid:'a',email:'a@example.com'}),b=app.change({uid:'b',email:'b@example.com'});
  second.resolve({exists:true,data:()=>({uid:'forged',email:'forged',role:'client',onboardingCompleted:true})});await b;
  first.resolve({exists:true,data:()=>({role:'admin'})});await a;
  assert.equal(app.state.User.uid,'b');assert.equal(app.state.User.email,'b@example.com');assert.equal(app.state.IsAdmin,false);
  app.cleanup();assert.equal(app.timers.size,0);assert.equal(app.state.unsubscribed,true);
});
test('missing profile uses safe defaults and anonymous intake does not navigate to dashboard',async()=>{
  const app=setup(async()=>({exists:false}));await app.change({uid:'client'});assert.equal(app.state.User.uid,'client');assert.equal(app.state.ShowOnboarding,true);
  await app.change({uid:'visitor',isAnonymous:true});assert.equal(app.state.User,null);assert.equal(app.state.ShowOnboarding,false);assert.equal(app.timers.size,0);
});
test('profile timeout clears loading state without granting staff access',async()=>{
  const app=setup(()=>new Promise(()=>{}));const pending=app.change({uid:'client'});[...app.timers.values()][0]();await pending;
  assert.equal(app.state.Loading,false);assert.equal(app.state.IsAdmin,false);assert.equal(app.state.User,null);assert.equal(app.timers.size,0);
});
test('guided intake requires explicit API acceptance and removes direct email path',()=>{
  const start=html.indexOf('function StartHereFlow(');const end=html.indexOf('if(saved){',start);const block=html.slice(start,end);
  assert.ok(block.includes('result.ok===true'));assert.ok(block.includes('signal:controller.signal'));assert.ok(!block.includes('emailjs.send'));
});
test('guided intake creates the client account and never stores the password in the application',()=>{
  const start=html.indexOf('function StartHereFlow(');const block=html.slice(start,html.indexOf('if(saved){',start));
  assert.ok(block.includes('createUserWithEmailAndPassword'));assert.ok(block.includes("auth/email-already-in-use"));
  assert.ok(block.includes('const{password:_pw,waiver:_wv,...safeData}=data;'));assert.ok(block.includes('liabilityWaiverAccepted:true'));
  assert.ok(!/payload=\{\.\.\.data/.test(block));
});
