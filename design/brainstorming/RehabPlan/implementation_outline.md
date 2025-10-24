[@concept-design-overview](../../background/concept-design-overview.md)

[@concept-specifications](../../background/concept-specifications.md)

[@implementing-concepts](../../background/implementing-concepts.md)

[@RehabPlan-concept-specification](../../../src/concepts/RehabPlan/spec.md)

# prompt: I would like an outline of a implementation for RehabPlan from the given specification. Don't implement any functions yet, but give a skeleton of the class with good documentation and docstrings for any functions I need.
# response:

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts"; // Included for context of ID generation

// Declare collection prefix, use concept name
const PREFIX = "RehabPlan" + ".";

// Generic types for this concept, as defined in the concept specification
type User = ID;
type Exercise = ID;

// Entity types introduced by this concept
type Plan = ID; // Identifier for a RehabPlan document

/**
 * Interface representing a PlanItem.
 * This structure describes an individual exercise routine entry within a RehabPlan.
 *
 * State:
 * a set of PlanItems with
 *  exercise Exercise
 *  perWeek Integer
 *  sets Integer
 *  reps Integer
 *  notes String
 *
 * Note: PlanItems are embedded within the 'Plans' collection, so they do not
 * have their own top-level '_id' field. The 'exercise' field is assumed to
 * uniquely identify a PlanItem within a specific plan for actions like removal.
 */
interface PlanItem {
  exercise: Exercise;
  perWeek: number;
  sets: number;
  reps: number;
  notes: string;
}

/**
 * Interface representing a RehabPlan document in the database.
 *
 * State:
 * a set of Plans with
 *  owner User
 *  archived Boolean (default false)
 *  items set of PlanItem
 */
interface Plans {
  _id: Plan; // The unique identifier for this plan
  owner: User;
  archived: boolean;
  items: PlanItem[]; // Embedded array of PlanItem objects
}

/**
 * RehabPlan Concept
 *
 * Purpose: Define the athlete’s routine as a selection of exercises and target frequencies
 *
 * Principle: An athlete creates a plan by selecting exercises from the library and setting
 * target sets and reps; the plan enumerates plan items that can be logged each day
 *
 * This class provides the implementation skeleton for the RehabPlan concept,
 * managing the state and actions related to creating, modifying, and archiving
 * rehabilitation plans for users.
 */
export default class RehabPlanConcept {
  // MongoDB Collection for 'Plans' documents
  plans: Collection<Plans>;

  /**
   * Constructs a new RehabPlanConcept instance.
   * Initializes the MongoDB collection for plans.
   *
   * @param db The MongoDB database instance to use.
   */
  constructor(private readonly db: Db) {
    this.plans = this.db.collection(PREFIX + "plans");
  }

  /**
   * createPlan (owner: User) : (plan: Plan)
   *
   * **requires** owner exists and has no active (non-archived) plan
   *
   * **effects** creates a plan with empty items; returns the new plan's ID
   *
   * @param params An object containing the owner's ID.
   * @returns A Promise resolving to an object containing the new plan's ID,
   *          or an object with an 'error' string if the operation fails.
   */
  async createPlan({ owner }: { owner: User }): Promise<{ plan: Plan } | { error: string }> {
    // TODO: Implement the logic to check preconditions:
    // 1. Verify 'owner' exists (this might involve a sync with a User concept).
    // 2. Check if the 'owner' already has an active (archived = false) plan.
    //
    // TODO: Implement the logic to create a new plan document:
    // 1. Generate a new unique ID for the plan using `freshID()`.
    // 2. Create a new Plans document with the owner, 'archived' set to false,
    //    and an empty 'items' array.
    // 3. Insert the new document into the 'plans' collection.
    //
    // If successful, return the new plan's ID.
    // If preconditions fail, or an error occurs, return an { error: "message" }.

    // Placeholder for skeleton:
    const newPlanId = freshID() as Plan; // Cast freshID result to Plan type
    console.log(`[RehabPlanConcept] Placeholder: Creating plan for owner ${owner} with ID ${newPlanId}`);
    return { plan: newPlanId };
  }

