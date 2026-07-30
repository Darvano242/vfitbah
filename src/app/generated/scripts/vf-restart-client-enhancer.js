/* Captured from the verified VFitness production shell. */
(function(){
  function isHomeLike(){
    var txt=(document.body.innerText||'').slice(0,4000);
    return /VFITNESS\s*APP|Train Hard|Built for training|Clients Trained|Avg Rating/i.test(txt) && !/Welcome back|Clients|Admin/i.test(txt);
  }
  function sanitizeClientCopy(){
    document.querySelectorAll('section,div').forEach(function(el){
      if(el.dataset && el.dataset.vfSanitized) return;
      var t=(el.innerText||'').trim();
      if(/^Business Scale Layer\b/i.test(t) || /Built to sell, manage, and retain\./i.test(t)){
        el.dataset.businessOnly='true';
        el.style.display='none';
        el.dataset.vfSanitized='1';
      }
    });
    document.querySelectorAll('*').forEach(function(el){
      if(el.childNodes && el.childNodes.length===1 && el.childNodes[0].nodeType===3){
        var v=el.textContent.trim();
        if(v==='Scalable') el.textContent='Online';
        if(v==='VFITNESS APP') el.innerHTML='TRAIN HARD<br><span style="color:#3d7dff">LOOK ELITE.</span>';
      }
    });
  }
  function enhanceButtons(){
    document.querySelectorAll('button').forEach(function(btn){
      if(!btn.getAttribute('type')) btn.setAttribute('type','button');
      btn.style.touchAction='manipulation';
    });
  }
  function tick(){sanitizeClientCopy();enhanceButtons();}
  document.addEventListener('DOMContentLoaded',tick);window.addEventListener('vf:ui-rendered',()=>setTimeout(tick,80));
  setTimeout(tick,1200); setTimeout(tick,2500);
})();
