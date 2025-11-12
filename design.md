## Final Design Summary (Assignment 4c)

### Differences vs A2 and A4b
- From A2 (initial concept design) to now
  - Moved orchestration and access control from the frontend to backend synchronizations.
  - Replaced implicit flows with explicit guards (session, admin, share-link) in `where` clauses.
  - Clarified ownership/actor bindings (e.g., CheckIn binds `owner` and `actor` from the session user).
- From A4b (visual design) to now
  - Frontend adopted the new API contract: always sends `session`/`shareToken`, unwraps `{ results: [...] }`, and handles standardized errors.
  - Polished day view selector and reminder affordances; owner-allowed reminders; improved loading/error states.
- Immutable snapshots (reference)
  - Initial concept snapshot: `context/design/background/concept-specifications.md/20251007_212711.f76391f1.md`
  - Visual design snapshot: `context/design/background/implementing-concepts.md/20251007_212719.9b6039ea.md`
  - API context snapshot: `context/deno.json/20251028_005306.c2732493.md`

### Purpose
Bring backend authentication/authorization into syncs, stabilize the API contract for the frontend, harden sensitive routes, and deploy a working, documented app that aligns with the rubric.

---

### Architecture: Request-driven syncs
- `Requesting` concept starts the server and turns “excluded” HTTP routes into `Requesting.request` actions. Syncs match those actions, perform guards/queries (in a `where` clause), and respond via `Requesting.respond`.
- Passthrough policy (see `src/concepts/Requesting/passthrough.ts`):
  - Public, non-sensitive routes are explicitly included.
  - Sensitive routes (mutations, owner data, admin-only reads) are excluded and handled by syncs.
- Auth patterns (now consistent across concepts):
  - Session validation: `UserAccount._getUserByToken`.
  - Admin validation: `UserAccount._isAdmin`.
  - Share-link validation: `UserAccount._resolveShareLink` (and expiry checks).
  - Responses always bind required variables before `Requesting.respond` to avoid missing bindings.

---

### API contract updates
Source of truth: `design/api/backend.api.md` (kept in sync with backend).
- Authentication inputs:
  - `session`: required for protected routes; obtained via `/UserAccount/login`.
  - `shareToken`: for read-only sharing without a session.
- Response shapes:
  - Actions: flat objects (e.g., `{ "plan": "ID" }` or `{}`).
  - Queries: `{ "results": [...] }` (never `[undefined]`).
  - Errors: `{ "error": "unauthenticated" | "forbidden" | "invalid_share_token" | "share_link_expired" | "invalid_date" }`.
- Two notable behavior changes the frontend depends on:
  - `POST /api/RehabPlan/createPlan` is idempotent; it returns the existing plan id instead of erroring if a plan already exists.
  - `POST /api/Feedback/sendReminder` is allowed for the owner or any admin (previously treated as admin-only).

---

### Key design choices & rationale
- Move auth to backend syncs (instead of FE-enforced)
  - Why: eliminates client-side trust assumptions; expresses security as declarative guards; keeps flows co-located with concept logic.
  - Alternative rejected: keep FE-only checks (fragile; easy to bypass; duplicated logic).
- Normalize responses and errors
  - `{ results: [...] }` for queries and a small, explicit error set avoids undefined arrays and fragile FE conditionals.
  - Alternative: passthrough raw concept arrays and heterogeneous error shapes (harder FE, more coupling).
- Idempotent RehabPlan.createPlan
  - Choice: on “already has an active plan,” return the existing id (no error).
  - Rationale: removes a noisy FE race/branch; models “ensure exists” semantics.
- Owner-allowed Feedback.sendReminder (admin still allowed)
  - Choice aligns with the user journey (self-reminders), while preserving admin tooling.
  - Alternative (admin-only) rejected as overly restrictive for core flow.
- ExerciseLibrary admin gating and AI flow
  - Admin-only mutations; proposal stage returns preview details without mutating exercise; apply/discard require admin.
  - Uses official `@google/generative-ai` SDK with a testable stub; robust parsing and `null` videoUrl clears the field.
  - Rationale: preserves editorial control; safe/traceable AI augmentation.
- Share-link scope and expiry
  - Read-only via `shareToken`, with strict expiry checks; no mutations permitted with tokens.
  - Rationale: safe sharing without account creation; minimized blast radius.
