---
timestamp: 'Thu Oct 23 2025 23:08:26 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_230826.8b2f87c2.md]]'
content_id: 165b17e9e39b2cfb36ff73c0f6bbfa883b7991411c4df57557eeb191c34b8394
---

# response:

```typescript
  /**
   * _getSummaryMetrics (owner: User) : (streakCount: Number, completion7d: Ratio)
   *
   * **requires** in Feedback: Summary of owner exists
   *
   * **effects** returns the `streakCount` and `completion7d` from the `owner`'s Summary.
   *
   * @param params An object containing:
   *   `owner`: The ID of the user whose summary metrics are requested.
   * @returns A promise resolving to an array containing a single object with `streakCount` and `completion7d`
   *          on success, or an `{ error: string }` object if the summary does not exist or an error occurs.
   */
  async _getSummaryMetrics(
    { owner }: { owner: User },
  ): Promise<Array<{ streakCount: number; completion7d: number }> | { error: string }> {
    try {
      // 1. Find the SummaryDocument for the given `owner`.
      const summary = await this.summaries.findOne({ owner: owner });

      // 2. If found, return an array containing an object with `streakCount` and `completion7d`.
      if (summary) {
        console.log(
          `Retrieved summary metrics for owner ${owner}: Streak ${summary.streakCount}, Completion ${summary.completion7d}`,
        );
        return [{ streakCount: summary.streakCount, completion7d: summary.completion7d }];
      } else {
        // 3. If not found (precondition violation), return `{ error: "Summary for owner X does not exist." }`.
        return { error: `Precondition failed: Summary for owner ${owner} does not exist.` };
      }
    } catch (e) {
      // 4. Handle potential database errors.
      console.error(`Error retrieving summary metrics for owner ${owner}:`, e);
      return { error: `Database error during _getSummaryMetrics: ${e.message}` };
    }
  }
```
