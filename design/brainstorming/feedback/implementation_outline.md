[@concept-design-overview](../../background/concept-design-overview.md)

[@concept-specifications](../../background/concept-specifications.md)

[@implementing-concepts](../../background/implementing-concepts.md)

[@Feedback-concept-specification](../../../src/concepts/Feedback/spec.md)

# prompt: I would like an outline of a implementation for Feedback from the given specification. Don't implement any functions yet, but give a skeleton of the class with good documentation and docstrings for any functions I need.
# response:

Here is the outline of the `FeedbackConcept` implementation, adhering to the provided guidelines for structure, documentation, and types.

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

# prompt: try again. Do everything except implement the functions, give clear specs, docstrings documentations for functions, with clear TODOs
# response:

Here is the outline for the `FeedbackConcept` implementation, with detailed docstrings, type definitions, and clear `TODO` comments, as requested.

***

# file: src/Feedback/FeedbackConcept.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

/**
 * concept Feedback [User, CheckIn]
 *
 * purpose Compute and deliver habit-forming feedback and reminders from check-ins
 *
 * principle As the athlete logs check-ins, the system computes streaks and completion rates;
 *            at a configured reminder time, if the day’s check-in is missing, send a reminder.
 */
const PREFIX = "Feedback" + "."; // Collection prefix derived from concept name

// Generic types defined by the concept
type User = ID;
type CheckIn = ID; // This generic type refers to CheckIn entities from the CheckIn concept.

// Entity IDs managed within this concept's state
type Summary = ID; // ID for Summary entities
type Message = ID; // ID for Message entities

/**
 * Represents a Summary document in the MongoDB collection.
 * Corresponds to:
 * a set of Summaries with
 *   owner User
 *   streakCount Number
 *   completion7d Ratio
 *   lastReminderDate Date // To prevent multiple reminders on the same day
 */
interface SummaryDocument {
  _id: Summary; // The unique identifier for this Summary entity.
  owner: User;
  streakCount: number; // Stored as a number.
  completion7d: number; // Ratio is typically represented as a number between 0.0 and 1.0.
  lastReminderDate?: Date; // Optional, as it might not be set until a reminder is sent.
}

/**
 * Defines the possible kinds of messages that can be recorded.
 * Corresponds to:
 *   kind {reminder, motivation, summary}
 */
type MessageKind = "reminder" | "motivation" | "summary";

/**
 * Represents a Message document in the MongoDB collection.
 * Corresponds to:
 * a set of Messages with
 *   owner User
 *   timestamp DateTime
 *   kind {reminder, motivation, summary}
 *   text String
 */
interface MessageDocument {
  _id: Message; // The unique identifier for this Message entity.
  owner: User;
  timestamp: Date; // DateTime from spec mapped to JS Date object.
  kind: MessageKind;
  text: string;
}

export default class FeedbackConcept {
  // MongoDB collections for the concept's state
  private summaries: Collection<SummaryDocument>;
  private messages: Collection<MessageDocument>;

