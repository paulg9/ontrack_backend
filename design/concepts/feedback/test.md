[@testing-concepts](../../background/testing-concepts.md)

[@Feedback-implementation](../../../src/concepts/Feedback/FeedbackConcept.ts)

[@Feedback-spec](../../../src/concepts/Feedback/spec.md)

<testing concepts blurb from assignment instructions>
Testing concepts. Your tests should cover the basic behavior of the concept but should also include some more interesting cases. Your tests should use the Deno testing framework and should be programmatic (that is, determining in the code whether they succeeded or failed, and not requiring a human to interpret console messages). They should also print helpful messages to the console with action inputs and outputs so that a human reader can make sense of the test execution when it runs in the console. Some more details about the test cases you should include:

Operational principle. A sequence of action executions that corresponds to the operational principle, representing the common expected usage of the concept. These sequence is not required to use all the actions; operational principles often do not include a deletion action, for example.
Interesting scenarios. Sequences of action executions that correspond to less common cases: probing interesting corners of the functionality, undoing actions with deletions and cancellations, repeating actions with the same arguments, etc. In some of these scenarios actions may be expected to throw errors.
Number required. For each concept, you should have one test sequence for the operational principle, and 3-5 additional interesting scenarios. Every action should be executed successfully in at least one of the scenarios.
No state setup. Your test cases should not require any setting up of the concept state except by calling concept actions. When you are testing one action at a time, this means that you will want to order your actions carefully (for example, by the operational principle) to avoid having to set up state.
Saving test execution output. Save the test execution output by copy-pasting from the console to a markdown file.
</testing concepts blurb from assignment instructions>
# prompt: write a test suite for my Feedback concept, adhereing to the given guidelines.
# response:

Here is the test suite for the `FeedbackConcept`, adhering to the provided guidelines and structure.

# file: src/concepts/Feedback/FeedbackConcept.test.ts

