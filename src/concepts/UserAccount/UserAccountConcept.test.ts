import { freshID, testDb } from "@utils/database.ts";
import {
  assert,
  assertEquals,
  assertExists,
  assertNotEquals,
} from "jsr:@std/assert";
import UserAccountConcept from "./UserAccountConcept.ts";
import { ID } from "@utils/types.ts";

// Helper to check if a result is an error object
function isError<T>(
  result: T | { error: string },
): result is { error: string } {
  return (result as { error: string }).error !== undefined;
}

Deno.test("Operational Principle: A user registers, manages settings, and shares data", async () => {
  console.log("\n🧪 Running Test: Operational Principle...");
  const [db, client] = await testDb();
  const concept = new UserAccountConcept(db);

  // 1. An athlete registers for an account
  console.log(
    "  ➡️  Action: register({ username: 'athlete1', password: 'password123' })",
  );
  const registerResult = await concept.register({
    username: "athlete1",
    password: "password123",
  });
  console.log("  ⬅️  Result:", registerResult);

  assert(!isError(registerResult), "Registration should succeed");
  const { user: userId } = registerResult as { user: ID };
  assertExists(userId);

  // Effect Verification
  const userDoc = await concept.users.findOne({ _id: userId });
  assertExists(userDoc, "User document should be created in the database");
  assertEquals(userDoc.username, "athlete1");
  assertEquals(userDoc.reminderTime, null);
  assertEquals(userDoc.shareLinks, []);
  assertEquals(userDoc.isAdmin, false);
  console.log(
    "  ✅  Effect Confirmed: New user 'athlete1' created with default state.",
  );

  // 2. Personalizes their notification reminder time
  const newReminderTime = "08:00";
  console.log(
    `  ➡️  Action: setReminderTime({ user: '${userId}', time: '${newReminderTime}' })`,
  );
  const setResult = await concept.setReminderTime({
    user: userId,
    time: newReminderTime,
  });
  console.log("  ⬅️  Result:", setResult);

  assert(!isError(setResult), "Setting reminder time should succeed");

  // Effect Verification
  const updatedUserDoc = await concept.users.findOne({ _id: userId });
  assertExists(updatedUserDoc, "User document should still exist");
  assertEquals(updatedUserDoc.reminderTime, newReminderTime);
  console.log(
    "  ✅  Effect Confirmed: User's reminderTime updated to '08:00'.",
  );

  // 3. Generates a temporary share link
  console.log(
    `  ➡️  Action: createShareLink({ owner: '${userId}', ttlSeconds: 3600 })`,
  );
  const createLinkResult = await concept.createShareLink({
    owner: userId,
    ttlSeconds: 3600,
  });
  console.log("  ⬅️  Result:", createLinkResult);

  assert(!isError(createLinkResult), "Creating a share link should succeed");
  const { token } = createLinkResult as { token: string };
  assertExists(token);

  // Effect Verification
  const userAfterLinkCreation = await concept.users.findOne({ _id: userId });
  assertEquals(
    userAfterLinkCreation?.shareLinks.length,
    1,
    "User should have one share link ID",
  );
  const shareLinkDoc = await concept.shareLinks.findOne({ token: token });
  assertExists(shareLinkDoc, "ShareLink document should be created");
  assertEquals(shareLinkDoc.owner, userId);
  assertEquals(userAfterLinkCreation?.shareLinks[0], shareLinkDoc._id);
  console.log(
    "  ✅  Effect Confirmed: Share link created and associated with the user.",
  );

  // Query share links for owner
  const listedLinks = await concept._listShareLinks({ owner: userId });
  assert(!(listedLinks as any).error, "_listShareLinks should succeed");
  const linkEntries = listedLinks as Array<
    { shareLink: ID; token: string; expiry: string; expired: boolean }
  >;
  assertEquals(linkEntries.length, 1);
  assertEquals(linkEntries[0].token, token);
  assertEquals(linkEntries[0].expired, false);

  // Resolve share link token
  const resolved = await concept._resolveShareLink({ token });
  assertEquals(
    resolved.length,
    1,
    "_resolveShareLink should expose active token",
  );
  assertEquals(resolved[0].owner, userId);
  assertEquals(resolved[0].expired, false);

  // 4. Revokes the temporary share link
  console.log(
    `  ➡️  Action: revokeShareLink({ owner: '${userId}', token: '${token}' })`,
  );
  const revokeResult = await concept.revokeShareLink({
    owner: userId,
    token: token,
  });
  console.log("  ⬅️  Result:", revokeResult);

  assert(!isError(revokeResult), "Revoking the share link should succeed");

  // Effect Verification
  const userAfterRevoke = await concept.users.findOne({ _id: userId });
  assertEquals(
    userAfterRevoke?.shareLinks.length,
    0,
    "User's shareLinks array should be empty",
  );
  const revokedLinkDoc = await concept.shareLinks.findOne({ token: token });
  assertEquals(revokedLinkDoc, null, "ShareLink document should be deleted");
  console.log(
    "  ✅  Effect Confirmed: Share link has been successfully revoked and deleted.",
  );

  const listedAfterRevoke = await concept._listShareLinks({ owner: userId });
  assert(!(listedAfterRevoke as any).error);
  const afterEntries = listedAfterRevoke as Array<any>;
  assertEquals(afterEntries.length, 0);

  const resolvedAfter = await concept._resolveShareLink({ token });
  assertEquals(
    resolvedAfter.length,
    0,
    "_resolveShareLink should return [] after revocation",
  );

  console.log("  🏁 Principle Test Complete.");
  await client.close();
});

