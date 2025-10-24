---
timestamp: 'Thu Oct 23 2025 22:58:12 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_225812.c59462ff.md]]'
content_id: 222e214eb83c7e399f00007aa628baa631d1557a411785b788363e30d98b2206
---

# response:

Okay, let's refactor the `Feedback` concept based on the review and guidelines. The primary focus will be on ensuring independence, avoiding composite objects in action arguments/results, and correctly structuring syncs to mediate dependencies.

Here is the revised `Feedback` concept specification:

***

## Refactored Concept: Feedback

**concept** Feedback \[User, CheckIn]

**purpose** Compute and deliver habit-forming feedback and reminders from check-ins

**principle** As the athlete logs check-ins, the system computes streaks and completion rates; at a configured reminder time, if the day’s check-in is missing, send a reminder.

**state**
  a set of Summaries with
    owner User
    streakCount Number
    completion7d Ratio
lastReminderDate Date // To prevent multiple reminders on the same day

  a set of Messages with
    owner User
    timestamp DateTime
    kind {reminder, motivation, summary}
    text String

**actions**

* recompute (owner: User, today: Date) : (summaryId: Summary, newStreakCount: Number, newCompletion7d: Ratio)
      **requires** owner exists
      **effects**
  upserts owner’s Summary;
  sets its streakCount to `newStreakCount` (derived from recent CheckIns, based on the `CheckIn` concept's state, evaluated by the triggering sync);
  sets its completion7d to `newCompletion7d` (derived from recent CheckIns, based on the `CheckIn` concept's state, evaluated by the triggering sync);
  returns the ID of the updated/created Summary along with the computed streak and completion values.

* recordMessage (owner: User, kind: Enum, text: String) : (messageId: Message)
      **requires** owner exists
      **effects**
  appends a new Message for `owner` with the given `kind` and `text` at the current timestamp for audit/tracking;
  returns the ID of the new Message.

* **system** sendReminder (owner: User)
      **requires** owner exists
      **effects**
  delivers an out-of-band reminder to `owner`;
  records a reminder Message for `owner`;
  updates `owner`'s Summary to set `lastReminderDate` to today's date to track that a reminder was sent.

**queries**

* \_getSummaryMetrics (owner: User) : (streakCount: Number, completion7d: Ratio)
      **requires** in Feedback: Summary of owner exists
      **effects** returns the `streakCount` and `completion7d` from the `owner`'s Summary.

* \_hasSentReminderToday (owner: User, date: Date) : (sent: Boolean)
      **requires** in Feedback: Summary of owner exists
      **effects** returns `true` if the `owner`'s `lastReminderDate` in their Summary is `date`, `false` otherwise.

**syncs**

* computeFeedback
      **when** CheckIn.submit (owner: User, date: Date, /\* other check-in args \*/)
      **where**
        in CheckIn: \_calculateStreak (user: owner, tillDate: date) is calculatedStreak // Assumes CheckIn concept provides a query for calculating streak
        in CheckIn: \_calculateCompletion7d (user: owner, tillDate: date) is calculatedCompletion // Assumes CheckIn concept provides a query for calculating 7-day completion
      **then** Feedback.recompute (owner: owner, today: date) : (summaryId, newStreakCount, newCompletion7d)
      **then** newStreakCount is calculatedStreak
      **then** newCompletion7d is calculatedCompletion

* motivateOnImprovement
      **when** Feedback.recompute (owner, today) : (summaryId, currentStreak, currentCompletion)
      **where** currentStreak > 0
      **then** Feedback.recordMessage (owner: owner, kind: motivation, text: "Nice work — streak " + currentStreak + " days!")

* dailyReminder
      **when** Schedule.hourlyTick (currentDateTime: DateTime) // Assumes a `Schedule` concept providing hourly ticks
      **where**
        in User: user of u, reminderTime of u is rTime // Assumes `User` concept has a `reminderTime` property for `User` entities
        currentDateTime.time is after rTime.time // Comparing only the time component
        currentDateTime.date is todayDate
        in CheckIn: \_hasCheckIn (user: u, date: todayDate) is false // Assumes `CheckIn` concept has a query to check for check-ins
        in Feedback: \_hasSentReminderToday (owner: u, date: todayDate) is false
      **then** Feedback.sendReminder (owner: u)

* shareOpen
      **when** User.createShareLink (user: User) : (token: String) // Assumes `User` concept for share link creation
      **where** token exists
      **then** Feedback.recordMessage (owner: user, kind: summary, text: "Share link created; weekly summary visible via link.")

* weeklySummary
      **when** Calendar.endsWeek (weekEndDate: Date) // Assumes a `Calendar` concept that triggers at week end
      **where** user: User // This implies the sync iterates for all relevant users, or `Calendar.endsWeek` provides context
      **then** Feedback.recompute (owner: user, today: weekEndDate) : (summaryId, currentStreak, currentCompletion)
      **then** Feedback.recordMessage (owner: user, kind: summary, text: "Weekly: " + currentCompletion\*100 + "% complete.")

***

### Summary of Changes and Rationale:

1. **Concept Type Parameters**: Added `[User, CheckIn]` to explicitly declare the external types `Feedback` works with.
2. **`recompute` Action**:
   * Changed return type from `(summary: Summary)` to `(summaryId: Summary, newStreakCount: Number, newCompletion7d: Ratio)`. This adheres to the rule of returning identifiers and primitive values, not composite objects.
   * Updated effects to reflect this change and clarified that computations occur *outside* the `Feedback` concept, with results passed in (this aligns with independence).
3. **`recordMessage` Action**:
   * Changed return type from `(msg: Message)` to `(messageId: Message)`. Same rationale as `recompute`.
4. **`sendReminder` Action**:
   * Removed all external state dependencies (`owner.reminderTime`, `no CheckIn exists`) from its `requires` clause. The `requires owner exists` remains, as `User` is a type parameter, and `Feedback` needs to ensure the ID is valid in its own context.
   * Marked as `system` action.
   * Added `lastReminderDate` to `Summary` state and updated `sendReminder` to use it to track reminders. This enables `Feedback` to internally manage reminder history, a necessary part of its "completeness."
5. **Queries**: Added `_getSummaryMetrics` and `_hasSentReminderToday` queries to `Feedback`. These are essential for syncs to read relevant data from `Feedback`'s state without direct access or problematic function calls.
6. **Syncs**:
   * **`computeFeedback`**: Now passes the calculated `streak` and `completion` values as explicit arguments, assuming `CheckIn` (or another concept) has queries like `_calculateStreak` and `_calculateCompletion7d`. This fully separates the *computation* of these metrics from their *storage* by `Feedback`.
   * **`motivateOnImprovement`**: Updated to use the named primitive returns (`currentStreak`) from `recompute`, resolving the composite object access issue.
   * **`dailyReminder`**: Significantly refactored.
     * The `When` clause now uses a generic `Schedule.hourlyTick` action, decoupling `Feedback` from knowing *when* to check.
     * The `Where` clause explicitly gathers all necessary conditions (user's reminder time from `User`, absence of check-in from `CheckIn`, and if a reminder was already sent from `Feedback` itself) using `in Concept: ...` syntax and the new queries. This ensures full independence.
   * **`weeklySummary`**: Updated to use the named primitive returns (`currentCompletion`) from `recompute` in the `Then` clause for constructing the message string.

These changes make the `Feedback` concept much more independent, modular, and consistent with the concept design principles.
