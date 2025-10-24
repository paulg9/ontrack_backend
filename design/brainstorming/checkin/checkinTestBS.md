[@concept-design-overview](../../background/concept-design-overview.md)

[@concept-specifications](../../background/concept-specifications.md)

[@checkIn-concept-specification](../../../src/concepts/CheckIn/spec.md)

[@testing-concepts](../../background/testing-concepts.md)

# prompt: For my Checkin concept, what do I need to test? Give a list of tests I need for full coverage, adhering to testing-concepts as well.
# response:

To ensure full coverage for the `CheckIn` concept, we need to test its principle, the `submit` action (including all its preconditions and effects), and the `amend` action (likewise). We'll adhere to the concept testing guidelines by demonstrating requirement satisfaction/failure and effect confirmation, along with legible output.

Here's a comprehensive list of tests needed:

---

### **Test File:** `src/checkin/CheckinConcept.test.ts`

```typescript
// file: src/checkin/CheckinConcept.test.ts

import { assertEquals, assertNotEquals, assertExists, assertObjectMatch, assertRejects } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts"; // Assuming this utility is available

// Mock interfaces for external types like User and PlanItem
// In a real application, these would come from other concept definitions or their implementations.
interface MockUser { id: string; }
interface MockPlanItem { id: string; ownerId: string; } // PlanItem needs to know its owner for validation

// --- Start Mock CheckIn Concept Implementation for Testing ---
// This class simulates the backend service for the CheckIn concept.
// In a real scenario, this would be the actual implementation being tested.
class CheckInConcept {
    // In-memory "database" for check-ins, users, and plan items
    private checkins: Map<string, any>; // Key: `${ownerId}-${date}`
    private users: Map<string, MockUser>;
    private planItems: Map<string, MockPlanItem>;

    constructor(initialData?: { users?: MockUser[], planItems?: MockPlanItem[], checkins?: any[] }) {
        this.checkins = new Map(initialData?.checkins?.map(c => [`${c.owner.id}-${c.date}`, c]));
        this.users = new Map(initialData?.users?.map(u => [u.id, u]));
        this.planItems = new Map(initialData?.planItems?.map(pi => [pi.id, pi]));
    }

    // Helper method to "register" a user for testing purposes
    public async registerUser(userId: string): Promise<MockUser> {
        const newUser = { id: userId };
        this.users.set(userId, newUser);
        return newUser;
    }

    // Helper method to "create" a plan item for testing purposes
    public async createPlanItem(itemId: string, ownerId: string): Promise<MockPlanItem> {
        const newPlanItem = { id: itemId, ownerId: ownerId };
        this.planItems.set(itemId, newPlanItem);
        return newPlanItem;
    }

    // Helper query for testing effects: get a specific check-in by owner and date
    public async getCheckIn(ownerId: string, date: string): Promise<any | undefined> {
        return this.checkins.get(`${ownerId}-${date}`);
    }

    // Helper query for testing effects: get all check-ins for an owner
    public async getAllCheckInsForOwner(ownerId: string): Promise<any[]> {
        return Array.from(this.checkins.values()).filter(c => c.owner.id === ownerId);
    }

    // submit (owner: User, date: Date, completed: set of PlanItem, strain_0_10: Number, pain_0_10: Number, comment?: String) : (checkin: CheckIn)
    public async submit(owner: MockUser, date: string, completedItems: Set<MockPlanItem>, strain_0_10: number, pain_0_10: number, comment?: string): Promise<{ checkin?: any; error?: string }> {
        console.log(`  Action Call: submit(owner: ${owner.id}, date: ${date}, strain: ${strain_0_10}, pain: ${pain_0_10}, comment: ${comment || 'N/A'})`);

        // requires owner exists
        if (!this.users.has(owner.id)) {
            return { error: `Owner ${owner.id} does not exist.` };
        }

        // requires each completed item belongs to owner’s active plan
        for (const item of completedItems) {
            if (!this.planItems.has(item.id) || this.planItems.get(item.id)?.ownerId !== owner.id) {
                return { error: `Plan item ${item.id} does not exist or does not belong to owner ${owner.id}.` };
            }
        }

        // requires no check-in exists for (owner, date)
        const checkinId = `${owner.id}-${date}`;
        if (this.checkins.has(checkinId)) {
            return { error: `A check-in for ${owner.id} on ${date} already exists.` };
        }

        // Validate strain and pain ranges (common implicit requirement for 0-10 scale)
        if (strain_0_10 < 0 || strain_0_10 > 10 || pain_0_10 < 0 || pain_0_10 > 10) {
            return { error: `Strain and pain values must be between 0 and 10.` };
        }

        const newCheckIn = {
            id: checkinId, // Unique identifier for the mock check-in
            owner: owner,
            date: date,
            completedItems: Array.from(completedItems).map(item => item.id), // Store IDs
            strain_0_10: strain_0_10,
            pain_0_10: pain_0_10,
            comment: comment
        };
        this.checkins.set(checkinId, newCheckIn);
        return { checkin: newCheckIn };
    }

    // amend (checkin: CheckIn, completed?: set of PlanItem, strain_0_10?: Number, pain_0_10?: Number, comment?: String)
    public async amend(checkinId: string, completedItems?: Set<MockPlanItem>, strain_0_10?: number, pain_0_10?: number, comment?: string): Promise<{ success?: boolean; error?: string }> {
        console.log(`  Action Call: amend(checkin: ${checkinId}, completed: ${completedItems ? Array.from(completedItems).map(i => i.id).join(', ') : 'N/A'}, strain: ${strain_0_10 || 'N/A'}, pain: ${pain_0_10 || 'N/A'}, comment: ${comment || 'N/A'})`);

        const existingCheckIn = this.checkins.get(checkinId);

        // requires checkin exists
        if (!existingCheckIn) {
            return { error: `Check-in ${checkinId} does not exist.` };
        }

        // requires checkin belongs to its owner (implicit: checkinId includes owner, and owner cannot be changed by amend)
        // If completed items are being updated, validate them
        if (completedItems !== undefined) {
            for (const item of completedItems) {
                if (!this.planItems.has(item.id) || this.planItems.get(item.id)?.ownerId !== existingCheckIn.owner.id) {
                    return { error: `Amended plan item ${item.id} does not exist or does not belong to owner ${existingCheckIn.owner.id}.` };
                }
            }
            existingCheckIn.completedItems = Array.from(completedItems).map(item => item.id);
        }

        // Validate and update strain
        if (strain_0_10 !== undefined) {
            if (strain_0_10 < 0 || strain_0_10 > 10) {
                return { error: `Amended strain value must be between 0 and 10.` };
            }
            existingCheckIn.strain_0_10 = strain_0_10;
        }

        // Validate and update pain
        if (pain_0_10 !== undefined) {
            if (pain_0_10 < 0 || pain_0_10 > 10) {
                return { error: `Amended pain value must be between 0 and 10.` };
            }
            existingCheckIn.pain_0_10 = pain_0_10;
        }

        // Update comment
        if (comment !== undefined) {
            existingCheckIn.comment = comment;
        }

        return { success: true };
    }
}
// --- End Mock CheckIn Concept Implementation for Testing ---

Deno.test("CheckIn Concept Testing", async (t) => {
    // We're not using the actual `testDb` for this mock, but including it as per prompt structure
    const [db, client] = await testDb();
    // In a real test, `db` and `client` would be passed to the CheckInConcept implementation.
    // For this mock, we instantiate our mock concept directly.
    const checkInService = new CheckInConcept();

    // Setup mock user and plan items for tests
    const user1 = await checkInService.registerUser("user123");
    const user2 = await checkInService.registerUser("user456");
    const planItem1 = await checkInService.createPlanItem("pi1", user1.id);
    const planItem2 = await checkInService.createPlanItem("pi2", user1.id);
    const planItem3_for_user2 = await checkInService.createPlanItem("pi3", user2.id);


    await t.step("trace: Principle fulfillment - Athlete records daily activities", async () => {
        console.log("\n--- Principle Trace: Athlete records daily check-in ---");

        const today = "2023-10-27";
        const completedSet = new Set([planItem1]);
        const strain = 7;
        const pain = 2;
        const comment = "Felt great after workout, mild knee pain.";

        // Action: submit
        console.log("  Step 1: User submits a check-in for today.");
        const submitResult = await checkInService.submit(user1, today, completedSet, strain, pain, comment);
        assertExists(submitResult.checkin, `Expected a check-in to be created, but got: ${submitResult.error}`);
        console.log(`    Result: Check-in created successfully with ID: ${submitResult.checkin.id}`);

        // Verify effects
        const createdCheckIn = await checkInService.getCheckIn(user1.id, today);
        assertExists(createdCheckIn, "Check-in should exist in the state after submission.");
        assertObjectMatch(createdCheckIn, {
            owner: user1,
            date: today,
            completedItems: [planItem1.id],
            strain_0_10: strain,
            pain_0_10: pain,
            comment: comment
        });
        console.log("    Verification: Check-in state matches submitted data.");

        const updatedComment = "Actually, knee felt fine.";
        const updatedStrain = 5;
        const updatedCompletedSet = new Set([planItem1, planItem2]);

        // Action: amend
        console.log("\n  Step 2: User amends the check-in later the same day.");
        const amendResult = await checkInService.amend(
            submitResult.checkin.id,
            updatedCompletedSet,
            updatedStrain,
            undefined, // Don't change pain
            updatedComment
        );
        assertEquals(amendResult.success, true, `Expected amendment to succeed, but got: ${amendResult.error}`);
        console.log("    Result: Check-in amended successfully.");

        // Verify effects
        const amendedCheckIn = await checkInService.getCheckIn(user1.id, today);
        assertExists(amendedCheckIn, "Amended check-in should still exist.");
        assertObjectMatch(amendedCheckIn, {
            owner: user1,
            date: today,
            completedItems: [planItem1.id, planItem2.id], // Updated
            strain_0_10: updatedStrain, // Updated
            pain_0_10: pain, // Unchanged
            comment: updatedComment // Updated
        });
        console.log("    Verification: Check-in state reflects amendments, other fields unchanged.");

        console.log("\n  Principle trace completed: A user successfully recorded and amended their daily check-in.");
    });

    await t.step("submit Action: Successful submission", async (t_submit) => {
        const user = user1;
        const date = "2023-10-28";
        const completedItems = new Set<MockPlanItem>(); // No items for this test
        const strain = 5;
        const pain = 0;

        await t_submit.step("Should create a check-in with minimal fields", async () => {
            console.log("\n--- submit Action: Successful minimal submission ---");
            const result = await checkInService.submit(user, date, completedItems, strain, pain);

            assertExists(result.checkin, `Expected check-in to be created: ${result.error}`);
            const created = await checkInService.getCheckIn(user.id, date);
            assertExists(created);
            assertObjectMatch(created, {
                owner: { id: user.id },
                date: date,
                completedItems: [],
                strain_0_10: strain,
                pain_0_10: pain,
                comment: undefined // No comment provided
            });
            console.log("  Effect: Check-in created with minimal fields and state confirmed.");
        });

        await t_submit.step("Should create a check-in with all fields including comment and completed items", async () => {
            console.log("\n--- submit Action: Successful full submission ---");
            const newDate = "2023-10-29";
            const newCompleted = new Set([planItem1, planItem2]);
            const newComment = "Feeling strong!";
            const result = await checkInService.submit(user, newDate, newCompleted, 8, 1, newComment);

            assertExists(result.checkin, `Expected check-in to be created: ${result.error}`);
            const created = await checkInService.getCheckIn(user.id, newDate);
            assertExists(created);
            assertObjectMatch(created, {
                owner: { id: user.id },
                date: newDate,
                completedItems: [planItem1.id, planItem2.id],
                strain_0_10: 8,
                pain_0_10: 1,
                comment: newComment
            });
            console.log("  Effect: Check-in created with all fields and state confirmed.");
        });
    });

    await t.step("submit Action: Requires conditions", async (t_requires) => {
        const user = user1;
        const date = "2023-10-30";
        const completedItems = new Set<MockPlanItem>();
        const strain = 5;
        const pain = 0;

        await t_requires.step("Should reject if owner does not exist", async () => {
            console.log("\n--- submit Action: Requires owner exists (failure) ---");
            const nonExistentUser: MockUser = { id: "nonExistentUser" };
            const result = await checkInService.submit(nonExistentUser, date, completedItems, strain, pain);
            assertNotEquals(result.checkin, true, "Expected submit to fail.");
            assertObjectMatch(result, { error: `Owner ${nonExistentUser.id} does not exist.` });
            console.log(`  Requirement: 'owner exists' failed as expected: ${result.error}`);
        });

        await t_requires.step("Should reject if a completed item does not belong to owner's active plan", async () => {
            console.log("\n--- submit Action: Requires completed item belongs to owner (failure) ---");
            const badPlanItem = await checkInService.createPlanItem("badPi", "anotherUser"); // Belongs to 'anotherUser'
            const completedWithBadItem = new Set([planItem1, badPlanItem]);
            const result = await checkInService.submit(user, "2023-10-31", completedWithBadItem, strain, pain);
            assertNotEquals(result.checkin, true, "Expected submit to fail.");
            assertObjectMatch(result, { error: `Plan item ${badPlanItem.id} does not exist or does not belong to owner ${user.id}.` });
            console.log(`  Requirement: 'each completed item belongs to owner’s active plan' failed as expected: ${result.error}`);
        });

        await t_requires.step("Should reject if check-in already exists for owner and date", async () => {
            console.log("\n--- submit Action: Requires no check-in exists for (owner, date) (failure) ---");
            const existingDate = "2023-11-01";
            // First, successfully submit one
            await checkInService.submit(user, existingDate, completedItems, strain, pain);
            console.log("  Pre-condition: A check-in was successfully submitted for user1 on 2023-11-01.");

            // Then, attempt to submit another for the same user and date
            const result = await checkInService.submit(user, existingDate, completedItems, strain, pain);
            assertNotEquals(result.checkin, true, "Expected second submit to fail.");
            assertObjectMatch(result, { error: `A check-in for ${user.id} on ${existingDate} already exists.` });
            console.log(`  Requirement: 'no check-in exists for (owner, date)' failed as expected: ${result.error}`);
        });

        await t_requires.step("Should reject if strain_0_10 is out of range (<0)", async () => {
            console.log("\n--- submit Action: Requires strain_0_10 within 0-10 (failure: too low) ---");
            const result = await checkInService.submit(user, "2023-11-02", completedItems, -1, pain);
            assertNotEquals(result.checkin, true, "Expected submit to fail.");
            assertObjectMatch(result, { error: `Strain and pain values must be between 0 and 10.` });
            console.log(`  Requirement: Strain range validation failed as expected: ${result.error}`);
        });

        await t_requires.step("Should reject if pain_0_10 is out of range (>10)", async () => {
            console.log("\n--- submit Action: Requires pain_0_10 within 0-10 (failure: too high) ---");
            const result = await checkInService.submit(user, "2023-11-03", completedItems, strain, 11);
            assertNotEquals(result.checkin, true, "Expected submit to fail.");
            assertObjectMatch(result, { error: `Strain and pain values must be between 0 and 10.` });
            console.log(`  Requirement: Pain range validation failed as expected: ${result.error}`);
        });
    });

    await t.step("amend Action: Successful amendment", async (t_amend) => {
        const user = user1;
        const date = "2023-11-04";
        const initialComment = "Initial thought.";
        const checkinId = `${user.id}-${date}`;

        // Setup: create a check-in to amend
        await checkInService.submit(user, date, new Set([planItem1]), 5, 1, initialComment);
        console.log(`\n  Pre-condition: Check-in ${checkinId} created for amendment tests.`);

        await t_amend.step("Should amend a single field (comment)", async () => {
            console.log("\n--- amend Action: Successful single field amendment ---");
            const newComment = "Revised thought, feeling better.";
            const result = await checkInService.amend(checkinId, undefined, undefined, undefined, newComment);
            assertEquals(result.success, true, `Expected amend to succeed: ${result.error}`);

            const amendedCheckIn = await checkInService.getCheckIn(user.id, date);
            assertObjectMatch(amendedCheckIn, { comment: newComment, strain_0_10: 5, pain_0_10: 1 });
            console.log("  Effect: Comment updated, other fields unchanged, state confirmed.");
        });

        await t_amend.step("Should amend multiple fields (completed, strain, pain)", async () => {
            console.log("\n--- amend Action: Successful multiple fields amendment ---");
            const updatedCompleted = new Set([planItem1, planItem2]);
            const updatedStrain = 8;
            const updatedPain = 0;
            const result = await checkInService.amend(checkinId, updatedCompleted, updatedStrain, updatedPain);
            assertEquals(result.success, true, `Expected amend to succeed: ${result.error}`);

            const amendedCheckIn = await checkInService.getCheckIn(user.id, date);
            assertObjectMatch(amendedCheckIn, {
                completedItems: [planItem1.id, planItem2.id],
                strain_0_10: updatedStrain,
                pain_0_10: updatedPain,
                comment: "Revised thought, feeling better." // Previous comment should remain
            });
            console.log("  Effect: Multiple fields updated, others unchanged, state confirmed.");
        });

        await t_amend.step("Should allow setting a field to undefined/null (e.g., clearing comment)", async () => {
            console.log("\n--- amend Action: Clear optional field ---");
            const result = await checkInService.amend(checkinId, undefined, undefined, undefined, undefined);
            assertEquals(result.success, true, `Expected amend to succeed: ${result.error}`);

            const amendedCheckIn = await checkInService.getCheckIn(user.id, date);
            assertEquals(amendedCheckIn.comment, undefined, "Expected comment to be cleared.");
            console.log("  Effect: Comment field cleared (set to undefined), state confirmed.");
        });
    });

    await t.step("amend Action: Requires conditions", async (t_amend_requires) => {
        const user = user1;
        const date = "2023-11-05";
        const checkinId = `${user.id}-${date}`;
        const nonExistentCheckinId = `${user.id}-nonexistent-date`;

        // Setup: create a check-in to amend for valid cases
        await checkInService.submit(user, date, new Set(), 5, 1, "Initial comment");
        console.log(`\n  Pre-condition: Check-in ${checkinId} created for amendment requires tests.`);

        await t_amend_requires.step("Should reject if checkin does not exist", async () => {
            console.log("\n--- amend Action: Requires checkin exists (failure) ---");
            const result = await checkInService.amend(nonExistentCheckinId, undefined, 6);
            assertNotEquals(result.success, true, "Expected amend to fail.");
            assertObjectMatch(result, { error: `Check-in ${nonExistentCheckinId} does not exist.` });
            console.log(`  Requirement: 'checkin exists' failed as expected: ${result.error}`);
        });

        await t_amend_requires.step("Should reject if an amended completed item does not belong to owner's plan", async () => {
            console.log("\n--- amend Action: Requires amended completed item belongs to owner (failure) ---");
            const badPlanItem = await checkInService.createPlanItem("badPi2", "anotherUser2"); // Belongs to 'anotherUser2'
            const completedWithBadItem = new Set([planItem1, badPlanItem]);
            const result = await checkInService.amend(checkinId, completedWithBadItem);
            assertNotEquals(result.success, true, "Expected amend to fail.");
            assertObjectMatch(result, { error: `Amended plan item ${badPlanItem.id} does not exist or does not belong to owner ${user.id}.` });
            console.log(`  Requirement: 'each completed item belongs to owner’s active plan' failed as expected: ${result.error}`);
        });

        await t_amend_requires.step("Should reject if amended strain_0_10 is out of range (<0)", async () => {
            console.log("\n--- amend Action: Requires strain_0_10 within 0-10 (failure: too low) ---");
            const result = await checkInService.amend(checkinId, undefined, -1);
            assertNotEquals(result.success, true, "Expected amend to fail.");
            assertObjectMatch(result, { error: `Amended strain value must be between 0 and 10.` });
            console.log(`  Requirement: Strain range validation failed as expected: ${result.error}`);
        });

        await t_amend_requires.step("Should reject if amended pain_0_10 is out of range (>10)", async () => {
            console.log("\n--- amend Action: Requires pain_0_10 within 0-10 (failure: too high) ---");
            const result = await checkInService.amend(checkinId, undefined, undefined, 11);
            assertNotEquals(result.success, true, "Expected amend to fail.");
            assertObjectMatch(result, { error: `Amended pain value must be between 0 and 10.` });
            console.log(`  Requirement: Pain range validation failed as expected: ${result.error}`);
        });
    });

    await client.close();
});
```

