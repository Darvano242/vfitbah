/* Stable VFITNESS Programs components.
 * Loaded after the legacy compatibility file and used as the authoritative Programs UI.
 */
(function(global){
  'use strict';
  if(!global.React)return;

  const React=global.React;
  const h=React.createElement;
  const Core=global.VFitnessProgramCore;

  function text(value){
    try{return typeof cleanTitle==='function'?cleanTitle(value):String(value||'');}
    catch(_){return String(value||'');}
  }

  function staticPrograms(){
    const programs=[];
    const names=[
      'HOME_30DAY_PROGRAM','FLEX_MASTER_PROGRAM','HOURGLASS_PROGRAM','SIXPACK_PROGRAM',
      'BOOTY_CAMP_PROGRAM','MASS_MONSTER_PROGRAM','IRON_BEAST_PROGRAM','SHRED42_PROGRAM',
      'FOUNDATION_PROGRAM','ATHLETE_ENGINE_PROGRAM','STRONG40_PROGRAM','UPPER_ARMOR_PROGRAM'
    ];
    names.forEach(function(name){
      try{
        const program=global[name]||eval(name);
        if(program)programs.push(program);
      }catch(_){ }
    });
    return programs;
  }

  function allPrograms(customPrograms){return staticPrograms().concat(customPrograms||[]);}

  function programImage(program){
    try{return PROGRAM_ART[program.id]||program.image||PROGRAM_ART._default;}
    catch(_){return program&&program.image||'/scene-programs.jpg';}
  }

  function programData(program,enrollment){
    if(Core)return Core.derive(program,enrollment||{});
    const weeks=(program&&program.weeklyPlans)||[];
    const completed=Array.from(new Set(((enrollment&&enrollment.completedWorkouts)||[]).map(String)));
    const total=weeks.reduce(function(sum,week){
      return sum+((((week||{}).workouts)||[]).length);
    },0)||1;
    const currentWeek=Math.max(1,Math.min(Number(enrollment&&enrollment.currentWeek)||1,weeks.length||1));
    const plan=weeks[currentWeek-1]||weeks[0]||{};
    const currentWorkouts=plan.workouts||[];
    const thisWeek=completed.filter(function(key){return key.indexOf('week'+currentWeek+'-')===0;}).length;
    const pct=Math.min(100,Math.round(completed.length/total*100));
    return {
      weeks:Math.max(1,weeks.length),total:total,completed:completed,pct:pct,
      currentWeek:currentWeek,week:currentWeek,remaining:Math.max(0,total-completed.length),
      currentWorkouts:currentWorkouts,thisWeek:thisWeek,perWeek:currentWorkouts.length,
      status:pct>=100?'completed':completed.length?'active':'not_started'
    };
  }

  function Progress(props){
    const pct=Math.max(0,Math.min(100,Number(props&&props.pct)||0));
    return h('div',{
      className:'vfp-progress',
      'aria-label':(props&&props.label||'Program progress')+' '+Math.round(pct)+' percent'
    },h('span',{style:{width:pct+'%'}}));
  }

  function Modal(props){
    return h('div',{className:'vfp-modal vfp-shell'},
      h('div',{className:'vfp-modal-body vfp-fade'},
        h('div',{className:'flex justify-between items-center gap-3 mb-5'},
          h('h2',{className:'text-2xl font-black'},props.title),
          h('button',{type:'button',className:'vfp-btn vfp-secondary',onClick:props.onClose},'Close')
        ),
        props.children
      )
    );
  }

  function simpleMetric(label,value,key){
    return h('div',{key:key||label,className:'py-2'},
      h('div',{className:'text-xs text-gray-500'},label),
      h('div',{className:'font-black mt-1'},value)
    );
  }

  function compactProgram(item,onOpen){
    const completed=item.d.status==='completed';
    const label=completed?'Review Program':item.d.completed.length?'Continue':'Start Program';
    return h('article',{key:item.e.id,className:'vfp-card vfp-compact','data-interactive':'true'},
      h('img',{className:'vfp-thumb',src:programImage(item.p),alt:''}),
      h('div',{className:'min-w-0'},
        h('div',{className:'flex gap-2 items-center flex-wrap'},
          h('h4',{className:'font-black'},text(item.p.title)),
          h('span',{className:'vfp-status '+(completed?'done':'')},completed?'Completed':'Week '+item.d.currentWeek)
        ),
        h('div',{className:'text-xs text-gray-500 mt-1 mb-2'},item.d.completed.length+' of '+item.d.total+' workouts'),
        h(Progress,{pct:item.d.pct})
      ),
      h('button',{
        type:'button',
        className:'vfp-btn '+(completed?'vfp-secondary':'vfp-primary')+' vfp-compact-action',
        onClick:function(){onOpen(item.e);}
      },label)
    );
  }

  function ProgramLibrary(props){
    const enrollments=props.enrollments||[];
    const programs=allPrograms(props.customPrograms);
    const purchases=[...enrollments]
      .sort(function(a,b){
        const at=a.purchaseDate&&a.purchaseDate.toDate?a.purchaseDate.toDate().getTime():0;
        const bt=b.purchaseDate&&b.purchaseDate.toDate?b.purchaseDate.toDate().getTime():0;
        return bt-at;
      })
      .map(function(enrollment){
        const program=programs.find(function(item){return item&&item.id===enrollment.programId;});
        return program?{e:enrollment,p:program,d:programData(program,enrollment)}:null;
      })
      .filter(Boolean);

    React.useEffect(function(){
      if(!Core)return;
      purchases.forEach(function(item){
        if(item.d.status!=='completed'||item.e.status==='completed')return;
        Core.synchronizeStatus({program:item.p,enrollment:item.e}).catch(function(error){
          try{
            if(global.VFitnessDiagnostics)global.VFitnessDiagnostics.capture({
              type:'program_status_sync',feature:'programs',action:'synchronize_status',
              message:error.message,programId:item.p.id,enrollmentId:item.e.id
            });
          }catch(_){ }
        });
      });
    },[enrollments]);

    if(!purchases.length){
      return h('div',{className:'vfp-shell vfp-card text-center p-10'},
        h('h3',{className:'text-2xl font-black mb-2'},'No Programs Yet'),
        h('p',{className:'text-gray-400 mb-6'},'Choose the program that matches your goal and start inside your dashboard.'),
        h('button',{type:'button',className:'vfp-btn vfp-primary',onClick:props.onBrowse},'Browse Programs')
      );
    }

    const active=purchases.find(function(item){return item.d.status!=='completed'&&item.e.status==='active';})
      ||purchases.find(function(item){return item.d.status!=='completed';})
      ||null;
    const remainingPrograms=purchases.filter(function(item){return item!==active&&item.d.status!=='completed';});
    const completedPrograms=purchases.filter(function(item){return item.d.status==='completed';});

    let hero;
    if(active){
      const heroMetrics=[
        ['This Week',active.d.thisWeek+' / '+active.d.perWeek],
        ['Current Week',active.d.currentWeek+' / '+active.d.weeks],
        ['Status','Active']
      ].map(function(metric,index){return simpleMetric(metric[0],metric[1],'hero-'+index);});
      hero=h('section',{className:'vfp-active rounded-[28px] p-6 sm:p-8'},
        h('div',{className:'relative z-10'},
          h('div',{className:'flex flex-wrap gap-2 mb-4'},
            h('span',{className:'vfp-status current'},'Current'),
            h('span',{className:'vfp-status'},'Week '+active.d.currentWeek+' of '+active.d.weeks)
          ),
          h('h2',{className:'text-3xl sm:text-5xl font-black mb-3'},text(active.p.title)),
          h('div',{className:'vfp-progress-summary'},
            h('strong',null,active.d.pct+'% Complete'),
            h('span',null,active.d.completed.length+' of '+active.d.total+' workouts · '+active.d.remaining+' remaining'),
            h(Progress,{pct:active.d.pct,label:'Program progress'})
          ),
          h('div',{className:'grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5'},heroMetrics),
          h('button',{type:'button',className:'vfp-btn vfp-primary mt-5',onClick:function(){props.onOpen(active.e);}},'Continue Program')
        )
      );
    }else{
      hero=h('section',{className:'vfp-active rounded-[28px] p-6 sm:p-8'},
        h('span',{className:'vfp-status done'},'Training History'),
        h('h2',{className:'text-3xl sm:text-5xl font-black mt-4 mb-3'},'All Purchased Programs Are Complete'),
        h('p',{className:'text-gray-400'},'Review a completed program below or choose your next phase.'),
        h('button',{type:'button',className:'vfp-btn vfp-primary mt-5',onClick:props.onBrowse},'Browse Next Program')
      );
    }

    function section(label,items){
      if(!items.length)return null;
      return h('section',{key:label},
        h('div',{className:'flex justify-between items-end mb-3'},
          h('h3',{className:'text-xl font-black'},label),
          h('span',{className:'text-sm text-gray-500'},String(items.length))
        ),
        h('div',{className:'vfp-library'},items.map(function(item){return compactProgram(item,props.onOpen);}))
      );
    }

    return h('div',{className:'vfp-shell space-y-8'},
      hero,
      section('Other Programs',remainingPrograms),
      section('Completed',completedPrograms)
    );
  }

  function RestTimer(props){
    const seconds=Math.max(0,Number(props.seconds)||60);
    const remainingState=React.useState(seconds);
    const remaining=remainingState[0];
    const setRemaining=remainingState[1];
    const runningState=React.useState(true);
    const running=runningState[0];
    const setRunning=runningState[1];

    React.useEffect(function(){setRemaining(seconds);setRunning(true);},[seconds]);
    React.useEffect(function(){
      if(!running||remaining<=0)return undefined;
      const timer=setTimeout(function(){setRemaining(function(value){return Math.max(0,value-1);});},1000);
      return function(){clearTimeout(timer);};
    },[running,remaining]);
    React.useEffect(function(){
      if(remaining!==0)return;
      try{if(navigator.vibrate)navigator.vibrate([180,80,180]);}catch(_){ }
    },[remaining]);

    const formatted=Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0');
    return h('div',{className:'vfp-rest flex flex-wrap items-center gap-2'},
      h('strong',{className:'mr-auto'},remaining>0?'Rest '+formatted:'Rest Complete'),
      h('button',{type:'button',className:'px-3 py-2 rounded-lg bg-gray-200',onClick:function(){setRunning(!running);}},running?'Pause':'Resume'),
      h('button',{type:'button',className:'px-3 py-2 rounded-lg bg-gray-200',onClick:function(){setRemaining(function(value){return value+15;});}},'+15s'),
      h('button',{type:'button',className:'px-3 py-2 rounded-lg bg-black text-white',onClick:props.onClose},'Skip')
    );
  }

  function WorkoutSummary(props){
    const metrics=[
      ['Duration',Math.floor(props.elapsed/60)+' min'],
      ['Exercises',props.exerciseCount],
      ['Sets',props.doneSets+'/'+props.totalSets],
      ['Volume',Math.round(props.volume).toLocaleString()]
    ];
    return h('div',{className:'vfp-workout-overlay flex items-center justify-center p-5 vfp-shell'},
      h('div',{className:'vfp-card max-w-xl w-full p-7 text-center vfp-fade'},
        h('h2',{className:'text-3xl font-black mb-2'},'Workout Complete'),
        h('p',{className:'text-gray-400 mb-6'},text(props.workoutName)),
        h('div',{className:'grid grid-cols-2 gap-3 text-left mb-6'},metrics.map(function(metric,index){
          return h('div',{key:index,className:'vfp-card p-4'},
            h('div',{className:'text-xs text-gray-500'},metric[0]),
            h('div',{className:'font-black text-lg'},metric[1])
          );
        })),
        h('textarea',{
          className:'vfp-input h-24 py-3 mb-4',placeholder:'Workout note',
          value:props.workoutNote,onChange:function(event){props.setWorkoutNote(event.target.value);}
        }),
        props.error?h('div',{className:'text-sm mb-4 rounded-xl p-3',style:{background:'rgba(239,68,68,.12)',color:'#fca5a5',border:'1px solid rgba(239,68,68,.25)'}},props.error):null,
        h('button',{
          type:'button',className:'vfp-btn vfp-primary w-full '+(props.saving?'vfp-saving':''),
          disabled:!props.allComplete||props.saving,onClick:props.onFinish
        },props.saving?'Saving Workout…':props.allComplete?'Complete Workout':'Finish All Sets First')
      )
    );
  }

  function WorkoutPlayer(props){
    const enrollment=props.enrollment||{};
    const workout=props.workout||{};
    const workoutIndex=Math.max(0,Number(props.workoutIndex)||0);
    const week=Math.max(1,Number(props.week)||1);
    const sessionKey='vfp-session-'+enrollment.id+'-'+week+'-'+workoutIndex;
    let saved={};
    try{saved=JSON.parse(localStorage.getItem(sessionKey)||'{}');}catch(_){ }

    const exercises=workout.exercises||[];
    const indexState=React.useState(saved.index||0);
    const index=indexState[0];
    const setIndex=indexState[1];
    const setsState=React.useState(saved.sets||{});
    const sets=setsState[0];
    const setSets=setsState[1];
    const startedState=React.useState(saved.started||Date.now());
    const started=startedState[0];
    const restState=React.useState(null);
    const rest=restState[0];
    const setRest=restState[1];
    const summaryState=React.useState(false);
    const summary=summaryState[0];
    const setSummary=summaryState[1];
    const noteState=React.useState(saved.workoutNote||'');
    const workoutNote=noteState[0];
    const setWorkoutNote=noteState[1];
    const exerciseNotesState=React.useState(saved.exerciseNotes||{});
    const exerciseNotes=exerciseNotesState[0];
    const setExerciseNotes=exerciseNotesState[1];
    const nowState=React.useState(Date.now());
    const now=nowState[0];
    const setNow=nowState[1];
    const savingState=React.useState(false);
    const saving=savingState[0];
    const setSaving=savingState[1];
    const errorState=React.useState('');
    const saveError=errorState[0];
    const setSaveError=errorState[1];

    React.useEffect(function(){
      const timer=setInterval(function(){setNow(Date.now());},1000);
      return function(){clearInterval(timer);};
    },[]);

    const exercise=exercises[index]||{};
    const setCount=Math.max(1,parseInt(exercise.sets)||1);
    const exerciseKey='e'+index;
    const rows=sets[exerciseKey]||Array.from({length:setCount},function(){return {weight:'',reps:'',done:false};});

    function persist(){
      try{localStorage.setItem(sessionKey,JSON.stringify({sets:sets,index:index,workoutNote:workoutNote,exerciseNotes:exerciseNotes,started:started}));}
      catch(_){ }
    }
    React.useEffect(persist,[sets,index,workoutNote,exerciseNotes]);

    const totalSets=exercises.reduce(function(sum,item){return sum+(parseInt(item.sets)||1);},0);
    const doneSets=Object.values(sets).reduce(function(sum,itemRows){
      return sum+(itemRows||[]).filter(function(row){return row.done;}).length;
    },0);
    const progress=Math.round(doneSets/Math.max(1,totalSets)*100);
    const elapsed=Math.max(0,Math.floor((now-started)/1000));
    const allComplete=doneSets>=totalSets;

    function updateSet(rowIndex,field,value){
      const nextRows=rows.map(function(row,i){return i===rowIndex?Object.assign({},row,{[field]:value}):row;});
      setSets(Object.assign({},sets,{[exerciseKey]:nextRows}));
    }

    function completeSet(rowIndex){
      updateSet(rowIndex,'done',true);
      setRest(Number(exercise.restSeconds||exercise.rest||exercise.restTime)||60);
    }

    async function finishWorkout(){
      if(saving||!allComplete)return;
      setSaving(true);
      setSaveError('');
      const log={
        sets:sets,workoutNote:workoutNote,exerciseNotes:exerciseNotes,
        duration:elapsed,completedAt:new Date().toISOString(),workoutName:workout.name||'',
        week:week,workoutIndex:workoutIndex
      };
      try{
        await props.onComplete({log:log,sessionKey:sessionKey,workoutIndex:workoutIndex});
        localStorage.removeItem(sessionKey);
      }catch(error){
        setSaveError(error&&error.message||'The workout could not be saved. Your set log remains on this device.');
        try{
          if(global.VFitnessDiagnostics)global.VFitnessDiagnostics.capture({
            type:'workout_completion_failed',feature:'programs',action:'complete_workout',
            message:error&&error.message,enrollmentId:enrollment.id
          });
        }catch(_){ }
      }finally{
        setSaving(false);
      }
    }

    if(summary){
      const volume=Object.values(sets).flat().reduce(function(sum,row){
        return sum+(parseFloat(row.weight)||0)*(parseFloat(row.reps)||0);
      },0);
      return h(WorkoutSummary,{
        elapsed:elapsed,exerciseCount:exercises.length,doneSets:doneSets,totalSets:totalSets,
        volume:volume,workoutName:workout.name,workoutNote:workoutNote,setWorkoutNote:setWorkoutNote,
        error:saveError,saving:saving,allComplete:allComplete,onFinish:finishWorkout
      });
    }

    const setCards=rows.map(function(row,rowIndex){
      return h('div',{key:rowIndex,'data-vfp-set':index+'-'+rowIndex,className:'vfp-set '+(row.done?'done':'')},
        h('div',{className:'vfp-set-title'},
          h('strong',null,'Set '+(rowIndex+1)),
          h('div',{className:'text-xs text-gray-500'},'Target: '+(exercise.reps||'—')+' reps')
        ),
        h('label',{className:'text-xs text-gray-400'},'Weight',
          h('input',{className:'vfp-input mt-1',inputMode:'decimal',value:row.weight,disabled:row.done,onChange:function(event){updateSet(rowIndex,'weight',event.target.value);}})
        ),
        h('label',{className:'text-xs text-gray-400'},'Completed Reps',
          h('input',{className:'vfp-input mt-1',inputMode:'numeric',value:row.reps,disabled:row.done,onChange:function(event){updateSet(rowIndex,'reps',event.target.value);}})
        ),
        h('button',{type:'button',className:'vfp-btn '+(row.done?'vfp-secondary':'vfp-primary')+' vfp-set-action',onClick:function(){row.done?updateSet(rowIndex,'done',false):completeSet(rowIndex);}},row.done?'Edit Set':'Complete Set')
      );
    });

    const restSeconds=Number(exercise.restSeconds||exercise.rest||exercise.restTime)||60;
    const exerciseMetrics=[
      simpleMetric('Target',exercise.reps||'As prescribed','target'),
      simpleMetric('Recommended',(exercise.baseWeight||exercise.recommendedWeight)?String(exercise.baseWeight||exercise.recommendedWeight)+' lb':'Use your working weight','recommended'),
      simpleMetric('Rest',restSeconds+' sec','rest')
    ];

    const header=h('header',{className:'vfp-workout-top p-4'},
      h('div',{className:'max-w-4xl mx-auto'},
        h('div',{className:'flex items-center gap-3'},
          h('button',{type:'button',className:'vfp-btn vfp-secondary vfp-save-top',onClick:props.onExit},'Save & Exit'),
          h('div',{className:'min-w-0 flex-1'},
            h('div',{className:'text-xs text-gray-500'},'Exercise '+(index+1)+' of '+exercises.length+' · '+Math.floor(elapsed/60)+':'+String(elapsed%60).padStart(2,'0')),
            h('h1',{className:'font-black truncate'},text(workout.name))
          ),
          h('strong',null,progress+'%')
        ),
        h('div',{className:'mt-3'},h(Progress,{pct:progress}))
      )
    );

    const body=h('main',{className:'max-w-4xl mx-auto p-4 pb-3 vfp-fade',key:index},
      h('section',{className:'vfp-card p-4 sm:p-6'},
        h('div',{className:'flex justify-between gap-3 mb-4'},
          h('div',null,
            h('div',{className:'text-xs uppercase tracking-widest text-blue-400 font-black'},'Exercise '+(index+1)),
            h('h2',{className:'text-2xl sm:text-4xl font-black mt-1'},text(exercise.name))
          ),
          h('span',{className:'vfp-status'},setCount+' sets')
        ),
        (exercise.videoUrl||exercise.video)?h('div',{className:'vfp-video mb-5'},h(SmartVideo,{videoUrl:exercise.videoUrl||exercise.video||'',exerciseName:exercise.name||'Exercise',autoplay:false})):null,
        h('div',{className:'grid sm:grid-cols-3 gap-3 mb-5'},exerciseMetrics),
        (exercise.instructions||exercise.tip||exercise.notes)?h('div',{className:'mb-5 text-sm text-gray-300 leading-6'},exercise.instructions||exercise.tip||exercise.notes):null,
        h('div',{className:'space-y-3'},setCards),
        h('textarea',{className:'vfp-input h-20 py-3 mt-5',placeholder:'Exercise note',value:exerciseNotes[exerciseKey]||'',onChange:function(event){setExerciseNotes(Object.assign({},exerciseNotes,{[exerciseKey]:event.target.value}));}})
      )
    );

    const footer=h('footer',{className:'vfp-bottom'},
      h('div',{className:'max-w-4xl mx-auto grid grid-cols-3 gap-2'},
        h('button',{type:'button',className:'vfp-btn vfp-secondary',disabled:index===0,onClick:function(){setIndex(Math.max(0,index-1));}},'Previous'),
        h('button',{type:'button',className:'vfp-btn vfp-secondary',onClick:props.onExit},'Save & Exit'),
        h('button',{type:'button',className:'vfp-btn vfp-primary',onClick:function(){
          if(index<exercises.length-1)setIndex(index+1);
          else if(allComplete)setSummary(true);
          else alert('Complete all prescribed sets before finishing the workout.');
        }},index<exercises.length-1?'Next':'Summary')
      )
    );

    return h('div',{className:'vfp-workout-overlay vfp-shell vfp-no-x'},
      header,
      body,
      rest!==null?h(RestTimer,{seconds:rest,onClose:function(){setRest(null);}}):null,
      footer
    );
  }

  function workoutCard(props){
    const workout=props.workout;
    return h('article',{key:props.index,className:'vfp-week-card py-4',style:{borderBottom:props.last?'0':'1px solid rgba(255,255,255,.08)'}},
      h('div',{className:'flex justify-between gap-3'},
        h('div',null,
          h('div',{className:'text-xs text-gray-500'},'Day '+(props.index+1)),
          h('h3',{className:'font-black text-lg mt-1'},text(workout.name)),
          h('div',{className:'text-sm text-gray-500 mt-1'},((workout.exercises||[]).length)+' exercises')
        ),
        h('span',{className:'vfp-status '+(props.done?'done':props.status==='Current'?'current':'')},props.status)
      ),
      h('button',{type:'button',className:'vfp-btn '+(props.done?'vfp-secondary':'vfp-primary')+' mt-3',onClick:props.onOpen},props.done?'Review Workout':'Start or Continue')
    );
  }

  function historyModal(logs,onClose){
    let content=h('p',{className:'text-gray-400'},'Your completed set history will appear here.');
    if(logs.length){
      content=h('div',{className:'space-y-3'},logs.map(function(item,index){
        const done=Object.values(item.sets||{}).flat().filter(function(row){return row.done;}).length;
        return h('div',{key:index,className:'vfp-card p-4'},
          h('div',{className:'font-black'},item.completedAt?new Date(item.completedAt).toLocaleDateString():'Saved Workout'),
          h('div',{className:'text-sm text-gray-400 mt-1'},Math.round((item.duration||0)/60)+' min · '+done+' sets'),
          item.workoutNote?h('p',{className:'text-sm text-gray-300 mt-2'},item.workoutNote):null
        );
      }));
    }
    return h(Modal,{title:'Exercise History',onClose:onClose},content);
  }

  function ProgramDashboard(props){
    const mergedEnrollment=Object.assign({},props.enrollment,{
      currentWeek:props.currentWeek,
      completedWorkouts:props.completedWorkouts,
      completedWorkoutsV2:props.completedWorkouts,
      completionSchema:Core&&Core.schema
    });
    const data=programData(props.program,mergedEnrollment);
    const week=data.currentWeek||props.currentWeek||1;
    const workouts=Core?Core.workoutsForWeek(props.program,week):((((props.program.weeklyPlans||[])[week-1]||(props.program.weeklyPlans||[])[0]||{}).workouts)||[]);
    const panelState=React.useState(null);
    const panel=panelState[0];
    const setPanel=panelState[1];

    if(props.selectedWorkout!==null){
      return h(WorkoutPlayer,{
        enrollment:props.enrollment,
        workout:props.getWorkoutForWeek(props.selectedWorkout),
        workoutIndex:props.selectedWorkout,
        week:week,
        onExit:props.onExitWorkout,
        onComplete:function(payload){return props.onCompleteWorkout(Object.assign({},payload,{workoutIndex:props.selectedWorkout}));}
      });
    }

    const next=Math.min(Math.max(0,workouts.length-1),data.thisWeek);
    const completed=data.status==='completed';
    const cards=workouts.map(function(workout,index){
      const key=Core?Core.canonicalKey(week,index):'week'+week+'-day'+index;
      const done=data.completed.indexOf(key)!==-1;
      const inProgress=!!localStorage.getItem('vfp-session-'+props.enrollment.id+'-'+week+'-'+index);
      const status=done?'Completed':inProgress?'In Progress':index===next?'Current':'Upcoming';
      return workoutCard({workout:workout,index:index,last:index===workouts.length-1,done:done,status:status,onOpen:function(){props.onSelectWorkout(index);}});
    });
    const logs=Object.values(props.enrollment.setLogs||{}).slice(-8).reverse();

    const primaryActions=completed
      ?h('div',{className:'vfp-completion-actions'},
          h('button',{type:'button',className:'vfp-btn vfp-secondary',onClick:function(){props.onSelectWorkout(0);}},'Review Program'),
          h('button',{type:'button',className:'vfp-btn vfp-primary',onClick:props.onBrowse||function(){if(global.VFitnessRouter)global.VFitnessRouter.openStore();}},'Start Next Phase')
        )
      :h('div',{className:'vfp-completion-actions'},
          h('button',{type:'button',className:'vfp-btn vfp-primary',onClick:function(){props.onSelectWorkout(next);}},'Start Next Workout'),
          h('button',{type:'button',className:'vfp-btn vfp-secondary',onClick:props.onMeal},'View Meal Plan')
        );

    const summaryMetrics=[
      ['This Week',data.thisWeek+' / '+data.perWeek],
      ['Current Week',week+' / '+data.weeks],
      ['Completed',data.completed.length],
      ['Remaining',data.remaining]
    ].map(function(metric,index){return simpleMetric(metric[0],metric[1],'dashboard-'+index);});

    const hero=h('section',{className:'vfp-active rounded-[28px] p-6 sm:p-8 mb-6'},
      h('span',{className:'vfp-status '+(completed?'done':'current')},completed?'Completed':'Week '+week+' of '+data.weeks),
      h('h1',{className:'text-3xl sm:text-5xl font-black mt-4'},text(props.program.title)),
      h('div',{className:'vfp-progress-summary mt-5'},
        h('strong',null,data.pct+'% Complete'),
        h('span',null,data.completed.length+' of '+data.total+' workouts · '+data.remaining+' remaining'),
        h(Progress,{pct:data.pct})
      ),
      primaryActions,
      h('div',{className:'grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6'},summaryMetrics)
    );

    const schedule=h('section',{className:'vfp-card p-5 sm:p-6'},
      h('div',{className:'flex justify-between items-end mb-4'},
        h('div',null,
          h('div',{className:'text-xs uppercase tracking-widest text-gray-500'},'Weekly Plan'),
          h('h2',{className:'text-2xl font-black mt-1'},completed?'Review Your Schedule':'Your Schedule')
        ),
        h('div',{className:'text-sm text-gray-500'},data.thisWeek+' / '+data.perWeek)
      ),
      h('div',null,cards)
    );

    return h('div',{className:'vfp-shell min-h-screen pt-28 pb-20 px-4 vfp-no-x',style:{background:'#070809'}},
      h('div',{className:'max-w-5xl mx-auto'},
        h('button',{type:'button',className:'vfp-btn vfp-secondary mb-5',onClick:props.onBack},'Back to Programs'),
        hero,
        schedule,
        h('div',{className:'grid sm:grid-cols-3 gap-3 mt-6'},
          h('button',{type:'button',className:'vfp-btn vfp-secondary',onClick:props.onWeight},'Log Weight'),
          h('button',{type:'button',className:'vfp-btn vfp-secondary',onClick:function(){setPanel('history');}},'Exercise History'),
          h('button',{type:'button',className:'vfp-btn vfp-secondary',onClick:props.onNote},'Program Note')
        ),
        panel==='history'?historyModal(logs,function(){setPanel(null);}):null
      )
    );
  }

  global.VFPProgramData=programData;
  global.VFPProgress=Progress;
  global.VFPModal=Modal;
  global.VFPProgramLibrary=ProgramLibrary;
  global.VFPRestTimer=RestTimer;
  global.VFPWorkoutPlayer=WorkoutPlayer;
  global.VFPProgramDashboard=ProgramDashboard;
})(window);