Deno.test("Interesting Scenario: Username uniqueness", async () => {
  console.log("\n🧪 Running Test: Username uniqueness...");
  const [db, client] = await testDb();
  const concept = new UserAccountConcept(db);

  // 1. Register a user successfully
  const username = "unique_user";
  console.log(
    `  ➡️  Action: register({ username: '${username}', password: 'pw' })`,
  );
  const firstRegisterResult = await concept.register({
    username,
    password: "pw",
  });
  console.log("  ⬅️  Result:", firstRegisterResult);
  assert(!isError(firstRegisterResult), "First registration should succeed");

  // 2. Attempt to register with the same username
  console.log(
    `  ➡️  Action: register({ username: '${username}', password: 'pw2' })`,
  );
  const secondRegisterResult = await concept.register({
    username,
    password: "pw2",
  });
  console.log("  ⬅️  Result:", secondRegisterResult);

  // Requirement Verification
  assert(isError(secondRegisterResult), "Second registration should fail");
  assertEquals(
    (secondRegisterResult as { error: string }).error,
    "Username already taken",
  );
  console.log(
    "  ✅  Requirement Confirmed: Cannot register with a duplicate username.",
  );

  // Effect Verification
  const userCount = await concept.users.countDocuments({ username });
  assertEquals(
    userCount,
    1,
    "There should still be only one user with that username",
  );
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
  console.log(
    `  ➡️  Action: setReminderTime({ user: '${fakeUserId}', time: '10:00' })`,
  );
  const setResult = await concept.setReminderTime({
    user: fakeUserId,
    time: "10:00",
  });
  console.log("  ⬅️  Result:", setResult);

  // Requirement Verification
  assert(
    isError(setResult),
    "setReminderTime should fail for a non-existent user",
  );
  assertEquals((setResult as { error: string }).error, "User not found");
  console.log(
    "  ✅  Requirement Confirmed: Cannot set reminder time for a non-existent user.",
  );

  // 2. Attempt to create a share link for a user that doesn't exist
  console.log(
    `  ➡️  Action: createShareLink({ owner: '${fakeUserId}', ttlSeconds: 60 })`,
  );
  const createLinkResult = await concept.createShareLink({
    owner: fakeUserId,
    ttlSeconds: 60,
  });
  console.log("  ⬅️  Result:", createLinkResult);

  // Requirement Verification
  assert(
    isError(createLinkResult),
    "createShareLink should fail for a non-existent user",
  );
  assertEquals(
    (createLinkResult as { error: string }).error,
    "Owner user not found",
  );
  console.log(
    "  ✅  Requirement Confirmed: Cannot create a share link for a non-existent owner.",
  );

  console.log("  🏁 Non-Existent User Test Complete.");
  await client.close();
});

