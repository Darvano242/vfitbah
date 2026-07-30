/* Captured from the verified VFitness production shell. */
(function(){
  function fitMobile(){
    if (window.innerWidth > 767) return;
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    var limit = window.innerWidth + 6;
    document.querySelectorAll('main, section, article, header, footer, nav, .mu-pop, .rounded-xl, .rounded-2xl, .rounded-3xl').forEach(function(el){
      if (el.scrollWidth > limit) {
        el.style.maxWidth = '100%';
        el.style.minWidth = '0';
        el.style.overflowX = 'hidden';
      }
    });
  }
  document.addEventListener('DOMContentLoaded', fitMobile);
  window.addEventListener('resize', fitMobile);
  window.addEventListener('vf:ui-rendered',()=>setTimeout(fitMobile,120));
})();
