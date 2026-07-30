/* Captured from the verified VFitness production shell. */
(function(){
  if(window.__vfitProgramExperienceUpgrade) return;
  window.__vfitProgramExperienceUpgrade = true;
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const text = el => (el && el.textContent || '').trim();
  const clean = s => String(s||'').replace(/\s+/g,' ').trim();
  const sleep = ms => new Promise(r=>setTimeout(r,ms));

  function toast(msg){
    let d=document.createElement('div');
    d.className='toast vfit-toast';
    d.textContent=msg;
    document.body.appendChild(d);
    setTimeout(()=>d.remove(),3200);
  }

  async function ensureJsPdf(){
    if(window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
    await new Promise((resolve,reject)=>{
      const old=[...document.scripts].find(s=>s.src.includes('jspdf.umd.min.js'));
      if(old){old.addEventListener('load',resolve,{once:true}); setTimeout(resolve,1200); return;}
      const s=document.createElement('script');
      s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      s.onload=resolve; s.onerror=reject; document.head.appendChild(s);
    });
    return window.jspdf && window.jspdf.jsPDF;
  }

  async function downloadPlan(kind, source){
    const title = clean(($('h1', source)||$('h2', source)||$('h3', source)||{}).textContent || `VFITNESS ${kind} Plan`);
    const body = clean(source ? source.innerText : document.body.innerText).slice(0,9000);
    const fileName = `VFITNESS-${kind.replace(/\s+/g,'-')}-${new Date().toISOString().slice(0,10)}.pdf`;
    try{
      const JsPDF = await ensureJsPdf();
      if(!JsPDF) throw new Error('PDF engine unavailable');
      const pdf = new JsPDF({unit:'pt', format:'letter'});
      const W = pdf.internal.pageSize.getWidth();
      let y=54;
      pdf.setFillColor(5,5,7); pdf.rect(0,0,W,70,'F');
      pdf.setTextColor(61,125,255); pdf.setFontSize(21); pdf.setFont(undefined,'bold'); pdf.text('VFITNESS',54,43);
      pdf.setTextColor(15,23,42); pdf.setFontSize(18); pdf.text(title || `VFITNESS ${kind} Plan`,54,105);
      pdf.setFontSize(10); pdf.setTextColor(85,95,115);
      pdf.text('Built from the plan inside your VFITNESS dashboard. Follow the day you are on. Do not overthink it, complete the work, check it off, and come back tomorrow.',54,126,{maxWidth:W-108});
      y=158; pdf.setFont(undefined,'normal'); pdf.setFontSize(10); pdf.setTextColor(35,41,52);
      const lines = pdf.splitTextToSize(body.replace(/Download Workout PDF|Download Meal Plan PDF|Ask VFitness Coach|Enable Email Reminders/g,''), W-108);
      lines.forEach(line=>{ if(y>730){ pdf.addPage(); y=54; } pdf.text(line,54,y); y+=14; });
      pdf.save(fileName);
      toast(`${kind} PDF downloaded.`);
    }catch(err){
      const blob = new Blob([`VFITNESS ${kind} Plan\n\n${body}`], {type:'application/pdf'});
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=fileName; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
      toast(`${kind} file downloaded.`);
    }
  }

  function getExerciseName(btn){
    const card = btn.closest('[class*="border"], [class*="rounded"], div') || btn.parentElement;
    let heading = card && (card.querySelector('h3,h4,strong,[class*="font-bold"]'));
    let name = heading ? clean(heading.textContent).replace(/^\d+\.\s*/,'') : 'This movement';
    if(!name || /^video$/i.test(name)) name='This movement';
    return name;
  }

  function showFormVideo(exerciseName){
    const old=$('.vfit-form-video-modal'); if(old) old.remove();
    const lower=exerciseName.toLowerCase();
    let cues=['Set your position first.','Control the lowering part.','Finish the rep clean before rushing the next one.'];
    if(lower.includes('thrust')||lower.includes('glute')) cues=['Drive through your heels.','Pause and squeeze hard at the top.','Do not turn it into a lower back movement.'];
    else if(lower.includes('lunge')) cues=['Each leg gets the same control.','Keep the front foot planted.','Step back if your knee feels crowded.'];
    else if(lower.includes('squat')) cues=['Sit down with control.','Keep your chest tall.','Stand up strong without bouncing.'];
    else if(lower.includes('press')||lower.includes('push')) cues=['Brace before the press.','Move the weight, do not throw it.','Lock in the top position before the next rep.'];
    else if(lower.includes('row')) cues=['Pull with your elbows.','Hold for a beat at the top.','Do not shrug the rep.'];
    const modal=document.createElement('div');
    modal.className='vfit-form-video-modal';
    modal.innerHTML=`
      <div class="vfit-video-card" role="dialog" aria-modal="true">
        <div class="vfit-video-top"><div><h3>${exerciseName}: Form Coach</h3><span style="color:#9fb7ff;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase">Playing movement guide</span></div><button aria-label="Close">×</button></div>
        <div class="vfit-video-stage">
          <div class="vfit-holo-grid"></div>
          <div class="vfit-coach-figure" aria-hidden="true"><div class="vfit-head"></div><div class="vfit-body"></div><div class="vfit-arm left"></div><div class="vfit-arm right"></div><div class="vfit-leg left"></div><div class="vfit-leg right"></div></div>
          <div class="vfit-video-cues"><h4>Watch the rhythm before you start.</h4><ul>${cues.map(c=>`<li>${c}</li>`).join('')}</ul><div class="vfit-rep-bar"><span></span></div><p style="color:#94a3b8;margin-top:14px;font-size:13px;line-height:1.45">This replaces the broken YouTube embed so clients never see “video unavailable.” Add your own recorded VFitness clips later and this same button can open them.</p></div>
        </div>
      </div>`;
    modal.addEventListener('click', e=>{ if(e.target===modal || e.target.closest('.vfit-video-top button')) modal.remove(); });
    document.body.appendChild(modal);
  }

  function setupVideoInterceptor(){
    document.addEventListener('click', function(e){
      const btn=e.target.closest('button');
      if(!btn) return;
      const label=clean(btn.textContent).toLowerCase();
      const isExerciseVideo = false; /* exercise videos now play in the app player */
      if(isExerciseVideo){
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        showFormVideo(getExerciseName(btn));
      }
    }, true);
  }

  function modalSource(){
    const dialogs = $$('[class*="fixed"], [role="dialog"], .modal, [class*="z-"]').filter(el=>{
      const t=text(el); return t.includes('Mark Complete') || t.includes('Meal Plan') || t.includes('Calories') || t.includes('Breakfast');
    });
    return dialogs[dialogs.length-1] || null;
  }

  function addDownloadButtons(){
    const src=modalSource();
    if(!src || src.querySelector('.vfit-download-row')) return;
    const t=text(src);
    if(!(t.includes('Meal Plan') || t.includes('Mark Complete') || t.includes('Calories') || t.includes('Breakfast'))) return;
    const row=document.createElement('div'); row.className='vfit-download-row';
    if(t.includes('Mark Complete')){
      row.innerHTML='<button type="button" data-vfit-pdf="workout">⬇ Download Workout PDF</button><button type="button" data-vfit-ai="open">Ask VFitness Coach</button>';
    }else{
      row.innerHTML='<button type="button" data-vfit-pdf="meal">⬇ Download Meal Plan PDF</button><button type="button" data-vfit-reminders="open">Enable Email Reminders</button>';
    }
    const head=$('h1,h2,h3',src) || src.firstElementChild;
    if(head && head.parentElement) head.insertAdjacentElement('afterend',row); else src.prepend(row);
  }

  function addProgramCommand(){
    const allText=clean(document.body.innerText);
    const isProgramPage = allText.includes('Program Library') || allText.includes('Online Training Programs') || allText.includes('HOME 30') || allText.includes('HOURGLASS');
    if(!isProgramPage || $('.vfit-program-command')) return;
    const anchor=[...document.querySelectorAll('h1,h2')].find(h=>/Program Library|Online Training Programs|Programs/i.test(text(h)));
    if(!anchor) return;
    const card=document.createElement('section');
    card.className='vfit-program-command';
    card.innerHTML=`<h3>Pick the plan. Press start. Let the app coach the rest.</h3><p>The online programs should feel like a training cockpit, not a document you have to figure out. Your workout, meal plan, videos, PDF downloads, reminders, and coach assistant are now pulled into one place.</p><div class="vfit-program-pill-row"><span class="vfit-program-pill">Workout PDF</span><span class="vfit-program-pill">Meal PDF</span><span class="vfit-program-pill">Form video guide</span><span class="vfit-program-pill">Email reminders</span><span class="vfit-program-pill">AI Coach help</span></div><div class="vfit-program-actions"><button class="vfit-digital-btn primary" data-vfit-ai="open">Ask VFitness Coach</button><button class="vfit-digital-btn green" data-vfit-reminders="open">Enable streak reminders</button></div>`;
    anchor.parentElement.insertAdjacentElement('afterend',card);
  }

  function openAICoach(seed){
    let box=$('.vfit-ai-coach');
    if(!box){
      box=document.createElement('div'); box.className='vfit-ai-coach';
      box.innerHTML=`<div class="vfit-ai-card"><div class="vfit-ai-head"><div><span>VFITNESS ASSISTANT</span><strong>Program Navigator</strong></div><button class="vfit-digital-btn" style="padding:8px 11px" data-vfit-ai-close>×</button></div><div class="vfit-ai-body"><div class="vfit-ai-log">${seed || 'Tell me what part of the workout you are stuck on. I’ll keep it simple: what to do now, what to skip if needed, and how to finish today without overthinking.'}</div><div class="vfit-ai-chat"><input placeholder="Ask: what do I do next?"><button>Ask</button></div></div></div>`;
      document.body.appendChild(box);
      box.querySelector('[data-vfit-ai-close]').onclick=()=>box.classList.remove('open');
      const input=box.querySelector('input'); const send=box.querySelector('.vfit-ai-chat button');
      const answer=()=>{
        const q=clean(input.value).toLowerCase(); let a='Start with the first listed exercise. Use the recommended weight only if your form looks clean. If form breaks, reduce the weight and finish the reps. The goal today is completion, not guessing.';
        if(q.includes('meal')||q.includes('eat')||q.includes('food')) a='Hit protein first, then carbs around training. For fat loss, do not starve all day and then fight cravings at night. Eat the meals shown, drink water, and keep one honest check in note.';
        else if(q.includes('tired')||q.includes('skip')) a='Do the shorter version: one warm up set, then two solid working sets for each movement. Mark it complete only when the work is actually done. A clean 70% day beats quitting.';
        else if(q.includes('weight')||q.includes('heavy')) a='Use the recommended weight as a starting point, not an ego test. If the last 2 reps are hard but clean, keep it. If you twist, bounce, or rush, drop it.';
        else if(q.includes('video')||q.includes('form')) a='Tap the red Video button beside the exercise. Watch the rhythm once, then copy the tempo: control down, pause where the cue says, finish strong.';
        box.querySelector('.vfit-ai-log').innerHTML += `<div style="margin-top:12px;padding:12px;border-radius:14px;background:rgba(255,255,255,.06)"><b>You:</b> ${input.value || 'What do I do next?'}</div><div style="margin-top:8px;padding:12px;border-radius:14px;background:rgba(61,125,255,.12);border:1px solid rgba(61,125,255,.20)"><b>Coach:</b> ${a}</div>`;
        input.value=''; box.querySelector('.vfit-ai-body').scrollTop=9999;
      };
      send.onclick=answer; input.addEventListener('keydown',e=>{if(e.key==='Enter') answer();});
    }
    box.classList.add('open');
  }

  function setupAI(){
    if(!$('.vfit-ai-fab')){
      const b=document.createElement('button'); b.className='vfit-ai-fab'; b.textContent='Ask Coach'; b.setAttribute('data-vfit-ai','open'); document.body.appendChild(b);
    }
    document.addEventListener('click',e=>{
      const ai=e.target.closest('[data-vfit-ai]'); if(ai){e.preventDefault(); openAICoach();}
    });
  }

  async function sendReminderEmail(){
    const email = (typeof auth!=='undefined' && auth.currentUser && auth.currentUser.email) || localStorage.getItem('vfitReminderEmail') || prompt('What email should receive workout reminders?');
    if(!email){toast('Add an email first.'); return;}
    localStorage.setItem('vfitReminderEmail', email);
    localStorage.setItem('vfitStreakReminders','on');
    try{
      if(typeof emailjs!=='undefined' && typeof EMAILJS_SERVICE_ID!=='undefined' && typeof EMAILJS_TEMPLATE_ID!=='undefined'){
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {to_email:email,to_name:'VFitness Client',subject:'Your VFITNESS workout is waiting',message:'Quick reminder: open your program, finish today’s workout, and keep your streak alive. Do not overthink the whole plan. Just complete the next workout.'});
        toast('Reminder email sent and streak reminders turned on.');
      }else{
        toast('Reminders saved. Email service needs to be configured for live sending.');
      }
    }catch(err){toast('Reminder saved. Email sending was blocked by the browser or email service.');}
  }

  function addReminderPanel(){
    const src=modalSource(); if(!src || src.querySelector('.vfit-reminder-panel')) return;
    const t=text(src); if(!(t.includes('Meal Plan') || t.includes('Mark Complete') || t.includes('HOURGLASS'))) return;
    const panel=document.createElement('div'); panel.className='vfit-reminder-panel';
    panel.innerHTML='<strong>Keep the streak simple.</strong><br>Get a reminder when you are drifting, not after you already fell off.<br><button type="button" data-vfit-reminders="open">Turn on email reminders</button>';
    src.appendChild(panel);
  }

  function setupDownloadAndReminders(){
    document.addEventListener('click',e=>{
      const pdf=e.target.closest('[data-vfit-pdf]');
      if(pdf){ e.preventDefault(); downloadPlan(pdf.getAttribute('data-vfit-pdf')==='meal'?'Meal Plan':'Workout Plan', modalSource()||document.body); }
      const rem=e.target.closest('[data-vfit-reminders]');
      if(rem){ e.preventDefault(); sendReminderEmail(); }
      const mark=e.target.closest('button');
      if(mark && clean(mark.textContent).toLowerCase().includes('mark complete')){
        setTimeout(()=>{ if(localStorage.getItem('vfitStreakReminders')==='on') sendReminderEmail(); }, 700);
      }
    });
  }

  function upgradeCopy(){
    const replacements={
      'Video unavailable':'Form guide loading',
      'This video is unavailable':'This movement guide is loading. Close and tap Video again if your connection is slow.',
      'Add transformation photos in Admin Gallery to feature them here.':'Real transformation results are loading for you.',
      'Browse every VFITNESS program by goal and level.':'Pick the plan that matches where you are right now. No guessing, no scrolling for ten minutes.',
      'No invoices available yet.':'Your invoices will show here once a package or program is assigned.',
      'Download invoices linked to your assigned packages.':'Keep your receipts and package history in one place.'
    };
    const walker=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()){const current=walker.currentNode;const parent=current&&current.parentElement;if(parent&&parent.closest('script,style,noscript,template'))continue;nodes.push(current);}
    nodes.forEach(n=>{let v=n.nodeValue; Object.entries(replacements).forEach(([a,b])=>{ if(v && v.includes(a)) v=v.replaceAll(a,b); }); n.nodeValue=v;});
  }

  function scan(){
    addProgramCommand(); addDownloadButtons(); addReminderPanel(); upgradeCopy();
  }
  setupVideoInterceptor(); setupAI(); setupDownloadAndReminders();
  window.addEventListener('vf:ui-rendered',()=>setTimeout(scan,120));
  window.addEventListener('load',()=>{scan(); setTimeout(scan,1000); setTimeout(scan,2500);});
  scan();
})();
