import {LETTERS,FIELDS,RULE,RUBRIC,SCENARIO,OUTPUTS,MODEL_F,EXAMPLE,RUBRIC_VERSION,briefSnapshot,formatIssues,SCENARIOS,getScenario,exampleFor,splitExpected,combineExpected,DEFINITIONS,WORKED_EXAMPLE,SCENARIO_LABELS,claimSourceLabel} from './framework.js';
import {STORAGE_KEY,newSession,newReview,hasCurrentGrade,hasCurrentDraft,invalidateBrief,reviewErrors,summary,restoreSession,reportHTML} from './session.js';
const $=id=>document.getElementById(id);
const node=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;};
let session=newSession(), busy=false,saveTimer,storageAvailable=true,recoveryRaw=null;
try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){try{session=restoreSession(raw);}catch{recoveryRaw=raw;storageAvailable=false;$('storageNotice').hidden=false;$('storageNotice').textContent='An older saved record could not be restored. Download it using Download my session before starting fresh. New work is kept in memory until you start a new activity.';}}}catch{storageAvailable=false;storageWarning();}
function storageWarning(){$('storageNotice').hidden=false;$('storageNotice').textContent='This browser cannot save your work reliably. Keep this tab open and download your session before leaving.';}
function persist(){clearTimeout(saveTimer);if(storageAvailable){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(session));}catch{storageAvailable=false;storageWarning();}}renderSummary();}
function saveSoon(){clearTimeout(saveTimer);saveTimer=setTimeout(persist,250);}
function event(type,data={}){session.events.push({type,at:new Date().toISOString(),...data});}
function status(text,error=false){$('status').textContent=text;$('status').classList.toggle('error',error);}
function reviewChanged(){session.review.completedAt=null;$('completion').hidden=true;saveSoon();}
function briefChanged(){$('replaceDraftPrompt').hidden=true;invalidateBrief(session);$('feedbackOutput').replaceChildren();renderStatus();saveSoon();}
function renderSummary(){const s=summary(session);$('summary').textContent=`This saved activity: ${s.coachRequests} coach ${s.coachRequests===1?'request':'requests'} · ${s.gradeAttempts} grade ${s.gradeAttempts===1?'attempt':'attempts'} · ${s.elapsedMinutes} ${s.elapsedMinutes===1?'minute':'minutes'} elapsed. Returning to this activity resumes these counts. Start a new activity to reset them. Retries carry no penalty.`;}
function renderStatus(){
  const ready=hasCurrentGrade(session),draftCurrent=hasCurrentDraft(session);
  $('readiness').textContent=ready?`Your BRIEF has been greenlit: ${session.grade.total}/10. This approves drafting; the copy still needs human review.`:session.grade?`${session.grade.total}/10: not ready to draft yet. ${RULE} Revise the fields below and grade again.`:'Grade your current BRIEF when ready. '+RULE;
  $('generationHint').textContent=ready?'Generate one draft using the format and tone in E.':'Grade your current BRIEF to unlock drafting. '+RULE;
  for(const id of ['coach','grade','generate','newSession'])$(id).disabled=busy||(id==='generate'&&!ready)||(['coach','grade'].includes(id)&&!session.output);
  $('replaceDraft').disabled=busy||!ready;$('keepDraft').disabled=busy;if(!ready||!session.draft)$('replaceDraftPrompt').hidden=true;
  $('reviewFields').disabled=!draftCurrent||busy;$('scenario').disabled=busy;
  $('draftArea').hidden=!session.draft;
  $('reviewHint').textContent=draftCurrent?'Read the entire draft, then complete your own review.':session.draft?'Your BRIEF changed. The earlier draft is preserved below; generate a new draft before completing this review.':'Generate a draft first. You will check facts, explain fit, and make one purposeful revision.';
  $('completion').hidden=!session.review.completedAt;
  $('completion').textContent='Your review is saved. Download the session and submit it as your instructor directs.';
}
function renderFeedback(result,mode){
  $('feedbackOutput').replaceChildren();
  for(const k of LETTERS){const f=result.elements[k],card=node('div',undefined,'feedback-item');card.append(node('h3',`${k} · ${FIELDS[k].name}${mode==='grade'?` · ${f.score}/2`:''}`),node('p',mode==='coach'?f.verdict:f.feedback));if(!f.evidence||!(mode==='coach'?f.verdict:f.feedback).includes(f.evidence))card.append(node('p',f.evidence?`${k==='E'?'From your E instructions (objective or format)':'Your words'}: “${f.evidence}”`:'Your field is blank.'));if(mode==='coach')card.append(node('p','One fix to adapt: '+f.fix));$('feedbackOutput').append(card);}
}
function renderClaims(){
  const target=$('claimChecks');target.replaceChildren();
  session.review.claims.forEach((claim,index)=>{
    const row=node('div',undefined,'claim');
    const make=(labelText,key)=>{const id=`claim-${index}-${key}`,label=node('label',labelText);label.htmlFor=id;const input=node('textarea');input.id=id;input.rows=2;input.maxLength=1500;input.value=claim[key];input.addEventListener('input',()=>{claim[key]=input.value;reviewChanged();});row.append(label,input);};
    make('Claim to check','claim');make('Supporting fact, or explain your correction/removal','evidence');
    const label=node('label','Your decision');label.htmlFor=`decision-${index}`;const select=node('select');select.id=label.htmlFor;
    for(const [value,text] of [['','Choose a decision'],['verified','Verified against the fact sheet'],['corrected','Corrected in the final copy'],['removed','Removed from the final copy']]){const option=node('option',text);option.value=value;select.append(option);}select.value=claim.decision;select.addEventListener('change',()=>{claim.decision=select.value;reviewChanged();});
    const remove=node('button','Remove this row','secondary');remove.type='button';remove.addEventListener('click',()=>{session.review.claims.splice(index,1);renderClaims();reviewChanged();});row.append(label,select,remove);target.append(row);
  });
}
function renderDraft(){
  $('originalDraft').textContent=session.draft?.copy||'';$('aiClaims').replaceChildren();
  if(session.draft){if(!session.draft.claims.length)$('aiClaims').append(node('p','The AI listed no factual claims. Check the entire draft yourself.'));
    for(const c of session.draft.claims)$('aiClaims').append(node('p',`${c.claim} | AI source label: ${claimSourceLabel(c.source)}`));}
  for(const key of ['fit','finalCopy','explanation','noClaimsReason'])$(key).value=session.review[key];
  for(const key of ['confirmed','noClaims'])$(key).checked=session.review[key];renderClaims();renderFormat();renderStatus();
}
function renderFormat(){const errors=formatIssues(session.review.finalCopy,session.output);$('formatStatus').textContent=session.review.finalCopy.trim()?(errors.join(' ')||'Within the classroom format. Check the message itself before confirming.'):'The final copy should follow the format in E.';}
async function request(action,replaceExisting=false){
  if(busy)return;
  if(!session.output){status('Choose an output before requesting feedback.',true);$('outputType').focus();return;}
  if(!LETTERS.some(k=>session.brief[k].trim())){status('Write at least one BRIEF field first.',true);$('field-B').focus();return;}
  if(action==='generate'&&!hasCurrentGrade(session)){status('Grade your current BRIEF first.',true);return;}
  if(action==='generate'&&session.draft&&!replaceExisting){$('replaceDraftPrompt').hidden=false;status('A previous draft is saved. Choose whether to generate a new draft or keep the existing one.');$('replaceDraft').focus();return;}
  $('replaceDraftPrompt').hidden=true;
  const revision=session.revision,snapshot=briefSnapshot(session.brief),output=session.output,scenario=session.scenario,brief={...session.brief};
  const controller=new AbortController();let timeout,progressTimer;const started=Date.now();
  busy=true;
  try{
  renderStatus();$('reviewFields').setAttribute('aria-busy','true');
  const button=$(action==='generate'?'generate':action);button.classList.add('busy');button.setAttribute('aria-busy','true');button.textContent=action==='generate'?'Generating…':action==='grade'?'Grading…':'Coaching…';
  if(action==='generate'){$('generationProgress').hidden=false;$('generationProgress').textContent='Generating your draft. You can still scroll and read your BRIEF.';progressTimer=setInterval(()=>{if(Date.now()-started>10000)$('generationProgress').textContent='Still waiting for Gemini. Your work is saved; the request will stop after 55 seconds if no draft arrives.';},1000);}
  timeout=setTimeout(()=>controller.abort(),55000);
  if(action==='grade')event('grade_attempt',{brief,output,scenario});else if(action==='coach')event('coach_request',{brief,output,scenario});else event('generate_request',{output});
  status(action==='coach'?'Your coach is reviewing each field.':action==='grade'?'Checking your BRIEF against the rubric.':'Drafting from your complete BRIEF.');persist();
  await new Promise(resolve=>setTimeout(resolve,0));
    const response=await fetch('/.netlify/functions/gemini-proxy',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,brief,output,scenario,approval:action==='generate'?session.grade.approval:undefined}),signal:controller.signal});
    let result;try{result=await response.json();}catch{throw new Error('The tutor is unavailable or busy. Retry in a moment; your work is saved.');}
    if(!response.ok){if(action==='generate'&&result.code==='not_greenlit')session.grade=null;throw new Error(result.error||'The tutor could not complete the request. Please retry.');}
    if(revision!==session.revision||snapshot!==briefSnapshot(session.brief)||output!==session.output||scenario!==session.scenario){event('stale_response',{action});status('Your BRIEF changed during the request. The earlier response was discarded. Request feedback on the current version.');return;}
    if(action==='grade'){
      session.grade={...result,snapshot,output,scenario,at:new Date().toISOString()};session.grades.push({...session.grade,approval:undefined,brief});event('grade_result',{total:result.total,scores:Object.fromEntries(LETTERS.map(k=>[k,result.elements[k].score])),greenlit:result.greenlit});if(result.suspectedInjection)event('suspected_instruction_attempt',{action});
      if(result.greenlit)event('greenlight',{total:result.total});session.feedback={result:{...result,approval:undefined},mode:'grade'};renderFeedback(result,'grade');status(result.greenlit?'Your BRIEF is ready to draft. The draft still needs your review.':`${result.total}/10: not ready to draft yet. Review the field feedback, revise, and try again.`);
    }else if(action==='coach'){
      session.coaching.push({...result,brief,at:new Date().toISOString()});event('coach_result',{elements:LETTERS});if(result.suspectedInjection)event('suspected_instruction_attempt',{action});session.feedback={result,mode:'coach'};renderFeedback(result,'coach');status('Your coaching is ready. Adapt the fixes, then grade your revised BRIEF.');
    }else{
      if(typeof result.copy!=='string'||result.copy.length>5000||!Array.isArray(result.claims)||result.claims.length>30||result.claims.some(c=>typeof c.claim!=='string'||c.claim.length>500||typeof c.source!=='string'||c.source.length>1000))throw new Error('The draft response was incomplete. Please retry; your BRIEF is preserved.');
      if(session.draft)session.drafts.push({draft:session.draft,review:structuredClone(session.review)});
      session.draft={...result,id:crypto.randomUUID(),snapshot,output,scenario,at:new Date().toISOString()};session.review=newReview();session.review.finalCopy=result.copy;session.review.claims=result.claims.map(c=>({claim:c.claim,evidence:'',decision:''}));event('generate',{draftId:session.draft.id});renderDraft();status('Your draft is ready. Check every claim, explain its fit, and make one purposeful revision.');
    }
  }catch(error){event('request_error',{action});status(['AbortError','TimeoutError'].includes(error.name)?'The request took too long. Retry when ready; your work is saved.':error.message,true);}
  finally{clearTimeout(timeout);clearInterval(progressTimer);busy=false;for(const [id,label] of [['generate','Generate draft'],['grade','Grade my BRIEF'],['coach','Coach my BRIEF']]){$(id).classList.remove('busy');$(id).removeAttribute('aria-busy');$(id).textContent=label;}$('generationProgress').hidden=true;$('reviewFields').removeAttribute('aria-busy');renderStatus();persist();}
}
function download(){
  event('download');persist();const html=recoveryRaw||reportHTML(session);const blob=new Blob([html],{type:recoveryRaw?'application/json':'text/html;charset=utf-8'});const url=URL.createObjectURL(blob);const link=node('a');link.href=url;link.download=recoveryRaw?'brief-saved-record-recovery.json':`BRIEF-session-${session.id.slice(0,8)}.html`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Your learning record has been downloaded. Submit it as your instructor directs.');
}
// All student/model content is rendered with textContent or field values.
function renderScenario(){const sc=getScenario(session.scenario);$('scenario').value=sc.id;$('factsTitle').textContent=sc.title;$('scenarioFocus').textContent=sc.focus;$('scenarioTask').textContent=sc.task+' Choose an output, then write a specific audience and objective.';$('factList').replaceChildren();for(const f of sc.facts)$('factList').append(node('li',f));$('factLimits').textContent=sc.limits;$('styleReference').textContent=sc.reference;}
for(const sc of SCENARIOS){const option=node('option',SCENARIO_LABELS[sc.id]||sc.title);option.value=sc.id;$('scenario').append(option);}
$('exampleTitle').textContent=WORKED_EXAMPLE.title;for(const fact of WORKED_EXAMPLE.facts)$('exampleFacts').append(node('li',fact));$('exampleLimits').textContent=WORKED_EXAMPLE.limits;$('exampleReference').textContent=WORKED_EXAMPLE.reference;
for(const k of LETTERS){for(const [id,key] of [['weakExample','weak'],['strongExample','strong'],['exampleWhy','why']]){const el=node('p');el.append(node('strong',k+' · '+FIELDS[k].name+': '),document.createTextNode(WORKED_EXAMPLE[key][k]));$(id).append(el);}const definition=node('p');definition.append(node('strong',k+' · '+FIELDS[k].name+': '),document.createTextNode(DEFINITIONS[k]));$('definitions').append(definition);}
$('modelF').textContent=MODEL_F;$('rule').textContent=RULE;
function syncE(){session.brief.E=combineExpected(session.eParts.objective,session.eParts.format);}
function fillFields(){for(const k of LETTERS)if(k!=='E')$(`field-${k}`).value=session.brief[k];$('field-E-objective').value=session.eParts.objective;$('field-E-format').value=session.eParts.format;}
for(const k of LETTERS){
 const wrapper=node('div',undefined,'field'),heading=node('h3',`${k} · ${FIELDS[k].name}`),hint=node('p',FIELDS[k].hint,'hint');hint.id=`hint-${k}`;wrapper.append(heading,hint);
 if(k==='E'){
  for(const [part,labelText,help] of [['objective','Communication objective','What should this audience think, feel, or do after seeing the message?'],['format','Output format','Filled from Your output. You may refine the tone while keeping the classroom structure and word limits.']]){
   const label=node('label',labelText);label.htmlFor=`field-E-${part}`;const input=node('textarea');input.id=label.htmlFor;input.rows=3;input.maxLength=2900;input.value=session.eParts[part];const desc=node('p',help,'hint');desc.id=`hint-E-${part}`;input.setAttribute('aria-describedby',desc.id);input.addEventListener('input',()=>{session.eParts[part]=input.value;syncE();briefChanged();});wrapper.append(label,desc,input);
  }
 }else{const label=node('label',FIELDS[k].name);label.htmlFor=`field-${k}`;label.className='sr-only';const input=node('textarea');input.id=label.htmlFor;input.rows=k==='B'||k==='F'?4:3;input.maxLength=6000;input.value=session.brief[k];input.setAttribute('aria-describedby',hint.id);input.addEventListener('input',()=>{session.brief[k]=input.value;briefChanged();});wrapper.append(label,input);}
 $('fields').append(wrapper);const rubric=node('div',undefined,'rubric-entry');rubric.append(node('strong',`${k} · ${FIELDS[k].name}`));RUBRIC[k].forEach((text,i)=>rubric.append(node('p',`${i}: ${text}`)));$('rubric').append(rubric);
}
function outputHint(){const type=session.output;$('outputHint').textContent=type?`Classroom format: ${OUTPUTS[type].format}. These are classroom constraints.`:'Choose a format. These are classroom constraints, not official platform limits.';}
$('outputType').value=session.output;$('outputType').addEventListener('change',()=>{session.output=$('outputType').value;session.eParts.format=session.output?OUTPUTS[session.output].format+'.':'';syncE();$('field-E-format').value=session.eParts.format;outputHint();briefChanged();status(session.output?'The output format has been filled in E. Your objective is preserved. Grade again when ready.':'Choose an output to fill the format in E and enable feedback. Your objective is preserved.');});
function startActivity(scenario){$('replaceDraftPrompt').hidden=true;clearTimeout(saveTimer);try{localStorage.removeItem(STORAGE_KEY);}catch{}recoveryRaw=null;storageAvailable=true;session=newSession(scenario);fillFields();$('outputType').value='';$('feedbackOutput').replaceChildren();renderScenario();outputHint();renderDraft();persist();status('A new activity is ready. Inspect the facts and decide who the message should reach.');}
$('scenario').addEventListener('change',()=>{const id=$('scenario').value;if(LETTERS.some(k=>session.brief[k].trim())&&!confirm('Changing the practice situation starts a new activity. Download your current session first if you want to keep it. Continue?')){$('scenario').value=session.scenario;return;}startActivity(id);});
for(const action of ['coach','grade'])$(action).addEventListener('click',()=>request(action));$('generate').addEventListener('click',()=>request('generate'));$('replaceDraft').addEventListener('click',()=>request('generate',true));$('keepDraft').addEventListener('click',()=>{$('replaceDraftPrompt').hidden=true;status('Kept your existing draft and review.');$('generate').focus();});
for(const key of ['fit','finalCopy','explanation','noClaimsReason'])$(key).addEventListener('input',()=>{session.review[key]=$(key).value;reviewChanged();if(key==='finalCopy')renderFormat();});
for(const key of ['confirmed','noClaims'])$(key).addEventListener('change',()=>{session.review[key]=$(key).checked;reviewChanged();});
$('addClaim').addEventListener('click',()=>{session.review.claims.push({claim:'',evidence:'',decision:''});session.review.noClaims=false;$('noClaims').checked=false;renderClaims();reviewChanged();});
$('complete').addEventListener('click',()=>{const errors=reviewErrors(session);if(errors.length){status(errors.join(' '),true);return;}session.review.completedAt=new Date().toISOString();event('factcheck_submit',{draftId:session.draft.id,review:structuredClone(session.review)});persist();renderStatus();status('Your review is complete. Download your session to keep and submit the work.');});
$('download').addEventListener('click',download);
$('newSession').addEventListener('click',()=>{if(!confirm('Start a new activity? Download your current record first if you want to keep it.'))return;startActivity(session.scenario);$('field-B').focus();});
window.addEventListener('pagehide',persist);renderScenario();outputHint();renderDraft();if(session.feedback)renderFeedback(session.feedback.result,session.feedback.mode);persist();

// This highlights the section in view, not assignment completion.
const stageLinks=[...document.querySelectorAll('.stage-link')];
function highlightStage(id){for(const link of stageLinks){const current=link.hash==='#'+id;if(current)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');link.querySelector('.stage-marker').hidden=!current;}}
let stageFrame=0;
function trackStage(){if(stageFrame)return;stageFrame=requestAnimationFrame(()=>{stageFrame=0;let current='plan';for(const id of ['plan','feedback','draft','review'])if($(id).getBoundingClientRect().top<=96)current=id;highlightStage(current);});}
for(const link of stageLinks)link.addEventListener('click',()=>highlightStage(link.hash.slice(1)));
window.addEventListener('scroll',trackStage,{passive:true});window.addEventListener('resize',trackStage);trackStage();
