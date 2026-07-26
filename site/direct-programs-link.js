(function(){
  var path=(window.location.pathname||'/').replace(/\/+$/,'')||'/';
  if(path!=='/programs'&&path!=='/training-programs'&&path!=='/online-programs')return;

  var attempts=0;
  var menuOpened=false;
  var maxAttempts=80;

  function text(el){
    return String((el&&el.textContent)||'').replace(/\s+/g,' ').trim();
  }

  function visible(el){
    if(!el)return false;
    var r=el.getBoundingClientRect();
    var s=window.getComputedStyle(el);
    return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden';
  }

  function findProgramsControl(){
    var nodes=[].slice.call(document.querySelectorAll('button,a,[role="button"]')).filter(visible);
    return nodes.find(function(el){
      return /^(programs|training programs|online programs|view programs|browse programs|workout programs)$/i.test(text(el));
    })||nodes.find(function(el){
      var t=text(el);
      return /program/i.test(t)&&!/application|workout history|program notes|assigned program|my program/i.test(t);
    });
  }

  function findMenuControl(){
    var nodes=[].slice.call(document.querySelectorAll('button,[role="button"]')).filter(visible);
    return nodes.find(function(el){
      var label=[el.getAttribute('aria-label'),el.getAttribute('title'),text(el)].filter(Boolean).join(' ');
      return /menu|navigation|open menu/i.test(label);
    })||nodes.find(function(el){
      var svg=el.querySelector('svg');
      if(!svg)return false;
      var lines=svg.querySelectorAll('line,path').length;
      var r=el.getBoundingClientRect();
      return lines>=2&&r.width<=90&&r.height<=90&&r.top<180&&r.left>window.innerWidth*0.55;
    });
  }

  function tryOpenPrograms(){
    attempts++;

    var programs=findProgramsControl();
    if(programs){
      programs.click();
      return;
    }

    if(!menuOpened&&attempts>=3){
      var menu=findMenuControl();
      if(menu){
        menuOpened=true;
        menu.click();
        setTimeout(tryOpenPrograms,250);
        return;
      }
    }

    if(attempts<maxAttempts)setTimeout(tryOpenPrograms,250);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){setTimeout(tryOpenPrograms,500);},{once:true});
  }else{
    setTimeout(tryOpenPrograms,500);
  }
})();