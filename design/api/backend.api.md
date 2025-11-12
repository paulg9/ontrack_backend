
# API Specification: Backend Concepts

Base URL: `https://<backend>/api`

All endpoints accept `POST` requests with `Content-Type: application/json`.

### Authentication Model
- `session` &mdash; most routes require an authenticated user session. Include the token returned by `/UserAccount/login` in the request body.
- `shareToken` &mdash; read-only routes that can be accessed without a session. Obtain the token from `/UserAccount/createShareLink`.
- Routes listed under **Public** do not require authentication.

### Response Shapes
- Successful **actions** return a JSON object with the fields listed below.
- Successful **queries** return `{ "results": [ ... ] }`.
- Errors return `{ "error": "reason" }`.

| Error Code | Meaning |
| --- | --- |
| `unauthenticated` | Missing or invalid `session`. |
| `forbidden` | Session is valid but lacks required permissions (e.g., not an admin). |
| `invalid_date` | Provided date/time failed validation. |
| `invalid_share_token` | Share token not found. |
| `share_link_expired` | Share token exists but has expired. |

---

## UserAccount (Authentication & Share Links)

### Public
#### POST `/api/UserAccount/register`
Request:
```json
{ "username": "string", "password": "string", "isAdmin": false }
```
Response:
```json
{ "user": "ID" }
```

#### POST `/api/UserAccount/login`
Request:
```json
{ "username": "string", "password": "string" }
```
Response:
```json
{ "token": "string" }
```

#### POST `/api/UserAccount/_resolveShareLink`
Request:
```json
{ "token": "string" }
```
Response:
```json
{ "results": [ { "owner": "ID", "ownerUsername": "string|null", "expiresAt": "ISO-8601", "expired": false } ] }
```

### Session Required
Include `{ "session": "<token>", ... }`.

- **POST `/api/UserAccount/logout`**  
  Request `{ "session": "string" }` → Response `{}`.
- **POST `/api/UserAccount/setReminderTime`**  
  Request `{ "session": "string", "time": "HH:MM" }` → Response `{}`.
- **POST `/api/UserAccount/createShareLink`**  
  Request `{ "session": "string", "ttlSeconds": 3600 }` → Response `{ "token": "string" }`.
- **POST `/api/UserAccount/revokeShareLink`**  
  Request `{ "session": "string", "token": "string" }` → Response `{}`.
- **POST `/api/UserAccount/_getUserByToken`**  
  Request `{ "session": "string" }` → Response `{ "results": [ { "user": "ID" } ] }`.
- **POST `/api/UserAccount/_isSignedIn`**  
  Request `{ "session": "string" }` → Response `{ "results": [ { "signedIn": true } ] }`.
- **POST `/api/UserAccount/_isAdmin`**  
  Request `{ "session": "string" }` → Response `{ "results": [ { "isAdmin": true } ] }`.
- **POST `/api/UserAccount/_listShareLinks`**  
  Request `{ "session": "string" }` → Response  
```json
  {
    "results": [
      { "shareLink": "ID", "token": "string", "expiry": "ISO-8601", "expired": false }
    ]
  }
  ```

---

## ExerciseLibrary (Admin Session Required)
All routes below require `{ "session": "<token>" }`. The backend verifies administrator status; the frontend no longer sends `actorIsAdmin`.

- **POST `/api/ExerciseLibrary/addExercise`**  
  Request body also includes `title`, optional `videoUrl`, `cues`. → Response `{ "exercise": "ID" }`.
- **POST `/api/ExerciseLibrary/addExerciseDraft`**  
  Fields: `title`. → Response `{ "exercise": "ID" }`.
- **POST `/api/ExerciseLibrary/updateExercise`**  
  Fields: `exercise`, optional `title`, `videoUrl`, `cues`. → Response `{}`.
- **POST `/api/ExerciseLibrary/deprecateExercise`**  
  Fields: `exercise`. → Response `{}`.
- **POST `/api/ExerciseLibrary/proposeDetails`**  
  Fields: `exercise`. → Response  
```json
  {
    "proposal": "ID",
    "details": { "videoUrl": "string|null", "cues": "string", "confidence_0_1": 0.0 }
  }
  ```
- **POST `/api/ExerciseLibrary/applyDetails`** / **`discardDetails`**  
  Fields: `proposal`. → Response `{}`.
- **POST `/api/ExerciseLibrary/_getExerciseById`**  
  Fields: `exercise`. → `{ "results": [ { "_id": "ID", "title": "...", "videoUrl": "...", "cues": "...", "deprecated": false } ] }`.
- **POST `/api/ExerciseLibrary/_listExercises`**  
  Optional `includeDeprecated`. → `{ "results": [ ...exercises... ] }`.
- **POST `/api/ExerciseLibrary/_listProposals`**  
  Optional `status`. → `{ "results": [ ...proposals... ] }`.
- **POST `/api/ExerciseLibrary/_getProposalsForExercise`**  
  Fields: `exercise`. → `{ "results": [ ...proposals... ] }`.

---

## CheckIn

### Session Routes
- **POST `/api/CheckIn/submit`**  
  Request `{ "session": "string", "date": "YYYY-MM-DD", "completedItems": ["ID"], "strain_0_10": 0, "pain_0_10": 0, "comment": "string|null" }`  
  Response `{ "checkin": "ID" }`.
- **POST `/api/CheckIn/amend`**  
  Request `{ "session": "string", "checkin": "ID", ...optional fields... }` → Response `{}`.
- **POST `/api/CheckIn/_getCheckInByOwnerAndDate`**  
  Request `{ "session": "string", "date": "YYYY-MM-DD" }` → `{ "results": [ { ...checkin... } ] }`.
