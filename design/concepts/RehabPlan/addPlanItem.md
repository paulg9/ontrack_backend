[@concept-design-overview](../../background/concept-design-overview.md)

[@implementing-concepts](../../background/implementing-concepts.md)

[@concept-code-skeleton](../../../src/concepts/RehabPlan/RehabPlanConcept.ts)

# prompt: I am incrementally implementing my RehabPlan concept. I have my class outlined already and the createPlan function already implemented. You need to implement the TODOs in the async function addPlanItem. 
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
    try {
      // Precondition 1: Check if the 'owner' already has an active (archived = false) plan.
      // As per concept independence, we assume the 'owner' ID is valid.
      const existingActivePlan = await this.plans.findOne({ owner: owner, archived: false });

      if (existingActivePlan) {
        console.warn(`[RehabPlanConcept] Owner ${owner} already has an active plan: ${existingActivePlan._id}`);
        return { error: `Owner ${owner} already has an active rehab plan.` };
      }

      // Effect: Create a new plan document.
      const newPlanId = freshID() as Plan; // Generate a new unique ID for the plan
      const newPlan: Plans = {
        _id: newPlanId,
        owner: owner,
        archived: false, // Default to false as per state definition
        items: [], // Initialize with an empty 'items' array
      };

      // Insert the new document into the 'plans' collection.
      const result = await this.plans.insertOne(newPlan);

      if (result.acknowledged) {
        console.log(`[RehabPlanConcept] Created plan for owner ${owner} with ID ${newPlanId}`);
        return { plan: newPlanId };
      } else {
        console.error(`[RehabPlanConcept] Failed to acknowledge plan creation for owner ${owner}`);
        return { error: "Failed to create plan due to database error." };
      }
    } catch (e) {
      console.error(`[RehabPlanConcept] Error creating plan for owner ${owner}:`, e);
      return { error: `An unexpected error occurred: ${e.message}` };
    }
  }

  /**
   * addPlanItem (plan: Plan, exercise: Exercise, perWeek: Integer, sets: Integer, reps: Integer, notes: String)
   *
   * **requires** plan exists; exercise exists and deprecated = false; no existing PlanItem for 'exercise' in 'plan'
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
    try {
      // Precondition 1: Verify the 'plan' exists in the 'plans' collection.
      const existingPlan = await this.plans.findOne({ _id: plan });
      if (!existingPlan) {
        console.warn(`[RehabPlanConcept] Plan ${plan} not found.`);
        return { error: `Plan ${plan} not found.` };
      }

      // Precondition 2: Verify 'exercise' exists and deprecated = false
      // As per concept independence, this concept does not interact with an 'Exercise Library' concept directly.
      // Validation for 'exercise' existence and its 'deprecated' status would typically be handled by a
      // synchronization (sync) or an external service validating the input before this action is called.
      // For this concept's scope, we assume the 'exercise' ID is valid and not deprecated at this point.
      // If a sync fails this validation, it would prevent this action from being triggered.

      // Precondition 3: Ensure no existing PlanItem with the same 'exercise' ID already exists in this plan.
      const existingPlanItem = existingPlan.items.find(item => item.exercise === exercise);
      if (existingPlanItem) {
        console.warn(`[RehabPlanConcept] Plan ${plan} already contains an item for exercise ${exercise}.`);
        return { error: `Plan ${plan} already contains an item for exercise ${exercise}.` };
      }

      // Effect: Create a new PlanItem object with the provided details.
      const newPlanItem: PlanItem = {
        exercise,
        perWeek,
        sets,
        reps,
        notes,
      };

      // Effect: Add the new PlanItem to the 'items' array of the plan.
      const result = await this.plans.updateOne(
        { _id: plan },
        { $push: { items: newPlanItem } }
      );

      if (result.matchedCount === 0) {
        // This case should ideally be caught by the initial findOne, but acts as a safeguard.
        console.error(`[RehabPlanConcept] Plan ${plan} not found during update to add item.`);
        return { error: `Plan ${plan} not found.` };
      }
      if (result.modifiedCount === 0) {
        // This indicates the document was found, but the update didn't change anything.
        // Given the precondition check, this scenario is less likely but good to guard against.
        console.warn(`[RehabPlanConcept] Plan ${plan} was found but not modified to add item ${exercise}.`);
        return { error: `Failed to add item to plan ${plan}. No modification occurred.` };
      }

      console.log(`[RehabPlanConcept] Added item ${exercise} to plan ${plan}.`);
      return {}; // Return an empty object on success.
    } catch (e) {
      console.error(`[RehabPlanConcept] Error adding plan item to plan ${plan}:`, e);
      return { error: `An unexpected error occurred: ${e.message}` };
    }
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

# prompt: now, implement the TODOs in removePlanItem. Only give me this function, not the full code.
# response:

```typescript
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
    try {
      // Precondition 1: Verify the 'plan' exists.
      const existingPlan = await this.plans.findOne({ _id: plan });
      if (!existingPlan) {
        console.warn(`[RehabPlanConcept] Plan ${plan} not found for removal of item ${exercise}.`);
        return { error: `Plan ${plan} not found.` };
      }

      // Precondition 2: Verify that a PlanItem for the given 'exercise' exists within that plan's 'items' array.
      const existingPlanItem = existingPlan.items.find(item => item.exercise === exercise);
      if (!existingPlanItem) {
        console.warn(`[RehabPlanConcept] Plan ${plan} does not contain an item for exercise ${exercise}.`);
        return { error: `Exercise ${exercise} not found in plan ${plan}.` };
      }

      // Effect: Use an update operation ($pull) to remove the PlanItem from the 'items' array.
      const result = await this.plans.updateOne(
        { _id: plan },
        { $pull: { items: { exercise: exercise } } }
      );

      if (result.matchedCount === 0) {
        // This case should ideally be caught by the initial findOne, but acts as a safeguard.
        console.error(`[RehabPlanConcept] Plan ${plan} not found during update to remove item.`);
        return { error: `Plan ${plan} not found.` };
      }
      if (result.modifiedCount === 0) {
        // This indicates the document was found, but the update didn't change anything.
        // Given the precondition check, this scenario is less likely but good to guard against.
        console.warn(`[RehabPlanConcept] Plan ${plan} was found but not modified to remove item ${exercise}.`);
        return { error: `Failed to remove item ${exercise} from plan ${plan}. No modification occurred.` };
      }

      console.log(`[RehabPlanConcept] Removed item ${exercise} from plan ${plan}.`);
      return {}; // Return an empty object on success.
    } catch (e) {
      console.error(`[RehabPlanConcept] Error removing plan item ${exercise} from plan ${plan}:`, e);
      return { error: `An unexpected error occurred: ${e.message}` };
    }
  }
```

# prompt: Now implement the TODOs in archivePlan, again giving me only the function and not the full code.
# response:

```typescript
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
    try {
      // Precondition 1: Verify the 'plan' exists.
      const existingPlan = await this.plans.findOne({ _id: plan });
      if (!existingPlan) {
        console.warn(`[RehabPlanConcept] Plan ${plan} not found for archiving.`);
        return { error: `Plan ${plan} not found.` };
      }

      // Effect: Update the 'archived' field of the document to 'true'.
      const result = await this.plans.updateOne(
        { _id: plan },
        { $set: { archived: true } }
      );

      if (result.matchedCount === 0) {
        // This case should ideally be caught by the initial findOne, but acts as a safeguard.
        console.error(`[RehabPlanConcept] Plan ${plan} not found during update to archive.`);
        return { error: `Plan ${plan} not found.` };
      }
      if (result.modifiedCount === 0) {
        // This indicates the document was found, but the update didn't change anything,
        // which could mean it was already archived.
        console.warn(`[RehabPlanConcept] Plan ${plan} was found but not modified. It might already be archived.`);
        // Even if already archived, the "effect" is still achieved, so we don't necessarily return an error.
        // However, if the requirement is that it *must change*, then this would be an error.
        // For now, we'll treat it as a success if the state desired is achieved.
      }

      console.log(`[RehabPlanConcept] Archived plan ${plan}.`);
      return {}; // Return an empty object on success.
    } catch (e) {
      console.error(`[RehabPlanConcept] Error archiving plan ${plan}:`, e);
      return { error: `An unexpected error occurred: ${e.message}` };
    }
  }
```