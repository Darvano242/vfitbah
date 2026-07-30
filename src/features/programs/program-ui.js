/* Stable VFITNESS Programs components. Loaded after the legacy component file and used as the authoritative UI. */
(function(global){
  'use strict';
  if(!global.React)return;
  const h=global.React.createElement;
  const Core=global.VFitnessProgramCore;

  function title(value){try{return typeof cleanTitle==='function'?cleanTitle(value):String(value||'');}catch(_){return String(value||'');}}
  function allPrograms(custom){
    const list=[];
    ['HOME_30DAY_PROGRAM','FLEX_MASTER_PROGRAM','HOURGLASS_PROGRAM','SIXPACK_PROGRAM','BOOTY_CAMP_PROGRAM','MASS_MONSTER_PROGRAM','IRON_BEAST_PROGRAM','SHRED42_PROGRAM','FOUNDATION_PROGRAM','ATHLETE_ENGINE_PROGRAM','STRONG40_PROGRAM','UPPER_ARMOR_PROGRAM'].forEach(function(name){try{if(global[name])list.push(global[name]);else if(typeof eval(name)!=='undefined')list.push(eval(name));}catch(_){ }});
    return list.concat(custom||[]);
  }
  function programArt(program){try{return PROGRAM_ART[program.id]||program.image||PROGRAM_ART._default;}catch(_){return program&&program.image||'/scene-programs.jpg';}}
  function VFPProgramData(program,enrollment){
    if(Core)return Core.derive(program,enrollment||{});
    const weeks=(program&&program.weeklyPlans)||[];
    const completed=Array.from(new Set(((enrollment&&enrollment.completedWorkouts)||[]).map(String)));
    const total=weeks.reduce(function(sum,w){return sum+((((w||{}).workouts)||[]).length);},0)||1;
    const currentWeek=Math.max(1,Math.min(Number(enrollment&&enrollment.currentWeek)||1,weeks.length||1));
    const currentWorkouts=(((weeks[currentWeek-1]||weeks[0]||{}).workouts)||[]);
    const thisWeek=completed.filter(function(x){return x.indexOf('week'+currentWeek+'-')===0;}).length;
    const pct=Math.min(100,Math.round(completed.length/total*100));
    return {weeks:weeks.length,total:total,completed:completed,pct:pct,currentWeek:currentWeek,week:currentWeek,remaining:Math.max(0,total-completed.length),currentWorkouts:currentWorkouts,thisWeek:thisWeek,perWeek:currentWorkouts.length,status:pct>=100?'completed':completed.length?'active':'not_started'};
  }
  function VFPProgress(props){
    const pct=Math.max(0,Math.min(100,Number(props&&props.pct)||0));
    return h('div',{className:'vfp-progress','aria-label':(props&&props.label||'Program progress')+' '+Math.round(pct)+' percent'},h('span',{style:{width:pct+'%'}}));
  }
  function VFPModal(props){return h('div',{className:'vfp-modal vfp-shell'},h('div',{className:'vfp-modal-body vfp-fade'},h('div',{className:'flex justify-between items-center gap-3 mb-5'},h('h2',{className:'text-2xl font-black'},props.title),h('button',{className:'vfp-btn vfp-secondary',onClick:props.onClose},'Close')),props.children));}

  function VFPProgramLibrary(props){
    const enrollments=props.enrollments||[];
    const programs=allPrograms(props.customPrograms);
    const programFor=function(enrollment){return programs.find(function(program){return program&&program.id===enrollment.programId;});};
    const purchases=[...enrollments].sort(function(a,b){const at=a.purchaseDate&&a.purchaseDate.toDate?a.purchaseDate.toDate().getTime():0;const bt=b.purchaseDate&&b.purchaseDate.toDate?b.purchaseDate.toDate().getTime():0;return bt-at;}).map(function(enrollment){const program=programFor(enrollment);return program?{e:enrollment,p:program,d:VFPProgramData(program,enrollment)}:null;}).filter(Boolean);

    global.React.useEffect(function(){
      if(!Core)return;
      purchases.forEach(function(item){
        if(item.d.status==='completed'&&item.e.status!=='completed')Core.synchronizeStatus({program:item.p,enrollment:item.e}).catch(function(error){try{global.VFitnessDiagnostics.capture({type:'program_status_sync',message:error.message,programId:item.p.id,enrollmentId:item.e.id});}catch(_){ }});
      });
    },[enrollments]);

    if(!purchases.length)return h('div',{className:'vfp-shell vfp-card text-center p-10'},h('h3',{className:'text-2xl font-black mb-2'},'No programs yet'),h('p',{className:'text-gray-400 mb-6'},'Choose the program that matches your goal and start inside your dashboard.'),h('button',{className:'vfp-btn vfp-primary',onClick:props.onBrowse},'Browse Programs'));

    const active=purchases.find(function(x){return x.d.status!=='completed'&&x.e.status==='active';})||purchases.find(function(x){return x.d.status!=='completed';})||null;
    const completed=purchases.filter(function(x){return x.d.status==='completed';});
    const otherActive=purchases.filter(function(x){return x!==active&&x.d.status!=='completed';});

    const compact=function(item){
      const complete=item.d.status==='completed';
      const buttonLabel=complete?'Review Program':item.d.completed.length?'Continue':'Start Program';
      return h('article',{key:item.e.id,className:'vfp-card vfp-compact','data-interactive':'true'},
        h('img',{className:'vfp-thumb',src:programArt(item.p),alt:''}),
        h('div',{className:'min-w-0'},
          h('div',{className:'flex gap-2 items-center flex-wrap'},h('h4',{className:'font-black'},title(item.p.title)),h('span',{className:'vfp-status '+(complete?'done':'')},complete?'Completed':'Week '+item.d.currentWeek)),
          h('div',{className:'text-xs text-gray-500 mt-1 mb-2'},item.d.completed.length+' of '+item.d.total+' workouts'),
          h(VFPProgress,{pct:item.d.pct})
        ),
        h('button',{className:'vfp-btn '+(complete?'vfp-secondary':'vfp-primary')+' vfp-compact-action',onClick:function(){props.onOpen(item.e);}},buttonLabel)
      );
    };

    const activeSection=active?h('section',{className:'vfp-active rounded-[28px] p-6 sm:p-8'},
      h('div',{className:'relative z-10'},
        h('div',{className:'flex flex-wrap gap-2 mb-4'},h('span',{className:'vfp-status current'},'Current'),h('span',{className:'vfp-status'},'Week '+active.d.currentWeek+' of '+active.d.weeks)),
        h('h2',{className:'text-3xl sm:text-5xl font-black mb-3'},title(active.p.title)),
        h('div',{className:'vfp-progress-summary'},h('strong',null,active.d.pct+'% Complete'),h('span',null,active.d.completed.length+' of '+active.d.total+' workouts · '+active.d.remaining+' remaining'),h(VFPProgress,{pct:active.d.pct,label:'Program progress'})),
        h('div',{className:'grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5'},[['This week',active.d.thisWeek+' / '+active.d.perWeek],['Current week',active.d.currentWeek+' / '+active.d.weeks],['Status','Active']].map(function(metric){return h('div',{key:metric[0],className:'py-2'},h('div',{className:'text-xs text-gray-500'},metric[0]),h('div',{className:'font-black mt-1'},metric[1]));})),
        h('button',{className:'vfp-btn vfp-primary mt-5',onClick:function(){props.onOpen(active.e);}},'Continue Program')
      )
    ):h('section',{className:'vfp-active rounded-[28px] p-6 sm:p-8'},
      h('span',{className:'vfp-status done'},'Training History'),
      h('h2',{className:'text-3xl sm:text-5xl font-black mt-4 mb-3'},'All purchased programs are complete.'),
      h('p',{className:'text-gray-400'},'Review any completed program below or choose your next phase.'),
      h('button',{className:'vfp-btn vfp-primary mt-5',onClick:props.onBrowse},'Browse Next Program')
    );

    return h('div',{className:'vfp-shell space-y-8'},
      activeSection,
      otherActive.length?h('section',null,h('div',{className:'flex justify-between items-end mb-3'},h('h3',{className:'text-xl font-black'},'Other Programs'),h('span',{className:'text-sm text-gray-500'},otherActive.length)),h('div',{className:'vfp-library'},otherActive.map(compact))):null,
      completed.length?h('section',null,h('div',{className:'flex justify-between items-end mb-3'},h('h3',{className:'text-xl font-black'},'Completed'),h('span',{className:'text-sm text-gray-500'},completed.length)),h('div',{className:'vfp-library'},completed.map(compact))):null
    );
  }

  function VFPRestTimer(props){
    const seconds=Math.max(0,Number(props.seconds)||60);
    const stateRemaining=global.React.useState(seconds),remaining=stateRemaining[0],setRemaining=stateRemaining[1];
    const stateRunning=global.React.useState(true),running=stateRunning[0],setRunning=stateRunning[1];
    global.React.useEffect(function(){setRemaining(seconds);setRunning(true);},[seconds]);
    global.React.useEffect(function(){if(!running||remaining<=0)return;const timer=setTimeout(function(){setRemaining(function(value){return Math.max(0,value-1);});},1000);return function(){clearTimeout(timer);};},[running,remaining]);
    global.React.useEffect(function(){if(remaining!==0)return;try{navigator.vibrate&&navigator.vibrate([180,80,180]);}catch(_){ }},[remaining]);
    const formatted=Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0');
    return h('div',{className:'vfp-rest flex flex-wrap items-center gap-2'},h('strong',{className:'mr-auto'},remaining>0?'Rest '+formatted:'Rest Complete'),h('button',{className:'px-3 py-2 rounded-lg bg-gray-200',onClick:function(){setRunning(!running);}},running?'Pause':'Resume'),h('button',{className:'px-3 py-2 rounded-lg bg-gray-200',onClick:function(){setRemaining(function(value){return value+15;});}},'+15s'),h('button',{className:'px-3 py-2 rounded-lg bg-black text-white',onClick:props.onClose},'Skip'));
  }

  function VFPWorkoutPlayer(props){
    const enrollment=props.enrollment||{};
    const workout=props.workout||{};
    const workoutIndex=Math.max(0,Number(props.workoutIndex)||0);
    const week=Math.max(1,Number(props.week)||1);
    const sessionKey='vfp-session-'+enrollment.id+'-'+week+'-'+workoutIndex;
    let saved={};try{saved=JSON.parse(localStorage.getItem(sessionKey)||'{}');}catch(_){ }
    const exercises=workout.exercises||[];
    const stateIndex=global.React.useState(saved.index||0),index=stateIndex[0],setIndex=stateIndex[1];
    const stateSets=global.React.useState(saved.sets||{}),sets=stateSets[0],setSets=stateSets[1];
    const startedState=global.React.useState(saved.started||Date.now()),started=startedState[0];
    const restState=global.React.useState(null),rest=restState[0],setRest=restState[1];
    const summaryState=global.React.useState(false),summary=summaryState[0],setSummary=summaryState[1];
    const noteState=global.React.useState(saved.workoutNote||''),workoutNote=noteState[0],setWorkoutNote=noteState[1];
    const exerciseNotesState=global.React.useState(saved.exerciseNotes||{}),exerciseNotes=exerciseNotesState[0],setExerciseNotes=exerciseNotesState[1];
    const nowState=global.React.useState(Date.now()),now=nowState[0],setNow=nowState[1];
    const savingState=global.React.useState(false),saving=savingState[0],setSaving=savingState[1];
    const errorState=global.React.useState(''),saveError=errorState[0],setSaveError=errorState[1];
    global.React.useEffect(function(){const timer=setInterval(function(){setNow(Date.now());},1000);return function(){clearInterval(timer);};},[]);
    const exercise=exercises[index]||{};
    const setCount=Math.max(1,parseInt(exercise.sets)||1);
    const exerciseKey='e'+index;
    const rows=sets[exerciseKey]||Array.from({length:setCount},function(){return {weight:'',reps:'',done:false};});
    function persist(nextSets,nextIndex,nextWorkoutNote,nextExerciseNotes){try{localStorage.setItem(sessionKey,JSON.stringify({sets:nextSets===undefined?sets:nextSets,index:nextIndex===undefined?index:nextIndex,workoutNote:nextWorkoutNote===undefined?workoutNote:nextWorkoutNote,exerciseNotes:nextExerciseNotes===undefined?exerciseNotes:nextExerciseNotes,started:started}));}catch(_){ }}
    global.React.useEffect(function(){persist();},[sets,index,workoutNote,exerciseNotes]);
    const totalSets=exercises.reduce(function(sum,item){return sum+(parseInt(item.sets)||1);},0);
    const doneSets=Object.values(sets).reduce(function(sum,itemRows){return sum+(itemRows||[]).filter(function(row){return row.done;}).length;},0);
    const progress=Math.round(doneSets/Math.max(1,totalSets)*100);
    const elapsed=Math.max(0,Math.floor((now-started)/1000));
    function update(rowIndex,field,value){const nextRows=rows.map(function(row,i){return i===rowIndex?Object.assign({},row,{[field]:value}):row;});setSets(Object.assign({},sets,{[exerciseKey]:nextRows}));}
    function completeSet(rowIndex){const nextRows=rows.map(function(row,i){return i===rowIndex?Object.assign({},row,{done:true}):row;});setSets(Object.assign({},sets,{[exerciseKey]:nextRows}));setRest(Number(exercise.restSeconds||exercise.rest||exercise.restTime)||60);}
    const allComplete=doneSets>=totalSets;
    async function finishNow(){
      if(saving||!allComplete)return;
      setSaving(true);setSaveError('');
      const log={sets:sets,workoutNote:workoutNote,exerciseNotes:exerciseNotes,duration:elapsed,completedAt:new Date().toISOString(),workoutName:workout.name||'',week:week,workoutIndex:workoutIndex};
      try{
        await props.onComplete({log:log,sessionKey:sessionKey,workoutIndex:workoutIndex});
        localStorage.removeItem(sessionKey);
      }catch(error){
        setSaveError(error&&error.message||'The workout could not be saved. Your set log remains on this device.');
        try{global.VFitnessDiagnostics.capture({type:'workout_completion_failed',feature:'programs',action:'complete_workout',message:error.message,enrollmentId:enrollment.id});}catch(_){ }
      }finally{setSaving(false);}
    }
    if(summary){
      const volume=Object.values(sets).flat().reduce(function(sum,row){return sum+(parseFloat(row.weight)||0)*(parseFloat(row.reps)||0);},0);
      return h('div',{className:'vfp-workout-overlay flex items-center justify-center p-5 vfp-shell'},h('div',{className:'vfp-card max-w-xl w-full p-7 text-center vfp-fade'},h('h2',{className:'text-3xl font-black mb-2'},'Workout Complete'),h('p',{className:'text-gray-400 mb-6'},title(workout.name)),h('div',{className:'grid grid-cols-2 gap-3 text-left mb-6'},[['Duration',Math.floor(elapsed/60)+' min'],['Exercises',exercises.length],['Sets',doneSets+'/'+totalSets],['Volume',Math.round(volume).toLocaleString()]].map(function(metric){return h('div',{key:metric[0],className:'vfp-card p-4'},h('div',{className:'text-xs text-gray-500'},metric[0]),h('div',{className:'font-black text-lg'},metric[1]));})),h('textarea',{className:'vfp-input h-24 py-3 mb-4',placeholder:'Workout note',value:workoutNote,onChange:function(event){setWorkoutNote(event.target.value);}}),saveError?h('div',{className:'text-sm mb-4 rounded-xl p-3',style:{background:'rgba(239,68,68,.12)',color:'#fca5a5',border:'1px solid rgba(239,68,68,.25)'}},saveError):null,h('button',{className:'vfp-btn vfp-primary w-full '+(saving?'vfp-saving':''),disabled:!allComplete||saving,onClick:finishNow},saving?'Saving Workout…':allComplete?'Complete Workout':'Finish All Sets First')));
    }
    const setCards=rows.map(function(row,rowIndex){return h('div',{key:rowIndex,'data-vfp-set':index+'-'+rowIndex,className:'vfp-set '+(row.done?'done':'')},h('div',{className:'vfp-set-title'},h('strong',null,'Set '+(rowIndex+1)),h('div',{className:'text-xs text-gray-500'},'Target: '+(exercise.reps||'—')+' reps')),h('label',{className:'text-xs text-gray-400'},'Weight',h('input',{className:'vfp-input mt-1',inputMode:'decimal',value:row.weight,onChange:function(event){update(rowIndex,'weight',event.target.value);},disabled:row.done})),h('label',{className:'text-xs text-gray-400'},'Completed Reps',h('input',{className:'vfp-input mt-1',inputMode:'numeric',value:row.reps,onChange:function(event){update(rowIndex,'reps',event.target.value);},disabled:row.done})),h('button',{className:'vfp-btn '+(row.done?'vfp-secondary':'vfp-primary')+' vfp-set-action',onClick:function(){row.done?update(rowIndex,'done',false):completeSet(rowIndex);}},row.done?'Edit Set':'Complete Set'));});
    const restSeconds=Number(exercise.restSeconds||exercise.rest||exercise.restTime)||60;
    const metrics=[['Target',exercise.reps||'As prescribed'],['Recommended',(exercise.baseWeight||exercise.recommendedWeight)?String(exercise.baseWeight||exercise.recommendedWeight)+' lb':'Use your working weight'],['Rest',restSeconds+' sec']].map(function(metric){return h('div',{key:metric[0],className:'py-2'},h('div',{className:'text-xs text-gray-500'},metric[0]),h('div',{className:'font-bold mt-1'},metric[1]));});
    return h('div',{className:'vfp-workout-overlay vfp-shell vfp-no-x'},h('header',{className:'vfp-workout-top p-4'},h('div',{className:'max-w-4xl mx-auto'},h('div',{className:'flex items-center gap-3'},h('button',{className:'vfp-btn vfp-secondary vfp-save-top',onClick:props.onExit},'Save & Exit'),h('div',{className:'min-w-0 flex-1'},h('div',{className:'text-xs text-gray-500'},'Exercise '+(index+1)+' of '+exercises.length+' · '+Math.floor(elapsed/60)+':'+String(elapsed%60).padStart(2,'0')),h('h1',{className:'font-black truncate'},title(workout.name))),h('strong',null,progress+'%')),h('div',{className:'mt-3'},h(VFPProgress,{pct:progress})))),h('main',{className:'max-w-4xl mx-auto p-4 pb-3 vfp-fade',key:index},h('section',{className:'vfp-card p-4 sm:p-6'},h('div',{className:'flex justify-between gap-3 mb-4'},h('div',null,h('div',{className:'text-xs uppercase tracking-widest text-blue-400 font-black'},'Exercise '+(index+1)),h('h2',{className:'text-2xl sm:text-4xl font-black mt-1'},title(exercise.name))),h('span',{className:'vfp-status'},setCount+' sets')),(exercise.videoUrl||exercise.video)?h('div',{className:'vfp-video mb-5'},h(SmartVideo,{videoUrl:exercise.videoUrl||exercise.video||'',exerciseName:exercise.name||'Exercise',autoplay:false})):null,h('div',{className:'grid sm:grid-cols-3 gap-3 mb-5'},metrics),(exercise.instructions||exercise.tip||exercise.notes)?h('div',{className:'mb-5 text-sm text-gray-300 leading-6'},exercise.instructions||exercise.tip||exercise.notes):null,h('div',{className:'space-y-3'},setCards),h('textarea',{className:'vfp-input h-20 py-3 mt-5',placeholder:'Exercise note',value:exerciseNotes[exerciseKey]||'',onChange:function(event){setExerciseNotes(Object.assign({},exerciseNotes,{[exerciseKey]:event.target.value}));}}))),rest!==null?h(VFPRestTimer,{seconds:rest,onClose:function(){setRest(null);}}):null,h('footer',{className:'vfp-bottom'},h('div',{className:'max-w-4xl mx-auto grid grid-cols-3 gap-2'},h('button',{className:'vfp-btn vfp-secondary',disabled:index===0,onClick:function(){setIndex(Math.max(0,index-1));}},'Previous'),h('button',{className:'vfp-btn vfp-secondary',onClick:props.onExit},'Save & Exit'),h('button',{className:'vfp-btn vfp-primary',onClick:function(){index<exercises.length-1?setIndex(index+1):allComplete?setSummary(true):alert('Complete all prescribed sets before finishing the workout.');}},index<exercises.length-1?'Next':'Summary'))));
  }

  function VFPProgramDashboard(props){
    const data=VFPProgramData(props.program,Object.assign({},props.enrollment,{currentWeek:props.currentWeek,completedWorkouts:props.completedWorkouts,completedWorkoutsV2:props.completedWorkouts,completionSchema:Core&&Core.schema}));
    const week=data.currentWeek||props.currentWeek||1;
    const workouts=Core?Core.workoutsForWeek(props.program,week):((((props.program.weeklyPlans||[])[week-1]||(props.program.weeklyPlans||[])[0]||{}).workouts)||[]);
    const selected=props.selectedWorkout;
    const panelState=global.React.useState(null),panel=panelState[0],setPanel=panelState[1];
    if(selected!==null)return h(VFPWorkoutPlayer,{enrollment:props.enrollment,workout:props.getWorkoutForWeek(selected),workoutIndex:selected,week:week,onExit:props.onExitWorkout,onComplete:function(payload){return props.onCompleteWorkout(Object.assign({},payload,{workoutIndex:selected}));}});
    const next=Math.min(Math.max(0,workouts.length-1),data.thisWeek);
    const complete=data.status==='completed';
    const cards=workouts.map(function(workout,index){const key=Core?Core.canonicalKey(week,index):'week'+week+'-day'+index;const done=data.completed.indexOf(key)!==-1;const inProgress=!!localStorage.getItem('vfp-session-'+props.enrollment.id+'-'+week+'-'+index);const status=done?'Completed':inProgress?'In Progress':index===next?'Current':'Upcoming';return h('article',{key:index,className:'vfp-week-card py-4',style:{borderBottom:index===workouts.length-1?'0':'1px solid rgba(255,255,255,.08)'}},h('div',{className:'flex justify-between gap-3'},h('div',null,h('div',{className:'text-xs text-gray-500'},'Day '+(index+1)),h('h3',{className:'font-black text-lg mt-1'},title(workout.name)),h('div',{className:'text-sm text-gray-500 mt-1'},((workout.exercises||[]).length)+' exercises')),h('span',{className:'vfp-status '+(done?'done':status==='Current'?'current':'')},status)),h('button',{className:'vfp-btn '+(done?'vfp-secondary':'vfp-primary')+' mt-3',onClick:function(){props.onSelectWorkout(index);}},done?'Review Workout':'Start or Continue'));});
    const logs=Object.values(props.enrollment.setLogs||{}).slice(-8).reverse();
    return h('div',{className:'vfp-shell min-h-screen pt-28 pb-20 px-4 vfp-no-x',style:{background:'#070809'}},h('div',{className:'max-w-5xl mx-auto'},h('button',{className:'vfp-btn vfp-secondary mb-5',onClick:props.onBack},'Back to Programs'),h('section',{className:'vfp-active rounded-[28px] p-6 sm:p-8 mb-6'},h('span',{className:'vfp-status '+(complete?'done':'current')},complete?'Completed':'Week '+week+' of '+data.weeks),h('h1',{className:'text-3xl sm:text-5xl font-black mt-4'},title(props.program.title)),h('div',{className:'vfp-progress-summary mt-5'},h('strong',null,data.pct+'% Complete'),h('span',null,data.completed.length+' of '+data.total+' workouts · '+data.remaining+' remaining'),h(VFPProgress,{pct:data.pct})),complete?h('div',{className:'vfp-completion-actions'},h('button',{className:'vfp-btn vfp-secondary',onClick:function(){props.onSelectWorkout(0);}},'Review Program'),h('button',{className:'vfp-btn vfp-primary',onClick:props.onBrowse||function(){if(global.VFitnessRouter)global.VFitnessRouter.openStore();}},'Start Next Phase')):h('div',{className:'vfp-completion-actions'},h('button',{className:'vfp-btn vfp-primary',onClick:function(){props.onSelectWorkout(next);}},'Start Next Workout'),h('button',{className:'vfp-btn vfp-secondary',onClick:props.onMeal},'View Meal Plan'))),h('div',{className:'grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6'},[['This Week',data.thisWeek+' / '+data.perWeek],['Current Week',week+' / '+data.weeks],['Completed',data.completed.length],['Remaining',data.remaining]].map(function(metric){return h('div',{key:metric[0],className:'py-2'},h('div',{className:'text-xs text-gray-500'},metric[0]),h('div',{className:'font-black mt-1'},metric[1]));}))),h('section',{className:'vfp-card p-5 sm:p-6'},h('div',{className:'flex justify-between items-end mb-4'},h('div',null,h('div',{className:'text-xs uppercase tracking-widest text-gray-500'},'Weekly Plan'),h('h2',{className:'text-2xl font-black mt-1'},complete?'Review Your Schedule':'Your Schedule')),h('div',{className:'text-sm text-gray-500'},data.thisWeek+' / '+data.perWeek)),h('div',null,cards)),h('div',{className:'grid sm:grid-cols-3 gap-3 mt-6'},h('button',{className:'vfp-btn vfp-secondary',onClick:props.onWeight},'Log Weight'),h('button',{className:'vfp-btn vfp-secondary',onClick:function(){setPanel('history');}},'Exercise History'),h('button',{className:'vfp-btn vfp-secondary',onClick:props.onNote},'Program Note')),panel==='history'?h(VFPModal,{title:'Exercise History',onClose:function(){setPanel(null);}},logs.length?h('div',{className:'space-y-3'},logs.map(function(item,index){return h('div',{key:index,className:'vfp-card p-4'},h('div',{className:'font-black'},item.completedAt?new Date(item.completedAt).toLocaleDateString():'Saved Workout'),h('div',{className:'text-sm text-gray-400 mt-1'},Math.round((item.duration||0)/60)+' min · '+Object.values(item.sets||{}).flat().filter(function(row){return row.done;}).length+' sets'),item.workoutNote?h('p',{className:'text-sm text-gray-300 mt-2'},item.workoutNote):null);})):h('p',{className:'text-gray-400'},'Your completed set history will appear here.')):null));
  }

  global.VFPProgramData=VFPProgramData;
  global.VFPProgress=VFPProgress;
  global.VFPModal=VFPModal;
  global.VFPProgramLibrary=VFPProgramLibrary;
  global.VFPRestTimer=VFPRestTimer;
  global.VFPWorkoutPlayer=VFPWorkoutPlayer;
  global.VFPProgramDashboard=VFPProgramDashboard;
})(window);
