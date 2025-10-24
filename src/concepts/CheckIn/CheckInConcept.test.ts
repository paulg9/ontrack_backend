
import { assertEquals, assertExists, assertObjectMatch, assertArrayIncludes } from "jsr:@std/assert";
import { testDb, freshID } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import CheckInConcept from "./CheckIn.ts"; // Import the actual concept implementation

Deno.test; // keep Deno import usage

function unwrapCheckinResult(result: { checkin: ID } | { error: string }): ID {
  if ("error" in result) {
    throw new Error(`Expected success, got error: ${result.error}`);
  }
  return result.checkin as ID;
}

Deno.test("CheckIn Concept Testing", async (t) => {
  const [db, client] = await testDb();
  const checkInService = new CheckInConcept(db);

  // Define mock IDs for User and PlanItem
  // As per Concept Independence, CheckInConcept does not manage Users or PlanItems directly.
  // It treats them as opaque IDs. Existence and ownership checks are handled by other concepts or syncs.
  const userAlice = freshID() as ID; // Mock user ID for Alice
  const userBob = freshID() as ID;   // Mock user ID for Bob

  const planItemA = freshID() as ID; // Mock plan item ID
  const planItemB = freshID() as ID; // Another mock plan item ID
  const planItemC = freshID() as ID; // Yet another mock plan item ID

  await t.step("trace: Principle fulfillment - Athlete records daily activities", async () => {
    console.log("\n--- Principle Trace: Athlete records daily check-in ---");

    const today = "2023-10-27";
    const completedItems1 = [planItemA];
    const strain1 = 7;
    const pain1 = 2;
    const comment1 = "Felt great after workout, mild knee pain.";

    console.log(`  Action: submit for ${userAlice} on ${today}`);
    console.log(`    Input: { owner: ${userAlice}, date: "${today}", completedItems: [${completedItems1.join(', ')}], strain_0_10: ${strain1}, pain_0_10: ${pain1}, comment: "${comment1}" }`);
    const submitResult = await checkInService.submit({
      owner: userAlice,
      date: today,
      completedItems: completedItems1,
      strain_0_10: strain1,
      pain_0_10: pain1,
      comment: comment1,
    });
    assertExists((submitResult as any).checkin);
    const checkinId = unwrapCheckinResult(submitResult);
    console.log(`    Result: Check-in created successfully with ID: ${checkinId}`);

    // Verify effects of submit
    const createdCheckIn = (await checkInService._getCheckInById({ checkin: checkinId }))[0];
    assertExists(createdCheckIn, "Check-in should exist in the state after submission.");
    assertObjectMatch(createdCheckIn, {
      _id: checkinId,
      owner: userAlice,
      date: today,
      completedItems: [planItemA],
      strain_0_10: strain1,
      pain_0_10: pain1,
      comment: comment1,
    });
    console.log("    Verification: Check-in state matches submitted data.");

    const updatedComment = "Actually, knee felt fine. Added another item.";
    const updatedStrain = 5;
    const updatedCompletedItems = [planItemA, planItemB];

    console.log(`\n  Action: amend check-in ${checkinId}`);
    console.log(`    Input: { completedItems: [${updatedCompletedItems.join(', ')}], strain_0_10: ${updatedStrain}, comment: "${updatedComment}" }`);
    const amendResult = await checkInService.amend({
      checkin: checkinId,
      completedItems: updatedCompletedItems,
      strain_0_10: updatedStrain,
      // pain_0_10 is intentionally not updated
      comment: updatedComment,
    });
    assertEquals(amendResult, {}, `Expected amendment to succeed, but got error: ${amendResult.error}`);
    console.log("    Result: Check-in amended successfully.");

    // Verify effects of amend
    const amendedCheckIn = (await checkInService._getCheckInById({ checkin: checkinId }))[0];
    assertExists(amendedCheckIn, "Amended check-in should still exist.");
    assertObjectMatch(amendedCheckIn, {
      _id: checkinId,
      owner: userAlice,
      date: today,
      completedItems: [planItemA, planItemB], // Updated
      strain_0_10: updatedStrain, // Updated
      pain_0_10: pain1, // Unchanged from original submit
      comment: updatedComment, // Updated
    });
    console.log("    Verification: Check-in state reflects amendments, other fields unchanged.");

    console.log("\n  Principle trace completed: A user successfully recorded and amended their daily check-in.");
  });

  await t.step("submit Action: Successful submissions (Effects)", async (t_submit_success) => {
    const user = userBob;
    const dateMinimal = "2023-11-01";
    const dateFull = "2023-11-02";
    const dateDuplicates = "2023-11-03";
    const dateBoundary1 = "2023-11-04";
    const dateBoundary2 = "2023-11-05";

    await t_submit_success.step("Should create a check-in with minimal fields", async () => {
      console.log("\n--- submit Action: Successful minimal submission ---");
      const result = await checkInService.submit({
        owner: user,
        date: dateMinimal,
        completedItems: [],
        strain_0_10: 5,
        pain_0_10: 0,
      });

      const createdId = unwrapCheckinResult(result);
      const created = (await checkInService._getCheckInById({ checkin: createdId }))[0];
      assertExists(created);
      assertObjectMatch(created, {
        owner: user,
        date: dateMinimal,
        completedItems: [],
        strain_0_10: 5,
        pain_0_10: 0,
      });
      assertEquals(created.comment, undefined);
      console.log(`  Effect: Check-in created with minimal fields (${createdId}) and state confirmed.`);
    });

    await t_submit_success.step("Should create a check-in with all fields including comment and completed items", async () => {
      console.log("\n--- submit Action: Successful full submission ---");
      const comment = "Feeling strong!";
      const result = await checkInService.submit({
        owner: user,
        date: dateFull,
        completedItems: [planItemB, planItemC],
        strain_0_10: 8,
        pain_0_10: 1,
        comment: comment,
      });

      const createdId = unwrapCheckinResult(result);
      const created = (await checkInService._getCheckInById({ checkin: createdId }))[0];
      assertExists(created);
      assertEquals(created.owner, user);
      assertEquals(created.date, dateFull);
      assertEquals(created.strain_0_10, 8);
      assertEquals(created.pain_0_10, 1);
      assertEquals(created.comment, comment);
      assertEquals(created.completedItems.length, 2);
      assertArrayIncludes(created.completedItems, [planItemB, planItemC]);
      console.log(`  Effect: Check-in created with all fields (${createdId}) and state confirmed.`);
    });

    await t_submit_success.step("Should handle duplicate completed items (store as set)", async () => {
      console.log("\n--- submit Action: Handles duplicate completed items ---");
      const itemsWithDuplicates = [planItemA, planItemB, planItemA]; // itemA duplicated
      const expectedItems = [planItemA, planItemB]; // Expected unique items

      const result = await checkInService.submit({
        owner: user,
        date: dateDuplicates,
        completedItems: itemsWithDuplicates,
        strain_0_10: 6,
        pain_0_10: 0,
      });

      const createdId = unwrapCheckinResult(result);
      const created = (await checkInService._getCheckInById({ checkin: createdId }))[0];
      assertExists(created);
      assertEquals(created.completedItems.length, expectedItems.length, "Expected completed items to be de-duplicated.");
      assertArrayIncludes(created.completedItems, expectedItems, "Expected unique completed items.");
      console.log(`  Effect: Check-in created, duplicate completed items removed, state confirmed. Items: [${created.completedItems.join(', ')}]`);
    });

    await t_submit_success.step("Should allow boundary values (0 and 10) for strain/pain", async () => {
      console.log("\n--- submit Action: Boundary values for strain/pain ---");
      const r1 = await checkInService.submit({ owner: user, date: dateBoundary1, completedItems: [], strain_0_10: 0, pain_0_10: 10 });
      const r1Id = unwrapCheckinResult(r1);
      const c1 = (await checkInService._getCheckInById({ checkin: r1Id }))[0];
      assertExists(c1);
      assertObjectMatch(c1, { owner: user, date: dateBoundary1, strain_0_10: 0, pain_0_10: 10 });

      const r2 = await checkInService.submit({ owner: user, date: dateBoundary2, completedItems: [], strain_0_10: 10, pain_0_10: 0 });
      const r2Id = unwrapCheckinResult(r2);
      const c2 = (await checkInService._getCheckInById({ checkin: r2Id }))[0];
      assertExists(c2);
      assertObjectMatch(c2, { owner: user, date: dateBoundary2, strain_0_10: 10, pain_0_10: 0 });
      console.log("  Effect: Boundary values accepted and persisted correctly.");
    });
  });

  await t.step("submit Action: Requirements validation (Failures)", async (t_submit_requires) => {
    const user = userAlice;
    const uniqueDateForTest = (offset: number) => `2023-11-${String(4 + offset).padStart(2, '0')}`;
    const completedItems = [planItemA];
    const strain = 5;
    const pain = 0;

    await t_submit_requires.step("Should reject if check-in already exists for owner and date", async () => {
      console.log("\n--- submit Action: Requires no check-in exists for (owner, date) (failure) ---");
      const existingDate = uniqueDateForTest(0);
      // First, successfully submit one
      const firstSubmit = await checkInService.submit({ owner: user, date: existingDate, completedItems: [], strain_0_10: strain, pain_0_10: pain });
      unwrapCheckinResult(firstSubmit);
      console.log(`  Pre-condition: A check-in was successfully submitted for ${user} on ${existingDate}.`);

      // Then, attempt to submit another for the same user and date
      const result = await checkInService.submit({ owner: user, date: existingDate, completedItems, strain_0_10: strain, pain_0_10: pain });
      if (!('error' in result)) throw new Error('Expected error on duplicate submit');
      assertObjectMatch(result, { error: `A check-in for owner ${user} on date ${existingDate} already exists.` });
      console.log(`  Requirement: 'no check-in exists for (owner, date)' failed as expected: ${result.error}`);
    });

    await t_submit_requires.step("Should reject if strain_0_10 is out of range (<0)", async () => {
      console.log("\n--- submit Action: Requires strain_0_10 within 0-10 (failure: too low) ---");
      const date = uniqueDateForTest(1);
      const result = await checkInService.submit({ owner: user, date, completedItems, strain_0_10: -1, pain_0_10: pain });
      if (!('error' in result)) throw new Error('Expected error for invalid strain');
      assertObjectMatch(result, { error: `Strain must be between 0 and 10.` });
      console.log(`  Requirement: Strain range validation failed as expected: ${result.error}`);
    });

    await t_submit_requires.step("Should reject if pain_0_10 is out of range (>10)", async () => {
      console.log("\n--- submit Action: Requires pain_0_10 within 0-10 (failure: too high) ---");
      const date = uniqueDateForTest(2);
      const result = await checkInService.submit({ owner: user, date, completedItems, strain_0_10: strain, pain_0_10: 11 });
      if (!('error' in result)) throw new Error('Expected error for invalid pain');
      assertObjectMatch(result, { error: `Pain must be between 0 and 10.` });
      console.log(`  Requirement: Pain range validation failed as expected: ${result.error}`);
    });

    await t_submit_requires.step("Should reject if date format is invalid", async () => {
      console.log("\n--- submit Action: Requires date format YYYY-MM-DD (failure) ---");
      const invalidDate = "2023/11/06";
      const result = await checkInService.submit({ owner: user, date: invalidDate, completedItems, strain_0_10: strain, pain_0_10: pain });
      if (!('error' in result)) throw new Error('Expected error for invalid date');
      assertObjectMatch(result, { error: "Invalid date format. Expected YYYY-MM-DD." });
      console.log(`  Requirement: Date format validation failed as expected: ${result.error}`);
    });

    // NOTE: The requirements "owner exists" and "each completed item belongs to owner’s active plan"
    // are typically handled by synchronization rules or other concepts, not directly by CheckInConcept
    // itself, as per the principle of concept independence. Thus, the current implementation does
    // not directly check these, and we are not writing tests for them within this concept's scope.
  });

  await t.step("amend Action: Successful amendments (Effects)", async (t_amend_success) => {
    const user = userAlice;
    const date = "2023-11-10";
    const initialComment = "Initial thought.";
    const initialCompleted = [planItemA];
    const initialStrain = 5;
    const initialPain = 1;

    // Setup: create a check-in to amend
    const submitResult = await checkInService.submit({
      owner: user,
      date: date,
      completedItems: initialCompleted,
      strain_0_10: initialStrain,
      pain_0_10: initialPain,
      comment: initialComment,
    });
    const checkinId = unwrapCheckinResult(submitResult);
    console.log(`\n  Pre-condition: Check-in ${checkinId} created for amendment tests.`);

    await t_amend_success.step("Should amend a single field (comment)", async () => {
      console.log("\n--- amend Action: Successful single field amendment (comment) ---");
      const newComment = "Revised thought, feeling better.";
      const result = await checkInService.amend({ checkin: checkinId, comment: newComment });
      assertEquals(result, {}, `Expected amend to succeed: ${result.error}`);

      const amendedCheckIn = (await checkInService._getCheckInById({ checkin: checkinId }))[0];
      assertObjectMatch(amendedCheckIn, { comment: newComment, strain_0_10: initialStrain, pain_0_10: initialPain });
      console.log("  Effect: Comment updated, other fields unchanged, state confirmed.");
    });

    await t_amend_success.step("Should amend a single field (strain_0_10)", async () => {
      console.log("\n--- amend Action: Successful single field amendment (strain) ---");
      const newStrain = 8;
      const result = await checkInService.amend({ checkin: checkinId, strain_0_10: newStrain });
      assertEquals(result, {}, `Expected amend to succeed: ${result.error}`);

      const amendedCheckIn = (await checkInService._getCheckInById({ checkin: checkinId }))[0];
      assertObjectMatch(amendedCheckIn, { strain_0_10: newStrain, pain_0_10: initialPain, comment: "Revised thought, feeling better." });
      console.log("  Effect: Strain updated, other fields unchanged, state confirmed.");
    });

    await t_amend_success.step("Should amend a single field (pain_0_10)", async () => {
      console.log("\n--- amend Action: Successful single field amendment (pain) ---");
      const newPain = 0;
      const result = await checkInService.amend({ checkin: checkinId, pain_0_10: newPain });
      assertEquals(result, {}, `Expected amend to succeed: ${result.error}`);

      const amendedCheckIn = (await checkInService._getCheckInById({ checkin: checkinId }))[0];
      assertObjectMatch(amendedCheckIn, { pain_0_10: newPain, strain_0_10: 8, comment: "Revised thought, feeling better." });
      console.log("  Effect: Pain updated, other fields unchanged, state confirmed.");
    });

    await t_amend_success.step("Should amend completed items (add and remove)", async () => {
      console.log("\n--- amend Action: Successful amendment of completed items ---");
      const newCompleted = [planItemB, planItemC]; // Adding C, removing A (from initial list), keeping B
      const result = await checkInService.amend({ checkin: checkinId, completedItems: newCompleted });
      assertEquals(result, {}, `Expected amend to succeed: ${result.error}`);

      const amendedCheckIn = (await checkInService._getCheckInById({ checkin: checkinId }))[0];
      assertEquals(amendedCheckIn.completedItems.length, 2, "Expected 2 completed items.");
      assertArrayIncludes(amendedCheckIn.completedItems, [planItemB, planItemC], "Expected new completed items.");
      console.log("  Effect: Completed items updated, state confirmed.");
    });

    await t_amend_success.step("Should deduplicate completed items on amend", async () => {
      console.log("\n--- amend Action: Deduplicate completed items ---");
      const result = await checkInService.amend({ checkin: checkinId, completedItems: [planItemA, planItemB, planItemA] });
      assertEquals(result, {}, `Expected amend to succeed: ${result.error}`);
      const amended = (await checkInService._getCheckInById({ checkin: checkinId }))[0];
      assertEquals(amended.completedItems.length, 2, "Expected completed items to be de-duplicated to length 2.");
      assertArrayIncludes(amended.completedItems, [planItemA, planItemB]);
      console.log("  Effect: Duplicate items removed on amend, state confirmed.");
    });

    await t_amend_success.step("Should amend multiple fields at once", async () => {
      console.log("\n--- amend Action: Successful multiple fields amendment ---");
      const finalCompleted = [planItemA];
      const finalStrain = 6;
      const finalPain = 3;
      const finalComment = "Final check. Back to basics.";
      const result = await checkInService.amend({
        checkin: checkinId,
        completedItems: finalCompleted,
        strain_0_10: finalStrain,
        pain_0_10: finalPain,
        comment: finalComment,
      });
      assertEquals(result, {}, `Expected amend to succeed: ${result.error}`);

      const amendedCheckIn = (await checkInService._getCheckInById({ checkin: checkinId }))[0];
      assertObjectMatch(amendedCheckIn, {
        completedItems: finalCompleted,
        strain_0_10: finalStrain,
        pain_0_10: finalPain,
        comment: finalComment,
      });
      console.log("  Effect: Multiple fields updated, state confirmed.");
    });

    await t_amend_success.step("Should allow clearing an optional field (comment to empty string)", async () => {
      console.log("\n--- amend Action: Clear optional field (comment) ---");
      const result = await checkInService.amend({ checkin: checkinId, comment: "" });
      assertEquals(result, {}, `Expected amend to succeed: ${result.error}`);

      const amendedCheckIn = (await checkInService._getCheckInById({ checkin: checkinId }))[0];
      assertEquals(amendedCheckIn.comment, undefined, "Expected comment to be cleared.");
      console.log("  Effect: Comment field cleared (set to undefined), state confirmed.");
    });

    await t_amend_success.step("Should allow clearing completed items to empty array", async () => {
      console.log("\n--- amend Action: Clear completed items to empty array ---");
      const result = await checkInService.amend({ checkin: checkinId, completedItems: [] });
      assertEquals(result, {}, `Expected amend to succeed: ${result.error}`);
      const amendedCheckIn = (await checkInService._getCheckInById({ checkin: checkinId }))[0];
      assertEquals(amendedCheckIn.completedItems, []);
      console.log("  Effect: Completed items cleared to empty array, state confirmed.");
    });

    await t_amend_success.step("Should be a no-op if no fields are provided", async () => {
      console.log("\n--- amend Action: No-op amendment ---");
      const currentCheckIn = (await checkInService._getCheckInById({ checkin: checkinId }))[0];
      const result = await checkInService.amend({ checkin: checkinId });
      assertEquals(result, {}, `Expected no-op amend to succeed: ${result.error}`);

      const afterNoOpCheckIn = (await checkInService._getCheckInById({ checkin: checkinId }))[0];
      assertEquals(afterNoOpCheckIn, currentCheckIn, "Expected no changes to the check-in state.");
      console.log("  Effect: No changes applied, state confirmed unchanged.");
    });
  });

  await t.step("amend Action: Requirements validation (Failures)", async (t_amend_requires) => {
    const user = userBob;
    const date = "2023-11-11";
    // const checkinId = freshID() as ID; // This will be the ID of the checkin we create.
    const nonExistentCheckinId = freshID() as ID;

    // Setup: create a check-in to amend for valid cases
    const submitResult = await checkInService.submit({ owner: user, date: date, completedItems: [planItemA], strain_0_10: 5, pain_0_10: 1, comment: "Initial for amend fails" });
    const existingCheckin = (await checkInService._getCheckInByOwnerAndDate({ owner: user, date: date }))[0];
    assertExists(existingCheckin);
    const checkinId = unwrapCheckinResult(submitResult);
    // existingCheckin._id; // Use the actual ID created by submit
    console.log(`\n  Pre-condition: Check-in ${checkinId} created for amendment requires tests.`);


    await t_amend_requires.step("Should reject if checkin does not exist", async () => {
      console.log("\n--- amend Action: Requires checkin exists (failure) ---");
      const result = await checkInService.amend({ checkin: nonExistentCheckinId, strain_0_10: 6 });
      assertEquals(result, { error: `Check-in with id ${nonExistentCheckinId} not found.` });
      console.log(`  Requirement: 'checkin exists' failed as expected: ${result.error}`);
    });

    await t_amend_requires.step("Should reject if amended strain_0_10 is out of range (<0)", async () => {
      console.log("\n--- amend Action: Requires strain_0_10 within 0-10 (failure: too low) ---");
      const result = await checkInService.amend({ checkin: checkinId, strain_0_10: -1 });
      assertEquals(result, { error: `Strain must be between 0 and 10.` });
      console.log(`  Requirement: Strain range validation failed as expected: ${result.error}`);
    });

    await t_amend_requires.step("Should reject if amended pain_0_10 is out of range (>10)", async () => {
      console.log("\n--- amend Action: Requires pain_0_10 within 0-10 (failure: too high) ---");
      const result = await checkInService.amend({ checkin: checkinId, pain_0_10: 11 });
      assertEquals(result, { error: `Pain must be between 0 and 10.` });
      console.log(`  Requirement: Pain range validation failed as expected: ${result.error}`);
    });

    // NOTE: The requirement "completed item belongs to owner’s active plan" is typically handled
    // by synchronization rules or other concepts, not directly by CheckInConcept itself.
    // The `amend` method in the current implementation does not enforce this check.
  });

  await client.close();
});