  /**
   * addPlanItem (plan: Plan, exercise: Exercise, perWeek: Integer, sets: Integer, reps: Integer, notes: String)
   *
   * **requires** plan exists; exercise exists and deprecated = false
   *
   * **effects** adds a new PlanItem to plan.items
   *
   * @param params An object containing the plan ID, exercise ID, target frequency,
   *               sets, reps, and any notes for the plan item.
   * @returns A Promise resolving to an Empty object on success,
   *          or an object with an 'error' string if the operation fails.
   */
  async addPlanItem({
    plan,
    exercise,
    perWeek,
    sets,
    reps,
    notes,
  }: {
    plan: Plan;
    exercise: Exercise;
    perWeek: number;
    sets: number;
    reps: number;
    notes: string;
  }): Promise<Empty | { error: string }> {
    // TODO: Implement the logic to check preconditions:
    // 1. Verify the 'plan' exists in the 'plans' collection.
    // 2. Verify 'exercise' exists and is not deprecated (this might involve a sync
    //    with an Exercise Library concept or similar).
    // 3. Ensure no existing PlanItem with the same 'exercise' ID already exists in this plan.
    //
    // TODO: Implement the logic to add the plan item:
    // 1. Create a new PlanItem object with the provided details.
    // 2. Find the plan document by its '_id'.
    // 3. Use an update operation (e.g., $push) to add the new PlanItem to the 'items' array.
    //
    // If successful, return an empty object.
    // If preconditions fail, or an error occurs, return an { error: "message" }.

    console.log(`[RehabPlanConcept] Placeholder: Adding item to plan ${plan}: ${exercise}`);
    return {};
  }

  /**
   * removePlanItem (plan: Plan, exercise: Exercise)
   *
   * **requires** plan exists and an item for exercise exists
   *
   * **effects** removes that PlanItem
   *
   * @param params An object containing the plan ID and the exercise ID of the item to remove.
   * @returns A Promise resolving to an Empty object on success,
   *          or an object with an 'error' string if the operation fails.
   */
  async removePlanItem({ plan, exercise }: { plan: Plan; exercise: Exercise }): Promise<Empty | { error: string }> {
    // TODO: Implement the logic to check preconditions:
    // 1. Verify the 'plan' exists.
    // 2. Verify that a PlanItem for the given 'exercise' exists within that plan's 'items' array.
    //
    // TODO: Implement the logic to remove the plan item:
    // 1. Find the plan document by its '_id'.
    // 2. Use an update operation (e.g., $pull) to remove the PlanItem from the 'items' array
    //    where the 'exercise' field matches.
    //
    // If successful, return an empty object.
    // If preconditions fail, or an error occurs, return an { error: "message" }.

    console.log(`[RehabPlanConcept] Placeholder: Removing item ${exercise} from plan ${plan}`);
    return {};
  }

  /**
   * archivePlan (plan: Plan)
   *
   * **requires** plan exists
   *
   * **effects** sets archived := true (not shown in daily view)
   *
   * @param params An object containing the plan ID to archive.
   * @returns A Promise resolving to an Empty object on success,
   *          or an object with an 'error' string if the operation fails.
   */
  async archivePlan({ plan }: { plan: Plan }): Promise<Empty | { error: string }> {
    // TODO: Implement the logic to check preconditions:
    // 1. Verify the 'plan' exists.
    //
    // TODO: Implement the logic to archive the plan:
    // 1. Find the plan document by its '_id'.
    // 2. Update the 'archived' field of the document to 'true'.
    //
    // If successful, return an empty object.
    // If preconditions fail, or an error occurs, return an { error: "message" }.

    console.log(`[RehabPlanConcept] Placeholder: Archiving plan ${plan}`);
    return {};
  }
}
```