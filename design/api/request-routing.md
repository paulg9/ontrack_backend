## Request Routing Notes

### Overview

- Every route excluded from `Requesting` expects a `session` token supplied by the
  caller. The syncs resolve that token through `UserAccount._getUserByToken` and
  bind the resulting user id to subsequent concept actions.
- Admin-only endpoints additionally query `UserAccount._isAdmin` before invoking
  the underlying concept. When the check fails, the sync responds with
  `{ error: "forbidden" }`.
- The `ExerciseLibrary.setLLMClientForTesting` passthrough is explicitly
  disabled and always responds with an error so that the testing helper cannot
  be reached in production.

## Authenticated Actor Routes

| HTTP Route | Required Request Body | Concept Action(s) | Notes |
| --- | --- | --- | --- |
| `/api/UserAccount/logout` | `session` | `UserAccount.logout` | Invalidates the current session token. |
| `/api/UserAccount/setReminderTime` | `session`, `time` | `UserAccount.setReminderTime` | Applies to the authenticated user only. |
| `/api/UserAccount/createShareLink` | `session`, `ttlSeconds` | `UserAccount.createShareLink` | Returns a new `token` for the owner. |
| `/api/UserAccount/revokeShareLink` | `session`, `token` | `UserAccount.revokeShareLink` | Owners can revoke a previously issued share link. |
| `/api/CheckIn/submit` | `session`, `date`, `completedItems`, `strain_0_10`, `pain_0_10`, `comment?` | `CheckIn.submit` | Authenticated user becomes both `actor` and `owner`. |
| `/api/CheckIn/amend` | `session`, `checkin`, `completedItems?`, `strain_0_10?`, `pain_0_10?`, `comment?` | `CheckIn.amend` | Only permitted for the owner of the check-in. |
| `/api/RehabPlan/createPlan` | `session` | `RehabPlan.createPlan` | Creates an empty plan for the authenticated user. |
| `/api/RehabPlan/addPlanItem` | `session`, `plan`, `exercise`, `perWeek`, `sets`, `reps`, `notes` | `RehabPlan.addPlanItem` | Owners only. |
| `/api/RehabPlan/removePlanItem` | `session`, `plan`, `exercise` | `RehabPlan.removePlanItem` | Owners only. |
| `/api/RehabPlan/archivePlan` | `session`, `plan` | `RehabPlan.archivePlan` | Owners only. |
| `/api/Feedback/recordCompletion` | `session`, `date`, `completedAll` | `Feedback.recordCompletion` | Parses `date` into a `Date` before calling the concept. |
| `/api/Feedback/recompute` | `session`, `owner`, `today`, `newStreakCount`, `newCompletion7d` | `Feedback.recompute` | Admin only. |
| `/api/Feedback/recordMessage` | `session`, `owner`, `kind`, `text` | `Feedback.recordMessage` | Admin only. |
| `/api/Feedback/sendReminder` | `session`, `owner` | `Feedback.sendReminder` | Admin only. |
| `/api/ExerciseLibrary/addExercise` | `session`, `title`, `videoUrl?`, `cues` | `ExerciseLibrary.addExercise` | Admin only. |
| `/api/ExerciseLibrary/addExerciseDraft` | `session`, `title` | `ExerciseLibrary.addExerciseDraft` | Admin only. |
| `/api/ExerciseLibrary/updateExercise` | `session`, `exercise`, `title?`, `videoUrl?`, `cues?` | `ExerciseLibrary.updateExercise` | Admin only. |
| `/api/ExerciseLibrary/deprecateExercise` | `session`, `exercise` | `ExerciseLibrary.deprecateExercise` | Admin only. |
| `/api/ExerciseLibrary/proposeDetails` | `session`, `exercise` | `ExerciseLibrary.proposeDetails` | Admin only. |
| `/api/ExerciseLibrary/applyDetails` | `session`, `proposal` | `ExerciseLibrary.applyDetails` | Admin only. |
| `/api/ExerciseLibrary/discardDetails` | `session`, `proposal` | `ExerciseLibrary.discardDetails` | Admin only. |
| `/api/ExerciseLibrary/setLLMClientForTesting` | *(any)* | *(none)* | Responds with `{ error: "setLLMClientForTesting is not exposed via the public API" }`. |

