running 5 tests from ./src/concepts/Feedback/FeedbackConcept.test.ts
FeedbackConcept: Operational Principle Trace ...
------- output -------

--- TRACE: Testing the Operational Principle ---

Action: recompute (owner: 019a1440-aae7-769c-ac13-043583255db9, streak: 1, completion: 0.14)
Recomputed feedback for owner 019a1440-aae7-769c-ac13-043583255db9: Summary ID 019a1440-aae7-7d66-b4d9-8a8547daf62d, Streak 1, Completion 0.14
Result: {
  summaryId: "019a1440-aae7-7d66-b4d9-8a8547daf62d",
  newStreakCount: 1,
  newCompletion7d: 0.14
}
Effect confirmed: Summary for user created with initial stats.

Action: recompute (owner: 019a1440-aae7-769c-ac13-043583255db9, streak: 2, completion: 0.28)
Recomputed feedback for owner 019a1440-aae7-769c-ac13-043583255db9: Summary ID 019a1440-aae7-7d66-b4d9-8a8547daf62d, Streak 2, Completion 0.28
Result: {
  summaryId: "019a1440-aae7-7d66-b4d9-8a8547daf62d",
  newStreakCount: 2,
  newCompletion7d: 0.28
}
Effect confirmed: Summary for user updated with new stats.

Query: _hasSentReminderToday to check if a reminder is needed.
Checked if reminder sent today for owner 019a1440-aae7-769c-ac13-043583255db9 (date: Thu Oct 23 2025): false
Result: [ { sent: false } ]
Requirement confirmed: No reminder has been sent today.

Action: sendReminder (owner: 019a1440-aae7-769c-ac13-043583255db9)
[SYSTEM ACTION] Delivering out-of-band reminder to owner 019a1440-aae7-769c-ac13-043583255db9 at 2025-10-24T03:26:13.825Z
Recorded message for owner 019a1440-aae7-769c-ac13-043583255db9: Message ID 019a1440-ab41-750b-b74b-529d596a4056, Kind: reminder, Text: "Don't forget to log your check-in today!"
Updated lastReminderDate for owner 019a1440-aae7-769c-ac13-043583255db9 to Thu Oct 23 2025.
Result: {}
Effect confirmed: Reminder sent and state updated.

Query: _hasSentReminderToday to confirm a reminder was sent.
Checked if reminder sent today for owner 019a1440-aae7-769c-ac13-043583255db9 (date: Thu Oct 23 2025): true
Result: [ { sent: true } ]
Effect confirmed: lastReminderDate is now set to today.
Effect confirmed: A message of kind 'reminder' was recorded in the database.
--- PRINCIPLE FULFILLED ---
----- output end -----
FeedbackConcept: Operational Principle Trace ... ok (746ms)
FeedbackConcept: Action `recompute` handles creation and updates ...
------- output -------

--- SCENARIO: Testing `recompute` action for upsert logic ---

Action: recompute (for new user 019a1440-adac-780a-a3d0-83cf7fa6aa4c)
Recomputed feedback for owner 019a1440-adac-780a-a3d0-83cf7fa6aa4c: Summary ID 019a1440-adac-74e1-90fb-f4c2c4e61c87, Streak 5, Completion 0.7
Result: {
  summaryId: "019a1440-adac-74e1-90fb-f4c2c4e61c87",
  newStreakCount: 5,
  newCompletion7d: 0.7
}
Effect confirmed: New summary created with correct values.

Action: recompute (for existing user 019a1440-adac-780a-a3d0-83cf7fa6aa4c with different values)
Recomputed feedback for owner 019a1440-adac-780a-a3d0-83cf7fa6aa4c: Summary ID 019a1440-adac-74e1-90fb-f4c2c4e61c87, Streak 6, Completion 0.8
Result: {
  summaryId: "019a1440-adac-74e1-90fb-f4c2c4e61c87",
  newStreakCount: 6,
  newCompletion7d: 0.8
}
Effect confirmed: Existing summary updated, ID remains the same.
----- output end -----
FeedbackConcept: Action `recompute` handles creation and updates ... ok (610ms)
FeedbackConcept: Action `sendReminder` fails if no summary exists ...
------- output -------

--- SCENARIO: Testing `sendReminder` requirement failure ---

Action: sendReminder (for user 019a1440-afad-795d-b9f1-0e71970fa93d without a summary)
Result: {
  error: "Precondition failed: Summary for owner 019a1440-afad-795d-b9f1-0e71970fa93d does not exist."
}
Requirement confirmed: Action correctly fails when the user summary does not exist.
----- output end -----
FeedbackConcept: Action `sendReminder` fails if no summary exists ... ok (456ms)
FeedbackConcept: Action `recordMessage` correctly creates messages ...
------- output -------