  /**
   * Constructs the FeedbackConcept instance, initializing its MongoDB collections.
   * @param db The MongoDB database instance.
   */
  constructor(private readonly db: Db) {
    this.summaries = this.db.collection(PREFIX + "summaries");
    this.messages = this.db.collection(PREFIX + "messages");
  }

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
      today: Date;
      newStreakCount: number;
      newCompletion7d: number;
    },
  ): Promise<{ summaryId: Summary; newStreakCount: number; newCompletion7d: number } | { error: string }> {
    // TODO:
    // 1. Validate 'owner exists' if necessary (though sync 'where' clause should ensure this).
    // 2. Find the existing summary for the owner.
    // 3. If no summary exists, create a new one with a fresh ID (using `freshID()`).
    // 4. Update the summary document with `newStreakCount` and `newCompletion7d`.
    // 5. Use `upsert` functionality of MongoDB for atomic find-or-create and update.
    // 6. Return the `_id` of the summary, along with the `newStreakCount` and `newCompletion7d` that were set.
    // 7. Handle potential database errors by returning `{ error: "message" }`.
    console.log(
      `Recomputing feedback for owner ${owner} on ${today.toDateString()} with streak ${newStreakCount} and completion ${newCompletion7d}`,
    );
    return { summaryId: freshID() as Summary, newStreakCount, newCompletion7d }; // Placeholder
  }

  /**
   * recordMessage (owner: User, kind: Enum, text: String) : (messageId: Message)
   *
   * **requires** owner exists
   *
   * **effects**
   * appends a new Message for `owner` with the given `kind` and `text` at the current timestamp for audit/tracking;
   * returns the ID of the new Message.
   *
   * @param params An object containing:
   *   `owner`: The ID of the user for whom the message is recorded.
   *   `kind`: The type of message (e.g., 'motivation', 'reminder').
   *   `text`: The content of the message.
   * @returns A promise resolving to an object with `messageId` on success,
   *          or an `{ error: string }` object if preconditions are not met or an error occurs.
   */
  async recordMessage(
    { owner, kind, text }: { owner: User; kind: MessageKind; text: string },
  ): Promise<{ messageId: Message } | { error: string }> {
    // TODO:
    // 1. Validate 'owner exists' if necessary.
    // 2. Create a new `MessageDocument` with a fresh ID (using `freshID()`),
    //    the provided `owner`, `kind`, `text`, and the current timestamp.
    // 3. Insert the new message document into the `messages` collection.
    // 4. Return the `_id` of the newly created message.
    // 5. Handle potential database errors by returning `{ error: "message" }`.
    console.log(`Recording message for owner ${owner}: [${kind}] ${text}`);
    return { messageId: freshID() as Message }; // Placeholder
  }

  /**
   * **system** sendReminder (owner: User) : Empty
   *
   * **requires** owner exists
   *
   * **effects**
   * delivers an out-of-band reminder to `owner`;
   * records a reminder Message for `owner`;
   * updates `owner`'s Summary to set `lastReminderDate` to today's date to track that a reminder was sent.
   *
   * @param params An object containing:
   *   `owner`: The ID of the user to whom the reminder should be sent.
   * @returns A promise resolving to an empty object `{}` on success,
   *          or an `{ error: string }` object if preconditions are not met or an error occurs.
   */
  async sendReminder({ owner }: { owner: User }): Promise<Empty | { error: string }> {
    // TODO:
    // 1. Validate 'owner exists' and that a summary exists for the owner.
    // 2. Simulate "out-of-band reminder delivery" (e.g., a `console.log` or call to an external service).
    // 3. Call `this.recordMessage` to record a message of `kind: "reminder"`.
    // 4. Update the `owner`'s Summary document to set `lastReminderDate` to the current date.
    // 5. Handle potential database or external service errors by returning `{ error: "message" }`.
    console.log(`[SYSTEM ACTION] Sending out-of-band reminder to owner ${owner}`);
    return {}; // Placeholder
  }

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
    // TODO:
    // 1. Find the SummaryDocument for the given `owner`.
    // 2. If found, return an array containing an object with `streakCount` and `completion7d`.
    // 3. If not found (precondition violation), return `{ error: "Summary for owner X does not exist." }`.
    // 4. Handle potential database errors.
    const summary = await this.summaries.findOne({ owner });
    if (summary) {
      return [{ streakCount: summary.streakCount, completion7d: summary.completion7d }];
    }
    return { error: `Summary for owner ${owner} does not exist.` };
  }

  /**
   * _hasSentReminderToday (owner: User, date: Date) : (sent: Boolean)
   *
   * **requires** in Feedback: Summary of owner exists
   *
   * **effects** returns `true` if the `owner`'s `lastReminderDate` in their Summary is `date`, `false` otherwise.
   *
   * @param params An object containing:
   *   `owner`: The ID of the user to check for a reminder.
   *   `date`: The date to check against the last reminder date.
   * @returns A promise resolving to an array containing a single object with `sent: true` or `sent: false`
   *          on success, or an `{ error: string }` object if the summary does not exist or an error occurs.
   */
  async _hasSentReminderToday(
    { owner, date }: { owner: User; date: Date },
  ): Promise<Array<{ sent: boolean }> | { error: string }> {
    // TODO:
    // 1. Find the SummaryDocument for the given `owner`.
    // 2. If found, compare `summary.lastReminderDate` (if it exists) with the provided `date`.
    //    Use `toDateString()` for date-only comparison to ignore time components.
    // 3. Return an array containing an object with `sent: true` or `sent: false`.
    // 4. If not found (precondition violation), return `{ error: "Summary for owner X does not exist." }`.
    // 5. Handle potential database errors.
    const summary = await this.summaries.findOne({ owner });
    if (summary) {
      const sentToday = summary.lastReminderDate?.toDateString() === date.toDateString();
      return [{ sent: sentToday }];
    }
    return { error: `Summary for owner ${owner} does not exist.` };
  }
}
```