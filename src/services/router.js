/* VFITNESS route service for public pages, program store, and protected training views. */
(function(global){
  'use strict';

  const pagePaths={
    home:'/',
    starthere:'/start',
    login:'/login',
    signup:'/signup',
    workoutprograms:'/programs',
    pricing:'/pricing',
    results:'/results',
    trainers:'/trainers',
    contact:'/contact',
    locations:'/locations',
    library:'/library',
    about:'/about',
    onlinecoaching:'/online-coaching',
    assessment:'/assessment',
    dashboard:'/dashboard',
    admin:'/admin'
  };

  function cleanPath(path){
    path=String(path||'/').split('?')[0].split('#')[0];
    if(path.length>1)path=path.replace(/\/+$/,'');
    return path||'/';
  }

  function parse(path){
    path=cleanPath(path||global.location.pathname);
    let match=path.match(/^\/programs\/([^/]+)$/i);
    if(match)return {path:path,page:'workoutprograms',tab:'all',programSlug:decodeURIComponent(match[1])};
    match=path.match(/^\/program\/([^/]+)$/i);
    if(match)return {path:path,page:'workoutprograms',tab:'purchased',enrollmentId:decodeURIComponent(match[1]),protected:true};
    if(path==='/my-programs')return {path:path,page:'workoutprograms',tab:'purchased',protected:true};
    const aliases={
      '/':'home','/home':'home','/start':'starthere','/starthere':'starthere','/register':'starthere','/join':'starthere','/apply':'starthere',
      '/login':'login','/signup':'signup','/programs':'workoutprograms','/training-programs':'workoutprograms','/online-programs':'workoutprograms',
      '/pricing':'pricing','/results':'results','/trainers':'trainers','/contact':'contact','/locations':'locations','/library':'library','/about':'about',
      '/online-coaching':'onlinecoaching','/assessment':'assessment','/dashboard':'dashboard','/admin':'admin'
    };
    return {path:path,page:aliases[path]||'home',tab:path==='/programs'?'all':null};
  }

  function current(){return parse(global.location.pathname);}
  function pageFromLocation(){return current().page;}
  function tabFromLocation(){return current().tab||'all';}
  function enrollmentFromLocation(){return current().enrollmentId||null;}
  function programSlugFromLocation(){return current().programSlug||null;}

  function emit(route){
    const detail=route||current();
    global.dispatchEvent(new CustomEvent('vf:routechange',{detail:detail}));
    setTimeout(function(){global.dispatchEvent(new CustomEvent('vf:ui-rendered',{detail:detail}));},0);
  }

  function navigate(path,options){
    options=options||{};
    const next=cleanPath(path);
    if(cleanPath(global.location.pathname)!==next){
      global.history[options.replace?'replaceState':'pushState']({vf:true},'',next);
    }
    const route=parse(next);
    if(route.programSlug){
      try{global.sessionStorage.setItem('vfit_focus_program',route.programSlug);}catch(_){ }
    }
    emit(route);
    return route;
  }

  function syncPage(page,options){
    options=options||{};
    const route=current();
    if(page==='workoutprograms'&&(/^\/program(?:s)?\//.test(route.path)||route.path==='/programs'||route.path==='/my-programs'))return route;
    const path=pagePaths[page]||'/';
    if(cleanPath(global.location.pathname)===path)return route;
    return navigate(path,{replace:!!options.replace});
  }

  function openProgram(enrollmentId){return navigate('/program/'+encodeURIComponent(enrollmentId));}
  function openStore(slug){return navigate(slug?'/programs/'+encodeURIComponent(slug):'/programs');}
  function openMyPrograms(){return navigate('/my-programs');}

  global.addEventListener('popstate',function(){emit(current());});

  const initial=current();
  if(initial.programSlug){
    try{global.sessionStorage.setItem('vfit_focus_program',initial.programSlug);}catch(_){ }
  }

  global.VFitnessRouter={
    parse:parse,
    current:current,
    pageFromLocation:pageFromLocation,
    tabFromLocation:tabFromLocation,
    enrollmentFromLocation:enrollmentFromLocation,
    programSlugFromLocation:programSlugFromLocation,
    navigate:navigate,
    syncPage:syncPage,
    openProgram:openProgram,
    openStore:openStore,
    openMyPrograms:openMyPrograms,
    emit:emit
  };
})(window);