```typescript
import { assertEquals, assert, assertNotEquals } from "jsr:@std/assert";
import { testDb, freshID } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import FeedbackConcept from "./FeedbackConcept.ts";

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
  console.log(`\nAction: recompute (owner: ${ownerId}, streak: 1, completion: 0.14)`);
  const recompute1 = await feedback.recompute({ owner: ownerId, today, newStreakCount: 1, newCompletion7d: 0.14 });
  console.log("Result:", recompute1);
  assert(!("error" in recompute1), "Recompute should succeed");
  assertEquals(recompute1.newStreakCount, 1);
  assertEquals(recompute1.newCompletion7d, 0.14);
  console.log("Effect confirmed: Summary for user created with initial stats.");

  // Step 2: User completes another check-in the next day.
  console.log(`\nAction: recompute (owner: ${ownerId}, streak: 2, completion: 0.28)`);
  const recompute2 = await feedback.recompute({ owner: ownerId, today, newStreakCount: 2, newCompletion7d: 0.28 });
  console.log("Result:", recompute2);
  assert(!("error" in recompute2), "Recompute should succeed");
  assertEquals(recompute2.newStreakCount, 2);
  assertEquals(recompute2.newCompletion7d, 0.28);
  console.log("Effect confirmed: Summary for user updated with new stats.");

  // Step 3: User misses a check-in. At reminder time, a sync checks if a reminder is needed.
  console.log("\nQuery: _hasSentReminderToday to check if a reminder is needed.");
  const check1 = await feedback._hasSentReminderToday({ owner: ownerId, date: today });
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
  const check2 = await feedback._hasSentReminderToday({ owner: ownerId, date: today });
  console.log("Result:", check2);
  assert(!("error" in check2), "Query should succeed");
  assertEquals(check2, [{ sent: true }]);
  console.log("Effect confirmed: lastReminderDate is now set to today.");

  // Also verify that a reminder message was recorded.
  const messages = await db.collection("Feedback.messages").find({ owner: ownerId, kind: "reminder" }).toArray();
  assert(messages.length > 0, "A reminder message should have been recorded.");
  console.log("Effect confirmed: A message of kind 'reminder' was recorded in the database.");
  console.log("--- PRINCIPLE FULFILLED ---");

  await client.close();
});

// --- Interesting Scenarios ---

Deno.test("FeedbackConcept: Action `recompute` handles creation and updates", async () => {
  console.log("\n--- SCENARIO: Testing `recompute` action for upsert logic ---");
  const [db, client] = await testDb();
  const feedback = new FeedbackConcept(db);
  const ownerId = freshID() as ID;

  // Case 1: First recompute for a user (create/upsert)
  console.log(`\nAction: recompute (for new user ${ownerId})`);
  const createResult = await feedback.recompute({ owner: ownerId, today: new Date(), newStreakCount: 5, newCompletion7d: 0.7 });
  console.log("Result:", createResult);
  assert(!("error" in createResult), "recompute should create a new summary");
  assertEquals(createResult.newStreakCount, 5);
  const summaryId = createResult.summaryId;

  const createdSummary = await db.collection("Feedback.summaries").findOne({ _id: summaryId });
  assertNotEquals(createdSummary, null, "Summary document should exist in DB");
  assertEquals(createdSummary?.streakCount, 5);
  console.log("Effect confirmed: New summary created with correct values.");

  // Case 2: Second recompute for the same user (update)
  console.log(`\nAction: recompute (for existing user ${ownerId} with different values)`);
  const updateResult = await feedback.recompute({ owner: ownerId, today: new Date(), newStreakCount: 6, newCompletion7d: 0.8 });
  console.log("Result:", updateResult);
  assert(!("error" in updateResult), "recompute should update the existing summary");
  assertEquals(updateResult.newStreakCount, 6);
  // The ID should be the same, as it was an update
  assertEquals(updateResult.summaryId, summaryId);

  const updatedSummary = await db.collection("Feedback.summaries").findOne({ _id: summaryId });
  assertEquals(updatedSummary?.streakCount, 6);
  console.log("Effect confirmed: Existing summary updated, ID remains the same.");

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
  assertEquals(result.error, `Precondition failed: Summary for owner ${ownerId} does not exist.`);
  console.log("Requirement confirmed: Action correctly fails when the user summary does not exist.");

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
  const result1 = await feedback.recordMessage({ owner: ownerId, kind: "motivation", text: motivationText });
  console.log("Result:", result1);

  assert(!("error" in result1), "recordMessage should succeed");
  const message1 = await db.collection("Feedback.messages").findOne({ _id: result1.messageId });
  assertNotEquals(message1, null);
  assertEquals(message1?.owner, ownerId);
  assertEquals(message1?.kind, "motivation");
  assertEquals(message1?.text, motivationText);
  console.log("Effect confirmed: Motivation message created successfully.");

  // Case 2: Record a summary message
  const summaryText = "Weekly summary: 80% complete.";
  console.log(`\nAction: recordMessage (owner: ${ownerId}, kind: summary)`);
  const result2 = await feedback.recordMessage({ owner: ownerId, kind: "summary", text: summaryText });
  console.log("Result:", result2);

  assert(!("error" in result2), "recordMessage should succeed");
  const message2 = await db.collection("Feedback.messages").findOne({ _id: result2.messageId });
  assertNotEquals(message2, null);
  assertEquals(message2?.kind, "summary");
  assertEquals(message2?.text, summaryText);
  console.log("Effect confirmed: Summary message created successfully.");

  await client.close();
});

Deno.test("FeedbackConcept: Queries correctly handle missing summaries and existing state", async () => {
  console.log("\n--- SCENARIO: Testing query actions `_getSummaryMetrics` and `_hasSentReminderToday` ---");
  const [db, client] = await testDb();
  const feedback = new FeedbackConcept(db);
  const ownerId = freshID() as ID;
  const nonExistentOwnerId = freshID() as ID;
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // --- _getSummaryMetrics ---
  console.log("\nTesting `_getSummaryMetrics` query...");
  console.log(`Query: _getSummaryMetrics (for user ${nonExistentOwnerId} with no summary)`);
  const metricsFailure = await feedback._getSummaryMetrics({ owner: nonExistentOwnerId });
  console.log("Result:", metricsFailure);
  assert("error" in metricsFailure, "Query should fail for non-existent summary");
  assertEquals(metricsFailure.error, `Precondition failed: Summary for owner ${nonExistentOwnerId} does not exist.`);
  console.log("Requirement confirmed: Query fails as expected.");

  console.log(`\nAction: recompute (to create a summary for user ${ownerId})`);
  await feedback.recompute({ owner: ownerId, today, newStreakCount: 10, newCompletion7d: 1.0 });
  console.log("State setup complete.");

  console.log(`Query: _getSummaryMetrics (for user ${ownerId} with a summary)`);
  const metricsSuccess = await feedback._getSummaryMetrics({ owner: ownerId });
  console.log("Result:", metricsSuccess);
  assert(!("error" in metricsSuccess), "Query should succeed for existing summary");
  assertEquals(metricsSuccess, [{ streakCount: 10, completion7d: 1.0 }]);
  console.log("Effect confirmed: Query returns correct metrics.");

  // --- _hasSentReminderToday ---
  console.log("\nTesting `_hasSentReminderToday` query...");
  console.log(`Query: _hasSentReminderToday (for user ${nonExistentOwnerId} with no summary)`);
  const reminderCheckFailure = await feedback._hasSentReminderToday({ owner: nonExistentOwnerId, date: today });
  console.log("Result:", reminderCheckFailure);
  assert("error" in reminderCheckFailure, "Query should fail for non-existent summary");
  assertEquals(reminderCheckFailure.error, `Precondition failed: Summary for owner ${nonExistentOwnerId} does not exist.`);
  console.log("Requirement confirmed: Query fails as expected.");

  console.log(`\nQuery: _hasSentReminderToday (for user ${ownerId}, before reminder)`);
  const reminderCheckBefore = await feedback._hasSentReminderToday({ owner: ownerId, date: today });
  console.log("Result:", reminderCheckBefore);
  assert(!("error" in reminderCheckBefore));
  assertEquals(reminderCheckBefore, [{ sent: false }]);
  console.log("Effect confirmed: Correctly reports 'false' when no reminder sent.");

  console.log(`\nAction: sendReminder (for user ${ownerId})`);
  await feedback.sendReminder({ owner: ownerId });

  console.log(`Query: _hasSentReminderToday (for user ${ownerId}, after reminder)`);
  const reminderCheckAfter = await feedback._hasSentReminderToday({ owner: ownerId, date: today });
  console.log("Result:", reminderCheckAfter);
  assert(!("error" in reminderCheckAfter));
  assertEquals(reminderCheckAfter, [{ sent: true }]);
  console.log("Effect confirmed: Correctly reports 'true' after reminder sent.");

  console.log(`Query: _hasSentReminderToday (checking yesterday for user ${ownerId})`);
  const reminderCheckYesterday = await feedback._hasSentReminderToday({ owner: ownerId, date: yesterday });
  console.log("Result:", reminderCheckYesterday);
  assert(!("error" in reminderCheckYesterday));
  assertEquals(reminderCheckYesterday, [{ sent: false }]);
  console.log("Effect confirmed: Correctly reports 'false' when checking against a different date.");

  await client.close();
});
```

