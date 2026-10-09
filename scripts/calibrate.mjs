import {createHandler} from '../lib/tutor.js';
import {fixtures} from '../tests/calibration-fixtures.js';
import {LETTERS} from '../public/assets/framework.js';
if(!process.env.GEMINI_API_KEY){console.error('Set GEMINI_API_KEY in your local environment before live calibration. Do not paste it into this file.');process.exit(1);}
const handler=createHandler({env:name=>process.env[name]});let failures=0;
for(const sample of fixtures){
 for(let run=1;run<=3;run++){
  const req=new Request('http://localhost/.netlify/functions/gemini-proxy',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'grade',brief:sample.brief,output:sample.output||'organic'})});
  const response=await handler(req),data=await response.json();
  const scores=data.elements?LETTERS.map(k=>data.elements[k].score):[];
  const matches=response.ok && scores.join()===sample.scores.join() && data.greenlit===sample.ready;
  if(!matches)failures++;
  console.log(JSON.stringify({sample:sample.name,run,model:data.model,scores,total:data.total,ready:data.greenlit,matches,error:data.error}));
 }
}
console.log(`${failures} mismatches/errors across ${fixtures.length*3} live grading runs.`);process.exitCode=failures?1:0;
