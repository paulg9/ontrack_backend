---
timestamp: 'Thu Oct 23 2025 22:01:30 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_220130.c9ef09f7.md]]'
content_id: 734dbcdc582276f5406f69a668e93838b6c945b5e8ade7bda53bf27e0f5423ac
---

# response:

Here's the outline for your `RehabPlan` concept implementation, following the provided `Concept Design` specification and implementation guidelines.

***

### File structure and imports

```typescript
// file: src/RehabPlan/RehabPlanConcept.ts
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts"; // Utility to generate unique IDs
```

### Concept name prefix and generic type declarations

```typescript
// concept RehabPlan [User, Exercise]
// Purpose: Define the athlete’s routine as a selection of exercises and target frequencies

// Declare collection prefix, using the concept name
const PREFIX = "RehabPlan" + ".";

// Generic types for the concept, treated as opaque IDs
type User = ID;
type Exercise = ID;

// Internal ID types for documents managed by this concept
type Plan = ID;      // ID for a Plan document
type PlanItem = ID;  // ID for a PlanItem document
```

### State interfaces

```typescript
/**
 * Represents a 'Plan' document in the database.
 * Corresponds to "a set of Plans with..." in the concept specification.
 *
 * @property _id The unique identifier for this plan.
 * @property owner The ID of the User who owns this plan.
 * @property archived Indicates if the plan is archived (default false).
 * @property items An array of PlanItem IDs associated with this plan.
 */
interface PlanDoc {
  _id: Plan;
  owner: User;
  archived: boolean;
  items: PlanItem[]; // References PlanItemDoc by ID
}

/**
 * Represents a 'PlanItem' document in the database.
 * Corresponds to "a set of PlanItems with..." in the concept specification.
 *
 * @property _id The unique identifier for this plan item.
 * @property planId The ID of the parent Plan this item belongs to.
 * @property exercise The ID of the Exercise associated with this item.
 * @property perWeek The target frequency per week for this exercise.
 * @property sets The target number of sets for this exercise.
 * @property reps The target number of repetitions per set for this exercise.
 * @property notes Any additional notes for this exercise in the plan.
 */
interface PlanItemDoc {
  _id: PlanItem;
  planId: Plan; // Explicitly links PlanItem back to its parent Plan
  exercise: Exercise;
  perWeek: number;
  sets: number;
  reps: number;
  notes: string;
}
```

### Concept class implementation

