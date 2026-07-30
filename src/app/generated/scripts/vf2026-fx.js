/* Captured from the verified VFitness production shell. */
(function(){
'use strict';
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============ DEPTH FIELD, island light on a midnight floor ============ */
var cv=document.getElementById('vf-depthfield');
if(cv&&cv.getContext){
  var ctx=cv.getContext('2d',{alpha:false});
  var W=0,H=0,DPR=Math.min(window.devicePixelRatio||1,2);
  var mobile=Math.min(window.innerWidth,window.innerHeight)<720;
  var COUNT=mobile?42:110, LINK=mobile?90:130;
  var px=0.5,py=0.35,tx=0.5,ty=0.35,scrollP=0;
  var parts=[],auroras=[
    {x:.78,y:.16,r:.62,hue:'61,125,255',sp:.00016,ph:0},
    {x:.14,y:.72,r:.55,hue:'45,212,191',sp:.00021,ph:2.1},
    {x:.5,y:1.05,r:.7,hue:'111,91,255',sp:.00013,ph:4.2}
  ];
  function resize(){
    W=window.innerWidth;H=window.innerHeight;
    cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  function seed(){
    parts=[];
    for(var i=0;i<COUNT;i++){
      var z=Math.random(); /* 0 far … 1 near */
      parts.push({x:Math.random()*W,y:Math.random()*H,z:z,
        vx:(Math.random()-.5)*(.08+z*.22),vy:(Math.random()-.5)*(.08+z*.22),
        r:.6+z*1.9,tw:Math.random()*6.28});
    }
  }
  window.addEventListener('resize',function(){resize();seed();},{passive:true});
  window.addEventListener('pointermove',function(e){tx=e.clientX/Math.max(1,W);ty=e.clientY/Math.max(1,H);},{passive:true});
  window.addEventListener('scroll',function(){scrollP=window.scrollY*0.03;},{passive:true});
  resize();seed();

  var last=0;
  function frame(t){
    if(document.hidden){requestAnimationFrame(frame);return;}
    if(t-last<1000/45){requestAnimationFrame(frame);return;} last=t;
    px+=(tx-px)*.035; py+=(ty-py)*.035;
    /* floor */
    var g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#05070B'); g.addColorStop(1,'#070b12');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    /* aurora light volumes */
    for(var a=0;a<auroras.length;a++){
      var A=auroras[a];
      var ax=(A.x+Math.sin(t*A.sp+A.ph)*.06+(px-.5)*.05)*W;
      var ay=(A.y+Math.cos(t*A.sp*.8+A.ph)*.05+(py-.5)*.05)*H - scrollP*(a+1)*1.2;
      var ar=A.r*Math.max(W,H)*(1+Math.sin(t*A.sp*1.7+A.ph)*.07);
      var rg=ctx.createRadialGradient(ax,ay,0,ax,ay,ar);
      rg.addColorStop(0,'rgba('+A.hue+',0.10)');
      rg.addColorStop(.5,'rgba('+A.hue+',0.035)');
      rg.addColorStop(1,'rgba('+A.hue+',0)');
      ctx.fillStyle=rg; ctx.fillRect(0,0,W,H);
    }
    if(!reduce){
      /* constellation with depth parallax */
      var ox=(px-.5)*40, oy=(py-.5)*28;
      for(var i=0;i<parts.length;i++){
        var p=parts[i];
        p.x+=p.vx; p.y+=p.vy; p.tw+=.02+p.z*.02;
        if(p.x<-20)p.x=W+20; if(p.x>W+20)p.x=-20;
        if(p.y<-20)p.y=H+20; if(p.y>H+20)p.y=-20;
        p.sx=p.x+ox*p.z; p.sy=p.y+oy*p.z-scrollP*p.z*2.4;
      }
      ctx.lineWidth=1;
      for(var i=0;i<parts.length;i++){
        var p=parts[i];
        for(var j=i+1;j<parts.length;j++){
          var q=parts[j];
          var dx=p.sx-q.sx, dy=p.sy-q.sy;
          if(dx>LINK||dx<-LINK||dy>LINK||dy<-LINK)continue;
          var d2=dx*dx+dy*dy;
          if(d2<LINK*LINK){
            var al=(1-Math.sqrt(d2)/LINK)*.09*Math.min(p.z,q.z);
            ctx.strokeStyle='rgba(120,165,255,'+al.toFixed(3)+')';
            ctx.beginPath();ctx.moveTo(p.sx,p.sy);ctx.lineTo(q.sx,q.sy);ctx.stroke();
          }
        }
      }
      for(var i=0;i<parts.length;i++){
        var p=parts[i];
        var tw=.45+Math.sin(p.tw)*.3;
        ctx.fillStyle='rgba(150,190,255,'+(tw*(.25+p.z*.5)).toFixed(3)+')';
        ctx.beginPath();ctx.arc(p.sx,p.sy,p.r,0,6.283);ctx.fill();
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ============ 3D card tilt (fine pointers only) ============ */
if(!reduce&&window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  var MAXT=7;
  document.addEventListener('pointermove',function(e){
    var card=e.target&&e.target.closest?e.target.closest('.mu-program-card'):null;
    if(!card)return;
    var r=card.getBoundingClientRect();
    var mx=(e.clientX-r.left)/r.width, my=(e.clientY-r.top)/r.height;
    card.style.transform='perspective(900px) rotateX('+((.5-my)*MAXT).toFixed(2)+'deg) rotateY('+((mx-.5)*MAXT).toFixed(2)+'deg) translateY(-3px)';
    var gl=card.querySelector('.vf-glare');
    if(!gl){gl=document.createElement('div');gl.className='vf-glare';card.appendChild(gl);}
    gl.style.setProperty('--gx',(mx*100).toFixed(1)+'%');
    gl.style.setProperty('--gy',(my*100).toFixed(1)+'%');
  },{passive:true});
  document.addEventListener('pointerout',function(e){
    var card=e.target&&e.target.closest?e.target.closest('.mu-program-card'):null;
    if(card&&(!e.relatedTarget||!card.contains(e.relatedTarget)))card.style.transform='';
  },{passive:true});
}

/* ============ Scroll reveal (progressive, SPA-aware) ============ */
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){
    es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('vf-in');io.unobserve(en.target);}});
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  var mark=function(){
    var els=document.querySelectorAll('.mu-program-card:not(.vf-reveal), section h1:not(.vf-reveal), section h2:not(.vf-reveal), .mu-band:not(.vf-reveal)');
    for(var i=0;i<els.length;i++){els[i].classList.add('vf-reveal');io.observe(els[i]);}
  };
  mark();
  window.addEventListener('vf:ui-rendered',()=>setTimeout(mark,300));
}
})();
