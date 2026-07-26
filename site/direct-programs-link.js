(function(){
  var path=(window.location.pathname||'/').replace(/\/+$/,'')||'/';
  if(path!=='/programs'&&path!=='/training-programs'&&path!=='/online-programs')return;
  var attempts=0,maxAttempts=40;
  function label(el){return String((el&&el.textContent)||'').replace(/\s+/g,' ').trim();}
  function tryOpen(){
    attempts++;
    var nodes=[].slice.call(document.querySelectorAll('button,a,[role="button"]'));
    var exact=nodes.find(function(el){return /^(programs|training programs|online programs|view programs|browse programs)$/i.test(label(el));});
    var fallback=nodes.find(function(el){return /program/i.test(label(el))&&!/application|workout history|program notes/i.test(label(el));});
    var target=exact||fallback;
    if(target){target.click();return;}
    if(attempts<maxAttempts)setTimeout(tryOpen,250);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(tryOpen,300);},{once:true});
  else setTimeout(tryOpen,300);
})();
