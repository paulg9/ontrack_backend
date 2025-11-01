# API Specification: Backend Concepts

Base URL: http://localhost:8000/api

All endpoints use HTTP POST with `Content-Type: application/json`.

- Actions return a single JSON object (or `{}` when no results).
- Queries (methods beginning with `_`) return a JSON array of objects.
- Errors are returned as `{ "error": "string" }`.

---

## Concept: ExerciseLibrary

Purpose: Provide a catalog of exercises that a plan is allowed to reference.
Administrators may request AI‑proposed details and explicitly apply or discard
those proposals.

### POST /api/ExerciseLibrary/addExercise

Description: Create a fully-specified exercise. Requirements:

- `actorIsAdmin = true`; `title` non-empty; `recommendedFreq` integer in [0, 14]
  Effects:
- Creates Exercise (`deprecated := false`) and returns its id Request Body:

```json
{
  "title": "string",
  "videoUrl": "string (optional)",
  "cues": "string",
  "recommendedFreq": 0,
  "actorIsAdmin": true
}
```

Success Response Body:

```json
{ "exercise": "ID" }
```

### POST /api/ExerciseLibrary/addExerciseDraft

Description: Create a minimally specified exercise draft. Requirements:

- `actorIsAdmin = true`; `title` non-empty Effects:
- Creates Exercise with minimal defaults Request Body:

```json
{ "title": "string", "actorIsAdmin": true }
```

Success Response Body:

```json
{ "exercise": "ID" }
```

### POST /api/ExerciseLibrary/updateExercise

Description: Update optional exercise fields. Requirements:

- `actorIsAdmin = true`; `exercise` exists; if provided: `title` non-empty;
  `recommendedFreq` integer in [0, 14]; `videoUrl` http/https or `null` to clear
  Effects:
- Updates provided fields Request Body:

```json
{
  "exercise": "ID",
  "title": "string (optional)",
  "videoUrl": "string|null (optional)",
  "cues": "string (optional)",
  "recommendedFreq": 0,
  "actorIsAdmin": true
}
```

Success Response Body:

```json
{}
```

### POST /api/ExerciseLibrary/deprecateExercise

Description: Mark an exercise as deprecated. Requirements:

- `actorIsAdmin = true`; `exercise` exists Effects:
- Sets `deprecated := true` Request Body:

```json
{ "exercise": "ID", "actorIsAdmin": true }
```

Success Response Body:

```json
{}
```

### POST /api/ExerciseLibrary/proposeDetails

Description: Generate (via Gemini) or record AI-proposed details for an
exercise. Requirements:

- `actorIsAdmin = true`; `exercise` exists; the server must have
  `GEMINI_API_KEY` configured; cues non-empty/no HTML/≤400; freq integer 0..14;
  url http/https; confidence in [0,1] Effects:
- The server calls Gemini with the current exercise details, stores the proposed
  details as a pending `DetailProposal`, and returns its id along with the
  normalized details. Request Body:

```json
{
  "exercise": "ID",
  "actorIsAdmin": true
}
```

Success Response Body:

```json
{
  "proposal": "ID",
  "details": {
    "videoUrl": "string|null",
    "cues": "string",
    "recommendedFreq": 0,
    "confidence_0_1": 0
  }
}
```

### POST /api/ExerciseLibrary/applyDetails

Description: Apply a pending proposal to its exercise. Requirements:

- `actorIsAdmin = true`; pending `proposal` exists Effects:
- Merges details; marks proposal applied Request Body:

```json
{ "proposal": "ID", "actorIsAdmin": true }
```

Success Response Body:

```json
{}
```

### POST /api/ExerciseLibrary/discardDetails

Description: Discard a pending proposal. Requirements:

- `actorIsAdmin = true`; pending `proposal` exists Effects:
- Marks proposal discarded Request Body:

```json
{ "proposal": "ID", "actorIsAdmin": true }
```

Success Response Body:

```json
{}
```

### POST /api/ExerciseLibrary/_getExerciseById

Description: Retrieve a single exercise by id. Request Body:

```json
{ "exercise": "ID" }
```

Success Response Body (Query):

```json
[
  {
    "_id": "ID",
    "title": "string",
    "videoUrl": "string (optional)",
    "cues": "string",
    "recommendedFreq": 0,
    "deprecated": false
  }
]
```

### POST /api/ExerciseLibrary/_listExercises

Description: List exercises, optionally excluding deprecated. Request Body:

```json
{ "includeDeprecated": true }
```

Success Response Body (Query):

```json
[
  {
    "_id": "ID",
    "title": "string",
    "videoUrl": "string (optional)",
    "cues": "string",
    "recommendedFreq": 0,
    "deprecated": false
  }
]
```

### POST /api/ExerciseLibrary/_listProposals

Description: List proposals, optionally filtered by status. Request Body:

```json
{ "status": "pending|applied|discarded" }
```

Success Response Body (Query):

```json
[
  {
    "_id": "ID",
    "exercise": "ID",
    "createdAt": "ISO-8601 string",
    "videoUrl": "string (optional)",
    "cues": "string",
    "recommendedFreq": 0,
    "confidence_0_1": 0.8,
    "status": "pending"
  }
]
```

### POST /api/ExerciseLibrary/_getProposalsForExercise

Description: List proposals for a specific exercise. Request Body:

```json
{ "exercise": "ID" }
```

Success Response Body (Query):

```json
[
  {
    "_id": "ID",
    "exercise": "ID",
    "createdAt": "ISO-8601 string",
    "videoUrl": "string (optional)",
    "cues": "string",
    "recommendedFreq": 0,
    "confidence_0_1": 0.8,
    "status": "pending"
  }
]
```

---

## Concept: CheckIn

Purpose: Record daily completion and simple subjective context.

### POST /api/CheckIn/submit

Description: Create a daily check-in. Requirements:

- `actor = owner`; no existing check-in for (owner, date); strain and pain in
  [0..10]; `date` format `YYYY-MM-DD` Effects:
- Creates a CheckIn Request Body:

```json
{
  "actor": "ID",
  "owner": "ID",
  "date": "YYYY-MM-DD",
  "completedItems": ["ID"],
  "strain_0_10": 0,
  "pain_0_10": 0,
  "comment": "string (optional)"
}
```

Success Response Body:

```json
{ "checkin": "ID" }
```

### POST /api/CheckIn/amend

Description: Update fields on an existing check-in. Requirements:

- `checkin` exists and belongs to `actor` Effects:
- Updates provided fields (comment cleared with null/empty string) Request Body:

```json
{
  "actor": "ID",
  "checkin": "ID",
  "completedItems": ["ID"],
  "strain_0_10": 0,
  "pain_0_10": 0,
  "comment": "string|null"
}
```

Success Response Body:

```json
{}
```

### POST /api/CheckIn/_getCheckInByOwnerAndDate

Description: Get check-in for (owner, date). Request Body:

```json
{ "owner": "ID", "date": "YYYY-MM-DD" }
```

Success Response Body (Query):

```json
[{
  "_id": "ID",
  "owner": "ID",
  "date": "YYYY-MM-DD",
  "completedItems": ["ID"],
  "strain_0_10": 0,
  "pain_0_10": 0,
  "comment": "string (optional)"
}]
```

### POST /api/CheckIn/_getCheckInsByOwner

Description: List all check-ins for an owner. Request Body:

```json
{ "owner": "ID" }
```

Success Response Body (Query):

```json
[{
  "_id": "ID",
  "owner": "ID",
  "date": "YYYY-MM-DD",
  "completedItems": ["ID"],
  "strain_0_10": 0,
  "pain_0_10": 0,
  "comment": "string (optional)"
}]
```

### POST /api/CheckIn/_getCheckInById

Description: Get a check-in by id. Request Body:

```json
{ "checkin": "ID" }
```

Success Response Body (Query):

```json
[{
  "_id": "ID",
  "owner": "ID",
  "date": "YYYY-MM-DD",
  "completedItems": ["ID"],
  "strain_0_10": 0,
  "pain_0_10": 0,
  "comment": "string (optional)"
}]
```

### POST /api/CheckIn/_hasCheckIn

Description: Check existence of a check-in for (owner, date). Request Body:

```json
{ "owner": "ID", "date": "YYYY-MM-DD" }
```

Success Response Body (Query):

```json
[{ "has": true }]
```

---

## Concept: RehabPlan

Purpose: Define the athlete’s routine as a selection of exercises and target
frequencies.

### POST /api/RehabPlan/createPlan

Description: Create an empty plan for a user. Requirements:

- `actor = owner`; owner has no active (non-archived) plan Effects:
- Creates plan with empty items Request Body:

```json
{ "actor": "ID", "owner": "ID" }
```

Success Response Body:

