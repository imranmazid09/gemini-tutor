export const RUBRIC_VERSION = 'BRIEF-1.0';
export const LETTERS = ['B', 'R', 'I', 'E', 'F'];
export const FIELDS = {
  B: {name: 'Background', hint: 'Give the approved facts and one clearly labeled style reference.'},
  R: {name: 'Role', hint: 'Name a specialist suited to this task and business.'},
  I: {name: 'Intended audience', hint: 'Who is this for? Add a relevant need, situation, platform, or sensitivity.'},
  E: {name: 'Expected output', hint: 'Two parts: the audience outcome, then the deliverable with length, structure, and tone.'},
  F: {name: 'Fact-check', hint: 'Set the factual boundary, request a claim-and-source list, and explain your human check.'}
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
export const OUTPUTS = {
  organic: {label: 'Organic Instagram post', format: 'one organic Instagram caption, at most 50 words, friendly, with one clear call to action suited to your objective'},
  ad: {label: 'Instagram ad copy', format: 'Instagram ad copy with a headline of at most 8 words, body of at most 30 words, and one short call to action. Use a friendly tone'}
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
export function formatIssues(copy, output) {
  if (output === 'organic') return wordCount(copy) > 50 ? ['The caption is over the classroom limit of 50 words.'] : [];
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
export function splitExpected(text=''){const parts=text.split(/\bFormat:/i);return {objective:parts[0].replace(/^Objective:\s*/i,'').trim(),format:parts.slice(1).join('Format:').trim()};}
export function combineExpected(objective,format){return [objective.trim()?'Objective: '+objective.trim():'',format.trim()?'Format: '+format.trim():''].filter(Boolean).join('\n');}
