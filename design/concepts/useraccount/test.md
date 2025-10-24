[@testing-concepts](../../background/testing-concepts.md)

[@Feedback-implementation](../../../src/concepts/UserAccount/UserConcept.ts)

[@Feedback-spec](../../../src/concepts/UserAccount/spec.md)

<testing concepts blurb from assignment instructions>
Testing concepts. Your tests should cover the basic behavior of the concept but should also include some more interesting cases. Your tests should use the Deno testing framework and should be programmatic (that is, determining in the code whether they succeeded or failed, and not requiring a human to interpret console messages). They should also print helpful messages to the console with action inputs and outputs so that a human reader can make sense of the test execution when it runs in the console. Some more details about the test cases you should include:

Operational principle. A sequence of action executions that corresponds to the operational principle, representing the common expected usage of the concept. These sequence is not required to use all the actions; operational principles often do not include a deletion action, for example.
Interesting scenarios. Sequences of action executions that correspond to less common cases: probing interesting corners of the functionality, undoing actions with deletions and cancellations, repeating actions with the same arguments, etc. In some of these scenarios actions may be expected to throw errors.
Number required. For each concept, you should have one test sequence for the operational principle, and 3-5 additional interesting scenarios. Every action should be executed successfully in at least one of the scenarios.
No state setup. Your test cases should not require any setting up of the concept state except by calling concept actions. When you are testing one action at a time, this means that you will want to order your actions carefully (for example, by the operational principle) to avoid having to set up state.
Saving test execution output. Save the test execution output by copy-pasting from the console to a markdown file.
</testing concepts blurb from assignment instructions>
# prompt: write a test suite for my UserAccount concept, adhereing to the given guidelines.
# response:

# file: src/UserAccount/UserAccountConcept.test.ts