```json
{ "plan": "ID" }
```

### POST /api/RehabPlan/addPlanItem

Description: Add a plan item to a plan. Requirements:

- `plan` exists; `plan.owner = actor`; `exercise` valid and not deprecated
  (validated externally) Effects:
- Appends the plan item Request Body:

```json
{
  "actor": "ID",
  "plan": "ID",
  "exercise": "ID",
  "perWeek": 0,
  "sets": 0,
  "reps": 0,
  "notes": "string"
}
```

Success Response Body:

```json
{}
```

### POST /api/RehabPlan/removePlanItem

Description: Remove a plan item by exercise id. Requirements:

- `plan` exists; `plan.owner = actor`; item for `exercise` exists Effects:
- Removes the item Request Body:

```json
{ "actor": "ID", "plan": "ID", "exercise": "ID" }
```

Success Response Body:

```json
{}
```

### POST /api/RehabPlan/archivePlan

Description: Archive a plan. Requirements:

- `plan` exists; `plan.owner = actor` Effects:
- Sets `archived := true` Request Body:

```json
{ "actor": "ID", "plan": "ID" }
```

### POST /api/RehabPlan/_getActivePlanByOwner

Description: Get the active (non-archived) plan for an owner. Request Body:

```json
{ "owner": "ID" }
```

Success Response Body (Query):

```json
[
  {
    "_id": "ID",
    "owner": "ID",
    "archived": false,
    "items": [
      {
        "exercise": "ID",
        "perWeek": 0,
        "sets": 0,
        "reps": 0,
        "notes": "string"
      }
    ]
  }
]
```

### POST /api/RehabPlan/_getPlanById

Description: Get a plan by id. Request Body:

```json
{ "plan": "ID" }
```

Success Response Body (Query):

```json
[
  {
    "_id": "ID",
    "owner": "ID",
    "archived": false,
    "items": [
      {
        "exercise": "ID",
        "perWeek": 0,
        "sets": 0,
        "reps": 0,
        "notes": "string"
      }
    ]
  }
]
```

Success Response Body:

```json
{}
```

---

## Concept: Feedback

Purpose: Compute and deliver habit‑forming feedback and reminders from
check‑ins.

### POST /api/Feedback/recompute

Description: Upsert summary metrics for a user. Requirements:

- `owner` exists Effects:
- Upserts Summary with provided streak and completion values; returns summaryId
  Request Body:

```json
{
  "owner": "ID",
  "today": "ISO-8601 string",
  "newStreakCount": 0,
  "newCompletion7d": 0
}
```

Success Response Body:

```json
{ "summaryId": "ID", "newStreakCount": 0, "newCompletion7d": 0 }
```

### POST /api/Feedback/recordMessage

Description: Record a message for a user. Requirements:

- `owner` exists Effects:
- Appends a Message and returns its id Request Body:

```json
{ "owner": "ID", "kind": "reminder|motivation|summary", "text": "string" }
```

Success Response Body:

```json
{ "messageId": "ID" }
```

### POST /api/Feedback/sendReminder

Description: System action to send a reminder and record it. Requirements:

- Summary for `owner` exists Effects:
- Records reminder Message; updates `lastReminderDate` Request Body:

```json
{ "owner": "ID" }
```

Success Response Body:

```json
{}
```

### POST /api/Feedback/_getSummaryMetrics

Description: Get streak and 7‑day completion ratio. Request Body:

```json
{ "owner": "ID" }
```

Success Response Body (Query):

```json
[{ "streakCount": 0, "completion7d": 0 }]
```

### POST /api/Feedback/_hasSentReminderToday

Description: Check if a reminder was sent on a given date. Request Body:

```json
{ "owner": "ID", "date": "ISO-8601 string" }
```

Success Response Body (Query):

```json
[{ "sent": true }]
```

### POST /api/Feedback/_listMessages

Description: List messages for an owner (newest first). Request Body:

```json
{ "owner": "ID" }
```

Success Response Body (Query):

```json
[
  {
    "_id": "ID",
    "owner": "ID",
    "timestamp": "ISO-8601 string",
    "kind": "reminder|motivation|summary",
    "text": "string"
  }
]
```

---

## Concept: LikertSurvey

Purpose: Measure attitudes/opinions with Likert-scale questions.

### POST /api/LikertSurvey/createSurvey

Description: Create a new survey. Requirements:

- `scaleMin < scaleMax` Effects:
- Creates survey and returns its id Request Body:

