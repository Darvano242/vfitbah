/* Visible PWA update flow. Clients can activate a waiting release without clearing cache. */
(function(global){
  'use strict';
  if(!('serviceWorker' in navigator))return;
  let refreshing=false;
  let updateRequested=false;
  const hadController=!!navigator.serviceWorker.controller;

  function removePrompt(){const old=document.getElementById('vf-update-ready');if(old)old.remove();}
  function showPrompt(registration){
    if(!registration||!registration.waiting||document.getElementById('vf-update-ready'))return;
    const bar=document.createElement('div');
    bar.id='vf-update-ready';
    bar.setAttribute('role','status');
    bar.innerHTML='<div><strong>A new VFitness update is ready.</strong><span>Update now to use the latest fixes.</span></div><button type="button">Update Now</button>';
    Object.assign(bar.style,{position:'fixed',left:'12px',right:'12px',bottom:'calc(12px + env(safe-area-inset-bottom))',zIndex:'10050',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'14px',padding:'14px 16px',borderRadius:'18px',background:'rgba(15,18,24,.97)',color:'#fff',border:'1px solid rgba(255,255,255,.14)',boxShadow:'0 18px 60px rgba(0,0,0,.5)',fontFamily:'Instrument Sans,system-ui,sans-serif'});
    const copy=bar.querySelector('div');Object.assign(copy.style,{display:'grid',gap:'2px'});
    const small=bar.querySelector('span');Object.assign(small.style,{fontSize:'12px',color:'#a8b0bd'});
    const button=bar.querySelector('button');Object.assign(button.style,{border:'0',borderRadius:'12px',padding:'10px 13px',background:'linear-gradient(135deg,#3d7dff,#6f5bff)',color:'#fff',fontWeight:'800',whiteSpace:'nowrap'});
    button.addEventListener('click',function(){
      updateRequested=true;
      button.disabled=true;
      button.textContent='Updating…';
      registration.waiting.postMessage({type:'SKIP_WAITING'});
    });
    document.body.appendChild(bar);
  }

  function watch(registration){
    if(registration.waiting&&navigator.serviceWorker.controller)showPrompt(registration);
    registration.addEventListener('updatefound',function(){
      const worker=registration.installing;
      if(!worker)return;
      worker.addEventListener('statechange',function(){
        if(worker.state==='installed'&&navigator.serviceWorker.controller)showPrompt(registration);
      });
    });
    setInterval(function(){registration.update().catch(function(){});},60*60*1000);
  }

  navigator.serviceWorker.addEventListener('controllerchange',function(){
    if(refreshing)return;
    if(!hadController&&!updateRequested)return;
    refreshing=true;
    removePrompt();
    global.location.reload();
  });

  global.addEventListener('load',function(){
    navigator.serviceWorker.getRegistration().then(function(registration){if(registration)watch(registration);}).catch(function(){});
  });
})(window);