```typescript
import { testDb, freshID } from "@utils/database.ts";
import { assertEquals, assertExists, assert, assertNotEquals } from "jsr:@std/assert";
import UserAccountConcept from "./UserConcept.ts";
import { ID } from "@utils/types.ts";

// Helper to check if a result is an error object
function isError<T>(result: T | { error: string }): result is { error: string } {
  return (result as { error: string }).error !== undefined;
}

Deno.test("Operational Principle: A user registers, manages settings, and shares data", async () => {
  console.log("\n🧪 Running Test: Operational Principle...");
  const [db, client] = await testDb();
  const concept = new UserAccountConcept(db);

  // 1. An athlete registers for an account
  console.log("  ➡️  Action: register({ username: 'athlete1', password: 'password123' })");
  const registerResult = await concept.register({ username: "athlete1", password: "password123" });
  console.log("  ⬅️  Result:", registerResult);

  assert(!isError(registerResult), "Registration should succeed");
  const { user: userId } = registerResult;
  assertExists(userId);

  // Effect Verification
  const userDoc = await concept.users.findOne({ _id: userId });
  assertExists(userDoc, "User document should be created in the database");
  assertEquals(userDoc.username, "athlete1");
  assertEquals(userDoc.reminderTime, null);
  assertEquals(userDoc.shareLinks, []);
  console.log("  ✅  Effect Confirmed: New user 'athlete1' created with default state.");

  // 2. Personalizes their notification reminder time
  const newReminderTime = "08:00";
  console.log(`  ➡️  Action: setReminderTime({ user: '${userId}', time: '${newReminderTime}' })`);
  const setResult = await concept.setReminderTime({ user: userId, time: newReminderTime });
  console.log("  ⬅️  Result:", setResult);

  assert(!isError(setResult), "Setting reminder time should succeed");

  // Effect Verification
  const updatedUserDoc = await concept.users.findOne({ _id: userId });
  assertExists(updatedUserDoc, "User document should still exist");
  assertEquals(updatedUserDoc.reminderTime, newReminderTime);
  console.log("  ✅  Effect Confirmed: User's reminderTime updated to '08:00'.");

  // 3. Generates a temporary share link
  console.log(`  ➡️  Action: createShareLink({ owner: '${userId}', ttlSeconds: 3600 })`);
  const createLinkResult = await concept.createShareLink({ owner: userId, ttlSeconds: 3600 });
  console.log("  ⬅️  Result:", createLinkResult);

  assert(!isError(createLinkResult), "Creating a share link should succeed");
  const { token } = createLinkResult;
  assertExists(token);

  // Effect Verification
  const userAfterLinkCreation = await concept.users.findOne({ _id: userId });
  assertEquals(userAfterLinkCreation?.shareLinks.length, 1, "User should have one share link ID");
  const shareLinkDoc = await concept.shareLinks.findOne({ token: token });
  assertExists(shareLinkDoc, "ShareLink document should be created");
  assertEquals(shareLinkDoc.owner, userId);
  assertEquals(userAfterLinkCreation?.shareLinks[0], shareLinkDoc._id);
  console.log("  ✅  Effect Confirmed: Share link created and associated with the user.");

  // 4. Revokes the temporary share link
  console.log(`  ➡️  Action: revokeShareLink({ owner: '${userId}', token: '${token}' })`);
  const revokeResult = await concept.revokeShareLink({ owner: userId, token: token });
  console.log("  ⬅️  Result:", revokeResult);

  assert(!isError(revokeResult), "Revoking the share link should succeed");

  // Effect Verification
  const userAfterRevoke = await concept.users.findOne({ _id: userId });
  assertEquals(userAfterRevoke?.shareLinks.length, 0, "User's shareLinks array should be empty");
  const revokedLinkDoc = await concept.shareLinks.findOne({ token: token });
  assertEquals(revokedLinkDoc, null, "ShareLink document should be deleted");
  console.log("  ✅  Effect Confirmed: Share link has been successfully revoked and deleted.");

  console.log("  🏁 Principle Test Complete.");
  await client.close();
});

Deno.test("Interesting Scenario: Username uniqueness", async () => {
  console.log("\n🧪 Running Test: Username uniqueness...");
  const [db, client] = await testDb();
  const concept = new UserAccountConcept(db);

  // 1. Register a user successfully
  const username = "unique_user";
  console.log(`  ➡️  Action: register({ username: '${username}', password: 'pw' })`);
  const firstRegisterResult = await concept.register({ username, password: "pw" });
  console.log("  ⬅️  Result:", firstRegisterResult);
  assert(!isError(firstRegisterResult), "First registration should succeed");

  // 2. Attempt to register with the same username
  console.log(`  ➡️  Action: register({ username: '${username}', password: 'pw2' })`);
  const secondRegisterResult = await concept.register({ username, password: "pw2" });
  console.log("  ⬅️  Result:", secondRegisterResult);

  // Requirement Verification
  assert(isError(secondRegisterResult), "Second registration should fail");
  assertEquals(secondRegisterResult.error, "Username already taken");
  console.log("  ✅  Requirement Confirmed: Cannot register with a duplicate username.");

  // Effect Verification
  const userCount = await concept.users.countDocuments({ username });
  assertEquals(userCount, 1, "There should still be only one user with that username");
  console.log("  ✅  Effect Confirmed: No new user was created.");

  console.log("  🏁 Uniqueness Test Complete.");
  await client.close();
});

Deno.test("Interesting Scenario: Actions on a non-existent user", async () => {
  console.log("\n🧪 Running Test: Actions on a non-existent user...");
  const [db, client] = await testDb();
  const concept = new UserAccountConcept(db);
  const fakeUserId = freshID() as ID;

  // 1. Attempt to set reminder time for a user that doesn't exist
  console.log(`  ➡️  Action: setReminderTime({ user: '${fakeUserId}', time: '10:00' })`);
  const setResult = await concept.setReminderTime({ user: fakeUserId, time: "10:00" });
  console.log("  ⬅️  Result:", setResult);

  // Requirement Verification
  assert(isError(setResult), "setReminderTime should fail for a non-existent user");
  assertEquals(setResult.error, "User not found");
  console.log("  ✅  Requirement Confirmed: Cannot set reminder time for a non-existent user.");

  // 2. Attempt to create a share link for a user that doesn't exist
  console.log(`  ➡️  Action: createShareLink({ owner: '${fakeUserId}', ttlSeconds: 60 })`);
  const createLinkResult = await concept.createShareLink({ owner: fakeUserId, ttlSeconds: 60 });
  console.log("  ⬅️  Result:", createLinkResult);

  // Requirement Verification
  assert(isError(createLinkResult), "createShareLink should fail for a non-existent user");
  assertEquals(createLinkResult.error, "Owner user not found");
  console.log("  ✅  Requirement Confirmed: Cannot create a share link for a non-existent owner.");

  console.log("  🏁 Non-Existent User Test Complete.");
  await client.close();
});

Deno.test("Interesting Scenario: Revoking unauthorized or non-existent links", async () => {
  console.log("\n🧪 Running Test: Revoking unauthorized or non-existent links...");
  const [db, client] = await testDb();
  const concept = new UserAccountConcept(db);

  // 1. Create two users
  const userAResult = await concept.register({ username: "userA", password: "pw" });
  assert(!isError(userAResult));
  const { user: userAId } = userAResult;

  const userBResult = await concept.register({ username: "userB", password: "pw" });
  assert(!isError(userBResult));
  const { user: userBId } = userBResult;
  console.log(`  - Setup: Created userA (${userAId}) and userB (${userBId})`);

  // 2. User A creates a share link
  const createLinkResult = await concept.createShareLink({ owner: userAId, ttlSeconds: 300 });
  assert(!isError(createLinkResult));
  const { token: tokenA } = createLinkResult;
  console.log(`  - Setup: userA created a share link with token: ${tokenA}`);

  // 3. Attempt to revoke a link that doesn't exist
  const fakeToken = crypto.randomUUID();
  console.log(`  ➡️  Action: revokeShareLink({ owner: '${userAId}', token: '${fakeToken}' })`);
  const revokeFakeResult = await concept.revokeShareLink({ owner: userAId, token: fakeToken });
  console.log("  ⬅️  Result:", revokeFakeResult);

  // Requirement Verification
  assert(isError(revokeFakeResult), "Revoking a non-existent token should fail");
  assertEquals(revokeFakeResult.error, "ShareLink not found or you do not have permission to revoke it");
  console.log("  ✅  Requirement Confirmed: Cannot revoke a token that does not exist.");

  // 4. User B attempts to revoke User A's link
  console.log(`  ➡️  Action: revokeShareLink({ owner: '${userBId}', token: '${tokenA}' })`);
  const revokeUnauthorizedResult = await concept.revokeShareLink({ owner: userBId, token: tokenA });
  console.log("  ⬅️  Result:", revokeUnauthorizedResult);

  // Requirement Verification
  assert(isError(revokeUnauthorizedResult), "Revoking an unauthorized link should fail");
  assertEquals(revokeUnauthorizedResult.error, "ShareLink not found or you do not have permission to revoke it");
  console.log("  ✅  Requirement Confirmed: A user cannot revoke another user's share link.");

  // Effect Verification
  const linkDoc = await concept.shareLinks.findOne({ token: tokenA });
  assertExists(linkDoc, "The share link should not have been deleted by the failed attempts");
  const userADoc = await concept.users.findOne({ _id: userAId });
  assertEquals(userADoc?.shareLinks.length, 1, "User A's link list should be unaffected");
  console.log("  ✅  Effect Confirmed: Failed revocations did not alter state.");

  console.log("  🏁 Unauthorized Revocation Test Complete.");
  await client.close();
});

Deno.test("Interesting Scenario: Managing multiple share links", async () => {
  console.log("\n🧪 Running Test: Managing multiple share links...");
  const [db, client] = await testDb();
  const concept = new UserAccountConcept(db);

  // 1. Create a user
  const registerResult = await concept.register({ username: "link_master", password: "pw" });
  assert(!isError(registerResult));
  const { user: userId } = registerResult;
  console.log(`  - Setup: Created user 'link_master' (${userId})`);

  // 2. Create two share links
  console.log(`  ➡️  Action: createShareLink({ owner: '${userId}', ttlSeconds: 60 })`);
  const link1Result = await concept.createShareLink({ owner: userId, ttlSeconds: 60 });
  assert(!isError(link1Result));
  const { token: token1 } = link1Result;
  console.log("  ⬅️  Result:", link1Result);

  console.log(`  ➡️  Action: createShareLink({ owner: '${userId}', ttlSeconds: 120 })`);
  const link2Result = await concept.createShareLink({ owner: userId, ttlSeconds: 120 });
  assert(!isError(link2Result));
  const { token: token2 } = link2Result;
  console.log("  ⬅️  Result:", link2Result);

  // Effect Verification
  let userDoc = await concept.users.findOne({ _id: userId });
  assertEquals(userDoc?.shareLinks.length, 2, "User should now have two share links");
  let linkCount = await concept.shareLinks.countDocuments({ owner: userId });
  assertEquals(linkCount, 2, "There should be two share link documents for the user");
  console.log("  ✅  Effect Confirmed: User has two active share links.");

  // 3. Revoke the first link
  console.log(`  ➡️  Action: revokeShareLink({ owner: '${userId}', token: '${token1}' })`);
  const revoke1Result = await concept.revokeShareLink({ owner: userId, token: token1 });
  console.log("  ⬅️  Result:", revoke1Result);
  assert(!isError(revoke1Result));

  // Effect Verification
  userDoc = await concept.users.findOne({ _id: userId });
  assertEquals(userDoc?.shareLinks.length, 1, "User should have one remaining share link");
  const link1Doc = await concept.shareLinks.findOne({ token: token1 });
  assertEquals(link1Doc, null, "Link 1 should be deleted");
  const link2Doc = await concept.shareLinks.findOne({ token: token2 });
  assertExists(link2Doc, "Link 2 should still exist");
  assertEquals(userDoc?.shareLinks[0], link2Doc?._id, "The remaining link ID in the user doc should be for link 2");
  console.log("  ✅  Effect Confirmed: First link was revoked, second link remains.");

  // 4. Revoke the second link
  console.log(`  ➡️  Action: revokeShareLink({ owner: '${userId}', token: '${token2}' })`);
  const revoke2Result = await concept.revokeShareLink({ owner: userId, token: token2 });
  console.log("  ⬅️  Result:", revoke2Result);
  assert(!isError(revoke2Result));

  // Effect Verification
  userDoc = await concept.users.findOne({ _id: userId });
  assertEquals(userDoc?.shareLinks.length, 0, "User's shareLinks array should now be empty");
  linkCount = await concept.shareLinks.countDocuments({ owner: userId });
  assertEquals(linkCount, 0, "There should be no more share link documents for the user");
  console.log("  ✅  Effect Confirmed: All share links have been revoked.");

  console.log("  🏁 Multiple Links Test Complete.");
  await client.close();
});
```

