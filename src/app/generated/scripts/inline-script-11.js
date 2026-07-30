/* Captured from the verified VFitness production shell. */
/* VFITNESS public-gallery polish: never show admin/setup language to visitors while gallery loads. */
(function(){
  var SAFE_GALLERY_COPY = 'Real results are loading. Give it a second.';
  function isPublicGalleryAdminCopy(txt){
    txt = String(txt || '').replace(/\s+/g,' ').trim().toLowerCase();
    return txt.includes('add transformation photos') ||
           txt.includes('admin gallery') ||
           txt.includes('feature them here') ||
           (txt.includes('admin') && txt.includes('gallery') && txt.includes('transformation'));
  }
  function polishPublicGalleryCopy(){
    try{
      var walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT);
      var nodes = [];
      while(walker.nextNode()){var current=walker.currentNode;var parent=current&&current.parentElement;if(parent&&parent.closest('script,style,noscript,template'))continue;nodes.push(current);}
      nodes.forEach(function(node){
        if(isPublicGalleryAdminCopy(node.nodeValue)) node.nodeValue = SAFE_GALLERY_COPY;
      });
      document.querySelectorAll('div,span,p,h1,h2,h3,h4,section,article').forEach(function(el){
        if(!el || !el.textContent) return;
        var own = Array.prototype.filter.call(el.childNodes, function(n){return n.nodeType === 3;}).map(function(n){return n.nodeValue;}).join(' ');
        if(isPublicGalleryAdminCopy(own)) el.textContent = SAFE_GALLERY_COPY;
      });
    }catch(e){}
  }
  document.addEventListener('DOMContentLoaded', polishPublicGalleryCopy);
  window.addEventListener('load', polishPublicGalleryCopy);
  window.addEventListener('vf:ui-rendered',()=>setTimeout(polishPublicGalleryCopy,80));
})();
