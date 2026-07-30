/* Captured from the verified VFitness production shell. */
(function(){
  function vfitRecoveryToast(message, ok){
    var note=document.createElement('div');
    note.textContent=message;
    note.style.position='fixed';
    note.style.left='50%';
    note.style.bottom='22px';
    note.style.transform='translateX(-50%)';
    note.style.zIndex='999999';
    note.style.maxWidth='92vw';
    note.style.padding='14px 18px';
    note.style.borderRadius='18px';
    note.style.fontWeight='800';
    note.style.fontSize='14px';
    note.style.color=ok?'#86efac':'#fecaca';
    note.style.background=ok?'rgba(22,101,52,.92)':'rgba(127,29,29,.94)';
    note.style.border=ok?'1px solid rgba(134,239,172,.35)':'1px solid rgba(254,202,202,.35)';
    note.style.boxShadow='0 18px 60px rgba(0,0,0,.55)';
    document.body.appendChild(note);
    setTimeout(function(){note.remove();},4200);
  }
  function findEmailInput(){
    return document.querySelector('input[type="email"]') || Array.from(document.querySelectorAll('input')).find(function(input){return /email/i.test(input.placeholder||input.name||input.id||'');});
  }
  function injectForgotPassword(){
    var password=document.querySelector('input[type="password"]');
    var email=findEmailInput();
    if(!password || !email) return;
    if(document.getElementById('vfit-forgot-password-recovery')) return;
    var wrap=document.createElement('div');
    wrap.id='vfit-forgot-password-recovery';
    wrap.style.marginTop='10px';
    wrap.style.marginBottom='8px';
    wrap.style.textAlign='right';
    var btn=document.createElement('button');
    btn.type='button';
    btn.textContent='Forgot password? Recover account';
    btn.style.border='0';
    btn.style.background='transparent';
    btn.style.color='#9cc0ff';
    btn.style.fontWeight='900';
    btn.style.fontSize='14px';
    btn.style.padding='8px 2px';
    btn.style.cursor='pointer';
    btn.onclick=function(){
      var clean=(email.value||'').trim();
      if(!clean){vfitRecoveryToast('Type your email first, then tap forgot password.', false); email.focus(); return;}
      try{
        if(!window.firebase || !window.firebase.auth){vfitRecoveryToast('The account system is still loading. Try again in a few seconds.', false); return;}
        btn.disabled=true; btn.textContent='Sending reset email...';
        window.firebase.auth().sendPasswordResetEmail(clean).then(function(){
          vfitRecoveryToast('Reset email sent. Check the inbox first, then spam if it is not there.', true);
          btn.textContent='Forgot password? Recover account'; btn.disabled=false;
        }).catch(function(err){
          vfitRecoveryToast((err && err.message) ? err.message : 'The reset email did not send. Check the email and try again.', false);
          btn.textContent='Forgot password? Recover account'; btn.disabled=false;
        });
      }catch(err){vfitRecoveryToast('Recovery did not start. Try again in a moment.', false); btn.disabled=false; btn.textContent='Forgot password? Recover account';}
    };
    wrap.appendChild(btn);
    var parent=password.parentElement;
    if(parent && parent.parentElement) parent.parentElement.insertBefore(wrap, parent.nextSibling);
  }
  document.addEventListener('DOMContentLoaded',injectForgotPassword);
  window.addEventListener('vf:ui-rendered',()=>{setTimeout(injectForgotPassword,100);setTimeout(injectForgotPassword,800);});
})();
