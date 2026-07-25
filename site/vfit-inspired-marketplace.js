/* Safe visual enhancement only: no Firebase, auth, purchases, prices, or program data changed. */
(function(){
  function text(el){return String((el&&el.innerText)||'').trim();}
  function isProgramsView(){var t=text(document.body).toLowerCase();return /training programs|online programs|program library|choose your program|purchased programs/.test(t);}
  function clickStartHere(){var els=[].slice.call(document.querySelectorAll('button,a'));var target=els.find(function(e){return /start here|find my program|program selector/i.test(text(e));});if(target){target.click();return;}try{localStorage.setItem('vf_lead_goal','');}catch(e){}window.scrollTo(0,0);}
  function addIntro(root){if(document.querySelector('.vf-marketplace-hero'))return;var heading=[].slice.call(root.querySelectorAll('h1,h2')).find(function(e){return /program/i.test(text(e));});if(!heading)return;var hero=document.createElement('section');hero.className='vf-marketplace-hero';hero.innerHTML='<div><small>VFITNESS PROGRAM FINDER</small><strong>Not sure which plan fits your goal?</strong><p>Match your goal, experience, schedule, and equipment to the right VFITNESS training system.</p></div><button type="button">Find My Program</button>';hero.querySelector('button').addEventListener('click',clickStartHere);var anchor=heading.closest('section,div')||heading;anchor.parentNode.insertBefore(hero,anchor.nextSibling);
    var strip=document.createElement('section');strip.className='vf-science-strip';strip.innerHTML='<div><b>Evidence-led structure</b><span>Clear progression, prescribed sets, reps, and recovery.</span></div><div><b>Goal-specific design</b><span>Programs organized around physique, strength, fat loss, and performance.</span></div><div><b>Built from coaching</b><span>Practical systems shaped by real VFITNESS client work.</span></div>';hero.parentNode.insertBefore(strip,hero.nextSibling);
  }
  function findCards(root){
    var out=[];var seen=new Set();
    [].slice.call(root.querySelectorAll('img')).forEach(function(img){
      var p=img.parentElement;for(var i=0;i<5&&p;i++,p=p.parentElement){var tx=text(p);if(tx.length>25&&tx.length<900&&p.querySelector('button,a')&&/program|week|workout|purchase|start|view/i.test(tx)){if(!seen.has(p)){seen.add(p);out.push(p);}break;}}
    });return out;
  }
  function decorateCard(card,index){if(card.dataset.vfPremium==='1')return;card.dataset.vfPremium='1';card.classList.add('vf-premium-program-card');var parent=card.parentElement;if(parent&&parent.children.length>1)parent.classList.add('vf-card-row');
    var title=[].slice.call(card.querySelectorAll('h1,h2,h3,h4,strong')).find(function(e){return text(e).length>3;});
    var meta=document.createElement('div');meta.className='vf-program-meta-row';var body=text(card).toLowerCase();var level=/advanced/.test(body)?'Advanced':/beginner/.test(body)?'Beginner':'All Levels';var weeks=(body.match(/\b\d+\s*[- ]?week/i)||[])[0]||'Structured Plan';meta.innerHTML='<span>'+weeks+'</span><b>'+level+'</b>';var meter=document.createElement('div');meter.className='vf-level-meter';var n=level==='Beginner'?1:level==='Advanced'?3:2;meter.innerHTML='<i class="on"></i><i class="'+(n>1?'on':'')+'"></i><i class="'+(n>2?'on':'')+'"></i>';
    var target=title&&title.parentElement?title.parentElement:card;target.appendChild(meta);target.appendChild(meter);
  }
  function enhance(){if(!isProgramsView())return;var root=document.querySelector('#root')||document.body;root.classList.add('vf-programs-enhanced');addIntro(root);findCards(root).slice(0,30).forEach(decorateCard);}
  var timer;function queue(){clearTimeout(timer);timer=setTimeout(enhance,180);}document.addEventListener('DOMContentLoaded',queue);window.addEventListener('load',queue);new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});setInterval(enhance,1800);
})();