# trace:

The operational principle of the `Feedback` concept is: "As the athlete logs check-ins, the system computes streaks and completion rates; at a configured reminder time, if the day’s check-in is missing, send a reminder."

The following trace demonstrates this principle using the concept's actions, simulating the behavior of external syncs that would trigger them.

1.  **Athlete logs a check-in.** A `CheckIn` event triggers the `computeFeedback` sync, which calls `Feedback.recompute`.
    *   **Action:** `recompute({ owner: "user123", today: ..., newStreakCount: 1, newCompletion7d: 0.14 })`
    *   **Result:** A new `Summary` document is created for `user123`, storing their initial streak and completion rate. The state is now correctly tracking their progress.

2.  **Athlete logs another check-in.** The process repeats.
    *   **Action:** `recompute({ owner: "user123", today: ..., newStreakCount: 2, newCompletion7d: 0.28 })`
    *   **Result:** The existing `Summary` for `user123` is updated, incrementing their streak and adjusting the completion rate. The system continues to reflect the user's activity.

3.  **Athlete misses a check-in.** At a pre-configured time (e.g., 8 PM), the `dailyReminder` sync activates. It first checks if a reminder has already been sent to avoid spamming the user.
    *   **Query:** `_hasSentReminderToday({ owner: "user123", date: ... })`
    *   **Result:** `[{ sent: false }]`. The query confirms that `lastReminderDate` is not set to today, so a reminder is necessary.

