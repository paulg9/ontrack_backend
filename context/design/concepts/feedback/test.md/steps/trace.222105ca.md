---
timestamp: 'Thu Oct 23 2025 23:14:30 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_231430.3d4e9644.md]]'
content_id: 222105ca87224549aaba9291049c1ec9fd205d4b5cb679231e54f9bf92597947
---

# trace:

The operational principle of the `Feedback` concept is: "As the athlete logs check-ins, the system computes streaks and completion rates; at a configured reminder time, if the day’s check-in is missing, send a reminder."

The following trace demonstrates this principle using the concept's actions, simulating the behavior of external syncs that would trigger them.

1. **Athlete logs a check-in.** A `CheckIn` event triggers the `computeFeedback` sync, which calls `Feedback.recompute`.
   * **Action:** `recompute({ owner: "user123", today: ..., newStreakCount: 1, newCompletion7d: 0.14 })`
   * **Result:** A new `Summary` document is created for `user123`, storing their initial streak and completion rate. The state is now correctly tracking their progress.

2. **Athlete logs another check-in.** The process repeats.
   * **Action:** `recompute({ owner: "user123", today: ..., newStreakCount: 2, newCompletion7d: 0.28 })`
   * **Result:** The existing `Summary` for `user123` is updated, incrementing their streak and adjusting the completion rate. The system continues to reflect the user's activity.

3. **Athlete misses a check-in.** At a pre-configured time (e.g., 8 PM), the `dailyReminder` sync activates. It first checks if a reminder has already been sent to avoid spamming the user.
   * **Query:** `_hasSentReminderToday({ owner: "user123", date: ... })`
   * **Result:** `[{ sent: false }]`. The query confirms that `lastReminderDate` is not set to today, so a reminder is necessary.

4. **System sends a reminder.** Based on the previous query result and the absence of a check-in, the sync proceeds to call `sendReminder`.
   * **Action:** `sendReminder({ owner: "user123" })`
   * **Result:** The action succeeds. It performs three effects:
     1. (Simulates) An out-of-band notification is sent to the user.
     2. A `Message` of kind `reminder` is recorded for `user123` for auditing.
     3. The `lastReminderDate` in the user's `Summary` is updated to the current date.

5. **Principle Fulfilled.** The system has successfully computed feedback from check-ins (`recompute`) and sent a timely reminder (`sendReminder`) upon a missed check-in, fulfilling the core purpose of the concept. If the `dailyReminder` sync were to run again on the same day, the `_hasSentReminderToday` query would now return `true`, preventing a duplicate reminder from being sent.
