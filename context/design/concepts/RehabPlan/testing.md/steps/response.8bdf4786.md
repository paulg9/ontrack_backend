---
timestamp: 'Thu Oct 23 2025 22:40:52 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_224052.03152713.md]]'
content_id: 8bdf4786bf527833e4a975d4cd58d56e3e559f3bd2272dc0a4a6e6107239d9f9
---

# response:

```typescript
// # file: src/concepts/RehabPlan/RehabPlanConcept.test.ts

import { testDb } from "../../../utils/database.ts"; // Adjust path as necessary for your project structure
import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import RehabPlanConcept from "./RehabPlanConcept.ts";
import { ID } from "../../../utils/types.ts"; // Adjust path as necessary for your project structure
import { Collection } from "npm:mongodb"; // Import Collection type for better type inference

// Define generic types for consistency with the concept
type User = ID;
type Exercise = ID;
type Plan = ID;

// Interface mirroring the RehabPlanConcept's internal Plans type for type-safe database queries.
interface Plans {
  _id: Plan;
  owner: User;
  archived: boolean;
  items: Array<{
    exercise: Exercise;
    perWeek: number;
    sets: number;
    reps: number;
    notes: string;
  }>;
}

/**
 * Helper function to fetch the current state of a plan directly from the database
 * for verification purposes.
 * @param concept The RehabPlanConcept instance.
 * @param planId The ID of the plan to fetch.
 * @returns A Promise resolving to the Plan document or null if not found.
 */
async function getPlanState(concept: RehabPlanConcept, planId: Plan): Promise<Plans | null> {
  return await (concept.plans as Collection<Plans>).findOne({ _id: planId });
}

Deno.test("RehabPlan Concept Testing", async (t) => {
  const [db, client] = await testDb(); // Initialize test database and client
  const rehabPlanConcept = new RehabPlanConcept(db); // Create an instance of the concept

  // Define some constant IDs for testing to ensure consistency and avoid collisions.
  const TEST_USER_1 = "user1" as User;
  const TEST_USER_2 = "user2" as User;
  const TEST_USER_3 = "user3" as User; // Dedicated user for add/remove item tests
  const TEST_USER_4 = "user4" as User; // Dedicated user for archive plan tests

  const TEST_EXERCISE_1 = "exercise1_squats" as Exercise;
  const TEST_EXERCISE_2 = "exercise2_lunges" as Exercise;
  const TEST_EXERCISE_3 = "exercise3_pushups" as Exercise;
  const TEST_EXERCISE_NON_EXISTENT = "nonExistentExercise" as Exercise; // For failure cases

  const TEST_PLAN_NON_EXISTENT = "nonExistentPlan" as Plan; // For failure cases

  // # trace: Operational Principle Trace: Athlete creates and populates a rehab plan
  // This trace demonstrates the core functionality as described in the concept's principle.
  await t.step("Principle: An athlete creates a plan and adds items", async () => {
    console.log("\n--- Principle Trace: Creating and Populating a Rehab Plan ---");

    // Action 1: Create a plan for TEST_USER_1.
    // This tests the `createPlan` action's success path and initial effects.
    console.log(`Action: createPlan({ owner: "${TEST_USER_1}" })`);
    const createPlanResult = await rehabPlanConcept.createPlan({ owner: TEST_USER_1 });
    console.log("Output:", JSON.stringify(createPlanResult)); // Log action output
    assertExists(createPlanResult, "createPlan should return a result.");
    if ("error" in createPlanResult) {
      throw new Error(`Failed to create plan for principle trace: ${createPlanResult.error}`);
    }
    const user1PlanId = createPlanResult.plan;
    console.log(`Effect: Plan created with ID: ${user1PlanId}`);

    // Verification: Confirm the state change after `createPlan`.
    const planAfterCreation = await getPlanState(rehabPlanConcept, user1PlanId);
    assertExists(planAfterCreation, "Plan should exist in the database after creation.");
    assertEquals(planAfterCreation.owner, TEST_USER_1, "Created plan should have the correct owner.");
    assertEquals(planAfterCreation.archived, false, "New plan should not be archived by default.");
    assertEquals(planAfterCreation.items.length, 0, "New plan should have an empty items array.");
    console.log("Verification: New plan exists for user1, is not archived, and has no items.");

    // Action 2: Add the first plan item to the newly created plan.
    // This tests the `addPlanItem` action's success path and its effects.
    const item1Details = {
      plan: user1PlanId,
      exercise: TEST_EXERCISE_1,
      perWeek: 3,
      sets: 3,
      reps: 10,
      notes: "Warm-up exercises for shoulders",
    };
    console.log(`Action: addPlanItem(${JSON.stringify(item1Details)})`);
    const addResult1 = await rehabPlanConcept.addPlanItem(item1Details);
    console.log("Output:", JSON.stringify(addResult1));
    assertEquals(addResult1, {}, "addPlanItem for first item should succeed.");
    console.log(`Effect: Item "${TEST_EXERCISE_1}" added to plan "${user1PlanId}".`);

    // Verification: Confirm the state change after `addPlanItem`.
    const planAfterAdd1 = await getPlanState(rehabPlanConcept, user1PlanId);
    assertExists(planAfterAdd1, "Plan should still exist.");
    assertEquals(planAfterAdd1.items.length, 1, "Plan should have 1 item after first addition.");
    assertEquals(planAfterAdd1.items[0].exercise, TEST_EXERCISE_1, "First item's exercise should be correct.");
    assertEquals(planAfterAdd1.items[0].perWeek, 3, "First item's perWeek should be correct.");
    console.log(`Verification: Plan "${user1PlanId}" now contains item for "${TEST_EXERCISE_1}".`);

    // Action 3: Add a second plan item to the same plan.
    // Demonstrates adding multiple items and further confirms `addPlanItem` effects.
    const item2Details = {
      plan: user1PlanId,
      exercise: TEST_EXERCISE_2,
      perWeek: 2,
      sets: 4,
      reps: 8,
      notes: "Main lift for legs",
    };
    console.log(`Action: addPlanItem(${JSON.stringify(item2Details)})`);
    const addResult2 = await rehabPlanConcept.addPlanItem(item2Details);
    console.log("Output:", JSON.stringify(addResult2));
    assertEquals(addResult2, {}, "addPlanItem for second item should succeed.");
    console.log(`Effect: Item "${TEST_EXERCISE_2}" added to plan "${user1PlanId}".`);

    // Verification: Confirm the state change after the second `addPlanItem`.
    const planAfterAdd2 = await getPlanState(rehabPlanConcept, user1PlanId);
    assertExists(planAfterAdd2, "Plan should still exist.");
    assertEquals(planAfterAdd2.items.length, 2, "Plan should have 2 items after second addition.");
    assertEquals(planAfterAdd2.items[1].exercise, TEST_EXERCISE_2, "Second item's exercise should be correct.");
    assertEquals(planAfterAdd2.items[1].perWeek, 2, "Second item's perWeek should be correct.");
    console.log(`Verification: Plan "${user1PlanId}" now contains item for "${TEST_EXERCISE_2}".`);

    console.log("\n--- Principle Trace Completed ---");
  });

  // Scenario 1: `createPlan` - Covering requirements and effects, including failure cases.
  await t.step("Scenario: createPlan - requirements and effects", async (st) => {
    console.log("\n--- Scenario: createPlan - requirements and effects ---");
    let user2PlanId: Plan;

    // 1. Successful creation for a new user (TEST_USER_2)
    await st.step("1. Successful creation for a new user", async () => {
      console.log(`Action: createPlan({ owner: "${TEST_USER_2}" })`);
      const result = await rehabPlanConcept.createPlan({ owner: TEST_USER_2 });
      console.log("Output:", JSON.stringify(result));
      assertExists(result, "createPlan should return a result.");
      if ("error" in result) {
        throw new Error(`Failed to create plan: ${result.error}`);
      }
      user2PlanId = result.plan;
      console.log(`Effect: Plan created with ID: ${user2PlanId}`);

      const createdPlan = await getPlanState(rehabPlanConcept, user2PlanId);
      assertExists(createdPlan, "Plan document should exist.");
      assertEquals(createdPlan.owner, TEST_USER_2, "Plan owner should be TEST_USER_2.");
      assertEquals(createdPlan.archived, false, "Plan should be active (not archived).");
      assertEquals(createdPlan.items.length, 0, "Plan should have no items initially.");
      console.log("Verification: Plan successfully created with correct initial state.");
    });

    // 2. Failure: Attempt to create a plan when the owner already has an active (non-archived) plan.
    // This tests the `requires` condition: "owner exists and has no active (non-archived) plan".
    await st.step("2. Failure: createPlan when owner already has an active plan", async () => {
      console.log(`Action: createPlan({ owner: "${TEST_USER_2}" }) (attempting to create a second active plan for same user)`);
      const result = await rehabPlanConcept.createPlan({ owner: TEST_USER_2 });
      console.log("Output:", JSON.stringify(result));
      assertExists(result, "createPlan should return a result.");
      if (!("error" in result)) {
        throw new Error("createPlan was expected to return an error but succeeded for an owner with an active plan.");
      }
      assertEquals(result.error, `Owner ${TEST_USER_2} already has an active rehab plan.`, "Error message should indicate existing active plan.");
      console.log(`Requirement Check: Correctly failed because ${TEST_USER_2} already has an active plan.`);

      // Verification: Ensure no *new* plan was created and the existing plan remains unchanged.
      const plansForUser2 = await rehabPlanConcept.plans.find({ owner: TEST_USER_2 }).toArray();
      assertEquals(plansForUser2.length, 1, "Only one plan should exist for TEST_USER_2.");
      assertEquals(plansForUser2[0]._id, user2PlanId, "The existing plan should be the original one.");
      console.log("Effect Verification: No new plan was created for TEST_USER_2.");
    });
    console.log("--- Scenario: createPlan completed ---");
  });

  // Scenario 2: `addPlanItem` - Covering requirements and effects, including failure cases.
  await t.step("Scenario: addPlanItem - requirements and effects", async (st) => {
    console.log("\n--- Scenario: addPlanItem - requirements and effects ---");
    let planIdForAddItem: Plan;

    // Setup: Create a plan for `addPlanItem` tests.
    await st.step("Setup: Create a plan for testing addPlanItem", async () => {
      const createResult = await rehabPlanConcept.createPlan({ owner: TEST_USER_3 });
      if ("error" in createResult) throw new Error(`Setup failed: ${createResult.error}`);
      planIdForAddItem = createResult.plan;
      console.log(`Setup: Created plan ${planIdForAddItem} for "${TEST_USER_3}".`);
    });

    // 1. Successful addition of a new plan item.
    await st.step("1. Successful addition of a new plan item (TEST_EXERCISE_1)", async () => {
      const itemDetails = {
        plan: planIdForAddItem,
        exercise: TEST_EXERCISE_1,
        perWeek: 1, sets: 1, reps: 1, notes: "First item",
      };
      console.log(`Action: addPlanItem(${JSON.stringify(itemDetails)})`);
      const result = await rehabPlanConcept.addPlanItem(itemDetails);
      console.log("Output:", JSON.stringify(result));
      assertEquals(result, {}, "addPlanItem should succeed.");
      console.log(`Effect: Item "${TEST_EXERCISE_1}" added to plan "${planIdForAddItem}".`);

      const updatedPlan = await getPlanState(rehabPlanConcept, planIdForAddItem);
      assertExists(updatedPlan, "Plan should still exist.");
      assertEquals(updatedPlan.items.length, 1, "Plan should have 1 item.");
      assertEquals(updatedPlan.items[0].exercise, TEST_EXERCISE_1, "The added item's exercise ID should be correct.");
      console.log("Verification: Item successfully added and state updated.");
    });

    // 2. Failure: Attempt to add a plan item to a non-existent plan.
    // This tests the `requires` condition: "plan exists".
    await st.step("2. Failure: addPlanItem to a non-existent plan", async () => {
      const itemDetails = {
        plan: TEST_PLAN_NON_EXISTENT,
        exercise: TEST_EXERCISE_2,
        perWeek: 5, sets: 5, reps: 5, notes: "No plan",
      };
      console.log(`Action: addPlanItem(${JSON.stringify(itemDetails)})`);
      const result = await rehabPlanConcept.addPlanItem(itemDetails);
      console.log("Output:", JSON.stringify(result));
      assertExists(result, "addPlanItem should return a result.");
      if (!("error" in result)) {
        throw new Error("addPlanItem was expected to return an error but succeeded for a non-existent plan.");
      }
      assertEquals(result.error, `Plan ${TEST_PLAN_NON_EXISTENT} not found.`, "Error message should indicate plan not found.");
      console.log(`Requirement Check: Correctly failed because plan "${TEST_PLAN_NON_EXISTENT}" does not exist.`);
    });

    // 3. Failure: Attempt to add an exercise that already exists in the plan.
    // This tests the internal logic that prevents duplicate exercises within a plan.
    await st.step("3. Failure: addPlanItem with an exercise already in the plan", async () => {
      const itemDetails = {
        plan: planIdForAddItem,
        exercise: TEST_EXERCISE_1, // This exercise already exists in the plan
        perWeek: 1, sets: 1, reps: 1, notes: "Duplicate",
      };
      console.log(`Action: addPlanItem(${JSON.stringify(itemDetails)}) (attempting to add duplicate exercise)`);
      const result = await rehabPlanConcept.addPlanItem(itemDetails);
      console.log("Output:", JSON.stringify(result));
      assertExists(result, "addPlanItem should return a result.");
      if (!("error" in result)) {
        throw new Error("addPlanItem was expected to return an error but succeeded for a duplicate exercise.");
      }
      assertEquals(result.error, `Plan ${planIdForAddItem} already contains an item for exercise ${TEST_EXERCISE_1}.`, "Error message should indicate duplicate exercise.");
      console.log(`Requirement Check: Correctly failed because exercise "${TEST_EXERCISE_1}" is already in the plan.`);

      // Verification: Ensure the plan's items array remains unchanged.
      const updatedPlan = await getPlanState(rehabPlanConcept, planIdForAddItem);
      assertEquals(updatedPlan?.items.length, 1, "Plan items array should remain unchanged.");
      console.log("Effect Verification: No new item was added to the plan.");
    });

    // 4. Add another unique item to ensure multiple items work.
    await st.step("4. Add another unique item to ensure multiple items work (TEST_EXERCISE_3)", async () => {
      const itemDetails = {
        plan: planIdForAddItem,
        exercise: TEST_EXERCISE_3,
        perWeek: 4, sets: 4, reps: 12, notes: "New unique item",
      };
      console.log(`Action: addPlanItem(${JSON.stringify(itemDetails)})`);
      const result = await rehabPlanConcept.addPlanItem(itemDetails);
      console.log("Output:", JSON.stringify(result));
      assertEquals(result, {}, "addPlanItem for unique exercise should succeed.");

      const updatedPlan = await getPlanState(rehabPlanConcept, planIdForAddItem);
      assertEquals(updatedPlan?.items.length, 2, "Plan should now have 2 items.");
      assertExists(updatedPlan?.items.find(item => item.exercise === TEST_EXERCISE_3), "New item should be present.");
      console.log("Verification: Another unique item successfully added.");
    });
    console.log("--- Scenario: addPlanItem completed ---");
  });

  // Scenario 3: `removePlanItem` - Covering requirements and effects, including failure cases.
  await t.step("Scenario: removePlanItem - requirements and effects", async (st) => {
    console.log("\n--- Scenario: removePlanItem - requirements and effects ---");
    let planIdForRemoveItem: Plan;

    // Setup: Create a plan with multiple items for `removePlanItem` tests.
    await st.step("Setup: Create a plan with multiple items for testing removePlanItem", async () => {
      const createResult = await rehabPlanConcept.createPlan({ owner: "removeItemUser" as User });
      if ("error" in createResult) throw new Error(`Setup failed: ${createResult.error}`);
      planIdForRemoveItem = createResult.plan;
      await rehabPlanConcept.addPlanItem({ plan: planIdForRemoveItem, exercise: TEST_EXERCISE_1, perWeek: 1, sets: 1, reps: 1, notes: "Item to remove" });
      await rehabPlanConcept.addPlanItem({ plan: planIdForRemoveItem, exercise: TEST_EXERCISE_2, perWeek: 2, sets: 2, reps: 2, notes: "Item to keep" });
      console.log(`Setup: Created plan ${planIdForRemoveItem} with items ${TEST_EXERCISE_1} and ${TEST_EXERCISE_2}.`);
      const initialPlan = await getPlanState(rehabPlanConcept, planIdForRemoveItem);
      assertEquals(initialPlan?.items.length, 2, "Setup: Plan should have 2 items.");
    });

    // 1. Successful removal of an existing plan item.
    await st.step("1. Successful removal of an existing plan item (TEST_EXERCISE_1)", async () => {
      const removeDetails = { plan: planIdForRemoveItem, exercise: TEST_EXERCISE_1 };
      console.log(`Action: removePlanItem(${JSON.stringify(removeDetails)})`);
      const result = await rehabPlanConcept.removePlanItem(removeDetails);
      console.log("Output:", JSON.stringify(result));
      assertEquals(result, {}, "removePlanItem should succeed.");
      console.log(`Effect: Item "${TEST_EXERCISE_1}" removed from plan "${planIdForRemoveItem}".`);

      const updatedPlan = await getPlanState(rehabPlanConcept, planIdForRemoveItem);
      assertExists(updatedPlan, "Plan should still exist.");
      assertEquals(updatedPlan.items.length, 1, "Plan should have 1 item after removal.");
      assertEquals(updatedPlan.items[0].exercise, TEST_EXERCISE_2, "Remaining item should be TEST_EXERCISE_2.");
      console.log("Verification: Item successfully removed and state updated.");
    });

    // 2. Failure: Attempt to remove a plan item from a non-existent plan.
    // This tests the `requires` condition: "plan exists".
    await st.step("2. Failure: removePlanItem from a non-existent plan", async () => {
      const removeDetails = { plan: TEST_PLAN_NON_EXISTENT, exercise: TEST_EXERCISE_1 };
      console.log(`Action: removePlanItem(${JSON.stringify(removeDetails)})`);
      const result = await rehabPlanConcept.removePlanItem(removeDetails);
      console.log("Output:", JSON.stringify(result));
      assertExists(result, "removePlanItem should return a result.");
      if (!("error" in result)) {
        throw new Error("removePlanItem was expected to return an error but succeeded for a non-existent plan.");
      }
      assertEquals(result.error, `Plan ${TEST_PLAN_NON_EXISTENT} not found.`, "Error message should indicate plan not found.");
      console.log(`Requirement Check: Correctly failed because plan "${TEST_PLAN_NON_EXISTENT}" does not exist.`);
    });

    // 3. Failure: Attempt to remove a non-existent exercise from an existing plan.
    // This tests the `requires` condition: "an item for exercise exists".
    await st.step("3. Failure: removePlanItem with a non-existent exercise in an existing plan", async () => {
      const removeDetails = { plan: planIdForRemoveItem, exercise: TEST_EXERCISE_NON_EXISTENT };
      console.log(`Action: removePlanItem(${JSON.stringify(removeDetails)})`);
      const result = await rehabPlanConcept.removePlanItem(removeDetails);
      console.log("Output:", JSON.stringify(result));
      assertExists(result, "removePlanItem should return a result.");
      if (!("error" in result)) {
        throw new Error("removePlanItem was expected to return an error but succeeded for a non-existent exercise.");
      }
      assertEquals(result.error, `Exercise ${TEST_EXERCISE_NON_EXISTENT} not found in plan ${planIdForRemoveItem}.`, "Error message should indicate exercise not found in plan.");
      console.log(`Requirement Check: Correctly failed because exercise "${TEST_EXERCISE_NON_EXISTENT}" is not in the plan.`);

      // Verification: Ensure the plan's items array remains unchanged.
      const updatedPlan = await getPlanState(rehabPlanConcept, planIdForRemoveItem);
      assertEquals(updatedPlan?.items.length, 1, "Plan items array should remain unchanged.");
      console.log("Effect Verification: No item was removed from the plan.");
    });
    console.log("--- Scenario: removePlanItem completed ---");
  });

  // Scenario 4: `archivePlan` - Covering requirements and effects, including idempotency and failure cases.
  await t.step("Scenario: archivePlan - requirements and effects", async (st) => {
    console.log("\n--- Scenario: archivePlan - requirements and effects ---");
    let planIdForArchive: Plan;

    // Setup: Create a plan for `archivePlan` tests.
    await st.step("Setup: Create a plan for testing archivePlan", async () => {
      const createResult = await rehabPlanConcept.createPlan({ owner: TEST_USER_4 });
      if ("error" in createResult) throw new Error(`Setup failed: ${createResult.error}`);
      planIdForArchive = createResult.plan;
      console.log(`Setup: Created plan ${planIdForArchive} for "${TEST_USER_4}".`);
      const initialPlan = await getPlanState(rehabPlanConcept, planIdForArchive);
      assertEquals(initialPlan?.archived, false, "Setup: Plan should initially be active.");
    });

    // 1. Successful archiving of an active plan.
    await st.step("1. Successful archiving of an active plan", async () => {
      const archiveDetails = { plan: planIdForArchive };
      console.log(`Action: archivePlan(${JSON.stringify(archiveDetails)})`);
      const result = await rehabPlanConcept.archivePlan(archiveDetails);
      console.log("Output:", JSON.stringify(result));
      assertEquals(result, {}, "archivePlan should succeed.");
      console.log(`Effect: Plan "${planIdForArchive}" archived.`);

      // Verification: Confirm the 'archived' status has changed to true.
      const archivedPlan = await getPlanState(rehabPlanConcept, planIdForArchive);
      assertExists(archivedPlan, "Plan should still exist.");
      assertEquals(archivedPlan.archived, true, "Plan 'archived' status should be true.");
      console.log("Verification: Plan successfully archived.");
    });

    // 2. Successful (idempotent) archiving of an already archived plan.
    // This demonstrates that calling `archivePlan` on an already archived plan does not cause an error.
    await st.step("2. Successful (idempotent) archiving of an already archived plan", async () => {
      const archiveDetails = { plan: planIdForArchive };
      console.log(`Action: archivePlan(${JSON.stringify(archiveDetails)}) (attempting to archive an already archived plan)`);
      const result = await rehabPlanConcept.archivePlan(archiveDetails);
      console.log("Output:", JSON.stringify(result));
      assertEquals(result, {}, "archivePlan should succeed even if already archived (idempotent).");
      console.log(`Effect: Plan "${planIdForArchive}" remains archived.`);

      // Verification: Confirm the 'archived' status remains true.
      const archivedPlan = await getPlanState(rehabPlanConcept, planIdForArchive);
      assertExists(archivedPlan, "Plan should still exist.");
      assertEquals(archivedPlan.archived, true, "Plan 'archived' status should remain true.");
      console.log("Verification: Plan remains archived, no error.");
    });

    // 3. Failure: Attempt to archive a non-existent plan.
    // This tests the `requires` condition: "plan exists".
    await st.step("3. Failure: archivePlan for a non-existent plan", async () => {
      const archiveDetails = { plan: TEST_PLAN_NON_EXISTENT };
      console.log(`Action: archivePlan(${JSON.stringify(archiveDetails)})`);
      const result = await rehabPlanConcept.archivePlan(archiveDetails);
      console.log("Output:", JSON.stringify(result));
      assertExists(result, "archivePlan should return a result.");
      if (!("error" in result)) {
        throw new Error("archivePlan was expected to return an error but succeeded for a non-existent plan.");
      }
      assertEquals(result.error, `Plan ${TEST_PLAN_NON_EXISTENT} not found.`, "Error message should indicate plan not found.");
      console.log(`Requirement Check: Correctly failed because plan "${TEST_PLAN_NON_EXISTENT}" does not exist.`);
    });
    console.log("--- Scenario: archivePlan completed ---");
  });

  // Clean up database connection after all tests are done.
  await client.close();
});
```
