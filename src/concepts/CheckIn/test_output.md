Check file:///Users/paul/ontrack_backend/src/concepts/CheckIn/CheckInConcept.test.ts
Check file:///Users/paul/ontrack_backend/src/concepts/ExerciseLibrary/ExerciseLibraryConcept.test.ts
Check file:///Users/paul/ontrack_backend/src/concepts/Feedback/FeedbackConcept.test.ts
Check file:///Users/paul/ontrack_backend/src/concepts/LikertSurvey/LikertSurveyConcept.test.ts
Check file:///Users/paul/ontrack_backend/src/concepts/RehabPlan/RehabPlanConcept.test.ts
Check file:///Users/paul/ontrack_backend/src/concepts/User/UserConcept.test.ts
running 1 test from ./src/concepts/CheckIn/CheckInConcept.test.ts
CheckIn Concept Testing ...
  trace: Principle fulfillment - Athlete records daily activities ...
------- output -------

--- Principle Trace: Athlete records daily check-in ---
  Action: submit for 019a0fcf-222c-7278-8470-037ae3886fa8 on 2023-10-27
    Input: { owner: 019a0fcf-222c-7278-8470-037ae3886fa8, date: "2023-10-27", completedItems: [019a0fcf-222c-7382-848a-ab4b4227f3ed], strain_0_10: 7, pain_0_10: 2, comment: "Felt great after workout, mild knee pain." }
    Result: Check-in created successfully with ID: 019a0fcf-223f-7bed-808a-a9b9ff3433fc
    Verification: Check-in state matches submitted data.

  Action: amend check-in 019a0fcf-223f-7bed-808a-a9b9ff3433fc
    Input: { completedItems: [019a0fcf-222c-7382-848a-ab4b4227f3ed, 019a0fcf-222c-7c56-91b3-2c10077d5e43], strain_0_10: 5, comment: "Actually, knee felt fine. Added another item." }
    Result: Check-in amended successfully.
    Verification: Check-in state reflects amendments, other fields unchanged.

  Principle trace completed: A user successfully recorded and amended their daily check-in.
----- output end -----
  trace: Principle fulfillment - Athlete records daily activities ... ok (134ms)
  submit Action: Successful submissions (Effects) ...
    Should create a check-in with minimal fields ...
------- output -------

--- submit Action: Successful minimal submission ---
  Effect: Check-in created with minimal fields (019a0fcf-22c4-713d-a182-b44057b3ec59) and state confirmed.
----- output end -----
    Should create a check-in with minimal fields ... ok (51ms)
    Should create a check-in with all fields including comment and completed items ...
------- output -------

--- submit Action: Successful full submission ---
  Effect: Check-in created with all fields (019a0fcf-22f7-7a3b-9dd6-81aa7733160f) and state confirmed.
----- output end -----
    Should create a check-in with all fields including comment and completed items ... ok (51ms)
    Should handle duplicate completed items (store as set) ...
------- output -------

--- submit Action: Handles duplicate completed items ---
  Effect: Check-in created, duplicate completed items removed, state confirmed. Items: [019a0fcf-222c-7382-848a-ab4b4227f3ed, 019a0fcf-222c-7c56-91b3-2c10077d5e43]
----- output end -----
    Should handle duplicate completed items (store as set) ... ok (52ms)
    Should allow boundary values (0 and 10) for strain/pain ...
------- output -------

--- submit Action: Boundary values for strain/pain ---
  Effect: Boundary values accepted and persisted correctly.
----- output end -----
    Should allow boundary values (0 and 10) for strain/pain ... ok (109ms)
  submit Action: Successful submissions (Effects) ... ok (266ms)
  submit Action: Requirements validation (Failures) ...
    Should reject if check-in already exists for owner and date ...
------- output -------

--- submit Action: Requires no check-in exists for (owner, date) (failure) ---
  Pre-condition: A check-in was successfully submitted for 019a0fcf-222c-7278-8470-037ae3886fa8 on 2023-11-04.
  Requirement: 'no check-in exists for (owner, date)' failed as expected: A check-in for owner 019a0fcf-222c-7278-8470-037ae3886fa8 on date 2023-11-04 already exists.
----- output end -----
    Should reject if check-in already exists for owner and date ... ok (52ms)
    Should reject if strain_0_10 is out of range (<0) ...
------- output -------

--- submit Action: Requires strain_0_10 within 0-10 (failure: too low) ---
  Requirement: Strain range validation failed as expected: Strain must be between 0 and 10.
----- output end -----
    Should reject if strain_0_10 is out of range (<0) ... ok (0ms)
    Should reject if pain_0_10 is out of range (>10) ...
------- output -------

--- submit Action: Requires pain_0_10 within 0-10 (failure: too high) ---
  Requirement: Pain range validation failed as expected: Pain must be between 0 and 10.
----- output end -----
    Should reject if pain_0_10 is out of range (>10) ... ok (1ms)
    Should reject if date format is invalid ...
------- output -------

