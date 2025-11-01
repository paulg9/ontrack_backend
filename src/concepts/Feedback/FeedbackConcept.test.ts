import {
  assert,
  assertAlmostEquals,
  assertEquals,
  assertNotEquals,
} from "jsr:@std/assert";
import { freshID, testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import FeedbackConcept from "./FeedbackConcept.ts";

// Helpers to unwrap union results to their success shapes for type safety
type RecomputeOk = {
  summaryId: ID;
  newStreakCount: number;
  newCompletion7d: number;
};
function expectRecomputeOk(
  result: Awaited<ReturnType<FeedbackConcept["recompute"]>>,
): RecomputeOk {
  if ("error" in result) {
    throw new Error(`Expected success, got error: ${result.error}`);
  }
  return result;
}

type RecordMessageOk = { messageId: ID };
function expectRecordMessageOk(
  result: Awaited<ReturnType<FeedbackConcept["recordMessage"]>>,
): RecordMessageOk {
  if ("error" in result) {
    throw new Error(`Expected success, got error: ${result.error}`);
  }
  return result;
}

// Helper to unwrap error-shaped union results
function expectError(result: unknown): { error: string } {
  if (!result || typeof result !== "object" || !("error" in result)) {
    throw new Error("Expected error result, got success.");
  }
  return result as { error: string };
}

// --- Test Case 1: Operational Principle ---
// This test follows the principle: "As the athlete logs check-ins, the system computes streaks
// and completion rates; at a configured reminder time, if the day’s check-in is missing, send a reminder."
Deno.test("FeedbackConcept: Operational Principle Trace", async () => {
  console.log("\n--- TRACE: Testing the Operational Principle ---");
  const [db, client] = await testDb();
  const feedback = new FeedbackConcept(db);
  const ownerId = freshID() as ID;
  const today = new Date();

  // Step 1: User completes a check-in. A sync triggers recompute.
  console.log(
    `\nAction: recompute (owner: ${ownerId}, streak: 1, completion: 0.14)`,
  );
  const recompute1 = await feedback.recompute({
    owner: ownerId,
    today,
    newStreakCount: 1,
    newCompletion7d: 0.14,
  });
  console.log("Result:", recompute1);
  assert(!("error" in recompute1), "Recompute should succeed");
  const recompute1Ok = expectRecomputeOk(recompute1);
  assertEquals(recompute1Ok.newStreakCount, 1);
  assertEquals(recompute1Ok.newCompletion7d, 0.14);
  console.log("Effect confirmed: Summary for user created with initial stats.");

  // Step 2: User completes another check-in the next day.
  console.log(
    `\nAction: recompute (owner: ${ownerId}, streak: 2, completion: 0.28)`,
  );
  const recompute2 = await feedback.recompute({
    owner: ownerId,
    today,
    newStreakCount: 2,
    newCompletion7d: 0.28,
  });
  console.log("Result:", recompute2);
  assert(!("error" in recompute2), "Recompute should succeed");
  const recompute2Ok = expectRecomputeOk(recompute2);
  assertEquals(recompute2Ok.newStreakCount, 2);
  assertEquals(recompute2Ok.newCompletion7d, 0.28);
  console.log("Effect confirmed: Summary for user updated with new stats.");

  // Step 3: User misses a check-in. At reminder time, a sync checks if a reminder is needed.
  console.log(
    "\nQuery: _hasSentReminderToday to check if a reminder is needed.",
  );
  const check1 = await feedback._hasSentReminderToday({
    owner: ownerId,
    date: today,
  });
  console.log("Result:", check1);
  assert(!("error" in check1), "Query should succeed");
  assertEquals(check1, [{ sent: false }]);
  console.log("Requirement confirmed: No reminder has been sent today.");

  // Step 4: Since no reminder was sent, the sync triggers sendReminder.
  console.log(`\nAction: sendReminder (owner: ${ownerId})`);
  const reminderResult = await feedback.sendReminder({ owner: ownerId });
  console.log("Result:", reminderResult);
  assert(!("error" in reminderResult), "sendReminder should succeed");
  console.log("Effect confirmed: Reminder sent and state updated.");

  // Step 5: Verify the effects of sendReminder.
  console.log("\nQuery: _hasSentReminderToday to confirm a reminder was sent.");
  const check2 = await feedback._hasSentReminderToday({
    owner: ownerId,
    date: today,
  });
  console.log("Result:", check2);
  assert(!("error" in check2), "Query should succeed");
  assertEquals(check2, [{ sent: true }]);
  console.log("Effect confirmed: lastReminderDate is now set to today.");

  // Also verify that a reminder message was recorded.
  const messages = await db.collection("Feedback.messages").find({
    owner: ownerId,
    kind: "reminder",
  }).toArray();
  assert(messages.length > 0, "A reminder message should have been recorded.");
  console.log(
    "Effect confirmed: A message of kind 'reminder' was recorded in the database.",
  );
  console.log("--- PRINCIPLE FULFILLED ---");

  await client.close();
});

// --- Interesting Scenarios ---

Deno.test("FeedbackConcept: Action `recompute` handles creation and updates", async () => {
  console.log(
    "\n--- SCENARIO: Testing `recompute` action for upsert logic ---",
  );
  const [db, client] = await testDb();
  const feedback = new FeedbackConcept(db);
  const ownerId = freshID() as ID;

  // Case 1: First recompute for a user (create/upsert)
  console.log(`\nAction: recompute (for new user ${ownerId})`);
  const createResult = await feedback.recompute({
    owner: ownerId,
    today: new Date(),
    newStreakCount: 5,
    newCompletion7d: 0.7,
  });
  console.log("Result:", createResult);
  assert(!("error" in createResult), "recompute should create a new summary");
  const createOk = expectRecomputeOk(createResult);
  assertEquals(createOk.newStreakCount, 5);
  const summaryId = createOk.summaryId;

  const createdSummary = await db.collection("Feedback.summaries").findOne({
    _id: summaryId,
  });
  assertNotEquals(createdSummary, null, "Summary document should exist in DB");
  assertEquals(createdSummary?.streakCount, 5);
  console.log("Effect confirmed: New summary created with correct values.");

  // Case 2: Second recompute for the same user (update)
  console.log(
    `\nAction: recompute (for existing user ${ownerId} with different values)`,
  );
  const updateResult = await feedback.recompute({
    owner: ownerId,
    today: new Date(),
    newStreakCount: 6,
    newCompletion7d: 0.8,
  });
  console.log("Result:", updateResult);
  assert(
    !("error" in updateResult),
    "recompute should update the existing summary",
  );
  const updateOk = expectRecomputeOk(updateResult);
  assertEquals(updateOk.newStreakCount, 6);
  // The ID should be the same, as it was an update
  assertEquals(updateOk.summaryId, summaryId);

  const updatedSummary = await db.collection("Feedback.summaries").findOne({
    _id: summaryId,
  });
  assertEquals(updatedSummary?.streakCount, 6);
  console.log(
    "Effect confirmed: Existing summary updated, ID remains the same.",
  );

  await client.close();
});

Deno.test("FeedbackConcept: Action `sendReminder` fails if no summary exists", async () => {
  console.log("\n--- SCENARIO: Testing `sendReminder` requirement failure ---");
  const [db, client] = await testDb();
  const feedback = new FeedbackConcept(db);
  const ownerId = freshID() as ID;

  console.log(`\nAction: sendReminder (for user ${ownerId} without a summary)`);
  const result = await feedback.sendReminder({ owner: ownerId });
  console.log("Result:", result);

  assert("error" in result, "sendReminder should return an error");
  assertEquals(
    result.error,
    `Precondition failed: Summary for owner ${ownerId} does not exist.`,
  );
  console.log(
    "Requirement confirmed: Action correctly fails when the user summary does not exist.",
  );

  await client.close();
});

Deno.test("FeedbackConcept: Action `recordMessage` correctly creates messages", async () => {
  console.log("\n--- SCENARIO: Testing `recordMessage` action ---");
  const [db, client] = await testDb();
  const feedback = new FeedbackConcept(db);
  const ownerId = freshID() as ID;

  // Case 1: Record a motivation message
  const motivationText = "Great job on your new streak!";
  console.log(`\nAction: recordMessage (owner: ${ownerId}, kind: motivation)`);
  const result1 = await feedback.recordMessage({
    owner: ownerId,
    kind: "motivation",
    text: motivationText,
  });
  console.log("Result:", result1);

  assert(!("error" in result1), "recordMessage should succeed");
  const result1Ok = expectRecordMessageOk(result1);
  const message1 = await db.collection("Feedback.messages").findOne({
    _id: result1Ok.messageId,
  });
  assertNotEquals(message1, null);
  assertEquals(message1?.owner, ownerId);
  assertEquals(message1?.kind, "motivation");
  assertEquals(message1?.text, motivationText);
  console.log("Effect confirmed: Motivation message created successfully.");

  // Case 2: Record a summary message
  const summaryText = "Weekly summary: 80% complete.";
  console.log(`\nAction: recordMessage (owner: ${ownerId}, kind: summary)`);
  const result2 = await feedback.recordMessage({
    owner: ownerId,
    kind: "summary",
    text: summaryText,
  });
  console.log("Result:", result2);

  assert(!("error" in result2), "recordMessage should succeed");
  const result2Ok = expectRecordMessageOk(result2);
  const message2 = await db.collection("Feedback.messages").findOne({
    _id: result2Ok.messageId,
  });
  assertNotEquals(message2, null);
  assertEquals(message2?.kind, "summary");
  assertEquals(message2?.text, summaryText);
  console.log("Effect confirmed: Summary message created successfully.");

  // Query listMessages
  const listed = await feedback._listMessages({ owner: ownerId });
  assert(listed.length >= 2);
  console.log("Effect confirmed: _listMessages returns recorded messages.");

  await client.close();
});

Deno.test("FeedbackConcept: recordCompletion auto-updates streak and history", async () => {
  console.log(
    "\n--- SCENARIO: recordCompletion increments streak when days are consecutive ---",
  );
  const [db, client] = await testDb();
  const feedback = new FeedbackConcept(db);
  const ownerId = freshID() as ID;

  const day1 = new Date("2025-01-01T00:00:00Z");
  const res1 = await feedback.recordCompletion({
    owner: ownerId,
    date: day1,
    completedAll: true,
  });
  assert(!("error" in res1));
  const ok1 = res1 as {
    summaryId: ID;
    streakCount: number;
    completion7d: number;
  };
  assertEquals(ok1.streakCount, 1);

  const day2 = new Date("2025-01-02T00:00:00Z");
  const res2 = await feedback.recordCompletion({
    owner: ownerId,
    date: day2,
    completedAll: true,
  });
  assert(!("error" in res2));
  const ok2 = res2 as {
    summaryId: ID;
    streakCount: number;
    completion7d: number;
  };
  assertEquals(ok2.streakCount, 2);

  // Missed day resets streak
  const day3 = new Date("2025-01-03T00:00:00Z");
  const res3 = await feedback.recordCompletion({
    owner: ownerId,
    date: day3,
    completedAll: false,
  });
  assert(!("error" in res3));
  const ok3 = res3 as {
    summaryId: ID;
    streakCount: number;
    completion7d: number;
  };
  assertEquals(ok3.streakCount, 0);

  // Completing again starts streak at 1
  const day4 = new Date("2025-01-04T00:00:00Z");
  const res4 = await feedback.recordCompletion({
    owner: ownerId,
    date: day4,
    completedAll: true,
  });
  assert(!("error" in res4));
  const ok4 = res4 as {
    summaryId: ID;
    streakCount: number;
    completion7d: number;
  };
  assertEquals(ok4.streakCount, 1);
  assertAlmostEquals(ok4.completion7d, 3 / 7, 1e-12);

  const metrics = await feedback._getSummaryMetrics({ owner: ownerId });
  assert(!("error" in metrics));
  const [row] = metrics as Array<{ streakCount: number; completion7d: number }>;
  assertEquals(row.streakCount, 1);
  assertAlmostEquals(row.completion7d, ok4.completion7d, 1e-12);

  await client.close();
});

Deno.test("FeedbackConcept: Queries correctly handle missing summaries and existing state", async () => {
  console.log(
    "\n--- SCENARIO: Testing query actions `_getSummaryMetrics` and `_hasSentReminderToday` ---",
  );
  const [db, client] = await testDb();
  const feedback = new FeedbackConcept(db);
  const ownerId = freshID() as ID;
  const nonExistentOwnerId = freshID() as ID;
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // --- _getSummaryMetrics ---
  console.log("\nTesting `_getSummaryMetrics` query...");
  console.log(
    `Query: _getSummaryMetrics (for user ${nonExistentOwnerId} with no summary)`,
  );
  const metricsFailure = await feedback._getSummaryMetrics({
    owner: nonExistentOwnerId,
  });
  console.log("Result:", metricsFailure);
  assert(
    "error" in metricsFailure,
    "Query should fail for non-existent summary",
  );
  const metricsFailureErr = expectError(metricsFailure);
  assertEquals(
    metricsFailureErr.error,
    `Precondition failed: Summary for owner ${nonExistentOwnerId} does not exist.`,
  );
  console.log("Requirement confirmed: Query fails as expected.");

  console.log(`\nAction: recompute (to create a summary for user ${ownerId})`);
  await feedback.recompute({
    owner: ownerId,
    today,
    newStreakCount: 10,
    newCompletion7d: 1.0,
  });
  console.log("State setup complete.");

  console.log(`Query: _getSummaryMetrics (for user ${ownerId} with a summary)`);
  const metricsSuccess = await feedback._getSummaryMetrics({ owner: ownerId });
  console.log("Result:", metricsSuccess);
  assert(
    !("error" in metricsSuccess),
    "Query should succeed for existing summary",
  );
  assertEquals(metricsSuccess, [{ streakCount: 10, completion7d: 1.0 }]);
  console.log("Effect confirmed: Query returns correct metrics.");

  // --- _hasSentReminderToday ---
  console.log("\nTesting `_hasSentReminderToday` query...");
  console.log(
    `Query: _hasSentReminderToday (for user ${nonExistentOwnerId} with no summary)`,
  );
  const reminderCheckFailure = await feedback._hasSentReminderToday({
    owner: nonExistentOwnerId,
    date: today,
  });
  console.log("Result:", reminderCheckFailure);
  assert(
    "error" in reminderCheckFailure,
    "Query should fail for non-existent summary",
  );
  const reminderCheckFailureErr = expectError(reminderCheckFailure);
  assertEquals(
    reminderCheckFailureErr.error,
    `Precondition failed: Summary for owner ${nonExistentOwnerId} does not exist.`,
  );
  console.log("Requirement confirmed: Query fails as expected.");

  console.log(
    `\nQuery: _hasSentReminderToday (for user ${ownerId}, before reminder)`,
  );
  const reminderCheckBefore = await feedback._hasSentReminderToday({
    owner: ownerId,
    date: today,
  });
  console.log("Result:", reminderCheckBefore);
  assert(!("error" in reminderCheckBefore));
  assertEquals(reminderCheckBefore, [{ sent: false }]);
  console.log(
    "Effect confirmed: Correctly reports 'false' when no reminder sent.",
  );

  console.log(`\nAction: sendReminder (for user ${ownerId})`);
  await feedback.sendReminder({ owner: ownerId });

  console.log(
    `Query: _hasSentReminderToday (for user ${ownerId}, after reminder)`,
  );
  const reminderCheckAfter = await feedback._hasSentReminderToday({
    owner: ownerId,
    date: today,
  });
  console.log("Result:", reminderCheckAfter);
  assert(!("error" in reminderCheckAfter));
  assertEquals(reminderCheckAfter, [{ sent: true }]);
  console.log(
    "Effect confirmed: Correctly reports 'true' after reminder sent.",
  );

  console.log(
    `Query: _hasSentReminderToday (checking yesterday for user ${ownerId})`,
  );
  const reminderCheckYesterday = await feedback._hasSentReminderToday({
    owner: ownerId,
    date: yesterday,
  });
  console.log("Result:", reminderCheckYesterday);
  assert(!("error" in reminderCheckYesterday));
  assertEquals(reminderCheckYesterday, [{ sent: false }]);
  console.log(
    "Effect confirmed: Correctly reports 'false' when checking against a different date.",
  );

  await client.close();
});
