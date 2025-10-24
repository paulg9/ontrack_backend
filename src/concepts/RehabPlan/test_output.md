running 1 test from ./src/concepts/RehabPlan/RehabPlanConcept.test.ts
RehabPlan Concept Testing ...
  Principle: An athlete creates a plan and adds items ...
------- output -------

--- Principle Trace: Creating and Populating a Rehab Plan ---
Action: createPlan({ owner: "user1" })
[RehabPlanConcept] Created plan for owner user1 with ID 019a141b-ad93-703d-bff8-20de4cb17350
Output: {"plan":"019a141b-ad93-703d-bff8-20de4cb17350"}
Effect: Plan created with ID: 019a141b-ad93-703d-bff8-20de4cb17350
Verification: New plan exists for user1, is not archived, and has no items.
Action: addPlanItem({"plan":"019a141b-ad93-703d-bff8-20de4cb17350","exercise":"exercise1_squats","perWeek":3,"sets":3,"reps":10,"notes":"Warm-up exercises for shoulders"})
[RehabPlanConcept] Added item exercise1_squats to plan 019a141b-ad93-703d-bff8-20de4cb17350.
Output: {}
Effect: Item "exercise1_squats" added to plan "019a141b-ad93-703d-bff8-20de4cb17350".
Verification: Plan "019a141b-ad93-703d-bff8-20de4cb17350" now contains item for "exercise1_squats".
Action: addPlanItem({"plan":"019a141b-ad93-703d-bff8-20de4cb17350","exercise":"exercise2_lunges","perWeek":2,"sets":4,"reps":8,"notes":"Main lift for legs"})
[RehabPlanConcept] Added item exercise2_lunges to plan 019a141b-ad93-703d-bff8-20de4cb17350.
Output: {}
Effect: Item "exercise2_lunges" added to plan "019a141b-ad93-703d-bff8-20de4cb17350".
Verification: Plan "019a141b-ad93-703d-bff8-20de4cb17350" now contains item for "exercise2_lunges".

--- Principle Trace Completed ---
----- output end -----
  Principle: An athlete creates a plan and adds items ... ok (202ms)
  Scenario: createPlan - requirements and effects ...
------- output -------

--- Scenario: createPlan - requirements and effects ---
----- output end -----
    1. Successful creation for a new user ...
------- output -------
Action: createPlan({ owner: "user2" })
[RehabPlanConcept] Created plan for owner user2 with ID 019a141b-ae57-72be-9950-1d65f14d4912
Output: {"plan":"019a141b-ae57-72be-9950-1d65f14d4912"}
Effect: Plan created with ID: 019a141b-ae57-72be-9950-1d65f14d4912
Verification: Plan successfully created with correct initial state.
----- output end -----
    1. Successful creation for a new user ... ok (51ms)
    2. Failure: createPlan when owner already has an active plan ...
------- output -------
Action: createPlan({ owner: "user2" }) (attempting to create a second active plan for same user)
[RehabPlanConcept] Owner user2 already has an active plan: 019a141b-ae57-72be-9950-1d65f14d4912
Output: {"error":"Owner user2 already has an active rehab plan."}
Requirement Check: Correctly failed because user2 already has an active plan.
Effect Verification: No new plan was created for TEST_USER_2.
----- output end -----
    2. Failure: createPlan when owner already has an active plan ... ok (32ms)
------- output -------
--- Scenario: createPlan completed ---
----- output end -----
  Scenario: createPlan - requirements and effects ... ok (84ms)
  Scenario: addPlanItem - requirements and effects ...
------- output -------

--- Scenario: addPlanItem - requirements and effects ---
----- output end -----
    Setup: Create a plan for testing addPlanItem ...
------- output -------
[RehabPlanConcept] Created plan for owner user3 with ID 019a141b-aea9-709f-b5d5-16120209b6ae
Setup: Created plan 019a141b-aea9-709f-b5d5-16120209b6ae for "user3".
----- output end -----
    Setup: Create a plan for testing addPlanItem ... ok (34ms)
    1. Successful addition of a new plan item (TEST_EXERCISE_1) ...
