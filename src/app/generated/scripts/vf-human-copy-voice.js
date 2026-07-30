/* Captured from the verified VFitness production shell. */
/* VFITNESS human copy pass: removes generic/public-facing filler and keeps client wording grounded. */
(function(){
  var COPY = {
    'Complete Fitness System':'Coaching That Holds You Accountable',
    'Complete Fitness Transformation Platform':'Online & In Person Coaching',
    'Train smart, train elite, built in The Bahamas for real results.':'Training, meals, check ins, and coaching we actually use with clients in The Bahamas.',
    'VFITNESS Transformation System':'VFITNESS Coaching Built From Real Client Work',
    'Workout tracking • Meal planning • Progress photos • Check ins • Trainer feedback':'Workouts, meals, check ins, progress photos, and trainer feedback in one place',
    'Premium fitness transformation platform, built in The Bahamas for real results.':'Built in The Bahamas from real coaching, real check ins, and results we can point to.',
    'Browse every VFITNESS program by goal and level.':'Pick the plan that matches how you actually train, not the one that only looks good on paper.',
    'No programs in this category yet':'Nothing is sitting in this lane yet. Try another goal or level.',
    'Choose how you want to start: train online from anywhere or train in person in Nassau. Every path leads to clear coaching, simple next steps, and real transformation proof.':'Start where you are. Train online if your schedule is tight, or train in person in Nassau if you need hands on coaching. Either way, you get a plan, check ins, and proof that the work is moving.',
    'One Platform.':'One VFITNESS.',
    'Goal Contract':'Goal Agreement',
    'Client goal → plan → check ins → measurable proof':'Your goal → your plan → weekly check ins → proof you can measure',
    'Choose path':'Choose your lane',
    'Follow the plan':'Do the work',
    'Check in weekly':'Check in honestly',
    'Renew or upgrade from proof':'Adjust from real results',
    'Programs, app dashboard, weekly check ins, nutrition guidance, progress photos, and coach feedback for clients anywhere.':'Programs, your dashboard, weekly check ins, food guidance, progress photos, and coach feedback, built for clients who are training outside the gym.',
    'Clients choose Online or In Person first. From there, every button leads them to a real app area: programs, pricing, signup, dashboard, or WhatsApp.':'Most people just need to know where to start. Online or in person first, then the app gets them to the right next step without making them dig.',
    'Browse the VFITNESS program library, choose a goal, purchase/get the program, then start Week 1 inside My Programs.':'Pick the program that fits your life, pay once, and start Week 1 inside your dashboard.',
    'Body measurements, movement screens, program phases, and reassessment reminders to prove progress professionally.':'We measure, retest, and adjust instead of guessing. That is how we know if the plan is working.',
    'You are about to start the':'You are about to start',
    "You'll get instant access to:":'Once payment clears, it opens inside your dashboard with:',
    'Online Payment Only':'Online payment keeps your access clean',
    'Self-training programs require instant online payment via PayPal. One time payment of':'This program is a one time PayPal payment. No subscription, no surprise charge. Total:',
    'Continue to Payment':'Continue to PayPal',
    'Complete your payment below':'Finish your payment below',
    'Sign in to continue your training.':'Sign in and pick up where you left off.',
    "Don't have an account? Sign Up":'New here? Create your account',
    'No invoices available yet.':'No invoices are ready yet.',
    'Download invoices linked to your assigned packages.':'Your invoices show up here once a package is assigned or purchased.',
    'Package Management':'Package Control',
    'Search trainer / assigner...':'Search trainer or assignment...',
    'Need Attention':'Needs a Look',
    'Active Alerts':'Alerts',
    'Add transformation photos in Admin → Gallery to feature them here.':'Real results are loading. Give it a second.',
    'Real transformation results are loading for you.':'Real results are loading. Give it a second.',
    'Admin Gallery':'results gallery',
    'WhatsApp Coach':'Message Coach',
    'What do I need to do today?':'What needs to get done today?',
    'Progress Snapshot':'Progress Check',
    'Run VFITNESS OS.':'Run the business from here.',
    'Analytics':'Numbers',
    'Audit Trail':'Change Log',
    'Button QA':'Button Check',
    'Package Card':'Package Record',
    'Reminder workflow:':'Renewal reminder:',
    'This does not auto-charge.':'No automatic charge is attached.',
    'Assigned clients only.':'Only assigned clients show here.',
    'Log sessions without changing payment logic.':'Log the session without touching payment records.',
    'Add meal and workout notes.':'Leave meal notes, workout notes, and check in feedback.',
    'Firebase setup required':'Connection setup needed',
    'PayPal setup required':'Payment setup needed',
    'Firebase connected':'Account system connected',
    'PayPal linked':'PayPal linked',
    'Admin Setup':'Connection Setup',
    'Connect Firebase and PayPal.':'Connect accounts and payments.',
    'Paste your Firebase web config JSON and PayPal public client ID here. This keeps identifiers out of source code.':'Paste the connection details here once. The app uses them to reach your existing client records and PayPal checkout.',
    'Login or create a client account after Admin Setup is saved.':'Log in after the connection is saved. New clients can create an account from here.',
    'Login / Sign Up':'Login or Create Account',
    'For QA only. Real access is Firebase role-based.':'Preview only. Real access follows the roles saved in Firebase.',
    'Payment saved to Firebase':'Payment saved to the client record',
    'Login before payment so Firebase can save the record.':'Log in before paying so the purchase lands on the right account.',
    'Enrollment saves to workoutProgramEnrollments.':'This adds the program to the client dashboard.',
    'Package saves to packages with protected sessions remaining.':'This creates the package record and keeps the session count protected.',
    'Password reset email sent. Check inbox or spam folder.':'Reset email sent. Check the inbox first, then spam if it is not there.',
    'Enter your email first, then tap Forgot Password.':'Type your email first, then tap forgot password.',
    'Forgot Password? Recover Account':'Forgot password? Recover account',
    'Unable to send reset email.':'The reset email did not send. Check the email and try again.',
    'Unable to start password recovery. Try again.':'Recovery did not start. Try again in a moment.',
    'Firebase is still loading. Try again in a few seconds.':'The account system is still loading. Try again in a few seconds.'
  };
  var BLOCKED_PUBLIC = [/add transformation photos/i,/admin\s*gallery/i,/business scaling/i,/package protection/i,/developer tools/i,/system qa/i];
  function onAdminPage(){ return /admin dashboard|package control|all clients|button check|site editor|change log/i.test(document.body.innerText||''); }
  function rewriteTextValue(text){
    var out = text;
    Object.keys(COPY).forEach(function(k){
      if(out.indexOf(k) !== -1) out = out.split(k).join(COPY[k]);
    });
    if(!onAdminPage()){
      BLOCKED_PUBLIC.forEach(function(rx){ if(rx.test(out)) out = 'Real results are loading. Give it a second.'; });
    }
    return out;
  }
  function applyHumanCopy(){
    try{
      var walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT);
      var node;
      while((node = walker.nextNode())){
        var parent=node&&node.parentElement;
        if(parent&&parent.closest('script,style,noscript,template')) continue;
        var old = node.nodeValue;
        if(!old || !old.trim()) continue;
        var next = rewriteTextValue(old);
        if(next !== old) node.nodeValue = next;
      }
      document.querySelectorAll('input,textarea').forEach(function(el){
        ['placeholder','aria-label','title'].forEach(function(attr){
          var v = el.getAttribute(attr); if(!v) return;
          var n = rewriteTextValue(v); if(n !== v) el.setAttribute(attr,n);
        });
      });
      document.querySelectorAll('[title],[aria-label]').forEach(function(el){
        if(el.closest&&el.closest('script,style,noscript,template')) return;
        ['title','aria-label'].forEach(function(attr){
          var v = el.getAttribute(attr); if(!v) return;
          var n = rewriteTextValue(v); if(n !== v) el.setAttribute(attr,n);
        });
      });
    }catch(e){}
  }
  document.addEventListener('DOMContentLoaded', applyHumanCopy);
  window.addEventListener('load', applyHumanCopy);
  window.addEventListener('vf:ui-rendered',()=>setTimeout(applyHumanCopy,80));
})();