```typescript
export default class RehabPlanConcept {
  // MongoDB collections for the concept's state
  plans: Collection<PlanDoc>;
  planItems: Collection<PlanItemDoc>;

  constructor(private readonly db: Db) {
    this.plans = this.db.collection(PREFIX + "plans");
    this.planItems = this.db.collection(PREFIX + "planItems");
  }

  // --- Actions ---

  /**
   * createPlan (owner: User) : (plan: Plan)
   *
   * **requires** owner exists and has no active (non-archived) plan
   *
   * **effects** creates a new plan document with the given owner, sets archived to false,
   *             and initializes an empty items array. Returns the ID of the newly created plan.
   */
  async createPlan({ owner }: { owner: User }): Promise<{ plan: Plan } | { error: string }> {
    // Check 'requires': owner exists (typically handled by a sync or an external concept's query)
    // For this concept's internal check: ensure the owner has no active (non-archived) plan
    const existingActivePlan = await this.plans.findOne({ owner, archived: false });
    if (existingActivePlan) {
      return { error: `Owner ${owner} already has an active plan.` };
    }

    const newPlanId = freshID() as Plan;
    const newPlan: PlanDoc = {
      _id: newPlanId,
      owner,
      archived: false,
      items: [], // Initialize with an empty array of PlanItem IDs
    };

    await this.plans.insertOne(newPlan);
    return { plan: newPlanId };
  }

  /**
   * addPlanItem (plan: Plan, exercise: Exercise, perWeek: Integer, sets: Integer, reps: Integer, notes: String) : Empty
   *
   * **requires** plan exists; exercise exists and deprecated = false; no item for this exercise already exists in the plan.
   *
   * **effects** creates a new PlanItem document, links it to the specified plan,
   *             and adds its ID to the `items` array of the parent plan document.
   */
  async addPlanItem(
    { plan, exercise, perWeek, sets, reps, notes }: {
      plan: Plan;
      exercise: Exercise;
      perWeek: number;
      sets: number;
      reps: number;
      notes: string;
    },
  ): Promise<Empty | { error: string }> {
    // Check 'requires': plan exists
    const existingPlan = await this.plans.findOne({ _id: plan });
    if (!existingPlan) {
      return { error: `Plan ${plan} does not exist.` };
    }

    // Check 'requires': exercise exists and deprecated = false (typically handled by a sync or an external Exercise concept's query)
    // Internal check: ensure no duplicate exercise for this plan
    const existingPlanItemForExercise = await this.planItems.findOne({ planId: plan, exercise });
    if (existingPlanItemForExercise) {
      return { error: `Exercise ${exercise} already exists in plan ${plan}.` };
    }

    const newPlanItemId = freshID() as PlanItem;
    const newPlanItem: PlanItemDoc = {
      _id: newPlanItemId,
      planId: plan,
      exercise,
      perWeek,
      sets,
      reps,
      notes,
    };

    await this.planItems.insertOne(newPlanItem);
    // Update the parent plan to include the new PlanItem's ID
    await this.plans.updateOne(
      { _id: plan },
      { $push: { items: newPlanItemId } },
    );

    return {}; // Successful completion
  }

  /**
   * removePlanItem (plan: Plan, exercise: Exercise) : Empty
   *
   * **requires** plan exists and an item for the specified exercise exists within that plan.
   *
   * **effects** removes the PlanItem document associated with the exercise from the `planItems` collection
   *             and removes its ID from the `items` array of the parent plan document.
   */
  async removePlanItem(
    { plan, exercise }: { plan: Plan; exercise: Exercise },
  ): Promise<Empty | { error: string }> {
    // Check 'requires': plan exists
    const existingPlan = await this.plans.findOne({ _id: plan });
    if (!existingPlan) {
      return { error: `Plan ${plan} does not exist.` };
    }

    // Check 'requires': an item for exercise exists in the plan
    const planItemToDelete = await this.planItems.findOne({ planId: plan, exercise });
    if (!planItemToDelete) {
      return { error: `No PlanItem for exercise ${exercise} found in plan ${plan}.` };
    }

    await this.planItems.deleteOne({ _id: planItemToDelete._id });
    // Remove the PlanItem's ID from the parent plan's items array
    await this.plans.updateOne(
      { _id: plan },
      { $pull: { items: planItemToDelete._id } },
    );

    return {}; // Successful completion
  }

  /**
   * archivePlan (plan: Plan) : Empty
   *
   * **requires** plan exists and is not already archived.
   *
   * **effects** sets the `archived` property of the specified plan to `true`.
   */
  async archivePlan({ plan }: { plan: Plan }): Promise<Empty | { error: string }> {
    // Check 'requires': plan exists
    const existingPlan = await this.plans.findOne({ _id: plan });
    if (!existingPlan) {
      return { error: `Plan ${plan} does not exist.` };
    }
    // Check 'requires': plan is not already archived
    if (existingPlan.archived) {
      return { error: `Plan ${plan} is already archived.` };
    }

    await this.plans.updateOne(
      { _id: plan },
      { $set: { archived: true } },
    );

    return {}; // Successful completion
  }

  // --- Queries (Example, not explicitly requested but good practice) ---

  /**
   * _getPlanById (plan: Plan) : (plan: PlanDoc)
   *
   * **requires** plan exists
   *
   * **effects** returns the plan document matching the given ID.
   */
  async _getPlanById({ plan }: { plan: Plan }): Promise<PlanDoc[] | { error: string }> {
    const foundPlan = await this.plans.findOne({ _id: plan });
    if (!foundPlan) {
      return { error: `Plan ${plan} not found.` };
    }
    return [foundPlan]; // Queries always return an array
  }

  /**
   * _getPlanItemsForPlan (plan: Plan) : (planItem: PlanItemDoc)
   *
   * **requires** plan exists
   *
   * **effects** returns all PlanItem documents associated with the given plan.
   */
  async _getPlanItemsForPlan({ plan }: { plan: Plan }): Promise<PlanItemDoc[] | { error: string }> {
    const existingPlan = await this.plans.findOne({ _id: plan });
    if (!existingPlan) {
      return { error: `Plan ${plan} does not exist.` };
    }
    const planItems = await this.planItems.find({ planId: plan }).toArray();
    return planItems;
  }

  /**
   * _getActivePlanForUser (owner: User) : (plan: PlanDoc)
   *
   * **requires** owner exists
   *
   * **effects** returns the active (non-archived) plan for the given user, if one exists.
   */
  async _getActivePlanForUser({ owner }: { owner: User }): Promise<PlanDoc[] | { error: string }> {
    // Requires owner exists (external check)
    const activePlan = await this.plans.findOne({ owner, archived: false });
    return activePlan ? [activePlan] : [];
  }
}
```