------- output -------
Action: addPlanItem({"plan":"019a141b-aea9-709f-b5d5-16120209b6ae","exercise":"exercise1_squats","perWeek":1,"sets":1,"reps":1,"notes":"First item"})
[RehabPlanConcept] Added item exercise1_squats to plan 019a141b-aea9-709f-b5d5-16120209b6ae.
Output: {}
Effect: Item "exercise1_squats" added to plan "019a141b-aea9-709f-b5d5-16120209b6ae".
Verification: Item successfully added and state updated.
----- output end -----
    1. Successful addition of a new plan item (TEST_EXERCISE_1) ... ok (49ms)
    2. Failure: addPlanItem to a non-existent plan ...
------- output -------
Action: addPlanItem({"plan":"nonExistentPlan","exercise":"exercise2_lunges","perWeek":5,"sets":5,"reps":5,"notes":"No plan"})
[RehabPlanConcept] Plan nonExistentPlan not found.
Output: {"error":"Plan nonExistentPlan not found."}
Requirement Check: Correctly failed because plan "nonExistentPlan" does not exist.
----- output end -----
    2. Failure: addPlanItem to a non-existent plan ... ok (16ms)
    3. Failure: addPlanItem with an exercise already in the plan ...
------- output -------
Action: addPlanItem({"plan":"019a141b-aea9-709f-b5d5-16120209b6ae","exercise":"exercise1_squats","perWeek":1,"sets":1,"reps":1,"notes":"Duplicate"}) (attempting to add duplicate exercise)
[RehabPlanConcept] Plan 019a141b-aea9-709f-b5d5-16120209b6ae already contains an item for exercise exercise1_squats.
Output: {"error":"Plan 019a141b-aea9-709f-b5d5-16120209b6ae already contains an item for exercise exercise1_squats."}
Requirement Check: Correctly failed because exercise "exercise1_squats" is already in the plan.
Effect Verification: No new item was added to the plan.
----- output end -----
    3. Failure: addPlanItem with an exercise already in the plan ... ok (32ms)
    4. Add another unique item to ensure multiple items work (TEST_EXERCISE_3) ...
------- output -------
Action: addPlanItem({"plan":"019a141b-aea9-709f-b5d5-16120209b6ae","exercise":"exercise3_pushups","perWeek":4,"sets":4,"reps":12,"notes":"New unique item"})
[RehabPlanConcept] Added item exercise3_pushups to plan 019a141b-aea9-709f-b5d5-16120209b6ae.
Output: {}
Verification: Another unique item successfully added.
----- output end -----
    4. Add another unique item to ensure multiple items work (TEST_EXERCISE_3) ... ok (51ms)
------- output -------
--- Scenario: addPlanItem completed ---
----- output end -----
  Scenario: addPlanItem - requirements and effects ... ok (183ms)
  Scenario: removePlanItem - requirements and effects ...
------- output -------

--- Scenario: removePlanItem - requirements and effects ---
----- output end -----
    Setup: Create a plan with multiple items for testing removePlanItem ...
------- output -------
[RehabPlanConcept] Created plan for owner removeItemUser with ID 019a141b-af61-720b-9f2c-21dcbd1061f1
[RehabPlanConcept] Added item exercise1_squats to plan 019a141b-af61-720b-9f2c-21dcbd1061f1.
[RehabPlanConcept] Added item exercise2_lunges to plan 019a141b-af61-720b-9f2c-21dcbd1061f1.
Setup: Created plan 019a141b-af61-720b-9f2c-21dcbd1061f1 with items exercise1_squats and exercise2_lunges.
----- output end -----
    Setup: Create a plan with multiple items for testing removePlanItem ... ok (118ms)
    1. Successful removal of an existing plan item (TEST_EXERCISE_1) ...
------- output -------
Action: removePlanItem({"plan":"019a141b-af61-720b-9f2c-21dcbd1061f1","exercise":"exercise1_squats"})
[RehabPlanConcept] Removed item exercise1_squats from plan 019a141b-af61-720b-9f2c-21dcbd1061f1.
Output: {}
Effect: Item "exercise1_squats" removed from plan "019a141b-af61-720b-9f2c-21dcbd1061f1".
Verification: Item successfully removed and state updated.
----- output end -----
    1. Successful removal of an existing plan item (TEST_EXERCISE_1) ... ok (50ms)
    2. Failure: removePlanItem from a non-existent plan ...
