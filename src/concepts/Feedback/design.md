Changed: The original `Feedback` specification was refactored to more strictly
adhere to the principles of concept design, primarily by enforcing complete
independence and eliminating composite objects from action interfaces. The most
critical change involved moving the complex conditional logic for triggering a
reminder out of the `sendReminder` action's precondition and into the `where`
clause of the `dailyReminder` sync. This ensures that the `Feedback` concept
itself has no direct knowledge of or dependency on the state of other concepts
like `User` or `CheckIn`. Additionally, actions like `recompute` were modified
to return primitive identifiers and values (e.g., `summaryId`, `newStreakCount`)
instead of composite objects, which simplifies the consuming syncs. Finally,
explicit queries were added to provide a formal, controlled way for syncs to
read `Feedback`'s state (added `_listMessages`), and internal state was added to
make the concept more behaviorally complete. A later iteration added
`recordCompletion`, which keeps a streak counter and a rolling seven-day
completion window entirely inside the concept so that the streak increments
automatically when all plan items are completed for a day. Interesting moments:
2.5 pro gave each test area its own deno.test, 2.5 flash gave them all as one
deno.test with multiple steps
[See test suite and methodology ↗](context/design/concepts/feedback/test.md/steps/response.ee41c1c0.md)
