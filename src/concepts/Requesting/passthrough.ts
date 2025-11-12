/**
 * The Requesting concept exposes passthrough routes by default,
 * which allow POSTs to the route:
 *
 * /{REQUESTING_BASE_URL}/{Concept name}/{action or query}
 *
 * to passthrough directly to the concept action or query.
 * This is a convenient and natural way to expose concepts to
 * the world, but should only be done intentionally for public
 * actions and queries.
 *
 * This file allows you to explicitly set inclusions and exclusions
 * for passthrough routes:
 * - inclusions: those that you can justify their inclusion
 * - exclusions: those to exclude, using Requesting routes instead
 */

/**
 * INCLUSIONS
 *
 * Each inclusion must include a justification for why you think
 * the passthrough is appropriate (e.g. public query).
 *
 * inclusions = {"route": "justification"}
 */

export const inclusions: Record<string, string> = {
  "/api/UserAccount/register": "registration must remain publicly reachable",
  "/api/UserAccount/login": "login bootstraps sessions without prior auth",
  "/api/UserAccount/_resolveShareLink":
    "share links should be resolvable without authentication",
  "/api/LikertSurvey/_getSurveyQuestions":
    "survey questions are intentionally public",
  "/api/LikertSurvey/_getSurveyResponses":
    "survey aggregate responses are public",
  "/api/LikertSurvey/_getRespondentAnswers":
    "respondent review screen is public",
  "/api/LikertSurvey/submitResponse":
    "anonymous respondents can submit answers",
  "/api/LikertSurvey/updateResponse":
    "respondents may correct their own answers without auth",
};

/**
 * EXCLUSIONS
 *
 * Excluded routes fall back to the Requesting concept, and will
 * instead trigger the normal Requesting.request action. As this
 * is the intended behavior, no justification is necessary.
 *
 * exclusions = ["route"]
 */

export const exclusions: Array<string> = [
  "/api/CheckIn/submit",
  "/api/CheckIn/amend",
  "/api/CheckIn/_getCheckInByOwnerAndDate",
  "/api/CheckIn/_getCheckInsByOwner",
  "/api/CheckIn/_getCheckInById",
  "/api/CheckIn/_hasCheckIn",
  "/api/ExerciseLibrary/setLLMClientForTesting",
  "/api/ExerciseLibrary/addExercise",
  "/api/ExerciseLibrary/addExerciseDraft",
  "/api/ExerciseLibrary/updateExercise",
  "/api/ExerciseLibrary/deprecateExercise",
  "/api/ExerciseLibrary/proposeDetails",
  "/api/ExerciseLibrary/applyDetails",
  "/api/ExerciseLibrary/discardDetails",
  "/api/ExerciseLibrary/_getExerciseById",
  "/api/ExerciseLibrary/_listExercises",
  "/api/ExerciseLibrary/_listProposals",
  "/api/ExerciseLibrary/_getProposalsForExercise",
  "/api/Feedback/recompute",
  "/api/Feedback/recordMessage",
  "/api/Feedback/recordCompletion",
  "/api/Feedback/sendReminder",
  "/api/Feedback/_getSummaryMetrics",
  "/api/Feedback/_hasSentReminderToday",
  "/api/Feedback/_listMessages",
  "/api/LikertSurvey/createSurvey",
  "/api/LikertSurvey/addQuestion",
  "/api/RehabPlan/createPlan",
  "/api/RehabPlan/addPlanItem",
  "/api/RehabPlan/removePlanItem",
  "/api/RehabPlan/archivePlan",
  "/api/RehabPlan/_getActivePlanByOwner",
  "/api/RehabPlan/_getPlanById",
  "/api/UserAccount/logout",
  "/api/UserAccount/setReminderTime",
  "/api/UserAccount/createShareLink",
  "/api/UserAccount/revokeShareLink",
  "/api/UserAccount/_getUserByToken",
  "/api/UserAccount/_isSignedIn",
  "/api/UserAccount/_isAdmin",
  "/api/UserAccount/_listShareLinks",
];
