/* VFITNESS canonical program state service.
 * Preserves existing Firebase enrollments while normalizing legacy workout IDs.
 */
(function(global){
  'use strict';

  const SCHEMA='zero-based-v2';

  function safeArray(value){return Array.isArray(value)?value:[];}
  function weeksOf(program){return safeArray(program&&program.weeklyPlans);}
  function workoutsForWeek(program,weekNumber){
    const weeks=weeksOf(program);
    const requested=weeks[Math.max(0,Number(weekNumber||1)-1)]||{};
    const base=weeks[0]||{};
    const workouts=safeArray(requested.workouts);
    return workouts.length?workouts:safeArray(base.workouts);
  }
  function weekCount(program){return Math.max(1,weeksOf(program).length||1);}
  function canonicalKey(week,workoutIndex){return 'week'+Number(week)+'-day'+Number(workoutIndex);}

  function parseLegacyKey(key,program,schema){
    const text=String(key||'').trim();
    let match=text.match(/^week(\d+)-day(\d+)$/i);
    if(match){
      const week=Number(match[1]);
      const raw=Number(match[2]);
      const index=schema===SCHEMA?raw:(raw===0?0:raw-1);
      return {week,index};
    }
    match=text.match(/^week(\d+)-(\d+)$/i);
    if(match){
      const week=Number(match[1]);
      const raw=Number(match[2]);
      return {week,index:raw===0?0:raw-1};
    }
    return null;
  }

  function canonicalCompleted(program,enrollment){
    const source=safeArray(enrollment&&((enrollment.completedWorkoutsV2&&enrollment.completedWorkoutsV2.length)?enrollment.completedWorkoutsV2:enrollment.completedWorkouts));
    const schema=enrollment&&enrollment.completionSchema;
    const seen=new Set();
    source.forEach(function(key){
      const parsed=parseLegacyKey(key,program,schema);
      if(!parsed||parsed.week<1||parsed.week>weekCount(program)||parsed.index<0)return;
      const max=workoutsForWeek(program,parsed.week).length;
      if(parsed.index>=max)return;
      seen.add(canonicalKey(parsed.week,parsed.index));
    });
    return Array.from(seen);
  }

  function totalWorkouts(program){
    let total=0;
    for(let week=1;week<=weekCount(program);week++)total+=workoutsForWeek(program,week).length;
    return Math.max(1,total);
  }

  function completedInWeek(program,enrollment,week){
    const prefix='week'+Number(week)+'-day';
    return canonicalCompleted(program,enrollment).filter(function(key){return key.indexOf(prefix)===0;});
  }

  function derive(program,enrollment){
    const completed=canonicalCompleted(program,enrollment);
    const total=totalWorkouts(program);
    const pct=Math.min(100,Math.round(completed.length/total*100));
    const weeks=weekCount(program);
    let firstOpen=weeks;
    for(let week=1;week<=weeks;week++){
      if(completedInWeek(program,{completedWorkoutsV2:completed,completionSchema:SCHEMA},week).length<workoutsForWeek(program,week).length){firstOpen=week;break;}
    }
    const stored=Math.max(1,Math.min(Number(enrollment&&enrollment.currentWeek)||1,weeks));
    const currentWeek=pct>=100?weeks:Math.max(stored,firstOpen);
    const currentWorkouts=workoutsForWeek(program,currentWeek);
    const thisWeek=completedInWeek(program,{completedWorkoutsV2:completed,completionSchema:SCHEMA},currentWeek).length;
    return {
      schema:SCHEMA,
      weeks:weeks,
      total:total,
      completed:completed,
      pct:pct,
      remaining:Math.max(0,total-completed.length),
      currentWeek:currentWeek,
      currentWorkouts:currentWorkouts,
      thisWeek:thisWeek,
      perWeek:currentWorkouts.length,
      status:pct>=100?'completed':completed.length?'active':'not_started'
    };
  }

  async function completeWorkout(options){
    options=options||{};
    const db=options.db||global.db;
    const firebase=options.firebase||global.firebase;
    const enrollment=options.enrollment||{};
    const program=options.program;
    const week=Math.max(1,Number(options.week)||1);
    const workoutIndex=Math.max(0,Number(options.workoutIndex)||0);
    const log=options.log||{};
    if(!db||!firebase||!enrollment.id||!program)throw new Error('Program completion is missing required data.');
    const ref=db.collection('workoutProgramEnrollments').doc(enrollment.id);
    const serverTimestamp=firebase.firestore.FieldValue.serverTimestamp;
    let result=null;

    await db.runTransaction(async function(transaction){
      const snapshot=await transaction.get(ref);
      if(!snapshot.exists)throw new Error('This program enrollment no longer exists.');
      const fresh=Object.assign({id:snapshot.id},snapshot.data()||{});
      const before=derive(program,fresh);
      const completed=new Set(before.completed);
      const key=canonicalKey(week,workoutIndex);
      completed.add(key);
      const canonical=Array.from(completed);
      const nextEnrollment=Object.assign({},fresh,{completedWorkoutsV2:canonical,completedWorkouts:canonical,completionSchema:SCHEMA});
      const after=derive(program,nextEnrollment);
      const currentWeekComplete=completedInWeek(program,nextEnrollment,week).length>=workoutsForWeek(program,week).length;
      const nextWeek=after.status==='completed'?after.weeks:(currentWeekComplete?Math.min(after.weeks,week+1):Math.max(week,Number(fresh.currentWeek)||1));
      const logKey=options.sessionKey||('week'+week+'-day'+workoutIndex);
      const setLogs=Object.assign({},fresh.setLogs||{});
      setLogs[logKey]=Object.assign({},log,{week:week,workoutIndex:workoutIndex,workoutKey:key});
      const update={
        completedWorkouts:canonical,
        completedWorkoutsV2:canonical,
        completionSchema:SCHEMA,
        setLogs:setLogs,
        currentWeek:nextWeek,
        status:after.status==='completed'?'completed':'active',
        lastWorkoutCompleted:serverTimestamp(),
        lastWorkoutDate:serverTimestamp(),
        updatedAt:serverTimestamp()
      };
      if(!fresh.legacyCompletedWorkouts&&safeArray(fresh.completedWorkouts).length)update.legacyCompletedWorkouts=safeArray(fresh.completedWorkouts);
      if(after.status==='completed'){
        update.completedAt=fresh.completedAt||serverTimestamp();
        update.completedDate=fresh.completedDate||serverTimestamp();
      }
      transaction.update(ref,update);
      result={
        enrollmentId:enrollment.id,
        workoutKey:key,
        completedWorkouts:canonical,
        status:update.status,
        currentWeek:nextWeek,
        pct:after.pct,
        remaining:after.remaining,
        alreadyCompleted:before.completed.indexOf(key)!==-1
      };
    });
    return result;
  }

  async function synchronizeStatus(options){
    options=options||{};
    const db=options.db||global.db;
    const firebase=options.firebase||global.firebase;
    const program=options.program;
    const enrollment=options.enrollment||{};
    if(!db||!firebase||!program||!enrollment.id)return null;
    const data=derive(program,enrollment);
    if(data.status!=='completed'||enrollment.status==='completed')return data;
    const ref=db.collection('workoutProgramEnrollments').doc(enrollment.id);
    await ref.set({
      status:'completed',
      completedWorkouts:data.completed,
      completedWorkoutsV2:data.completed,
      completionSchema:SCHEMA,
      completedAt:firebase.firestore.FieldValue.serverTimestamp(),
      completedDate:firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});
    return data;
  }

  global.VFitnessProgramCore={
    schema:SCHEMA,
    workoutsForWeek:workoutsForWeek,
    weekCount:weekCount,
    canonicalKey:canonicalKey,
    canonicalCompleted:canonicalCompleted,
    totalWorkouts:totalWorkouts,
    derive:derive,
    completeWorkout:completeWorkout,
    synchronizeStatus:synchronizeStatus
  };
})(window);