4.  **System sends a reminder.** Based on the previous query result and the absence of a check-in, the sync proceeds to call `sendReminder`.
    *   **Action:** `sendReminder({ owner: "user123" })`
    *   **Result:** The action succeeds. It performs three effects:
        1.  (Simulates) An out-of-band notification is sent to the user.
        2.  A `Message` of kind `reminder` is recorded for `user123` for auditing.
        3.  The `lastReminderDate` in the user's `Summary` is updated to the current date.

5.  **Principle Fulfilled.** The system has successfully computed feedback from check-ins (`recompute`) and sent a timely reminder (`sendReminder`) upon a missed check-in, fulfilling the core purpose of the concept. If the `dailyReminder` sync were to run again on the same day, the `_hasSentReminderToday` query would now return `true`, preventing a duplicate reminder from being sent.


# prompt: does multiple Deno tests fit the instructions? in other concepts, I only have 1 deno test that covers all cases.
# response:

Yes, using multiple `Deno.test` blocks absolutely fits the instructions, and in fact, it's generally a *better* approach that adheres more closely to the spirit of the guidelines than putting everything in a single `Deno.test` block.

Let's break down why, based on the provided instructions:

1.  **"Use the Deno.test framework, splitting by appropriate test steps and describing each behavior."**
    *   This is the most direct justification. Each `Deno.test` block *is* an "appropriate test step" designed to describe and verify a specific "behavior."
    *   If you put *all* cases (principle, 3-5 scenarios) into one `Deno.test`, you're not truly "splitting by appropriate test steps" within the framework's structure. You'd be splitting logically *inside* one large test, but the Deno test runner would still see it as a single unit, making individual failures harder to isolate.

2.  **"Each test should output what it is doing and the trace of any actions..."**
    *   When you have separate `Deno.test` blocks, the output for each scenario is naturally grouped and labeled by Deno's test runner. This makes it much easier to read the "trace of any actions" for a specific scenario without it getting intermingled with unrelated actions from other scenarios within the same large test block.

3.  **"Principle tests and tests involving multiple actions should explain how it aligns with expectations."**
    *   A dedicated `Deno.test` block titled "FeedbackConcept: Operational Principle Trace" (as in the example) allows for a clear, focused explanation of how *that specific sequence* aligns with the principle, without distractions from other unrelated tests.

4.  **"For action tests, the output should explain how requirements are met and how effects are confirmed."**
    *   Again, separating tests by scenario (e.g., "recompute handles creation and updates," "sendReminder fails if no summary exists") allows you to precisely explain the requirements and effects *for that specific test's focus*.

5.  **"Number required. For each concept, you should have one test sequence for the operational principle, and 3-5 additional interesting scenarios. Every action should be executed successfully in at least one of the scenarios."**
    *   This requirement specifies *what* to test, not *how* to structure your Deno test file. Having one `Deno.test` for the principle and separate `Deno.test` blocks for each of the 3-5 interesting scenarios (or logical groupings of them) is a perfectly valid and often preferred way to fulfill this.

**In summary:**

While a single `Deno.test` could technically contain all your assertions, using multiple `Deno.test` blocks, one for the operational principle and one or more for "interesting scenarios," aligns *much better* with the "legible testing" goals and the instruction to "split by appropriate test steps." It makes your test suite clearer, more modular, easier to debug, and its output more understandable.

Your provided test suite, with its distinct `Deno.test` blocks for the principle and various scenarios, is an excellent implementation of these guidelines.