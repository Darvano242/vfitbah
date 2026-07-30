/* Captured from the verified VFitness production shell. */
(function(){
  function vfitIsAdminView(){return /admin/i.test(location.pathname+location.hash) || /ADMIN DASHBOARD|Button Check|Site Editor|Automation Alerts/i.test(document.body.innerText||'');}
  function hideClientUnsafeAdminText(){
    if(vfitIsAdminView()) return;
    var blocked=['Package Protection','Change Log','Business Scaling','Admin Controls','Developer Tools','System QA','Button Check','Site Editor','Package Audit','Business Tools'];
    document.querySelectorAll('section,article,div,button,a').forEach(function(el){
      var t=(el.innerText||'').trim();
      if(!t || t.length>220) return;
      if(blocked.some(function(b){return t.indexOf(b)!==-1;})){
        var card=el.closest('.card,.glass,.rounded-2xl,.rounded-xl,section,article,div');
        if(card && card!==document.body && !/ADMIN DASHBOARD/i.test(document.body.innerText||'')) card.style.display='none';
      }
    });
  }
  function fixTapTargets(){
    document.querySelectorAll('button,a,input,select,textarea').forEach(function(el){
      el.style.touchAction='manipulation';
      if((el.tagName==='BUTTON'||el.tagName==='A') && el.offsetHeight<42){ el.style.minHeight='42px'; }
    });
  }
  document.addEventListener('DOMContentLoaded',function(){hideClientUnsafeAdminText();fixTapTargets();});
  window.addEventListener('vf:ui-rendered',()=>{hideClientUnsafeAdminText();fixTapTargets();});
})();
