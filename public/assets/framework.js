export const RUBRIC_VERSION = 'BRIEF-1.0';
export const LETTERS = ['B', 'R', 'I', 'E', 'F'];
export const FIELDS = {
  B: {name: 'Background', hint: 'Give the approved facts and one clearly labeled style reference.'},
  R: {name: 'Role', hint: 'Name a specialist suited to this task and business.'},
  I: {name: 'Intended audience', hint: 'Who is this for? Add a relevant need, situation, platform, or sensitivity.'},
  E: {name: 'Expected output', hint: 'Two parts: what you want the audience to think, feel, or do; then the deliverable’s length, structure, and tone.'},
  F: {name: 'Fact-check', hint: 'Set the factual boundary, request a claim-and-source list, and explain your human check.'}
};
export const DEFINITIONS = {
 B:'Background gives the AI the situation, approved facts, and a style reference it needs to work from.',
 R:'Role tells the AI which relevant professional perspective or expertise to use.',
 I:'Intended audience identifies who the message is for and what matters to them in this situation.',
 E:'Expected output states the communication objective and specifies the deliverable, format, length, and tone.',
 F:'Fact-check sets factual boundaries, requests a separate claim-and-source list, and states how you will verify the draft.'
};
export const WORKED_EXAMPLE = {
 title:'Neighborhood Paws Adoption Day',
 facts:['A fictional shelter holds an adoption information day Saturday, 11 a.m.–2 p.m., at 18 Oak Avenue.','Visitors can meet shelter staff and learn about the adoption process.','There is no entry fee.'],
 limits:'No animal counts, adoption guarantees, fees, health claims, or visitor testimonials are approved.',
 reference:'Meet the team. Ask your questions. Learn what adoption could look like for you.',
 weak:{B:'A shelter has an event.',R:'Be a marketer.',I:'Everyone.',E:'Make an exciting Instagram post.',F:'Make sure it is accurate.'},
 strong:{B:'Neighborhood Paws is a fictional shelter. Its adoption information day is Saturday, 11 a.m.–2 p.m., at 18 Oak Avenue. Visitors can meet staff and learn about adoption. Entry is free. No adoption guarantee or animal count is approved. Style reference only: "Meet the team. Ask your questions. Learn what adoption could look like for you."',R:'You are a social media copywriter for animal shelters.',I:'Local adults who are considering adoption but want to understand the process before deciding.',E:'Objective: encourage these adults to visit the information day and ask staff questions. Format: one organic Instagram caption of at most 50 words, with a welcoming tone and one invitation to attend.',F:'Use only approved Background facts. Do not invent animal counts, fees, quotes, or adoption guarantees. List factual claims separately with their source. I will compare each claim with the fact sheet and correct or remove unsupported claims before submitting.'},
 why:{B:'The strong version supplies event details and distinguishes style from facts.',R:'It names expertise suited to the organization and task.',I:'It specifies an audience with a relevant uncertainty.',E:'It connects an audience response to a concrete format and limits.',F:'It sets boundaries, requests sources, and makes the human check explicit.'}
};
export const RULE = 'At least 8/10, every field at least 1, and E and F each at 2.';
export const RUBRIC = {
  B: ['No usable situation or facts.', 'Some usable context, but insufficient task facts or no usable style example.', 'Enough specific approved facts for the task plus a usable style example.'],
  R: ['No usable role.', 'A generic role such as marketing expert.', 'A relevant specialist with a task domain.'],
  I: ['No usable audience.', 'A broad audience label or demographics without context.', 'An identifiable audience plus a relevant need, setting, platform, or sensitivity.'],
  E: ['Neither an outcome nor a sufficiently specified deliverable.', 'Only an outcome or only a specified deliverable.', 'An outcome and a deliverable with at least one shaping constraint such as length, structure, or tone.'],
  F: ['No accuracy or verification instruction.', 'An incomplete check: generic accuracy, AI-only checking, or human-only checking.', 'A factual boundary, a separate claim-and-source list, and an explicit human check before submission.']
};
export const SCENARIO = {
  id: 'campus-corner-coffee', title: 'Campus Corner Coffee',
  facts: ['A fictional student-run coffee shop on State Street.', 'Its new oat-milk latte launches Monday.', 'The latte costs $4.50.'],
  limits: 'No discount, health benefit, sales result, opening hours, or scarcity claim is approved.',
  reference: 'Between classes? Meet us at the corner for your next coffee break.'
};
export const SCENARIOS = [SCENARIO,
  {id:'campus-book-swap',title:'Campus Book Swap',focus:'Event invitation',task:'Invite students to take part in a book swap. Decide what response your message should encourage.',facts:['The fictional Campus Book Swap takes place Thursday, 2–4 p.m., in the student center lobby.','Students may bring up to three books and exchange them for books available at the event.','Entry is free; textbooks are welcome.'],limits:'No guarantee of a particular title, book condition, or money saved. No registration link is approved.',reference:'Bring a book. Find your next read. Make a little room on your shelf.'},
  {id:'repair-table',title:'Bike Repair Table',focus:'Service awareness',task:'Help campus cyclists decide whether to visit a basic bike-check event.',facts:['The fictional Bike Repair Table is outside the recreation center Saturday, 10 a.m.–noon.','Volunteers offer free tire-pressure checks and chain lubrication.','Parts and major repairs are not provided.'],limits:'Do not promise a safe bike, full repairs, or professional certification.',reference:'A little care for your everyday ride. Stop by for a basic bike check.'},
  {id:'gallery-night',title:'Student Gallery Night',focus:'Creative event promotion',task:'Invite a specific campus audience to explore student artwork.',facts:['The fictional Student Gallery Night is Friday, 5–7 p.m., in the arts building gallery.','It features work by 12 student artists.','Admission is free.'],limits:'No awards, artist quotes, refreshments, or artwork sales are approved.',reference:'Take a closer look. See what students are making this week.'},
  {id:'refill-station',title:'Campus Refill Station',focus:'Practical behavior change',task:'Encourage students to use a new refill station without making unsupported environmental claims.',facts:['A fictional water-bottle refill station is now available on the library ground floor.','It is beside the east entrance.','Students can use it whenever the library is open.'],limits:'No exact opening hours, water-quality claims, plastic-savings figures, or health benefits are approved.',reference:'Bring your bottle. Refill on the way to your next study session.'},
  {id:'garden-volunteers',title:'Community Garden Morning',focus:'Volunteer recruitment',task:'Invite students to consider a volunteer morning and make the commitment clear.',facts:['The fictional Community Garden Morning is Sunday, 9–11 a.m., at River Street Garden.','Tasks include planting and watering.','Tools are provided; beginners are welcome.'],limits:'No transport, food, service-credit guarantee, or claim that all tasks are accessible is approved.',reference:'New to gardening? Start with a small task and a morning outdoors.'},
  {id:'library-hours',title:'Library Study-Hour Update',focus:'Service update',task:'Help students plan around a temporary library-hours change.',facts:['The fictional campus library closes at 8 p.m. this Friday.','It reopens Saturday at 10 a.m.','The change applies only to these stated times.'],limits:'No reason for the change, alternative study location, or normal weekly schedule is approved.',reference:'Planning a study session? Check these hours before you head over.'},
  {id:'film-club',title:'Film Club Discussion',focus:'Community participation',task:'Invite students to a discussion that welcomes first-time attendees.',facts:['The fictional Film Club discussion is Tuesday, 6 p.m., in Room 204 of the student center.','The topic is storytelling in short films.','Attendance is free; no membership is required.'],limits:'No film screening, guest speaker, discussion length, or refreshments are approved.',reference:'Bring your curiosity. There is room for a new perspective at the table.'},
  {id:'pantry-drive',title:'Campus Pantry Collection',focus:'Respectful community support',task:'Encourage a practical donation while preserving the dignity of people using a pantry.',facts:['The fictional Campus Pantry collection runs Monday through Friday.','Unopened pasta and canned beans can be left at the student center welcome desk.','Donations support the campus pantry.'],limits:'No beneficiary stories, names, need statistics, donation targets, or claims about meals provided are approved.',reference:'Small contributions can be part of a shared campus effort. Here is what to bring.'},
  {id:'workshop-correction',title:'Resume Workshop Correction',focus:'Clear correction',task:'Correct an earlier workshop announcement so students can make an accurate plan.',facts:['The fictional Resume Workshop is Wednesday at 3 p.m. in Career Center Room 110.','An earlier announcement incorrectly listed 2 p.m.','The workshop is free; students should bring a resume draft.'],limits:'No guaranteed job outcome, employer attendance, registration link, or reason for the error is approved.',reference:'A quick correction to help you plan: here is the updated workshop time.'}
];
SCENARIO.focus='Product launch';SCENARIO.task='Encourage a suitable response to the latte launch. Make your audience and objective specific.';
export function getScenario(id=SCENARIO.id){return SCENARIOS.find(s=>s.id===id);}
export const PLATFORMS = {
 instagram:{label:'Instagram',words:50,tone:'friendly'},
 facebook:{label:'Facebook',words:80,tone:'welcoming and community-focused'},
 threads:{label:'Threads',words:80,tone:'conversational'},
 x:{label:'X',words:40,characters:280,tone:'clear and concise'},
 linkedin:{label:'LinkedIn',words:100,tone:'professional and approachable'}
};
export function outputSpec(output,platform='instagram'){
 const p=PLATFORMS[platform];if(!p||!['organic','ad'].includes(output))throw new Error('Choose a platform and message type.');
 return {label:p.label+' '+(output==='organic'?'organic post':'paid ad copy'),format:output==='organic'?`one organic ${p.label} post, at most ${p.words} words${p.characters?` and ${p.characters} characters`:''}, with a ${p.tone} tone and one clear call to action suited to your objective`:`${p.label} paid ad copy using the classroom practice template: a headline of at most 8 words, body of at most 30 words, and one short call to action. Use a ${p.tone} tone`};
}
export const OUTPUTS = {
  organic: {label: 'Organic post', format: 'one organic Instagram caption, at most 50 words, friendly, with one clear call to action suited to your objective'},
  ad: {label: 'Paid ad copy', format: 'Instagram ad copy with a headline of at most 8 words, body of at most 30 words, and one short call to action. Use a friendly tone'}
};
export const MODEL_F = 'Use only the approved facts in Background. Do not invent statistics, quotes, offers, or product benefits. List factual claims separately and identify where each came from. I will check every claim against the fact sheet and correct or remove unsupported claims before submitting.';
export const EXAMPLE = {
  B: 'Campus Corner Coffee is a fictional student-run shop on State Street. Its new oat-milk latte launches Monday and costs $4.50. No discount, health benefit, or scarcity claim is approved. Style reference only: "Between classes? Meet us at the corner for your next coffee break."',
  R: 'You are a social media copywriter for campus coffee shops.',
  I: 'Undergraduates who buy coffee between classes and see this on Instagram. They want a convenient coffee break; use a friendly student-run voice.',
  E: `Objective: encourage students to try the new latte during launch week. Format: ${OUTPUTS.organic.format}.`, F: MODEL_F
};
export function readiness(elements) {
  if (!elements || LETTERS.some(k => !Number.isInteger(elements[k]?.score) || elements[k].score < 0 || elements[k].score > 2)) throw new Error('Invalid field scores.');
  const total = LETTERS.reduce((sum, k) => sum + elements[k].score, 0);
  return {total, greenlit: total >= 8 && LETTERS.every(k => elements[k].score >= 1) && elements.E.score === 2 && elements.F.score === 2};
}
export function briefSnapshot(brief) { return JSON.stringify(Object.fromEntries(LETTERS.map(k => [k, String(brief[k] ?? '').trim()]))); }
export function wordCount(text) { return String(text).trim().split(/\s+/u).filter(Boolean).length; }
export function formatIssues(copy, output, platform='instagram') {
  if(output==='organic'){const p=PLATFORMS[platform];if(!p)return ['Choose a platform.'];const issues=[];if(wordCount(copy)>p.words)issues.push(`The post is over the classroom limit of ${p.words} words.`);if(p.characters&&Array.from(copy).length>p.characters)issues.push(`The post is over the classroom limit of ${p.characters} characters.`);return issues;}
  const lines = String(copy).split('\n');
  const find = name => lines.find(s => s.toLowerCase().startsWith(name.toLowerCase() + ':'))?.split(':').slice(1).join(':').trim();
  const headline = find('Headline'), body = find('Body'), cta = find('Call to action');
  const issues = [];
  if (!headline || !body || !cta) issues.push('Include labeled Headline, Body, and Call to action lines.');
  if (headline && wordCount(headline) > 8) issues.push('The headline is over 8 words.');
  if (body && wordCount(body) > 30) issues.push('The body is over 30 words.');
  return issues;
}

