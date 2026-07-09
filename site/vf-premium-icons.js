// VFITNESS premium Lucide icon enhancer
(function(){
  function wrapped(el){return el.parentElement&&el.parentElement.classList&&el.parentElement.classList.contains('vf-icon-shell');}
  function skip(svg){return !svg||svg.dataset.vf3dApplied==='1'||(svg.closest&&svg.closest('.vf-no-3d-icon,iframe,[data-vf-skip-icons]'));}
  function shellClass(svg){var w=parseFloat(svg.getAttribute('width'))||svg.clientWidth||20;if(w>=24)return 'vf-icon-shell vf-icon-shell-lg';if(w<=18)return 'vf-icon-shell vf-icon-shell-sm';return 'vf-icon-shell';}
  function upgrade(svg){if(skip(svg))return;svg.dataset.vf3dApplied='1';svg.classList.add('vf-lucide-3d','vf-icon-animate');if(!wrapped(svg)){var span=document.createElement('span');span.className=shellClass(svg);span.setAttribute('aria-hidden','true');var p=svg.parentNode;if(!p)return;p.insertBefore(span,svg);span.appendChild(svg);}}
  function scan(root){if(!root||!root.querySelectorAll)return;root.querySelectorAll('svg.lucide,[data-lucide] svg,button svg,a svg,[role="button"] svg,.rounded-xl svg,.rounded-2xl svg,.rounded-3xl svg').forEach(function(svg){if(svg.querySelector&&svg.querySelector('path,circle,rect,line,polyline,polygon'))upgrade(svg);});root.querySelectorAll('.rounded-xl,.rounded-2xl,.rounded-3xl').forEach(function(el){if(el.querySelector&&el.querySelector('svg'))el.classList.add('vf-premium-card');});}
  function boot(){scan(document);var mo=new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)scan(n);});});});mo.observe(document.body,{childList:true,subtree:true});setTimeout(function(){scan(document);},900);setTimeout(function(){scan(document);},2400);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
