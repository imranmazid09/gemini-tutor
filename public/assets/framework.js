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
export const OUTPUTS = {
  organic: {label: 'Organic Instagram post', format: 'one organic Instagram caption, at most 50 words, friendly, with one clear invitation to visit'},
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