Deno.test("Interesting Scenario: Revoking unauthorized or non-existent links", async () => {
  console.log(
    "\n🧪 Running Test: Revoking unauthorized or non-existent links...",
  );
  const [db, client] = await testDb();
  const concept = new UserAccountConcept(db);

  // 1. Create two users
  const userAResult = await concept.register({
    username: "userA",
    password: "pw",
  });
  assert(!isError(userAResult));
  const { user: userAId } = userAResult as { user: ID };

  const userBResult = await concept.register({
    username: "userB",
    password: "pw",
  });
  assert(!isError(userBResult));
  const { user: userBId } = userBResult as { user: ID };
  console.log(`  - Setup: Created userA (${userAId}) and userB (${userBId})`);

  // 2. User A creates a share link
  const createLinkResult = await concept.createShareLink({
    owner: userAId,
    ttlSeconds: 300,
  });
  assert(!isError(createLinkResult));
  const { token: tokenA } = createLinkResult as { token: string };
  console.log(`  - Setup: userA created a share link with token: ${tokenA}`);

  // 3. Attempt to revoke a link that doesn't exist
  const fakeToken = crypto.randomUUID();
  console.log(
    `  ➡️  Action: revokeShareLink({ owner: '${userAId}', token: '${fakeToken}' })`,
  );
  const revokeFakeResult = await concept.revokeShareLink({
    owner: userAId,
    token: fakeToken,
  });
  console.log("  ⬅️  Result:", revokeFakeResult);

  // Requirement Verification
  assert(
    isError(revokeFakeResult),
    "Revoking a non-existent token should fail",
  );
  assertEquals(
    (revokeFakeResult as { error: string }).error,
    "ShareLink not found or you do not have permission to revoke it",
  );
  console.log(
    "  ✅  Requirement Confirmed: Cannot revoke a token that does not exist.",
  );

  // 4. User B attempts to revoke User A's link
  console.log(
    `  ➡️  Action: revokeShareLink({ owner: '${userBId}', token: '${tokenA}' })`,
  );
  const revokeUnauthorizedResult = await concept.revokeShareLink({
    owner: userBId,
    token: tokenA,
  });
  console.log("  ⬅️  Result:", revokeUnauthorizedResult);

  // Requirement Verification
  assert(
    isError(revokeUnauthorizedResult),
    "Revoking an unauthorized link should fail",
  );
  assertEquals(
    (revokeUnauthorizedResult as { error: string }).error,
    "ShareLink not found or you do not have permission to revoke it",
  );
  console.log(
    "  ✅  Requirement Confirmed: A user cannot revoke another user's share link.",
  );

  // Effect Verification
  const linkDoc = await concept.shareLinks.findOne({ token: tokenA });
  assertExists(
    linkDoc,
    "The share link should not have been deleted by the failed attempts",
  );
  const userADoc = await concept.users.findOne({ _id: userAId });
  assertEquals(
    userADoc?.shareLinks.length,
    1,
    "User A's link list should be unaffected",
  );
  console.log(
    "  ✅  Effect Confirmed: Failed revocations did not alter state.",
  );

  console.log("  🏁 Unauthorized Revocation Test Complete.");
  await client.close();
});