- **POST `/api/CheckIn/_getCheckInsByOwner`**  
  Request `{ "session": "string" }` → `{ "results": [ { ...checkin... } ] }`.
- **POST `/api/CheckIn/_getCheckInById`**  
  Request `{ "session": "string", "checkin": "ID" }` → `{ "results": [ { ...checkin... } ] }`.
- **POST `/api/CheckIn/_hasCheckIn`**  
  Request `{ "session": "string", "date": "YYYY-MM-DD" }` → `{ "results": [ { "has": true } ] }`.

### Share-Link Route
- **POST `/api/CheckIn/_getCheckInsByOwner`**  
  Request `{ "shareToken": "string" }` → `{ "results": [ { ...checkin... } ] }`. Errors: `invalid_share_token`, `share_link_expired`.

---

## RehabPlan

### Session Routes
- **POST `/api/RehabPlan/createPlan`**  
  Request `{ "session": "string" }` → `{ "plan": "ID" }`.  
  Behavior: Idempotent. If an active plan already exists for the owner, returns the existing plan id (no error).
- **POST `/api/RehabPlan/addPlanItem`**  
  Request `{ "session": "string", "plan": "ID", "exercise": "ID", "perWeek": 0, "sets": 0, "reps": 0, "notes": "string" }` → `{}`.
- **POST `/api/RehabPlan/removePlanItem`**  
  Request `{ "session": "string", "plan": "ID", "exercise": "ID" }` → `{}`.
- **POST `/api/RehabPlan/archivePlan`**  
  Request `{ "session": "string", "plan": "ID" }` → `{}`.
- **POST `/api/RehabPlan/_getActivePlanByOwner`**  
  Request `{ "session": "string" }` → `{ "results": [ { ...plan... } ] }`.
- **POST `/api/RehabPlan/_getPlanById`**  
  Request `{ "session": "string", "plan": "ID" }` → `{ "results": [ { ...plan... } ] }`.

### Share-Link Route
- **POST `/api/RehabPlan/_getPlanById`**  
  Request `{ "shareToken": "string", "plan": "ID" }` → `{ "results": [ { ...plan... } ] }`.  
  Errors: `invalid_share_token`, `share_link_expired`.

---

## Feedback

### Session Routes
- **POST `/api/Feedback/recordCompletion`**  
  Request `{ "session": "string", "date": "YYYY-MM-DD", "completedAll": true }` → `{ "summaryId": "ID", "streakCount": 0, "completion7d": 0.0 }`.
- **POST `/api/Feedback/_getSummaryMetrics`**  
  Request `{ "session": "string" }` → `{ "results": [ { "streakCount": 0, "completion7d": 0.0 } ] }`.
- **POST `/api/Feedback/_hasSentReminderToday`**  
  Request `{ "session": "string", "date": "YYYY-MM-DD" }` → `{ "results": [ { "sent": false } ] }` (requires valid date).
- **POST `/api/Feedback/_listMessages`**  
  Request `{ "session": "string" }` → `{ "results": [ { "_id": "ID", "timestamp": "ISO-8601", "kind": "...", "text": "..." } ] }`.
- **POST `/api/Feedback/sendReminder`**  
  Request `{ "session": "string", "owner": "ID" }` → `{}`.  
  Authorization: allowed for the `owner` or any admin. Error: `{ "error": "forbidden" }` if neither.

### Admin Session Routes
- **POST `/api/Feedback/recompute`**  
  Request `{ "session": "string", "owner": "ID", "today": "YYYY-MM-DD", "newStreakCount": 0, "newCompletion7d": 0.0 }` → `{ "summaryId": "ID", ... }`.
- **POST `/api/Feedback/recordMessage`**  
  Request `{ "session": "string", "owner": "ID", "kind": "reminder|motivation|summary", "text": "string" }` → `{ "messageId": "ID" }`.

### Share-Link Route
- **POST `/api/Feedback/_getSummaryMetrics`**  
  Request `{ "shareToken": "string" }` → `{ "results": [ { "streakCount": 0, "completion7d": 0.0 } ] }`.

---

## LikertSurvey (Public)
The LikertSurvey concept remains exposed via passthrough routes. No session token is required.

- **POST `/api/LikertSurvey/createSurvey`**  
  Request `{ "author": "ID", "title": "string", "scaleMin": 1, "scaleMax": 5 }` → `{ "survey": "ID" }`.
- **POST `/api/LikertSurvey/addQuestion`**  
  Request `{ "survey": "ID", "text": "string" }` → `{ "question": "ID" }`.
- **POST `/api/LikertSurvey/submitResponse`**  
  Request `{ "respondent": "ID", "question": "ID", "value": 3 }` → `{}`.
- **POST `/api/LikertSurvey/updateResponse`**  
  Request `{ "respondent": "ID", "question": "ID", "value": 4 }` → `{}`.
- **POST `/api/LikertSurvey/_getSurveyQuestions`**  
  Request `{ "survey": "ID" }` → `{ "results": [ { "_id": "ID", "text": "string" } ] }`.
- **POST `/api/LikertSurvey/_getSurveyResponses`**  
  Request `{ "survey": "ID" }` → `{ "results": [ { "_id": "ID", "respondent": "ID", "question": "ID", "value": 3 } ] }`.
- **POST `/api/LikertSurvey/_getRespondentAnswers`**  
  Request `{ "respondent": "ID" }` → `{ "results": [ { "_id": "ID", "question": "ID", "value": 2 } ] }`.

---

## Request Flow Summary
1. The frontend sends a `POST` request to `/api/...` with the appropriate payload.
2. If `session` or `shareToken` is supplied, the backend validates it via `UserAccount` queries.
3. On success, the response contains either a JSON object or `{ "results": [...] }`.
4. On failure, the response is `{ "error": "..." }`; check the table above for common values.