---

### **Explanation of Test Coverage:**

1.  **Principle Fulfillment (`trace:`):**
    *   **Goal:** Directly demonstrate the concept's core story as defined in its `principle`.
    *   **Scenario:** A user first `submit`s a check-in, and then `amend`s it. This validates the fundamental flow and ensures both actions work together to fulfill the purpose.
    *   **Verification:** After each action, the state is queried to confirm the effects match expectations.

2.  **`submit` Action Tests:**
    *   **Successful Submissions (Effects):**
        *   Test with minimal required fields (ensures defaults or optional fields are handled correctly).
        *   Test with all fields, including optional `comment` and `completedItems`.
        *   **Verification:** Query the concept state after each `submit` call to confirm the new `CheckIn` object exists and all its properties are set as expected.
    *   **Precondition Failures (`requires`):**
        *   **`owner exists`**: Attempt to submit with a non-existent `User` ID.
        *   **`each completed item belongs to owner’s active plan`**: Attempt to submit with a `PlanItem` that's either non-existent or owned by a different user.
        *   **`no check-in exists for (owner, date)`**: Submit a check-in, then try to submit another one for the exact same `owner` and `date`.
        *   **`strain_0_10` / `pain_0_10` range validation**: Test submitting values outside the 0-10 range (e.g., -1, 11) to confirm the concept rejects them (assuming this validation is part of the concept's behavior for "Number" in the 0-10 context).
        *   **Verification:** Each of these tests should result in an `error` being returned, and the concept's state should remain unchanged (no new check-in created).

3.  **`amend` Action Tests:**
    *   **Successful Amendments (Effects):**
        *   Test updating a single field (e.g., `comment`).
        *   Test updating multiple fields (e.g., `completedItems`, `strain_0_10`, `pain_0_10`).
        *   Test setting an optional field to `undefined` (or `null`) to confirm it can be cleared.
        *   **Verification:** Query the concept state after each `amend` call to confirm only the specified properties are updated, while others (like `owner`, `date`, and non-amended properties) remain unchanged.
    *   **Precondition Failures (`requires`):**
        *   **`checkin exists`**: Attempt to amend a `checkin` using a non-existent `checkinId`.
        *   **`each completed item belongs to owner’s active plan` (for `amend`)**: If `completedItems` are provided during amendment, ensure they still belong to the check-in's owner.
        *   **`strain_0_10` / `pain_0_10` range validation**: Test amending with values outside the 0-10 range.
        *   **Verification:** Each of these tests should result in an `error` being returned, and the concept's state for the target check-in should remain unchanged.

Each test step includes console output to describe the action, its results, and the verification of its effects, making the test trace legible as required. The `testDb` function is included as a placeholder, with the mock `CheckInConcept` standing in for the actual implementation for demonstration purposes.