Deno.test("Interesting Scenario: Managing multiple share links", async () => {
  console.log("\n🧪 Running Test: Managing multiple share links...");
  const [db, client] = await testDb();
  const concept = new UserAccountConcept(db);

  // 1. Create a user
  const registerResult = await concept.register({
    username: "link_master",
    password: "pw",
  });
  assert(!isError(registerResult));
  const { user: userId } = registerResult as { user: ID };
  console.log(`  - Setup: Created user 'link_master' (${userId})`);

  // 2. Create two share links
  console.log(
    `  ➡️  Action: createShareLink({ owner: '${userId}', ttlSeconds: 60 })`,
  );
  const link1Result = await concept.createShareLink({
    owner: userId,
    ttlSeconds: 60,
  });
  assert(!isError(link1Result));
  const { token: token1 } = link1Result as { token: string };
  console.log("  ⬅️  Result:", link1Result);

  console.log(
    `  ➡️  Action: createShareLink({ owner: '${userId}', ttlSeconds: 120 })`,
  );
  const link2Result = await concept.createShareLink({
    owner: userId,
    ttlSeconds: 120,
  });
  assert(!isError(link2Result));
  const { token: token2 } = link2Result as { token: string };
  console.log("  ⬅️  Result:", link2Result);

  // Effect Verification
  let userDoc = await concept.users.findOne({ _id: userId });
  assertEquals(
    userDoc?.shareLinks.length,
    2,
    "User should now have two share links",
  );
  let linkCount = await concept.shareLinks.countDocuments({ owner: userId });
  assertEquals(
    linkCount,
    2,
    "There should be two share link documents for the user",
  );
  console.log("  ✅  Effect Confirmed: User has two active share links.");

  // 3. Revoke the first link
  console.log(
    `  ➡️  Action: revokeShareLink({ owner: '${userId}', token: '${token1}' })`,
  );
  const revoke1Result = await concept.revokeShareLink({
    owner: userId,
    token: token1,
  });
  console.log("  ⬅️  Result:", revoke1Result);
  assert(!isError(revoke1Result));

  // Effect Verification
  userDoc = await concept.users.findOne({ _id: userId });
  assertEquals(
    userDoc?.shareLinks.length,
    1,
    "User should have one remaining share link",
  );
  const link1Doc = await concept.shareLinks.findOne({ token: token1 });
  assertEquals(link1Doc, null, "Link 1 should be deleted");
  const link2Doc = await concept.shareLinks.findOne({ token: token2 });
  assertExists(link2Doc, "Link 2 should still exist");
  assertEquals(
    userDoc?.shareLinks[0],
    link2Doc?._id,
    "The remaining link ID in the user doc should be for link 2",
  );
  console.log(
    "  ✅  Effect Confirmed: First link was revoked, second link remains.",
  );

  // 4. Revoke the second link
  console.log(
    `  ➡️  Action: revokeShareLink({ owner: '${userId}', token: '${token2}' })`,
  );
  const revoke2Result = await concept.revokeShareLink({
    owner: userId,
    token: token2,
  });
  console.log("  ⬅️  Result:", revoke2Result);
  assert(!isError(revoke2Result));

  // Effect Verification
  userDoc = await concept.users.findOne({ _id: userId });
  assertEquals(
    userDoc?.shareLinks.length,
    0,
    "User's shareLinks array should now be empty",
  );
  linkCount = await concept.shareLinks.countDocuments({ owner: userId });
  assertEquals(
    linkCount,
    0,
    "There should be no more share link documents for the user",
  );
  console.log("  ✅  Effect Confirmed: All share links have been revoked.");

  console.log("  🏁 Multiple Links Test Complete.");
  await client.close();
});

