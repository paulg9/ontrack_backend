---
timestamp: 'Thu Oct 23 2025 00:45:08 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_004508.d33b5a13.md]]'
content_id: 585c35d4f7116c131e6b35d3e2b4028bcfe5be391d68ab5977af5b7ae8c9804e
---

# file: src/checkin/CheckInConcept.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { freshID } from "@utils/database.ts";
import { Empty, ID } from "@utils/types.ts";

// Generic types used by this concept
type User = ID;
type PlanItem = ID;
type CheckIn = ID;

const PREFIX = "CheckIn";

/**
 * Represents the state of a single CheckIn.
 *
 * State: a set of CheckIns with
 * - owner: User
 * - date: Date (stored as YYYY-MM-DD string)
 * - completedItems: set of PlanItem
 * - strain_0_10: Number
 * - pain_0_10: Number
 * - comment: String (optional)
 */
interface CheckInDoc {
  _id: CheckIn;
  owner: User;
  date: string;
  completedItems: PlanItem[];
  strain_0_10: number;
  pain_0_10: number;
  comment?: string;
}

/**
 * @concept CheckIn
 * @purpose Record daily completion and simple subjective context
 * @principle Each day the athlete records which plan items were completed and strain (how hard the user pushed themselves) and pain notes
 */
export default class CheckInConcept {
  public readonly checkins: Collection<CheckInDoc>;

  constructor(db: Db) {
    this.checkins = db.collection<CheckInDoc>(PREFIX);
  }

  /**
   * submit (owner: User, date: Date, completed: set of PlanItem, strain_0_10: Number, pain_0_10: Number, comment?: String) : (checkin: CheckIn)
   *
   * @requires owner exists; each completed item belongs to owner’s active plan; no check-in exists for (owner, date)
   * @effects creates a new CheckIn with provided fields
   */
  async submit({
    owner,
    date,
    completedItems,
    strain_0_10,
    pain_0_10,
    comment,
  }: {
    owner: User;
    date: string; // Expected format: YYYY-MM-DD
    completedItems: PlanItem[];
    strain_0_10: number;
    pain_0_10: number;
    comment?: string;
  }): Promise<{ checkin: CheckIn } | { error: string }> {
    // Validate inputs
    if (strain_0_10 < 0 || strain_0_10 > 10) {
      return { error: "Strain must be between 0 and 10." };
    }
    if (pain_0_10 < 0 || pain_0_10 > 10) {
      return { error: "Pain must be between 0 and 10." };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { error: "Invalid date format. Expected YYYY-MM-DD." };
    }

    // Requires: no check-in exists for (owner, date)
    const existingCheckIn = await this.checkins.findOne({ owner, date });
    if (existingCheckIn) {
      return { error: `A check-in for owner ${owner} on date ${date} already exists.` };
    }

    // Effects: creates a new CheckIn with provided fields
    const newCheckInId = freshID() as CheckIn;
    const newCheckIn: CheckInDoc = {
      _id: newCheckInId,
      owner,
      date,
      // Ensure completedItems is a set (no duplicates)
      completedItems: [...new Set(completedItems)],
      strain_0_10,
      pain_0_10,
    };

    if (comment !== undefined && comment !== null && comment !== "") {
      newCheckIn.comment = comment;
    }

    await this.checkins.insertOne(newCheckIn);

    return { checkin: newCheckInId };
  }

  /**
   * amend (checkin: CheckIn, completed?: set of PlanItem, strain_0_10?: Number, pain_0_10?: Number, comment?: String)
   *
   * @requires checkin exists and belongs to its owner
   * @effects updates the provided fields on checkin
   */
  async amend({
    checkin,
    completedItems,
    strain_0_10,
    pain_0_10,
    comment,
  }: {
    checkin: CheckIn;
    completedItems?: PlanItem[];
    strain_0_10?: number;
    pain_0_10?: number;
    comment?: string | null;
  }): Promise<Empty | { error: string }> {
    // Requires: checkin exists
    const existingCheckIn = await this.checkins.findOne({ _id: checkin });
    if (!existingCheckIn) {
      return { error: `Check-in with id ${checkin} not found.` };
    }

    // Validate inputs if they are provided
    if (strain_0_10 !== undefined && (strain_0_10 < 0 || strain_0_10 > 10)) {
      return { error: "Strain must be between 0 and 10." };
    }
    if (pain_0_10 !== undefined && (pain_0_10 < 0 || pain_0_10 > 10)) {
      return { error: "Pain must be between 0 and 10." };
    }

    // Effects: updates the provided fields on checkin
    const updatePayload: { $set: Partial<Omit<CheckInDoc, "_id">>; $unset?: { comment?: "" } } = { $set: {} };

    if (completedItems !== undefined) {
      updatePayload.$set.completedItems = [...new Set(completedItems)];
    }
    if (strain_0_10 !== undefined) {
      updatePayload.$set.strain_0_10 = strain_0_10;
    }
    if (pain_0_10 !== undefined) {
      updatePayload.$set.pain_0_10 = pain_0_10;
    }
    if (comment !== undefined) {
      if (comment) { // non-empty string
        updatePayload.$set.comment = comment;
      } else { // null or empty string
        updatePayload.$unset = { comment: "" };
      }
    }

    if (Object.keys(updatePayload.$set).length === 0 && !updatePayload.$unset) {
      return {}; // No changes, successful no-op
    }

    const finalUpdate: any = {};
    if (Object.keys(updatePayload.$set).length > 0) finalUpdate.$set = updatePayload.$set;
    if (updatePayload.$unset) finalUpdate.$unset = updatePayload.$unset;

    await this.checkins.updateOne({ _id: checkin }, finalUpdate);

    return {};
  }

  /**
   * _getCheckInByOwnerAndDate (owner: User, date: String): (checkin: CheckInDoc)
   * @effects returns the checkin document for the given owner and date, if it exists.
   */
  async _getCheckInByOwnerAndDate({ owner, date }: { owner: User; date: string }): Promise<CheckInDoc[]> {
    const checkin = await this.checkins.findOne({ owner, date });
    return checkin ? [checkin] : [];
  }

  /**
   * _getCheckInsByOwner (owner: User): (checkin: CheckInDoc)
   * @effects returns all checkin documents for the given owner.
   */
  async _getCheckInsByOwner({ owner }: { owner: User }): Promise<CheckInDoc[]> {
    return this.checkins.find({ owner }).toArray();
  }

  /**
   * _getCheckInById (checkin: CheckIn): (checkin: CheckInDoc)
   * @effects returns the checkin document for the given ID, if it exists.
   */
  async _getCheckInById({ checkin }: { checkin: CheckIn }): Promise<CheckInDoc[]> {
    const doc = await this.checkins.findOne({ _id: checkin });
    return doc ? [doc] : [];
  }
}
```