- Path/payload leniency to avoid timeouts
  - Accept both `proposal` or `proposalId` for apply/discard; `_listProposals` works with or without `status`.
  - Rationale: tolerate client variance; ensure a Requesting.respond always fires (no 10s timeouts).
- CORS + request tracing
  - Enabled Hono CORS for the FE origin; kept flow-by-flow log traces to aid debugging and demo trace capture.

---

### Concept-specific decisions
- UserAccount
  - Routes requiring a session are explicitly guarded in syncs; admin checks done only where needed.
  - Share-link lifecycle handled via `createShareLink`/`revokeShareLink` and `_listShareLinks`.
- CheckIn
  - Mutations (`submit`, `amend`) require session; owner derived from session and bound as both `actor` and `owner`.
  - Owner queries accept `session`; shared read-only list accepts `shareToken` with expiry checks.
- RehabPlan
  - `createPlan` made idempotent; if an active plan exists, return it.
  - Owner queries accept `session`; read-only access by `shareToken` validates owner + expiry.
- ExerciseLibrary
  - All mutations and select reads are admin-only. Syncs enforce admin via `_isAdmin` (derived from session).
  - Query responses normalized to `{ results: [...] }` (no `undefined` entries).
- Feedback
  - `recordCompletion`/metrics/messages require session.
  - `sendReminder` allowed for owner or admin; rejects otherwise with `forbidden`.
  - Share-link path for summary metrics remains read-only and expiry-gated.

---

### Security and authorization summary
- All sensitive routes are excluded from passthrough and validated in `where` clauses.
- Sessions are validated server-side before any mutation or owner-specific read.
- Admin checks are centralized and consistent; no reliance on frontend flags.
- Share links cannot access mutations and are rejected if invalid or expired.

---

### Frontend changes required (completed)
- Include `session` (or `shareToken`) in bodies for protected/read-only routes per `design/api/backend.api.md`.
- Unwrap query data from `{ results: [...] }` and handle the standardized error codes.
- Use idempotent `createPlan` behavior (don’t retry-loop on prior-plan errors), and allow owner to send reminders.

---

### Verification (deployment + trace)
- Deployed on Render (Deno + MongoDB). Environment: `MONGODB_URL`, `DB_NAME`, `PORT`.
- Observability: Render logs provide the action trace used in the demo submission.

---

### Evidence and testing (summary)
- Concept tests (`deno test -A`) validate core behaviors across concepts (admin gating, owner checks, proposal apply/discard, share-links, feedback streaks).
- Manual end-to-end runs validate:
  - Session vs. admin vs. share-token access patterns.
  - Day view selector, plan creation/idempotency, reminder flows, AI proposal → apply/discard path.

---

### Interesting moments (selected)
- Optional parameters vs. spec (CheckIn.amend)
  - Implementation suggested optional `strain_0_10`/`pain_0_10`; this matched real use and we updated the spec accordingly.
  - Reference: `design/concepts/checkin/implementation.md` and `context/design/concepts/checkin/test.md/steps/response.4d78370b.md`.
- Prompting quality shaped outcomes (RehabPlan outline)
  - A vague prompt yielded near-complete code; a precise “skeleton only, with docstrings” prompt produced the intended outline.
  - Reference: `context/design/brainstorming/RehabPlan/implementation_outline.md/steps/response.ef94f105.md`.
- Test structuring trade-off
  - One large test vs. many focused tests: we favored focused cases for clearer failure signals and coverage mapping.
  - Reference: `context/design/concepts/feedback/test.md/steps/response.ee41c1c0.md`.

---

### Rationale and impact
- Moving orchestration to syncs makes auth reliable and declarative, removing scattered frontend logic and ensuring the backend owns security decisions.
- Standardizing responses and errors simplifies frontend data handling and reduces edge-case failures.
- Idempotent `createPlan` improves UX and robustness; owner-enabled reminders better match real usage.

---

### Pointers
- Backend API contract:
  - `design/api/backend.api.md`
- Request routing notes:
  - `design/api/request-routing.md`
- Sync implementations:
  - `src/syncs/` (CheckIn, RehabPlan, ExerciseLibrary, Feedback, UserAccount)


