(function(){
  'use strict';

  const BUILD='85be586c2f42';
  const STORAGE_KEY='vfitness:runtime-errors';
  const MAX_ERRORS=25;
  const sent=new Set();

  function safeString(value,max){
    const text=String(value==null?'':value);
    return text.length>(max||1200)?text.slice(0,max||1200):text;
  }

  function fingerprint(entry){
    return [entry.type,entry.message,entry.source,entry.line,entry.column].join('|').slice(0,500);
  }

  function readLog(){
    try{
      const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
      return Array.isArray(parsed)?parsed:[];
    }catch(_){return [];}
  }

  function writeLog(entries){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(entries.slice(-MAX_ERRORS)));}catch(_){}
  }

  function normalize(raw){
    return {
      build:BUILD,
      type:safeString(raw.type||'runtime',80),
      message:safeString(raw.message||'Unknown runtime error',800),
      stack:safeString(raw.stack||'',1800),
      source:safeString(raw.source||'',500),
      line:Number(raw.line||0),
      column:Number(raw.column||0),
      path:safeString(location.pathname+location.search+location.hash,500),
      online:navigator.onLine,
      userAgent:safeString(navigator.userAgent,500),
      createdAtClient:new Date().toISOString()
    };
  }

  function persist(entry){
    const log=readLog();
    log.push(entry);
    writeLog(log);
  }

  function reportToFirestore(entry){
    const key=fingerprint(entry);
    if(sent.has(key))return;
    sent.add(key);
    setTimeout(function(){
      try{
        if(!window.db||typeof window.db.collection!=='function')return;
        const authUser=window.auth&&window.auth.currentUser;
        window.db.collection('clientErrors').add({
          ...entry,
          userId:authUser&&authUser.uid?authUser.uid:'anonymous',
          createdAt:window.firebase&&firebase.firestore&&firebase.firestore.FieldValue?firebase.firestore.FieldValue.serverTimestamp():entry.createdAtClient
        }).catch(function(){});
      }catch(_){}
    },600);
  }

  function capture(raw){
    const entry=normalize(raw||{});
    persist(entry);
    reportToFirestore(entry);
    try{console.warn('[VFitness diagnostics]',entry.type,entry.message);}catch(_){}
    return entry;
  }

  window.addEventListener('error',function(event){
    capture({
      type:'javascript_error',
      message:event.message||(event.error&&event.error.message),
      stack:event.error&&event.error.stack,
      source:event.filename,
      line:event.lineno,
      column:event.colno
    });
  });

  window.addEventListener('unhandledrejection',function(event){
    const reason=event.reason||{};
    capture({
      type:'unhandled_rejection',
      message:reason.message||reason,
      stack:reason.stack||''
    });
  });

  window.addEventListener('load',function(){
    setTimeout(function(){
      const root=document.getElementById('root');
      if(!root)return;
      const fallbackText='VFITNESS Coaching Built From Real Client Work';
      if((root.textContent||'').includes(fallbackText)){
        capture({type:'app_not_mounted',message:'React app did not replace the emergency fallback shell within 8 seconds.'});
      }
    },8000);
  });

  window.VFitnessDiagnostics={
    build:BUILD,
    getErrors:readLog,
    clearErrors:function(){writeLog([]);sent.clear();},
    capture:capture
  };
})();
