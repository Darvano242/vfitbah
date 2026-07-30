(function(){
  'use strict';
  var VERSION='2026.07.30-stability-1';
  window.VFITNESS_BUILD_VERSION=VERSION;

  function safeText(value,max){
    var text=String(value==null?'':value);
    return text.length>(max||1200)?text.slice(0,max||1200):text;
  }

  function context(){
    var path=location.pathname+location.search+location.hash;
    var body=(document.body&&document.body.innerText)||'';
    return {
      buildVersion:VERSION,
      path:safeText(path,500),
      feature:/workout|weekly plan|program/i.test(body)?'programs':'app',
      userAgent:safeText(navigator.userAgent,500),
      online:navigator.onLine,
      viewport:window.innerWidth+'x'+window.innerHeight,
      createdAt:new Date().toISOString()
    };
  }

  function saveLocal(entry){
    try{
      var rows=JSON.parse(localStorage.getItem('vfitness_runtime_errors')||'[]');
      rows.push(entry);
      localStorage.setItem('vfitness_runtime_errors',JSON.stringify(rows.slice(-20)));
    }catch(_){ }
  }

  function report(type,error,extra){
    var entry=Object.assign(context(),{
      type:type,
      message:safeText(error&&error.message?error.message:error,1000),
      stack:safeText(error&&error.stack?error.stack:'',4000)
    },extra||{});
    saveLocal(entry);
    try{
      if(window.db&&window.db.collection){
        window.db.collection('clientErrors').add(entry).catch(function(){});
      }
    }catch(_){ }
    console.error('[VFITNESS '+type+']',entry);
    return entry;
  }

  window.VFitnessReportError=report;
  window.addEventListener('error',function(event){
    report('window_error',event.error||event.message,{source:safeText(event.filename,500),line:event.lineno||0,column:event.colno||0});
  });
  window.addEventListener('unhandledrejection',function(event){
    report('unhandled_rejection',event.reason||'Unhandled promise rejection');
  });

  function updateToast(registration){
    if(document.getElementById('vf-update-toast'))return;
    var wrap=document.createElement('div');
    wrap.id='vf-update-toast';
    wrap.setAttribute('role','status');
    wrap.innerHTML='<strong>A new VFitness update is ready.</strong><button type="button">Update Now</button>';
    Object.assign(wrap.style,{position:'fixed',left:'16px',right:'16px',bottom:'calc(16px + env(safe-area-inset-bottom))',zIndex:'999999',padding:'14px 16px',borderRadius:'18px',background:'rgba(14,18,26,.96)',border:'1px solid rgba(255,255,255,.14)',boxShadow:'0 18px 50px rgba(0,0,0,.45)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',fontFamily:'system-ui,sans-serif'});
    var btn=wrap.querySelector('button');
    Object.assign(btn.style,{border:'0',borderRadius:'12px',padding:'10px 14px',fontWeight:'800',background:'linear-gradient(135deg,#3d7dff,#6f5bff)',color:'#fff'});
    btn.onclick=function(){
      if(registration&&registration.waiting)registration.waiting.postMessage({type:'SKIP_WAITING'});
      setTimeout(function(){location.reload();},250);
    };
    document.body.appendChild(wrap);
  }

  if('serviceWorker' in navigator){
    navigator.serviceWorker.addEventListener('controllerchange',function(){location.reload();});
    window.addEventListener('load',function(){
      navigator.serviceWorker.getRegistration().then(function(reg){
        if(!reg)return;
        if(reg.waiting)updateToast(reg);
        reg.addEventListener('updatefound',function(){
          var worker=reg.installing;
          if(!worker)return;
          worker.addEventListener('statechange',function(){
            if(worker.state==='installed'&&navigator.serviceWorker.controller)updateToast(reg);
          });
        });
      }).catch(function(err){report('service_worker_registration',err);});
    });
  }

  document.documentElement.dataset.vfitnessBuild=VERSION;
})();
