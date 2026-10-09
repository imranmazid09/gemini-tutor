# Prompt Writing Tutor

BRIEF Framework for Prompt Writing

A beginner activity: plan, prompt, check, and improve one organic social post or paid ad.

## Student workflow

1. Choose a fictional situation, platform, and message type. Inspect approved facts, then write one prompt in your own words. BRIEF teaching material is hidden.
2. Generate one first draft and write a short reflection about what works and what to change. The original prompt and draft are retained unchanged.
3. Unlock BRIEF. Write the five fields, use coaching, and grade. Readiness requires 8/10, every field at least 1, and E/F at 2.
4. Generate the BRIEF draft using the same situation, platform, message type, model, supplied facts, and server generation instructions as the first attempt. Each response can still vary.
5. Compare both AI drafts side by side. Identify two differences, explain which instructions may have contributed, and assess which draft serves the task better. Either draft, mixed strengths, or similar quality are valid assessments.
6. Complete Facts / Fit / Revision, save final work locally, and download the learning record for instructor submission. The record includes the original prompt/draft, first reflection, final BRIEF, feedback, second draft, comparison, checks, revision, and rationale.

The situation and output choices lock after first generation. Start a new activity to change them. BRIEF guidance is unlocked only after reflection. First-attempt proof lasts seven days; grade approval lasts one hour. Server checks the first-attempt context and model for comparison-flow requests. An earlier saved activity can still be resumed, with its absent first attempt reported honestly rather than reconstructed. Downloading does not submit work. This learning comparison does not establish that BRIEF caused every difference.

The rubric matches BRIEF rubric 1.0. Classroom format limits are not official platform limits. A ready brief is permission to draft, not verification of the message or evidence of campaign success.

## Netlify setup

Connect this repository and use the committed `netlify.toml`. The publish directory is `public`; functions and server instructions are outside that directory. Node 22 or newer is required. The build runs the local tests.

In Netlify project environment variables, set:

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Your Google AI Studio Gemini API key. Scope must include Functions and the intended deploy context. |
| `GEMINI_MODEL` | No | Default `gemini-3.8-flash`. Set an exact Gemini model ID available to your key. Existing 2.5 models may have restricted access; verify your chosen model. |
| `BRIEF_SIGNING_SECRET` | No | Optional separate random secret for signing readiness approvals. Without it, server-only HMAC signing uses the Gemini key. |

Set the key through Netlify's UI or secret-management tools, never in Git, the browser, or `netlify.toml`. Redeploy after environment changes. Configure Deploy Preview variables if you want the PR preview to call Gemini. Do not share keys in student prompts or chat.

The function uses Google's current Interactions REST API with separate system instructions, structured JSON output, and `store:false`. It sends the key in the `x-goog-api-key` header. No external search tools are enabled. The default thinking level is low for Gemini 3 models; other supported Gemini models use their default thinking settings.

There is no login or application database. Student work and interaction history stay in browser storage and downloaded reports. BRIEF requests are still transmitted to Google; `store:false` does not override Google's API data-use or retention terms. Review the settings and terms associated with your AI Studio account before student use. The tutor itself does not log prompt bodies, provider responses, or secrets.

## Local checks

```sh
npm test
```

Tests cover score-based readiness, signed approvals, edited/expired briefs, malformed output, fabricated evidence quotes, missing configuration, upstream failures, human-review completion, safe HTML export, and session restoration. These use mocked model replies; they do not prove live model grading accuracy.

For local development use Netlify CLI `netlify dev`, with the required environment variable available to the function. Do not open the HTML as a `file:` URL; browser modules require a web server.

## Instructor calibration

Set a local `GEMINI_API_KEY` and optionally `GEMINI_MODEL`, then run:

```sh
node scripts/calibrate.mjs
```

This makes 27 billable model calls: nine keyed BRIEFs, three runs each. It reports every score, readiness decision, and mismatch without printing the key. Resolve mismatches before classroom release. It tests model behavior in addition to the deterministic gate checks in `npm test`.

A suspected instruction attempt is only a review flag, not evidence of misconduct. Equivalent clear wording should earn equivalent scores. Feedback must quote each field accurately. The app checks that human-review entries are complete; the instructor remains responsible for assessing their quality.

## Implementation notes

- `public/assets/framework.js`: shared five-field rubric, scenario, output presets, readiness and format rules.
- `public/assets/app.js`: browser interface, stale-response handling, autosave, and human review.
- `public/assets/session.js`: session restoration, review rules, summary, and escaped HTML report.
- `lib/tutor.js`: authoritative model instructions, request/output validation, approval signing, and Gemini adapter.
- `netlify/functions/gemini-proxy.mjs`: modern Netlify handler and per-IP rate limit.
- `tests/`: local contract tests and instructor calibration fixtures.

Readiness approvals are stateless and expire after one hour. They bind to the normalized brief, selected practice situation, selected platform, selected message type, and rubric version. Generation verifies the approval on the server. This is a learning gate, not identity verification or protection against every form of endpoint abuse.

The function has a 45-second provider timeout and a 200-request-per-minute per-IP limit. Shared campus IPs count together; review the limit during a pilot. Network errors preserve work and allow retry. Browser-storage failures show a warning and leave download available. Stored work is device-specific and may be cleared; download before ending the activity.

## Official references

- [Google Gemini getting started](https://ai.google.dev/gemini-api/docs/get-started)
- [Google structured outputs](https://ai.google.dev/gemini-api/docs/structured-output)
- [Google API-key guidance](https://ai.google.dev/gemini-api/docs/api-key)
- [Google models](https://ai.google.dev/gemini-api/docs/models)
- [Netlify function environment variables](https://docs.netlify.com/build/functions/environment-variables/)

The revised teaching documents are the current rubric authority: the 8/10 threshold also requires every element at least 1 and E/F at 2. Tone is specified in E; the human review is Facts / Fit / Revision with a whole-copy confirmation. This intentionally replaces the older build-spec rule.

## Learning aids and request recovery

The weak/strong comparison uses a separate Neighborhood Paws adoption-information event that is not in the ten practice situations and cannot be loaded into student fields. Definitions of all five BRIEF letters precede the grading rubric. E feedback is labeled as coming from the objective or format instructions because the format may be supplied automatically.

Draft requests show immediate button and inline progress, use a 55-second browser deadline, validate the draft before rendering, and release controls on failure. A successful live baseline check did not reproduce the externally reported renderer freeze; its browser-specific cause is not yet identified. Delayed, failed, and malformed responses are checked separately from successful requests.

When a saved draft already exists, generation uses an inline Generate a new draft / Keep the existing draft choice instead of a blocking browser confirmation dialog. Approving replacement preserves the prior draft and review in the process record; cancelling preserves the current review. This addresses the carried-over-state path reported in automated Chromium sessions.

Platform formats are classroom constraints: organic posts have 50 words on Instagram, 80 on Facebook or Threads, 40 words and 280 characters on X, and 100 words on LinkedIn. Paid ad copy uses a headline/body/call-to-action practice template on all five platforms. These do not represent official platform limits or native ad specifications. Changing platform or message type preserves the objective, updates the format, and requires grading again. Earlier saved activities default to Instagram on restoration.

Creative direction in E offers an AI-chosen opening, a question, a relatable moment, or a surprising opening. Generation instructions favor a concrete audience-relevant idea over stock promotional phrases while preserving approved-fact boundaries. A separate shelter example compares routine and more distinctive copy. Objectives containing Beat labels or old format instructions show an optional cleanup action; student outcomes and measurement language are preserved. Save my final work records the reviewed copy locally and does not submit an assignment.
