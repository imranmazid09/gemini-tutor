# BRIEF Prompt Trainer

A beginner activity for CAP 105: plan, prompt, check, and improve one organic Instagram post or social ad. By Dr Imran.

## Student workflow

1. Inspect the fictional Campus Corner Coffee fact sheet.
2. Choose one output and write B Background, R Role, I Intended audience, E Expected output, and F Fact-check.
3. Get unlimited coaching, then grade the current BRIEF. Readiness requires at least 8/10, every field at least 1, and E and F each at 2.
4. Generate one draft from the complete BRIEF. Changing the brief or output requires grading again.
5. Complete the human Facts / Fit / Revision review. Check claims, explain audience/objective fit, make one purposeful improvement, and explain it in two sentences.
6. Download a printable HTML report. This does not submit the assignment.

The rubric, facts, and examples match BRIEF rubric 1.0 in the revised student guide, demo bank, and calibration pack. Word limits are classroom constraints, not official platform limits. A ready brief is permission to draft, not a verified message or evidence of campaign success.

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

Readiness approvals are stateless and expire after one hour. They bind to the normalized brief, selected output, and rubric version. Generation verifies the approval on the server. This is a learning gate, not identity verification or protection against every form of endpoint abuse.

The function has a 45-second provider timeout and a 200-request-per-minute per-IP limit. Shared campus IPs count together; review the limit during a pilot. Network errors preserve work and allow retry. Browser-storage failures show a warning and leave download available. Stored work is device-specific and may be cleared; download before ending the activity.

## Official references

- [Google Gemini getting started](https://ai.google.dev/gemini-api/docs/get-started)
- [Google structured outputs](https://ai.google.dev/gemini-api/docs/structured-output)
- [Google API-key guidance](https://ai.google.dev/gemini-api/docs/api-key)
- [Google models](https://ai.google.dev/gemini-api/docs/models)
- [Netlify function environment variables](https://docs.netlify.com/build/functions/environment-variables/)