--- submit Action: Requires date format YYYY-MM-DD (failure) ---
  Requirement: Date format validation failed as expected: Invalid date format. Expected YYYY-MM-DD.
----- output end -----
    Should reject if date format is invalid ... ok (0ms)
  submit Action: Requirements validation (Failures) ... ok (55ms)
  amend Action: Successful amendments (Effects) ...
------- output -------

  Pre-condition: Check-in 019a0fcf-2407-75f6-a190-31ba36727acd created for amendment tests.
----- output end -----
    Should amend a single field (comment) ...
------- output -------

--- amend Action: Successful single field amendment (comment) ---
  Effect: Comment updated, other fields unchanged, state confirmed.
----- output end -----
    Should amend a single field (comment) ... ok (51ms)
    Should amend a single field (strain_0_10) ...
------- output -------

--- amend Action: Successful single field amendment (strain) ---
  Effect: Strain updated, other fields unchanged, state confirmed.
----- output end -----
    Should amend a single field (strain_0_10) ... ok (51ms)
    Should amend a single field (pain_0_10) ...
------- output -------

--- amend Action: Successful single field amendment (pain) ---
  Effect: Pain updated, other fields unchanged, state confirmed.
----- output end -----
    Should amend a single field (pain_0_10) ... ok (51ms)
    Should amend completed items (add and remove) ...
------- output -------

--- amend Action: Successful amendment of completed items ---
  Effect: Completed items updated, state confirmed.
----- output end -----
    Should amend completed items (add and remove) ... ok (50ms)
    Should deduplicate completed items on amend ...
------- output -------

--- amend Action: Deduplicate completed items ---
  Effect: Duplicate items removed on amend, state confirmed.
----- output end -----
    Should deduplicate completed items on amend ... ok (56ms)
    Should amend multiple fields at once ...
------- output -------

--- amend Action: Successful multiple fields amendment ---
  Effect: Multiple fields updated, state confirmed.
----- output end -----
    Should amend multiple fields at once ... ok (55ms)
    Should allow clearing an optional field (comment to empty string) ...
------- output -------

--- amend Action: Clear optional field (comment) ---
  Effect: Comment field cleared (set to undefined), state confirmed.
----- output end -----
    Should allow clearing an optional field (comment to empty string) ... ok (54ms)
    Should allow clearing completed items to empty array ...
------- output -------

--- amend Action: Clear completed items to empty array ---
  Effect: Completed items cleared to empty array, state confirmed.
----- output end -----
    Should allow clearing completed items to empty array ... ok (55ms)
    Should be a no-op if no fields are provided ...
------- output -------

--- amend Action: No-op amendment ---
  Effect: No changes applied, state confirmed unchanged.
----- output end -----
    Should be a no-op if no fields are provided ... ok (51ms)
  amend Action: Successful amendments (Effects) ... ok (516ms)
  amend Action: Requirements validation (Failures) ...
------- output -------

  Pre-condition: Check-in 019a0fcf-260b-7728-9a42-c2599b2f6189 created for amendment requires tests.
----- output end -----
    Should reject if checkin does not exist ...
------- output -------

--- amend Action: Requires checkin exists (failure) ---
  Requirement: 'checkin exists' failed as expected: Check-in with id 019a0fcf-25fb-7ae8-b844-f0dc4d3c438a not found.
----- output end -----
    Should reject if checkin does not exist ... ok (16ms)
    Should reject if amended strain_0_10 is out of range (<0) ...
------- output -------

--- amend Action: Requires strain_0_10 within 0-10 (failure: too low) ---
  Requirement: Strain range validation failed as expected: Strain must be between 0 and 10.
----- output end -----
    Should reject if amended strain_0_10 is out of range (<0) ... ok (28ms)
    Should reject if amended pain_0_10 is out of range (>10) ...
------- output -------

--- amend Action: Requires pain_0_10 within 0-10 (failure: too high) ---
  Requirement: Pain range validation failed as expected: Pain must be between 0 and 10.
----- output end -----
    Should reject if amended pain_0_10 is out of range (>10) ... ok (33ms)
  amend Action: Requirements validation (Failures) ... ok (132ms)
CheckIn Concept Testing ... ok (1s)
running 0 tests from ./src/concepts/ExerciseLibrary/ExerciseLibraryConcept.test.ts
running 0 tests from ./src/concepts/Feedback/FeedbackConcept.test.ts
running 5 tests from ./src/concepts/LikertSurvey/LikertSurveyConcept.test.ts
Principle: Author creates survey, respondent answers, author views results ... ok (970ms)
Action: createSurvey requires scaleMin < scaleMax ... ok (592ms)
Action: addQuestion requires an existing survey ... ok (570ms)
Action: submitResponse requirements are enforced ... ok (909ms)
Action: updateResponse successfully updates a response and enforces requirements ... ok (881ms)
running 0 tests from ./src/concepts/RehabPlan/RehabPlanConcept.test.ts
running 0 tests from ./src/concepts/User/UserConcept.test.ts

ok | 6 passed (25 steps) | 0 failed (5s)

