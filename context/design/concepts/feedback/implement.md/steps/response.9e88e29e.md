---
timestamp: 'Thu Oct 23 2025 23:05:56 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_230556.e0c2be63.md]]'
content_id: 9e88e29ee0ec5b0e7746b34ab612519e6c42cd2fa4fd977e30308ecdec31ed97
---

# response:

```typescript
  /**
   * recompute (owner: User, today: Date, newStreakCount: Number, newCompletion7d: Ratio) : (summaryId: Summary, newStreakCount: Number, newCompletion7d: Ratio)
   *
   * **requires** owner exists
   *
   * **effects**
   * upserts owner’s Summary;
   * sets its streakCount to `newStreakCount` (derived from recent CheckIns, based on the `CheckIn` concept's state, evaluated by the triggering sync);
   * sets its completion7d to `newCompletion7d` (derived from recent CheckIns, based on the `CheckIn` concept's state, evaluated by the triggering sync);
   * returns the ID of the updated/created Summary along with the computed streak and completion values.
   *
   * @param params An object containing:
   *   `owner`: The ID of the user whose summary is being recomputed.
   *   `today`: The current date for context.
   *   `newStreakCount`: The computed streak count, provided by the triggering sync.
   *   `newCompletion7d`: The computed 7-day completion ratio, provided by the triggering sync.
   * @returns A promise resolving to an object with `summaryId`, `newStreakCount`, and `newCompletion7d` on success,
   *          or an `{ error: string }` object if preconditions are not met or an error occurs.
   */
  async recompute(
    { owner, today, newStreakCount, newCompletion7d }: {
      owner: User;
      today: Date; // 'today' is part of the concept spec but not directly used in the current effects for simplicity
      newStreakCount: number;
      newCompletion7d: number;
    },
  ): Promise<{ summaryId: Summary; newStreakCount: number; newCompletion7d: number } | { error: string }> {
    try {
      const result = await this.summaries.findOneAndUpdate(
        { owner: owner }, // Filter: find summary for this owner
        {
          $set: {
            streakCount: newStreakCount,
            completion7d: newCompletion7d,
          },
          $setOnInsert: { // Set these fields only if a new document is being inserted
            _id: freshID() as Summary, // Generate a fresh ID for new summaries
            owner: owner,
            // lastReminderDate remains undefined on initial creation,
            // will be set by sendReminder action
          },
        },
        {
          upsert: true, // Create a new document if no match is found
          returnDocument: 'after', // Return the modified document rather than the original
        },
      );

      if (result.value) {
        // The summary was successfully found/created and updated
        console.log(
          `Recomputed feedback for owner ${owner}: Summary ID ${result.value._id}, Streak ${result.value.streakCount}, Completion ${result.value.completion7d}`,
        );
        return {
          summaryId: result.value._id,
          newStreakCount: result.value.streakCount,
          newCompletion7d: result.value.completion7d,
        };
      } else {
        // This case should ideally not be reached with upsert: true and returnDocument: 'after',
        // but included for robust error handling.
        return { error: `Failed to upsert summary for owner ${owner}. No document returned after operation.` };
      }
    } catch (e) {
      console.error(`Error recomputing feedback for owner ${owner}:`, e);
      return { error: `Database error during recompute: ${e.message}` };
    }
  }
```
