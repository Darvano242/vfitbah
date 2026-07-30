/* Captured from the verified VFitness production shell. */
(function(){
  function fixHomeStartCta(){
    document.querySelectorAll('.mu-sticky-cta button').forEach(function(btn){
      if((btn.textContent||'').trim()==='Sign Up'){
        btn.textContent='Start Here';
        btn.onclick=function(e){e.preventDefault();try{document.querySelector('[data-page="training"]')?.click();}catch(_){ } try{window.scrollTo({top:0,behavior:'smooth'});}catch(_){ }};
      }
    });
  }
  document.addEventListener('DOMContentLoaded',fixHomeStartCta);
  setInterval(fixHomeStartCta,800);
})();
