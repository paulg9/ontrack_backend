---
timestamp: 'Thu Oct 23 2025 23:01:29 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_230129.c7acc6ec.md]]'
content_id: 5d2e89979fa2d73d1ef9bcb5efcc1ddcb55d548bc76498da94446c94a4f96160
---

# file: src/Feedback/FeedbackConcept.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts"; // Although not used in skeleton, will be needed for actual implementation

/**
 * concept Feedback [User, CheckIn]
 *
 * purpose Compute and deliver habit-forming feedback and reminders from check-ins
 */
const PREFIX = "Feedback" + ".";

// Generic types of this concept, and entity IDs used within its state
type User = ID;
type CheckIn = ID; // Generic parameter from the concept definition
type Summary = ID; // ID for Summary entities managed by this concept
type Message = ID; // ID for Message entities managed by this concept

/**
 * a set of Summaries with
 *   owner User
 *   streakCount Number
 *   completion7d Ratio
 * lastReminderDate Date // To prevent multiple reminders on the same day
 */
interface SummaryDocument {
  _id: Summary; // The ID of the summary
  owner: User;
  streakCount: number;
  completion7d: number; // Ratio is typically represented as a number (e.g., 0.0 to 1.0)
  lastReminderDate?: Date; // Optional, as it might not be set initially or for all summaries
}

/**
 * a set of Messages with
 *   owner User
 *   timestamp DateTime
 *   kind {reminder, motivation, summary}
 *   text String
 */
type MessageKind = "reminder" | "motivation" | "summary";

interface MessageDocument {
  _id: Message; // The ID of the message
  owner: User;
  timestamp: Date;
  kind: MessageKind;
  text: string;
}

export default class FeedbackConcept {
  private summaries: Collection<SummaryDocument>;
  private messages: Collection<MessageDocument>;

  constructor(private readonly db: Db) {
    this.summaries = this.db.collection(PREFIX + "summaries");
    this.messages = this.db.collection(PREFIX + "messages");
  }

  /**
   * recompute (owner: User, today: Date) : (summaryId: Summary, newStreakCount: Number, newCompletion7d: Ratio)
   *
   * **requires** owner exists
   *
   * **effects**
   * upserts owner’s Summary;
   * sets its streakCount to `newStreakCount` (derived from recent CheckIns, based on the `CheckIn` concept's state, evaluated by the triggering sync);
   * sets its completion7d to `newCompletion7d` (derived from recent CheckIns, based on the `CheckIn` concept's state, evaluated by the triggering sync);
   * returns the ID of the updated/created Summary along with the computed streak and completion values.
   */
  async recompute(
    { owner, today, newStreakCount, newCompletion7d }: {
      owner: User;
      today: Date;
      newStreakCount: number; // These come from the sync, not calculated here
      newCompletion7d: number; // These come from the sync, not calculated here
    },
  ): Promise<{ summaryId: Summary; newStreakCount: number; newCompletion7d: number } | { error: string }> {
    // Implementation for recomputing summary and returning its ID and new metrics
    // Will involve finding/creating a SummaryDocument for the owner and updating it.
    // Error handling should return { error: "message" }
    return { summaryId: "tempSummaryId" as Summary, newStreakCount, newCompletion7d };
  }

  /**
   * recordMessage (owner: User, kind: Enum, text: String) : (messageId: Message)
   *
   * **requires** owner exists
   *
   * **effects**
   * appends a new Message for `owner` with the given `kind` and `text` at the current timestamp for audit/tracking;
   * returns the ID of the new Message.
   */
  async recordMessage(
    { owner, kind, text }: { owner: User; kind: MessageKind; text: string },
  ): Promise<{ messageId: Message } | { error: string }> {
    // Implementation for recording a new message
    // Will involve inserting a new MessageDocument.
    // Error handling should return { error: "message" }
    return { messageId: "tempMessageId" as Message };
  }

  /**
   * **system** sendReminder (owner: User)
   *
   * **requires** owner exists
   *
   * **effects**
   * delivers an out-of-band reminder to `owner`;
   * records a reminder Message for `owner`;
   * updates `owner`'s Summary to set `lastReminderDate` to today's date to track that a reminder was sent.
   */
  async sendReminder({ owner }: { owner: User }): Promise<Empty | { error: string }> {
    // Implementation for sending a reminder, recording it, and updating the summary
    // Error handling should return { error: "message" }
    return {};
  }

  /**
   * _getSummaryMetrics (owner: User) : (streakCount: Number, completion7d: Ratio)
   *
   * **requires** in Feedback: Summary of owner exists
   *
   * **effects** returns the `streakCount` and `completion7d` from the `owner`'s Summary.
   */
  async _getSummaryMetrics(
    { owner }: { owner: User },
  ): Promise<Array<{ streakCount: number; completion7d: number }> | { error: string }> {
    // Implementation to retrieve streakCount and completion7d for the owner
    // Returns an array as per query convention, or an error object.
    const summary = await this.summaries.findOne({ owner });
    if (summary) {
      return [{ streakCount: summary.streakCount, completion7d: summary.completion7d }];
    }
    // As per specification, requires 'Summary of owner exists'.
    // If not found, it's a precondition violation which can be handled as an error.
    return { error: `Summary for owner ${owner} does not exist.` };
  }

  /**
   * _hasSentReminderToday (owner: User, date: Date) : (sent: Boolean)
   *
   * **requires** in Feedback: Summary of owner exists
   *
   * **effects** returns `true` if the `owner`'s `lastReminderDate` in their Summary is `date`, `false` otherwise.
   */
  async _hasSentReminderToday(
    { owner, date }: { owner: User; date: Date },
  ): Promise<Array<{ sent: boolean }> | { error: string }> {
    // Implementation to check if a reminder was sent today for the owner
    const summary = await this.summaries.findOne({ owner });
    if (summary) {
      const sentToday = summary.lastReminderDate?.toDateString() === date.toDateString();
      return [{ sent: sentToday }];
    }
    // As per specification, requires 'Summary of owner exists'.
    // If not found, it's a precondition violation which can be handled as an error.
    return { error: `Summary for owner ${owner} does not exist.` };
  }
}
```
