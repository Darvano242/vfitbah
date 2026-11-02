// Remove legacy page code that the 2026 site layer replaced and nothing can reach any more.
// Runs last in the build, on the built page only (the source keeps it). Each entry is cut from its start
// to the start of the next top-level statement. Fail safe: if an anchor is not found exactly once, that entry
// is skipped; if the result does not parse, the page is written unchanged.
// The list comes from a reachability check of the built page (identifier references, string mentions,
// dynamic legacy('Name') lookups and every build step's patch targets). Re-run it when legacy code changes.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const file=path.join(__dirname,'..','site','index.html');
const DEAD=[
 {
  "name": "VFLegacyHomePage",
  "head": "function VFLegacyHomePage(",
  "next": "function FeatureCard({icon,title,description,theme='dark'}){"
 },
 {
  "name": "VFLegacyWorkoutProgramsPage",
  "head": "function VFLegacyWorkoutProgramsPage(",
  "next": "function ActiveProgramView({enrollment,user,theme,onComplete"
 },
 {
  "name": "ActiveProgramView",
  "head": "function ActiveProgramView(",
  "next": "function VFLegacyFooter({setCurrentPage}){return/*#__PURE__*"
 },
 {
  "name": "VFLegacyAboutPage",
  "head": "function VFLegacyAboutPage(",
  "next": "function VFLegacyLoginPage({setCurrentPage}){const[email,set"
 },
 {
  "name": "VFLegacyNavigation",
  "head": "function VFLegacyNavigation(",
  "next": "const VH=React.createElement;\n\nconst VF_CARD_STYLE={backgrou"
 },
 {
  "name": "VFLegacyPricingPage",
  "head": "function VFLegacyPricingPage(",
  "next": "function VFLegacyTrainersPage({setCurrentPage,user}){const t"
 },
 {
  "name": "VFLegacyProgramLibraryPage",
  "head": "function VFLegacyProgramLibraryPage(",
  "next": "function VFLegacyLegalPage({kind='privacy',theme='dark'}){co"
 },
 {
  "name": "VFLegacyTrainersPage",
  "head": "function VFLegacyTrainersPage(",
  "next": "function VFLegacyAboutPage({theme='dark'}){const[gallery,set"
 },
 {
  "name": "VFLegacySessionMeter",
  "head": "function VFLegacySessionMeter(",
  "next": "function VFLegacyDashboardPage({user,isAdmin,theme='dark',in"
 },
 {
  "name": "VFLegacyVFResultsPage",
  "head": "function VFLegacyVFResultsPage(",
  "next": "function VFLegacyVFLocationsPage({setCurrentPage}){\n return "
 },
 {
  "name": "VFLegacyFooter",
  "head": "function VFLegacyFooter(",
  "next": "function VFLegacyPremiumTrainingDirectionPage({setCurrentPag"
 },
 {
  "name": "vfShowCertificate",
  "head": "function vfShowCertificate(",
  "next": "const HOME_30DAY_PROGRAM={id:'home-30day',title:'HOME 30: 30"
 },
 {
  "name": "VFLegacyTestimonialSlider",
  "head": "function VFLegacyTestimonialSlider(",
  "next": "function TrainerSelectionModal({isOpen,onClose,selectedPacka"
 },
 {
  "name": "VFLegacyVFContactPage",
  "head": "function VFLegacyVFContactPage(",
  "next": "function VFXProofCounter({setCurrentPage}){\n return VH(\"div\""
 },
 {
  "name": "VF_TEAM",
  "head": "const VF_TEAM=[\n {name:\"",
  "next": "const VF_LOCATIONS=[[\"Empire Fitness\",\"Nassau, New Providenc"
 },
 {
  "name": "VFLegacyRealTimeClock",
  "head": "function VFLegacyRealTimeClock(",
  "next": "function SleepTracker({user,theme='dark'}){const[sleepLogs,s"
 },
 {
  "name": "VFLegacyIco3D",
  "head": "function VFLegacyIco3D({",
  "next": "const EXERCISE_DATABASE={chest:[{id:'bench-press',name:'Barb"
 },
 {
  "name": "VFXProofCounter",
  "head": "function VFXProofCounter(",
  "next": "function VFXNumbers(){\n const nums=[[\"2,000+\",\"Clients Serve"
 },
 {
  "name": "VFXNumbers",
  "head": "function VFXNumbers(){\n ",
  "next": "function VFLegacyHomePage({setCurrentPage,theme='dark'}){con"
 },
 {
  "name": "VFLegacyVFLocationsPage",
  "head": "function VFLegacyVFLocationsPage(",
  "next": "function VFLegacyVFContactPage({setCurrentPage}){\n const car"
 },
 {
  "name": "VF_LOCATIONS",
  "head": "const VF_LOCATIONS=[[\"Em",
  "next": "const VF_FAQ=[\n [\"Do I need a gym membership?\",\"Yes, a gym m"
 }
];
const before=fs.readFileSync(file,'utf8');
let html=before,cut=0,skipped=[];
const count=(s,x)=>s.split(x).length-1;
for(const d of DEAD.slice().sort((x,y)=>html.indexOf(x.head)-html.indexOf(y.head))){
  if(count(html,d.head)!==1||count(html,d.next)!==1){skipped.push(d.name);continue;}
  const a=html.indexOf(d.head),b=html.indexOf(d.next);
  if(b<=a||/<\/script>/i.test(html.slice(a,b))){skipped.push(d.name);continue;}
  cut+=b-a;html=html.slice(0,a)+html.slice(b);
}
const inline=[...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
try{inline.forEach((code,i)=>new vm.Script(code,{filename:'inline-'+i+'.js'}));}
catch(e){console.warn('Unused legacy strip skipped: result did not parse ('+e.message+')');process.exit(0);}
fs.writeFileSync(file,html);
console.log('Removed '+(DEAD.length-skipped.length)+' unused legacy blocks ('+Math.round(cut/1024)+' KB)'+(skipped.length?'; skipped '+skipped.join(', '):''));