------- output -------
Action: removePlanItem({"plan":"nonExistentPlan","exercise":"exercise1_squats"})
[RehabPlanConcept] Plan nonExistentPlan not found for removal of item exercise1_squats.
Output: {"error":"Plan nonExistentPlan not found."}
Requirement Check: Correctly failed because plan "nonExistentPlan" does not exist.
----- output end -----
    2. Failure: removePlanItem from a non-existent plan ... ok (17ms)
    3. Failure: removePlanItem with a non-existent exercise in an existing plan ...
------- output -------
Action: removePlanItem({"plan":"019a141b-af61-720b-9f2c-21dcbd1061f1","exercise":"nonExistentExercise"})
[RehabPlanConcept] Plan 019a141b-af61-720b-9f2c-21dcbd1061f1 does not contain an item for exercise nonExistentExercise.
Output: {"error":"Exercise nonExistentExercise not found in plan 019a141b-af61-720b-9f2c-21dcbd1061f1."}
Requirement Check: Correctly failed because exercise "nonExistentExercise" is not in the plan.
Effect Verification: No item was removed from the plan.
----- output end -----
    3. Failure: removePlanItem with a non-existent exercise in an existing plan ... ok (38ms)
------- output -------
--- Scenario: removePlanItem completed ---
----- output end -----
  Scenario: removePlanItem - requirements and effects ... ok (224ms)
  Scenario: archivePlan - requirements and effects ...
------- output -------

--- Scenario: archivePlan - requirements and effects ---
----- output end -----
    Setup: Create a plan for testing archivePlan ...
------- output -------
[RehabPlanConcept] Created plan for owner user4 with ID 019a141b-b043-7823-a66c-f8c9f159455e
Setup: Created plan 019a141b-b043-7823-a66c-f8c9f159455e for "user4".
----- output end -----
    Setup: Create a plan for testing archivePlan ... ok (51ms)
    1. Successful archiving of an active plan ...
------- output -------
Action: archivePlan({"plan":"019a141b-b043-7823-a66c-f8c9f159455e"})
[RehabPlanConcept] Archived plan 019a141b-b043-7823-a66c-f8c9f159455e.
Output: {}
Effect: Plan "019a141b-b043-7823-a66c-f8c9f159455e" archived.
Verification: Plan successfully archived.
----- output end -----
    1. Successful archiving of an active plan ... ok (50ms)
    2. Successful (idempotent) archiving of an already archived plan ...
------- output -------
Action: archivePlan({"plan":"019a141b-b043-7823-a66c-f8c9f159455e"}) (attempting to archive an already archived plan)
[RehabPlanConcept] Plan 019a141b-b043-7823-a66c-f8c9f159455e was already archived. Archive operation completed successfully.
[RehabPlanConcept] Archived plan 019a141b-b043-7823-a66c-f8c9f159455e.
Output: {}
Effect: Plan "019a141b-b043-7823-a66c-f8c9f159455e" remains archived.
Verification: Plan remains archived, no error.
----- output end -----
    2. Successful (idempotent) archiving of an already archived plan ... ok (48ms)
    3. Failure: archivePlan for a non-existent plan ...
------- output -------
Action: archivePlan({"plan":"nonExistentPlan"})
[RehabPlanConcept] Plan nonExistentPlan not found for archiving.
Output: {"error":"Plan nonExistentPlan not found."}
Requirement Check: Correctly failed because plan "nonExistentPlan" does not exist.
----- output end -----
    3. Failure: archivePlan for a non-existent plan ... ok (16ms)
------- output -------
--- Scenario: archivePlan completed ---
----- output end -----
  Scenario: archivePlan - requirements and effects ... ok (166ms)
RehabPlan Concept Testing ... ok (1s)

ok | 1 passed (20 steps) | 0 failed (1s)


