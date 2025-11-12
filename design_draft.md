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

### What changed since A2/A4b
- Moved critical orchestration and auth from the frontend into backend synchronizations.
- Introduced the `Requesting` concept and a request server so HTTP requests become actions that syncs can guard and route.
- Replaced fragile direct passthroughs with explicit include/exclude policy and request-driven syncs for sensitive routes.
- Standardized the API contract for queries to return `{ "results": [...] }` and for errors to return `{ "error": "..." }`.
- Clarified share-link reads via `shareToken`, and session/auth checks via `session`.

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

### Deployment
- Runtime: Deno. Database: MongoDB.
- Render env:
  - `MONGODB_URL`, `DB_NAME`, `PORT`.
  - Start: `deno run --allow-net --allow-write --allow-read --allow-sys --allow-env src/main.ts`.
- Observability: Render logs provide the action trace. Copy trace into `design/trace.md` for submission.

---

### Evidence and testing
- Concept unit tests pass (`deno test -A`) for all core behaviors.
- Request-driven sync test added (currently ignored due to engine semantics around missing keys) documenting intended enforcement paths. Manual validation performed for:
  - Session invalid/valid, admin required, share-link invalid/expired/valid.
  - End-to-end flows exercised from the frontend.

Manual test checklist (for TA/demo)
1) Register → Login → get `session`.
2) RehabPlan: createPlan (returns id), add/remove items, archive plan, re-create (same id).
3) CheckIn: submit, amend, queries (by owner/date, by id), day view in UI.
4) Feedback: recordCompletion; `_getSummaryMetrics`, `_hasSentReminderToday`; sendReminder as owner; view messages.
5) ExerciseLibrary: add/update/deprecate/propose/apply/discard as admin; non-admin forbidden.
6) Share links: create; resolve; read plan/check-ins/summary via `shareToken`; verify expiry handling.

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


