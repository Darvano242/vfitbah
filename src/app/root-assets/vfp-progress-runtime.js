/* VFITNESS Programs progress normalization — no DOM observers, no Firebase writes. */
(function(){
  if(window.__VFP_PROGRESS_RUNTIME__)return;
  window.__VFP_PROGRESS_RUNTIME__=true;

  function pctValue(value){
    var n=Number(value||0);
    return Math.max(0,Math.min(100,Number.isFinite(n)?n:0));
  }

  window.VFPProgramData=function(program,enrollment){
    var weeks=(program&&program.weeklyPlans)||[];
    var uniqueCompleted=Array.from(new Set(((enrollment&&enrollment.completedWorkouts)||[]).map(function(x){return String(x);}))); 
    var total=weeks.reduce(function(sum,w){return sum+((((w||{}).workouts)||[]).length);},0)||1;
    var pct=Math.min(100,Math.round(uniqueCompleted.length/total*100));
    var storedWeek=Math.max(1,Math.min(Number(enrollment&&enrollment.currentWeek)||1,weeks.length||1));
    var firstOpenIndex=weeks.findIndex(function(w,wi){
      var count=(((w||{}).workouts)||[]).length;
      if(!count)return false;
      var done=uniqueCompleted.filter(function(key){return key.indexOf('week'+(wi+1)+'-')===0;}).length;
      return done<count;
    });
    var inferredWeek=firstOpenIndex>=0?firstOpenIndex+1:(weeks.length||1);
    var week=pct>=100?(weeks.length||1):Math.max(storedWeek,Math.min(inferredWeek,weeks.length||1));
    var currentWorkouts=(((weeks[week-1]||{}).workouts)||[]);
    var completedThisWeek=uniqueCompleted.filter(function(key){return key.indexOf('week'+week+'-')===0;});
    return{
      weeks:weeks,
      total:total,
      completed:uniqueCompleted,
      pct:pct,
      week:week,
      remaining:Math.max(0,total-uniqueCompleted.length),
      currentWorkouts:currentWorkouts,
      thisWeek:completedThisWeek.length,
      perWeek:currentWorkouts.length,
      derivedStatus:pct>=100?'completed':uniqueCompleted.length?'active':'not_started'
    };
  };

  window.VFPProgress=function(props){
    var pct=pctValue(props&&props.pct);
    var label=(props&&props.label)||'Progress';
    return React.createElement('div',{className:'vfp-progress-wrap',style:{'--vfp-progress':String(pct/100)}},
      React.createElement('div',{className:'vfp-progress-meta'},
        React.createElement('span',null,label),
        React.createElement('strong',null,Math.round(pct)+'%')
      ),
      React.createElement('div',{className:'vfp-progress','aria-label':label+' '+Math.round(pct)+' percent'},React.createElement('span',null))
    );
  };

  if(typeof window.VFPProgramLibrary==='function'){
    var OriginalProgramLibrary=window.VFPProgramLibrary;
    window.VFPProgramLibrary=function(props){
      props=props||{};
      var staticPrograms=[];
      ['HOME_30DAY_PROGRAM','FLEX_MASTER_PROGRAM','HOURGLASS_PROGRAM','SIXPACK_PROGRAM','BOOTY_CAMP_PROGRAM','MASS_MONSTER_PROGRAM','IRON_BEAST_PROGRAM','SHRED42_PROGRAM','FOUNDATION_PROGRAM','ATHLETE_ENGINE_PROGRAM','STRONG40_PROGRAM','UPPER_ARMOR_PROGRAM'].forEach(function(name){
        try{if(window[name])staticPrograms.push(window[name]);}catch(e){}
      });
      var allPrograms=staticPrograms.concat(props.customPrograms||[]);
      var normalized=(props.enrollments||[]).map(function(enrollment){
        var program=allPrograms.find(function(p){return p&&p.id===enrollment.programId;});
        if(!program)return enrollment;
        var data=window.VFPProgramData(program,enrollment);
        return Object.assign({},enrollment,{status:data.pct>=100?'completed':enrollment.status,__vfpPct:data.pct});
      });
      var hasActive=normalized.some(function(e){return e.status==='active'&&Number(e.__vfpPct||0)<100;});
      if(!hasActive){
        var candidate=normalized.findIndex(function(e){return e.status!=='completed'&&Number(e.__vfpPct||0)<100;});
        if(candidate>=0)normalized[candidate]=Object.assign({},normalized[candidate],{status:'active'});
      }
      return React.createElement(OriginalProgramLibrary,Object.assign({},props,{enrollments:normalized}));
    };
  }
})();
