import test from 'node:test';
import assert from 'node:assert/strict';
import {EXAMPLE,LETTERS,readiness,formatIssues} from '../public/assets/framework.js';
import {createHandler,approvalToken,verifyApproval,validateResult,requestBody,parseInteraction} from '../lib/tutor.js';
import {newSession,hasCurrentGrade,hasCurrentDraft,invalidateBrief,reviewErrors,reportHTML,restoreSession,summary} from '../public/assets/session.js';
import {readFile} from 'node:fs/promises';
const elements=scores=>Object.fromEntries(LETTERS.map((k,i)=>[k,{score:scores[i],evidence:EXAMPLE[k].slice(0,30),feedback:'Specific rubric feedback.'}]));
const result=scores=>({elements:elements(scores),suspectedInjection:false});
const request=body=>new Request('https://tutor.example/.netlify/functions/gemini-proxy',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
const response=content=>Response.json({status:'completed',steps:[{type:'thought',signature:'not user output'},{type:'model_output',content:[{type:'text',text:JSON.stringify(content)}]}]});
const handler=(fetchFn, key='test-secret')=>createHandler({env:name=>name==='GEMINI_API_KEY'?key:undefined,fetchFn,now:()=>1000});
test('readiness covers the nine calibration score keys',()=>{
 for(const [scores,total,greenlit] of [[[1,0,1,0,0],2,false],[[1,1,2,1,1],6,false],[[2,2,2,2,0],8,false],[[2,2,2,2,1],9,false],[[2,2,2,1,2],9,false],[[1,1,2,2,2],8,true],[[2,2,2,2,2],10,true],[[1,0,0,0,0],1,false],[[2,2,0,2,2],8,false]])assert.deepEqual(readiness(elements(scores)),{total,greenlit});
 assert.throws(()=>readiness(elements([2,2,2,2,3])));assert.throws(()=>readiness(elements([2,2,2,2,1.5])));
});
test('server ignores client totals and signs only a validated passing grade',async()=>{
 const h=handler(async(url,opts)=>{assert(!url.includes('test-secret'));assert.equal(opts.headers['x-goog-api-key'],'test-secret');const b=JSON.parse(opts.body);assert.equal(b.store,false);assert.equal(b.response_format.mime_type,'application/json');assert(b.system_instruction.includes('untrusted'));return response({...result([2,2,2,2,2]),total:0,greenlit:false});});
 const r=await h(request({action:'grade',brief:EXAMPLE,output:'organic',total:10}));assert.equal(r.status,200);const data=await r.json();assert.equal(data.total,10);assert.equal(data.greenlit,true);assert(verifyApproval(data.approval,EXAMPLE,'organic','test-secret',1000));
});
test('generation cannot bypass a grade or reuse approval after edits or expiry',async()=>{
 let calls=0;const h=handler(async()=>{calls++;return response({copy:'Try the new oat-milk latte Monday for $4.50.',claims:[{claim:'$4.50',source:'Approved fact sheet: price'}]});});
 for(const token of [undefined,'forged',approvalToken(EXAMPLE,'ad','test-secret',1000),approvalToken(EXAMPLE,'organic','different',1000),approvalToken(EXAMPLE,'organic','test-secret',-4000000)])assert.equal((await h(request({action:'generate',brief:EXAMPLE,output:'organic',approval:token}))).status,409);
 const token=approvalToken(EXAMPLE,'organic','test-secret',1000);assert.equal((await h(request({action:'generate',brief:{...EXAMPLE,I:'Another audience'},output:'organic',approval:token}))).status,409);
 assert.equal(calls,0);assert.equal((await h(request({action:'generate',brief:EXAMPLE,output:'organic',approval:token}))).status,200);assert.equal(calls,1);
});
test('malformed results blank scores and fabricated evidence never pass',()=>{
 assert.throws(()=>validateResult('grade',result([2,2,2,2,3]),EXAMPLE,'organic'));
 const bad=result([2,2,2,2,2]);bad.elements.B.evidence='fabricated quotation';assert.throws(()=>validateResult('grade',bad,EXAMPLE,'organic'));
 const blank=result([2,2,2,2,2]);blank.elements.F.evidence='';assert.throws(()=>validateResult('grade',blank,{...EXAMPLE,F:''},'organic'));
 assert.throws(()=>parseInteraction({status:'in_progress',steps:[]}));assert.throws(()=>parseInteraction({status:'completed',steps:[]}));
});
test('coaching has evidence fixes and no scores',()=>{
 const coach={elements:Object.fromEntries(LETTERS.map(k=>[k,{verdict:'This detail helps.',evidence:EXAMPLE[k].slice(0,20),fix:'A concrete rewrite.'}])),suspectedInjection:false};
 assert(!Object.hasOwn(validateResult('coach',coach,EXAMPLE,'organic'),'total'));coach.elements.B.score=2;assert.throws(()=>validateResult('coach',coach,EXAMPLE,'organic'));
});
test('method empty payload size and missing key errors make no provider call',async()=>{
 let calls=0;const h=handler(async()=>{calls++;return response(result([2,2,2,2,2]));});
 assert.equal((await h(new Request('https://tutor.example'))).status,405);
 assert.equal((await h(request({action:'grade',brief:Object.fromEntries(LETTERS.map(k=>[k,''])),output:'organic'}))).status,400);
 assert.equal((await h(request({action:'grade',brief:{...EXAMPLE,B:'x'.repeat(6001)},output:'organic'}))).status,400);
 assert.equal((await h(request({action:'arbitrary',brief:EXAMPLE,output:'organic'}))).status,400);
 assert.equal((await handler(async()=>{},'')(request({action:'grade',brief:EXAMPLE,output:'organic'}))).status,503);assert.equal(calls,0);
});
test('provider setup rate-limit malformed output and timeout are clear failures',async()=>{
 const body={action:'grade',brief:EXAMPLE,output:'organic'};
 assert.equal((await handler(async()=>new Response('',{status:429}))(request(body))).status,429);
 assert.equal((await handler(async()=>new Response('',{status:403}))(request(body))).status,503);
 assert.equal((await handler(async()=>Response.json({status:'completed',steps:[]}))(request(body))).status,502);
 assert.equal((await handler(async()=>{throw new DOMException('timeout','TimeoutError');})(request(body))).status,504);
});
test('single draft call rejects output outside classroom format',()=>{
 assert.equal(formatIssues('word '.repeat(51),'organic').length,1);
 assert.equal(formatIssues('Headline: Try the new latte\nBody: Monday, $4.50.\nCall to action: Visit us','ad').length,0);
 assert.throws(()=>validateResult('generate',{copy:'word '.repeat(51),claims:[]},EXAMPLE,'organic'));
 const body=requestBody('grade',EXAMPLE,'organic','gemini-3.8-flash');assert(body.system_instruction.includes('F needs'));assert(!body.tools);assert.equal(body.generation_config.thinking_level,'low');
});
test('human review is invalidated by edits and needs a real revision',()=>{
 const s=newSession();s.brief={...EXAMPLE};s.output='organic';const snap=JSON.stringify(EXAMPLE);s.grade={...result([2,2,2,2,2]),approval:'signed',snapshot:snap,output:'organic',rubricVersion:'BRIEF-1.0'};s.draft={copy:'Try our new latte Monday.',snapshot:snap,output:'organic',claims:[]};
 assert(hasCurrentGrade(s));assert(hasCurrentDraft(s));assert(reviewErrors(s).length);
 s.review={claims:[{claim:'Monday launch',evidence:'The supplied facts say launches Monday.',decision:'verified'}],noClaims:false,noClaimsReason:'',fit:'The invitation fits students seeking coffee between classes.',finalCopy:'Try our new oat-milk latte Monday for $4.50.',explanation:'I added the product and price to the invitation. This makes the next action clearer for students between classes.',confirmed:true,completedAt:'now'};
 assert.deepEqual(reviewErrors(s),[]);s.review.finalCopy=s.draft.copy;assert(reviewErrors(s).some(e=>e.includes('purposeful')));invalidateBrief(s);assert(!hasCurrentGrade(s));assert.equal(s.review.completedAt,null);
});
test('refresh retains work and reports safely escape untrusted text without approval',()=>{
 const s=newSession();s.brief.B='<script>alert(1)</script>';s.review.finalCopy='</pre><img src=x onerror=alert(1)>';
 const restored=restoreSession(JSON.stringify(s));assert.equal(restored.brief.B,s.brief.B);
 const html=reportHTML(s);assert(!html.includes('<script>alert'));assert(html.includes('&lt;script&gt;'));assert(!html.includes('<img src=x'));assert.equal(summary(s).attemptsToFirstGreenlight,null);
});
test('static publish excludes function code and inline executable scripts',async()=>{
 const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');assert(!html.includes('GEMINI_API_KEY'));assert(!html.includes('8 framework'));assert(!html.includes('95%'));assert(!/<script(?![^>]*src=)/.test(html));
 const toml=await readFile(new URL('../netlify.toml',import.meta.url),'utf8');assert(toml.includes('publish = "public"'));
 const app=await readFile(new URL('../public/assets/app.js',import.meta.url),'utf8');assert(!app.includes('.innerHTML'));
});