## Authenticated Queries

| HTTP Route | Required Request Body | Concept Query | Notes |
| --- | --- | --- | --- |
| `/api/CheckIn/_getCheckInByOwnerAndDate` | `session`, `date` | `CheckIn._getCheckInByOwnerAndDate` | Returns the authenticated user’s check-in for the date. |
| `/api/CheckIn/_getCheckInsByOwner` | `session` | `CheckIn._getCheckInsByOwner` | Lists all check-ins for the user. |
| `/api/CheckIn/_getCheckInById` | `session`, `checkin` | `CheckIn._getCheckInById` | Returns the document only when it belongs to the user. |
| `/api/CheckIn/_hasCheckIn` | `session`, `date` | `CheckIn._hasCheckIn` | Owner only. |
| `/api/RehabPlan/_getActivePlanByOwner` | `session` | `RehabPlan._getActivePlanByOwner` | Returns the user’s active plan. |
| `/api/RehabPlan/_getPlanById` | `session`, `plan` | `RehabPlan._getPlanById` | Returns the plan only when it belongs to the user. |
| `/api/Feedback/_getSummaryMetrics` | `session` | `Feedback._getSummaryMetrics` | Owner view. |
| `/api/Feedback/_hasSentReminderToday` | `session`, `date` | `Feedback._hasSentReminderToday` | Owner view; validates the provided date. |
| `/api/Feedback/_listMessages` | `session` | `Feedback._listMessages` | Owner view. |
| `/api/UserAccount/_getUserByToken` | `session` | `UserAccount._getUserByToken` | Returns `[ { user } ]` for the current session. |
| `/api/UserAccount/_isSignedIn` | `session` | `UserAccount._isSignedIn` | Returns `[ { signedIn } ]`. |
| `/api/UserAccount/_isAdmin` | `session` | `UserAccount._isAdmin` | Returns `[ { isAdmin } ]` or `{ error: "unauthenticated" }`. |
| `/api/UserAccount/_listShareLinks` | `session` | `UserAccount._listShareLinks` | Lists share links owned by the user. |
| `/api/ExerciseLibrary/_getExerciseById` | `session`, `exercise` | `ExerciseLibrary._getExerciseById` | Signed-in users can view exercise metadata. |
| `/api/ExerciseLibrary/_listExercises` | `session`, `includeDeprecated?` | `ExerciseLibrary._listExercises` | Signed-in users can view the catalog. |
| `/api/ExerciseLibrary/_listProposals` | `session`, `status?` | `ExerciseLibrary._listProposals` | Admin only. |
| `/api/ExerciseLibrary/_getProposalsForExercise` | `session`, `exercise` | `ExerciseLibrary._getProposalsForExercise` | Admin only. |

## Share Link Queries

Routes that include a `shareToken` allow read-only access without a session. The syncs validate the token via `UserAccount._resolveShareLink`, ensure it is not expired, and confirm that the requested resource belongs to the share-link owner.

| HTTP Route | Required Request Body | Concept Query | Notes |
| --- | --- | --- | --- |
| `/api/RehabPlan/_getPlanById` | `shareToken`, `plan` | `RehabPlan._getPlanById` | Returns the plan when the share link owner matches the plan owner. |
| `/api/CheckIn/_getCheckInsByOwner` | `shareToken` | `CheckIn._getCheckInsByOwner` | Provides read-only access to the owner’s check-in history. |
| `/api/Feedback/_getSummaryMetrics` | `shareToken` | `Feedback._getSummaryMetrics` | Exposes summary metrics tied to the share-link owner. |

## Request/Response Semantics

- Every request sync binds `request` from `Requesting.request` and eventually
  emits `Requesting.respond` with either the success payload or an `{ error }`
  object.
- Authentication failures respond with `{ error: "unauthenticated" }`. Authenticated
  users without sufficient privileges receive `{ error: "forbidden" }`.
- Validation issues (for example, malformed dates) respond with
  `{ error: "invalid_date" }`.
- Invalid or expired share links respond with `{ error: "invalid_share_token" }`
  or `{ error: "share_link_expired" }`.
- Queries respond with `{ results: [...] }`, where `results` mirrors the array
  returned by the underlying concept query.