Deno.test("Authentication: login and logout with session token", async () => {
  console.log("\n🧪 Running Test: Authentication login/logout...");
  const [db, client] = await testDb();
  const concept = new UserAccountConcept(db);

  // Register user
  const reg = await concept.register({ username: "auth_user", password: "pw" });
  assert(!isError(reg));

  // Bad login
  const badLogin = await concept.login({
    username: "auth_user",
    password: "wrong",
  });
  assert(isError(badLogin));
  assertEquals((badLogin as { error: string }).error, "Invalid credentials");

  // Good login
  const login = await concept.login({ username: "auth_user", password: "pw" });
  assert(!isError(login));
  const token = (login as { token: string }).token;
  assertExists(token);

  // Query by token
  const userRowsRes = await concept._getUserByToken({ token });
  assert(!(userRowsRes as any).error);
  const userRows = userRowsRes as Array<{ user: ID }>;
  assertEquals(userRows.length, 1);
  assertExists(userRows[0].user);

  // Logout
  const out = await concept.logout({ token });
  assert(!isError(out));

  // Token should no longer resolve
  const afterRowsRes = await concept._getUserByToken({ token });
  assert(!(afterRowsRes as any).error);
  const afterRows = afterRowsRes as Array<{ user: ID }>;
  assertEquals(afterRows.length, 0);

  // Logout again should error
  const out2 = await concept.logout({ token });
  assert(isError(out2));
  assertEquals((out2 as { error: string }).error, "Session not found");

  await client.close();
});

Deno.test("Authentication: _isSignedIn convenience and expiry handling", async () => {
  console.log("\n🧪 Running Test: _isSignedIn and expiry...");
  const [db, client] = await testDb();
  const concept = new UserAccountConcept(db);

  // Register and login
  const reg = await concept.register({ username: "is_user", password: "pw" });
  assert(!isError(reg));
  const login = await concept.login({ username: "is_user", password: "pw" });
  assert(!isError(login));
  const token = (login as { token: string }).token;

  // isSignedIn should be true
  const signedInRes = await concept._isSignedIn({ token });
  const signedIn = (signedInRes as Array<{ signedIn: boolean }>)[0].signedIn;
  assertEquals(signedIn, true);

  // Expire the session manually then check
  await concept.sessions.updateOne({ token }, {
    $set: { expiry: new Date(Date.now() - 1000) },
  });
  const signedInAfterExpireRes = await concept._isSignedIn({ token });
  const signedInAfterExpire =
    (signedInAfterExpireRes as Array<{ signedIn: boolean }>)[0].signedIn;
  assertEquals(signedInAfterExpire, false);

  // _getUserByToken should now return []
  const byToken = await concept._getUserByToken({ token });
  assert(!(byToken as any).error);
  const rows = byToken as Array<{ user: ID }>;
  assertEquals(rows.length, 0);

  // Logout should now report not found (already expired & removed by logout)
  const logoutRes = await concept.logout({ token });
  // Depending on implementation, expired sessions may still be present; tolerate either
  if ((logoutRes as any).error) {
    assertEquals((logoutRes as { error: string }).error, "Session not found");
  } else {
    assertEquals(logoutRes, {});
  }

  await client.close();
});

Deno.test("Admin flag: register with isAdmin and _isAdmin", async () => {
  console.log("\n🧪 Running Test: Admin flag...");
  const [db, client] = await testDb();
  const concept = new UserAccountConcept(db);

  const reg = await concept.register({
    username: "admin_candidate",
    password: "pw",
  });
  assert(!isError(reg));
  const { user } = reg as { user: ID };

  // Initially false
  const q1 = await concept._isAdmin({ user });
  assert(!(q1 as any).error);
  const isA1 = (q1 as Array<{ isAdmin: boolean }>)[0].isAdmin;
  assertEquals(isA1, false);

  // Register a separate admin user
  const regAdmin = await concept.register({
    username: "admin_user",
    password: "pw",
    isAdmin: true,
  });
  assert(!isError(regAdmin));
  const { user: adminUser } = regAdmin as { user: ID };
  const q2 = await concept._isAdmin({ user: adminUser });
  const isA2 = (q2 as Array<{ isAdmin: boolean }>)[0].isAdmin;
  assertEquals(isA2, true);

  await client.close();
});
