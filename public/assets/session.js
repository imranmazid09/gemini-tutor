import {LETTERS, RUBRIC_VERSION, briefSnapshot, readiness, formatIssues, SCENARIO, getScenario, splitExpected,PLATFORMS,outputSpec,CREATIVE_ANGLES} from './framework.js';
export const STORAGE_KEY='brief-trainer-v1';
export function newReview(){return {claims:[],noClaims:false,noClaimsReason:'',fit:'',finalCopy:'',explanation:'',confirmed:false,completedAt:null};}
export function newSession(scenario=SCENARIO.id){return {version:1,rubricVersion:RUBRIC_VERSION,id:crypto.randomUUID(),startedAt:new Date().toISOString(),workingTime:{milliseconds:0,complete:true},revision:0,scenario,eParts:{objective:'',format:'',creative:'auto'},feedback:null,output:'',platform:'instagram',brief:Object.fromEntries(LETTERS.map(k=>[k,''])),grade:null,draft:null,review:newReview(),events:[{type:'session_start',at:new Date().toISOString()}],grades:[],coaching:[],drafts:[]};}
export function hasCurrentGrade(session){
  const g=session.grade;
  try{return Boolean(g && g.snapshot===briefSnapshot(session.brief) && g.output===session.output && (g.scenario??SCENARIO.id)===session.scenario && (g.platform??'instagram')===(session.platform??'instagram') && g.rubricVersion===RUBRIC_VERSION && readiness(g.elements).greenlit && Array.isArray(g.unsupportedClaims) && g.unsupportedClaims.length===0 && g.approval);}catch{return false;}
}
export function hasCurrentDraft(session){return Boolean(session.draft && session.draft.snapshot===briefSnapshot(session.brief) && session.draft.output===session.output && (session.draft.scenario??SCENARIO.id)===session.scenario && (session.draft.platform??'instagram')===(session.platform??'instagram'));}
export function invalidateBrief(session){session.revision++;session.grade=null;session.feedback=null;session.review.completedAt=null;}
export function reviewValidation(session){
  const r=session.review, issues=[];
  const add=(message,...fields)=>issues.push({message,fields});
  if(!hasCurrentDraft(session))add('Generate a draft from your current BRIEF first.','generate');
  if(r.noClaims){
    if(r.claims.length)add('Remove claim rows only if you found no factual claims.','noClaims');
    if(!r.noClaimsReason.trim())add('Explain what you checked when reporting no factual claims.','noClaimsReason');
  }else{
    const missing=[];
    r.claims.forEach((c,i)=>{for(const key of ['claim','evidence'])if(!c[key].trim())missing.push(`claim-${i}-${key}`);if(!['verified','corrected','removed'].includes(c.decision))missing.push(`decision-${i}`);});
    if(!r.claims.length||missing.length)add('Check every claim row: add evidence or explain the correction/removal, and choose a decision.',...(missing.length?missing:['addClaim']));
  }
  if(!r.fit.trim())add('Explain the audience and objective fit in your own words.','fit');
  if(!r.finalCopy.trim())add('Write your final copy.','finalCopy');
  if(r.finalCopy.trim()===session.draft?.copy.trim())add('Make one purposeful improvement to the original draft.','finalCopy');
  if((r.explanation.match(/[.!?](?:\s|$)/g)||[]).length<2)add('Explain your revision in two complete sentences: what changed and why it helps.','explanation');
  for(const error of formatIssues(r.finalCopy,session.output,session.platform))add(error,'finalCopy');
  if(!r.confirmed)add('Confirm that you checked the whole final copy.','confirmed');
  return issues;
}
export function reviewErrors(session){return reviewValidation(session).map(issue=>issue.message);}
// Counts visible, focused intervals after interaction; pauses after 60 seconds idle.
// A gap over 15 seconds is excluded, so sleep/suspended timers cannot inflate it.
export function workingClock(session,now=()=>performance.now()){
  let previous=now(),lastInteraction=null;
  return {
    tick(eligible){const current=now(),gap=current-previous;if(eligible&&lastInteraction!==null&&gap>=0&&gap<=15000)session.workingTime.milliseconds+=Math.max(0,Math.min(current,lastInteraction+60000)-previous);previous=current;},
    interact(eligible){this.tick(eligible);lastInteraction=eligible?now():null;},
    pause(){this.tick(false);lastInteraction=null;}
  };
}
export function summary(session,now=Date.now()){
  const scores=Object.fromEntries(LETTERS.map(k=>[k,session.grades.length?session.grades.reduce((sum,g)=>sum+g.elements[k].score,0)/session.grades.length:null]));
  const min=Math.min(...Object.values(scores).filter(s=>s!==null));
  const first=session.events.findIndex(e=>e.type==='greenlight');
  return {activityId:session.id,coachRequests:session.events.filter(e=>e.type==='coach_request').length,gradeAttempts:session.events.filter(e=>e.type==='grade_attempt').length,attemptsToFirstGreenlight:first<0?null:session.events.slice(0,first+1).filter(e=>e.type==='grade_attempt').length,weakestElements:LETTERS.filter(k=>scores[k]!==null&&scores[k]===min),averageScores:scores,workingMinutes:Math.round((session.workingTime?.milliseconds??0)/60000),workingTimeComplete:session.workingTime?.complete===true,activityAgeMinutes:Math.max(0,Math.round((now-Date.parse(session.startedAt))/60000)),reviewCompleted:Boolean(session.review.completedAt)};
}
export function restoreSession(raw){
  const s=JSON.parse(raw);
  s.workingTime??={milliseconds:0,complete:false};
  if(!Number.isFinite(s.workingTime.milliseconds)||s.workingTime.milliseconds<0||typeof s.workingTime.complete!=='boolean')throw new Error('Invalid saved working time.');
  // Retire the experimental first-attempt flow while preserving BRIEF work.
  for(const key of ["flowVersion","initialPrompt","initialReflection","baseline","unlockedAt","comparison"])delete s[key];
  if(Array.isArray(s.events))s.events=s.events.filter(event=>!["first_attempt_generated","framework_revealed"].includes(event.type));
  if(Array.isArray(s.drafts))for(const archived of s.drafts)delete archived.comparison;
  if(Array.isArray(s.events))for(const event of s.events)delete event.comparison;
  s.platform??='instagram';if(!Object.hasOwn(PLATFORMS,s.platform))throw new Error('Invalid saved platform.');s.scenario??=SCENARIO.id;s.eParts??=splitExpected(s.brief?.E);s.eParts.creative??='auto';if(!Object.hasOwn(CREATIVE_ANGLES,s.eParts.creative))throw new Error('Invalid creative angle.');s.feedback??=s.grade?{result:{...s.grade,approval:undefined},mode:"grade"}:null;
  if(!getScenario(s.scenario)||typeof s.eParts.objective!=="string"||typeof s.eParts.format!=="string")throw new Error("Invalid saved scenario or expected output.");
  if(s.version!==1 || s.rubricVersion!==RUBRIC_VERSION || typeof s.id!=='string'||!Number.isFinite(Date.parse(s.startedAt))||!Number.isInteger(s.revision)||!LETTERS.every(k=>typeof s.brief?.[k]==='string'&&s.brief[k].length<=6000)||!['','organic','ad'].includes(s.output)||!Array.isArray(s.events)||!Array.isArray(s.grades)||!Array.isArray(s.coaching)||!Array.isArray(s.drafts)||!s.review||!Array.isArray(s.review.claims))throw new Error('Saved session needs recovery.');
  for(const k of ['finalCopy','fit','explanation','noClaimsReason'])if(typeof s.review[k]!=='string')throw new Error('Invalid saved review.');
  if(s.review.claims.some(c=>typeof c.claim!=='string'||typeof c.evidence!=='string'||typeof c.decision!=='string'))throw new Error('Invalid saved claims.');
  for(const g of s.grades)readiness(g.elements);
  if(s.draft && (typeof s.draft.copy!=='string'||!Array.isArray(s.draft.claims)))throw new Error('Invalid saved draft.');
  if(s.review.completedAt && reviewErrors(s).length)s.review.completedAt=null;
  return s;
}
export function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function reportHTML(session){
  const e=escapeHTML, info=summary(session);
  const record={...session,feedback:session.feedback?{...session.feedback,result:{...session.feedback.result,approval:undefined}}:null,grade:session.grade?{...session.grade,approval:undefined}:null,grades:session.grades.map(g=>({...g,approval:undefined}))};
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>BRIEF learning record</title><style>body{font:16px/1.6 Arial,sans-serif;color:#17211F;max-width:900px;margin:32px auto;padding:24px}h1{font-family:Georgia,serif}pre{white-space:pre-wrap;overflow-wrap:anywhere;padding:16px;background:#F8F6F0}table{width:100%;border-collapse:collapse}td,th{border:1px solid #D5D9D0;padding:8px;text-align:left}th{background:#D9EBE3}@media print{details{display:block}pre{background:white}}</style><body><h1>BRIEF learning record</h1><p>${e(RUBRIC_VERSION)} | ${e(session.review.completedAt?'Review completed':'Work in progress')}</p><h2>Process summary</h2><p>Activity ${e(info.activityId)}. Coach requests: ${info.coachRequests}. Rubric checks: ${info.gradeAttempts}. Checks before first ready-to-draft result: ${info.attemptsToFirstGreenlight??'Not yet'}. Recorded working time${info.workingTimeComplete?'':' since timing update'}: ${info.workingMinutes} minutes. ${info.workingTimeComplete?'':'Earlier working-time history is unavailable; this is a partial record. '}Estimate of visible, focused browser time after interaction; pauses after 60 seconds idle and excludes closed/hidden time. Not a measure of attention. Activity age (including time away): ${info.activityAgeMinutes} minutes. Fields to revisit by average rubric score: ${e(info.weakestElements.join(', ')||'No grades yet')}.</p><h2>Practice situation</h2><p>${e(getScenario(session.scenario)?.title)}</p><pre>${e(getScenario(session.scenario).task)}

Approved facts:
${e(getScenario(session.scenario).facts.join("\n"))}

Factual boundaries:
${e(getScenario(session.scenario).limits)}

Style reference only:
${e(getScenario(session.scenario).reference)}</pre><h2>Platform and message type</h2><p>${e(session.output?outputSpec(session.output,session.platform).label:PLATFORMS[session.platform]?.label||'Not selected')}</p><h2>Final BRIEF</h2>${LETTERS.map(k=>`<h3>${k}</h3><pre>${e(session.brief[k])}</pre>`).join('')}<h2>Original AI draft</h2><pre>${e(session.draft?.copy||'No draft yet')}</pre><h2>Revised final copy</h2><pre>${e(session.review.finalCopy)}</pre><h2>Facts</h2><table><thead><tr><th>Claim</th><th>Evidence or change</th><th>Decision</th></tr></thead><tbody>${session.review.claims.map(c=>`<tr><td>${e(c.claim)}</td><td>${e(c.evidence)}</td><td>${e(({verified:'Verified against the fact sheet',corrected:'Corrected in the final copy',removed:'Removed from the final copy'})[c.decision]||'Not selected')}</td></tr>`).join('')}</tbody></table>${session.review.noClaims?`<p>No factual claims reported: ${e(session.review.noClaimsReason)}</p>`:''}<h2>Fit</h2><pre>${e(session.review.fit)}</pre><h2>Revision explanation</h2><pre>${e(session.review.explanation)}</pre><p>Human confirmation: ${session.review.confirmed?'Yes':'Not yet'}. Review saved: ${e(session.review.completedAt||'Not completed')}.</p><h2>Rubric check history</h2>${session.grades.map(g=>`<p>${e(g.at)}: ${g.total}/10 | ${g.greenlit?'Ready to draft':'Not ready'} | ${e(g.model)}</p>${(g.unsupportedClaims||[]).map(c=>`<p>Unsupported claim in ${e(c.field)}: “${e(c.quote)}” — ${e(c.reason)}</p>`).join('')}<pre>${e(LETTERS.map(k=>`${k}: ${g.elements[k].score}/2 — ${g.elements[k].feedback}\nYour words: ${g.elements[k].evidence}`).join("\n\n"))}</pre>`).join('')}<details><summary>Complete process record</summary><pre>${e(JSON.stringify(record,null,2))}</pre></details><p>This file is a learning record. Downloading it does not submit an assignment.</p></body></html>`;
}