--- SCENARIO: Testing `recordMessage` action ---

Action: recordMessage (owner: 019a1440-b1bf-7d57-ba79-0b00d3b90732, kind: motivation)
Recorded message for owner 019a1440-b1bf-7d57-ba79-0b00d3b90732: Message ID 019a1440-b1bf-78c4-b2fc-bede1ca32ccf, Kind: motivation, Text: "Great job on your new streak!"
Result: { messageId: "019a1440-b1bf-78c4-b2fc-bede1ca32ccf" }
Effect confirmed: Motivation message created successfully.

Action: recordMessage (owner: 019a1440-b1bf-7d57-ba79-0b00d3b90732, kind: summary)
Recorded message for owner 019a1440-b1bf-7d57-ba79-0b00d3b90732: Message ID 019a1440-b1f4-7eb0-9094-734deacf58c7, Kind: summary, Text: "Weekly summary: 80% complete."
Result: { messageId: "019a1440-b1f4-7eb0-9094-734deacf58c7" }
Effect confirmed: Summary message created successfully.
----- output end -----
FeedbackConcept: Action `recordMessage` correctly creates messages ... ok (593ms)
FeedbackConcept: Queries correctly handle missing summaries and existing state ...
------- output -------

--- SCENARIO: Testing query actions `_getSummaryMetrics` and `_hasSentReminderToday` ---

Testing `_getSummaryMetrics` query...
Query: _getSummaryMetrics (for user 019a1440-b41a-75ac-89c9-d4e40cd4cc56 with no summary)
Result: {
  error: "Precondition failed: Summary for owner 019a1440-b41a-75ac-89c9-d4e40cd4cc56 does not exist."
}
Requirement confirmed: Query fails as expected.

Action: recompute (to create a summary for user 019a1440-b41a-71cf-9a8c-903d89cc5a0e)
Recomputed feedback for owner 019a1440-b41a-71cf-9a8c-903d89cc5a0e: Summary ID 019a1440-b42b-7aee-ba57-3a6f79081ec4, Streak 10, Completion 1
State setup complete.
Query: _getSummaryMetrics (for user 019a1440-b41a-71cf-9a8c-903d89cc5a0e with a summary)
Retrieved summary metrics for owner 019a1440-b41a-71cf-9a8c-903d89cc5a0e: Streak 10, Completion 1
Result: [ { streakCount: 10, completion7d: 1 } ]
Effect confirmed: Query returns correct metrics.

Testing `_hasSentReminderToday` query...
Query: _hasSentReminderToday (for user 019a1440-b41a-75ac-89c9-d4e40cd4cc56 with no summary)
Result: {
  error: "Precondition failed: Summary for owner 019a1440-b41a-75ac-89c9-d4e40cd4cc56 does not exist."
}
Requirement confirmed: Query fails as expected.

Query: _hasSentReminderToday (for user 019a1440-b41a-71cf-9a8c-903d89cc5a0e, before reminder)
Checked if reminder sent today for owner 019a1440-b41a-71cf-9a8c-903d89cc5a0e (date: Thu Oct 23 2025): false
Result: [ { sent: false } ]
Effect confirmed: Correctly reports 'false' when no reminder sent.

Action: sendReminder (for user 019a1440-b41a-71cf-9a8c-903d89cc5a0e)
[SYSTEM ACTION] Delivering out-of-band reminder to owner 019a1440-b41a-71cf-9a8c-903d89cc5a0e at 2025-10-24T03:26:16.213Z
Recorded message for owner 019a1440-b41a-71cf-9a8c-903d89cc5a0e: Message ID 019a1440-b495-77ac-9c14-a472913be0c8, Kind: reminder, Text: "Don't forget to log your check-in today!"
Updated lastReminderDate for owner 019a1440-b41a-71cf-9a8c-903d89cc5a0e to Thu Oct 23 2025.
Query: _hasSentReminderToday (for user 019a1440-b41a-71cf-9a8c-903d89cc5a0e, after reminder)
Checked if reminder sent today for owner 019a1440-b41a-71cf-9a8c-903d89cc5a0e (date: Thu Oct 23 2025): true
Result: [ { sent: true } ]
Effect confirmed: Correctly reports 'true' after reminder sent.
Query: _hasSentReminderToday (checking yesterday for user 019a1440-b41a-71cf-9a8c-903d89cc5a0e)
Checked if reminder sent today for owner 019a1440-b41a-71cf-9a8c-903d89cc5a0e (date: Wed Oct 22 2025): false
Result: [ { sent: false } ]
Effect confirmed: Correctly reports 'false' when checking against a different date.
----- output end -----
FeedbackConcept: Queries correctly handle missing summaries and existing state ... ok (727ms)

ok | 5 passed | 0 failed (3s)