export function exampleFor(id){const sc=getScenario(id);return sc.id===SCENARIO.id?{...EXAMPLE}:{B:sc.facts.join(' ')+' '+sc.limits+' Style reference only: "'+sc.reference+'"',R:'You are a social media copywriter for campus organizations.',I:'Students who see this on Instagram and need clear information to decide whether to take part.',E:'Objective: help students decide whether to respond to this opportunity. Format: '+OUTPUTS.organic.format+'.',F:MODEL_F};}
export function splitExpected(text=''){const parts=String(text).split(/\bFormat:/i);return {objective:cleanObjective(text),format:parts.slice(1).join('Format:').trim()};}
export function combineExpected(objective,format){return [objective.trim()?'Objective: '+objective.trim():'',format.trim()?'Format: '+format.trim():''].filter(Boolean).join('\n');}

export const SCENARIO_LABELS={"community-garden":"Community Garden","garden-volunteers":"Community Garden","library-hours":"Library Hours","workshop-correction":"Resume Workshop"};
export function claimSourceLabel(source){return String(source).replace(/\bfact[ -]sheet\s*:\s*title\b/gi,"fact sheet: practice-situation title");}

export const CREATIVE_ANGLES={
 auto:{label:'No preference: let AI choose',instruction:'Choose the strongest audience-relevant opening: a question, a relatable moment, or a surprising turn of phrase.'},
 question:{label:'Open with a question',instruction:"Open with a specific question that connects to the audience's situation, not a generic question."},
 moment:{label:'Start with a relatable moment',instruction:"Start with a recognizable moment in the audience's day. Make the situation concrete without inventing facts."},
 surprise:{label:'Use a surprising opening',instruction:'Use an unexpected contrast or turn of phrase tied to the approved facts. Do not invent an offer or product benefit.'}
};
export function cleanObjective(text){return String(text).split(/(?:Beat\s*2\s*[,.:]\s*(?:the\s+)?format\s*:|(?:\\n|\n)?\s*Format\s*:)/i)[0].replace(/^(?:Beat\s*1\s*[,.:]\s*)?(?:the\s+)?objective\s*:\s*/i,'').trim();}
export function hasMixedObjective(text){return /Beat\s*[12]\b|\bFormat\s*:/i.test(text);}
export const CREATIVE_COMPARISON={routine:'Visit Neighborhood Paws this Saturday to learn about adoption. Entry is free.',distinctive:'Thinking about adoption? Start with questions, not a commitment. Meet the Neighborhood Paws team Saturday, 11 a.m.–2 p.m., at 18 Oak Avenue. Entry is free. Come learn about the process.',why:"The second version addresses the audience's uncertainty, gives the invitation an idea, and keeps the factual details intact. It is an illustration, not evidence of campaign performance."};
