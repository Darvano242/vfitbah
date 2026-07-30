/* Dedicated Programs error boundary with recoverable actions and diagnostic references. */
(function(global){
  'use strict';
  if(!global.React)return;

  class VFitnessProgramErrorBoundary extends global.React.Component{
    constructor(props){
      super(props);
      this.state={error:null,reference:null,resetKey:0};
      this.retry=this.retry.bind(this);
      this.returnToPrograms=this.returnToPrograms.bind(this);
    }
    static getDerivedStateFromError(error){return {error:error};}
    componentDidCatch(error,info){
      const reference='VFP-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
      this.setState({reference:reference});
      const payload={
        type:'program_runtime_error',
        feature:'programs',
        action:this.props.action||'program_dashboard',
        programId:this.props.programId||'',
        enrollmentId:this.props.enrollmentId||'',
        reference:reference,
        message:error&&error.message||String(error||'Unknown Programs error'),
        stack:error&&error.stack||'',
        componentStack:info&&info.componentStack||''
      };
      try{
        if(global.VFitnessDiagnostics&&typeof global.VFitnessDiagnostics.capture==='function')global.VFitnessDiagnostics.capture(payload);
        else console.error('PROGRAM_RUNTIME_ERROR',payload);
      }catch(_){ }
    }
    retry(){this.setState(function(state){return {error:null,reference:null,resetKey:state.resetKey+1};});}
    returnToPrograms(){
      try{if(global.VFitnessRouter)global.VFitnessRouter.openMyPrograms();}catch(_){ }
      if(typeof this.props.onReturn==='function')this.props.onReturn();
      else global.location.assign('/my-programs');
    }
    render(){
      if(!this.state.error)return global.React.createElement(global.React.Fragment,{key:this.state.resetKey},this.props.children);
      const ref=this.state.reference||'VFP-PENDING';
      const supportSubject=encodeURIComponent('VFitness Programs Error '+ref);
      const supportBody=encodeURIComponent('Please help me with a Programs error.\n\nReference: '+ref+'\nProgram: '+(this.props.programId||'Unknown')+'\nEnrollment: '+(this.props.enrollmentId||'Unknown'));
      return global.React.createElement('div',{className:'min-h-screen pt-28 pb-20 px-4',style:{background:'#070809',color:'#fff'}},
        global.React.createElement('div',{className:'max-w-xl mx-auto rounded-3xl p-6 sm:p-8',style:{background:'#101318',border:'1px solid rgba(255,255,255,.12)',boxShadow:'0 24px 80px rgba(0,0,0,.45)'}},
          global.React.createElement('div',{className:'text-xs font-black tracking-widest mb-3',style:{color:'#f59e0b'}},'PROGRAM RECOVERY'),
          global.React.createElement('h1',{className:'text-3xl font-black mb-3'},'This program did not load correctly.'),
          global.React.createElement('p',{className:'mb-5',style:{color:'#a8b0bd',lineHeight:1.6}},'Your purchase and workout history are still protected. Try reopening the program. If the issue continues, send the reference below to VFitness support.'),
          global.React.createElement('div',{className:'rounded-2xl p-4 mb-5',style:{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)'}},
            global.React.createElement('div',{className:'text-xs mb-1',style:{color:'#7f8998'}},'Error reference'),
            global.React.createElement('strong',{style:{fontFamily:'monospace'}},ref)
          ),
          global.React.createElement('div',{className:'grid sm:grid-cols-2 gap-3'},
            global.React.createElement('button',{type:'button',onClick:this.retry,className:'vfp-btn vfp-primary'},'Try Again'),
            global.React.createElement('button',{type:'button',onClick:this.returnToPrograms,className:'vfp-btn vfp-secondary'},'Return to Programs'),
            global.React.createElement('a',{href:'mailto:vfitnessbahamas@gmail.com?subject='+supportSubject+'&body='+supportBody,className:'vfp-btn vfp-secondary sm:col-span-2',style:{textAlign:'center'}},'Contact Support')
          )
        )
      );
    }
  }

  global.VFitnessProgramErrorBoundary=VFitnessProgramErrorBoundary;
})(window);