# trace:

This trace demonstrates the operational principle of the `UserAccount` concept: "An athlete registers for an account, personalizes their notification reminder time, and can generate or revoke temporary share links to their data, all managed through their account."

**Initial State:**
*   `Users` collection is empty.
*   `ShareLinks` collection is empty.

**1. Action: `register`**
An athlete signs up for a new account.
*   **Call:** `register({ username: 'athlete1', password: 'password123' })`
*   **Returns:** `{ user: '...' }` (a new unique ID, let's call it `user123`)
*   **State Change:**
    *   A new `User` document is created with:
        *   `_id: user123`
        *   `username: 'athlete1'`
        *   `passwordHash: 'password123'` (note: unhashed in this implementation)
        *   `reminderTime: null`
        *   `shareLinks: []`

**2. Action: `setReminderTime`**
The athlete personalizes their account by setting a daily reminder time.
*   **Call:** `setReminderTime({ user: user123, time: '08:00' })`
*   **Returns:** `{}` (success)
*   **State Change:**
    *   The `User` document for `user123` is updated:
        *   `reminderTime` is now `'08:00'`.

**3. Action: `createShareLink`**
The athlete wants to share their data temporarily with a coach and generates a share link.
*   **Call:** `createShareLink({ owner: user123, ttlSeconds: 3600 })`
*   **Returns:** `{ token: '...' }` (a new unique token, let's call it `tokenABC`)
*   **State Change:**
    *   A new `ShareLink` document is created with:
        *   `_id: ...` (a new unique ID, let's call it `link456`)
        *   `token: tokenABC`
        *   `expiry: <current time + 1 hour>`
        *   `owner: user123`
    *   The `User` document for `user123` is updated:
        *   `shareLinks` is now `[link456]`.

**4. Action: `revokeShareLink`**
After the coach has viewed the data, the athlete revokes access.
*   **Call:** `revokeShareLink({ owner: user123, token: tokenABC })`
*   **Returns:** `{}` (success)
*   **State Change:**
    *   The `ShareLink` document with `_id: link456` (and `token: tokenABC`) is deleted from the `ShareLinks` collection.
    *   The `User` document for `user123` is updated:
        *   `shareLinks` is now `[]`.

**Final State:**
*   `Users` collection contains the document for `athlete1` (`user123`), with their reminder time set and an empty `shareLinks` array.
*   `ShareLinks` collection is empty.

This sequence successfully models the lifecycle of a user managing their account settings and data sharing capabilities as described in the principle.