```json
{ "author": "ID", "title": "string", "scaleMin": 1, "scaleMax": 5 }
```

Success Response Body:

```json
{ "survey": "ID" }
```

### POST /api/LikertSurvey/addQuestion

Description: Add a question to a survey. Requirements:

- Survey exists Effects:
- Creates question and returns its id Request Body:

```json
{ "survey": "ID", "text": "string" }
```

Success Response Body:

```json
{ "question": "ID" }
```

### POST /api/LikertSurvey/submitResponse

Description: Submit a response to a question. Requirements:

- Question exists; respondent hasn’t answered; value within survey scale
  Effects:
- Records response Request Body:

```json
{ "respondent": "ID", "question": "ID", "value": 3 }
```

Success Response Body:

```json
{}
```

### POST /api/LikertSurvey/updateResponse

Description: Update an existing response. Requirements:

- Question exists; response exists; value within scale Effects:
- Updates response value Request Body:

```json
{ "respondent": "ID", "question": "ID", "value": 4 }
```

Success Response Body:

```json
{}
```

### POST /api/LikertSurvey/_getSurveyQuestions

Description: List questions for a survey. Request Body:

```json
{ "survey": "ID" }
```

Success Response Body (Query):

```json
[{ "_id": "ID", "survey": "ID", "text": "string" }]
```

### POST /api/LikertSurvey/_getSurveyResponses

Description: List responses for a survey. Request Body:

```json
{ "survey": "ID" }
```

Success Response Body (Query):

```json
[{ "_id": "ID", "respondent": "ID", "question": "ID", "value": 3 }]
```

### POST /api/LikertSurvey/_getRespondentAnswers

Description: List all answers by a respondent. Request Body:

```json
{ "respondent": "ID" }
```

Success Response Body (Query):

```json
[{ "_id": "ID", "respondent": "ID", "question": "ID", "value": 2 }]
```

---

## Concept: UserAccount

Purpose: Create, manage, and personalize a user account; manage share links.

### POST /api/UserAccount/register

Description: Register a new user. Requirements:

- `username` not already taken Effects:
- Creates User; sets default fields Request Body:

```json
{ "username": "string", "password": "string", "isAdmin": false }
```

Success Response Body:

```json
{ "user": "ID" }
```

### POST /api/UserAccount/login

Description: Sign in and receive a session token. Requirements:

- A user with `username` exists and `password` matches Effects:
- Creates a Session with token; returns token Request Body:

```json
{ "username": "string", "password": "string" }
```

Success Response Body:

```json
{ "token": "string" }
```

### POST /api/UserAccount/logout

Description: Sign out by invalidating a session token. Requirements:

- Session with `token` exists Effects:
- Deletes the Session Request Body:

```json
{ "token": "string" }
```

Success Response Body:

```json
{}
```

### POST /api/UserAccount/setReminderTime

Description: Set a user’s reminder time. Requirements:

- User exists Effects:
- Sets `reminderTime := time` Request Body:

```json
{ "user": "ID", "time": "HH:MM" }
```

Success Response Body:

```json
{}
```

### POST /api/UserAccount/_getUserByToken

Description: Resolve a user id from an active session token. Request Body:

```json
{ "token": "string" }
```

Success Response Body (Query):

```json
[{ "user": "ID" }]
```

### POST /api/UserAccount/_isAdmin

Description: Return whether a user is an administrator. Request Body:

```json
{ "user": "ID" }
```

Success Response Body (Query):

```json
[{ "isAdmin": true }]
```

### POST /api/UserAccount/_isSignedIn

Description: Return whether a token corresponds to an active (non-expired)
session. Request Body:

```json
{ "token": "string" }
```

Success Response Body (Query):

```json
[{ "signedIn": true }]
```

### POST /api/UserAccount/createShareLink

Description: Create a share link for a user with TTL. Requirements:

- Owner exists Effects:
- Creates ShareLink; returns token Request Body:

```json
{ "owner": "ID", "ttlSeconds": 3600 }
```

Success Response Body:

```json
{ "token": "string" }
```

### POST /api/UserAccount/revokeShareLink

Description: Revoke a share link by token for the owner. Requirements:

- ShareLink with `token` exists and belongs to `owner` Effects:
- Removes ShareLink and detaches from owner Request Body:

```json
{ "owner": "ID", "token": "string" }
```

Success Response Body:

```json
{}
```
