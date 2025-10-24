Check file:///Users/paul/ontrack_backend/src/concepts/UserAccount/UserConcept.test.ts
running 5 tests from ./src/concepts/UserAccount/UserConcept.test.ts
Operational Principle: A user registers, manages settings, and shares data ...
------- output -------

🧪 Running Test: Operational Principle...
  ➡️  Action: register({ username: 'athlete1', password: 'password123' })
  ⬅️  Result: { user: "019a1457-a8a4-7126-9137-56dbb1a049a7" }
  ✅  Effect Confirmed: New user 'athlete1' created with default state.
  ➡️  Action: setReminderTime({ user: '019a1457-a8a4-7126-9137-56dbb1a049a7', time: '08:00' })
  ⬅️  Result: {}
  ✅  Effect Confirmed: User's reminderTime updated to '08:00'.
  ➡️  Action: createShareLink({ owner: '019a1457-a8a4-7126-9137-56dbb1a049a7', ttlSeconds: 3600 })
  ⬅️  Result: { token: "8f03525d-aa5c-4812-8bef-76178b541cbf" }
  ✅  Effect Confirmed: Share link created and associated with the user.
  ➡️  Action: revokeShareLink({ owner: '019a1457-a8a4-7126-9137-56dbb1a049a7', token: '8f03525d-aa5c-4812-8bef-76178b541cbf' })
  ⬅️  Result: {}
  ✅  Effect Confirmed: Share link has been successfully revoked and deleted.
  🏁 Principle Test Complete.
----- output end -----
Operational Principle: A user registers, manages settings, and shares data ... ok (1s)
Interesting Scenario: Username uniqueness ...
------- output -------

🧪 Running Test: Username uniqueness...
  ➡️  Action: register({ username: 'unique_user', password: 'pw' })
  ⬅️  Result: { user: "019a1457-acbd-7e52-8264-044e883ffcab" }
  ➡️  Action: register({ username: 'unique_user', password: 'pw2' })
  ⬅️  Result: { error: "Username already taken" }
  ✅  Requirement Confirmed: Cannot register with a duplicate username.
  ✅  Effect Confirmed: No new user was created.
  🏁 Uniqueness Test Complete.
----- output end -----
Interesting Scenario: Username uniqueness ... ok (859ms)
Interesting Scenario: Actions on a non-existent user ...
------- output -------

🧪 Running Test: Actions on a non-existent user...
  ➡️  Action: setReminderTime({ user: '019a1457-affd-717b-bad2-4c976928c75b', time: '10:00' })
  ⬅️  Result: { error: "User not found" }
  ✅  Requirement Confirmed: Cannot set reminder time for a non-existent user.
  ➡️  Action: createShareLink({ owner: '019a1457-affd-717b-bad2-4c976928c75b', ttlSeconds: 60 })
  ⬅️  Result: { error: "Owner user not found" }
  ✅  Requirement Confirmed: Cannot create a share link for a non-existent owner.
  🏁 Non-Existent User Test Complete.
----- output end -----
Interesting Scenario: Actions on a non-existent user ... ok (783ms)
Interesting Scenario: Revoking unauthorized or non-existent links ...
------- output -------

🧪 Running Test: Revoking unauthorized or non-existent links...
  - Setup: Created userA (019a1457-b2ca-74c9-b080-2935b219e2a2) and userB (019a1457-b362-73bd-a162-943c3ce74a03)
  - Setup: userA created a share link with token: c5d2da96-7e80-4f5a-bbbb-9c99aaf89182
  ➡️  Action: revokeShareLink({ owner: '019a1457-b2ca-74c9-b080-2935b219e2a2', token: '58f020b3-73b9-4d13-a9e2-cd392853fa88' })
  ⬅️  Result: {
  error: "ShareLink not found or you do not have permission to revoke it"
}
  ✅  Requirement Confirmed: Cannot revoke a token that does not exist.
  ➡️  Action: revokeShareLink({ owner: '019a1457-b362-73bd-a162-943c3ce74a03', token: 'c5d2da96-7e80-4f5a-bbbb-9c99aaf89182' })
  ⬅️  Result: {
  error: "ShareLink not found or you do not have permission to revoke it"
}
  ✅  Requirement Confirmed: A user cannot revoke another user's share link.
  ✅  Effect Confirmed: Failed revocations did not alter state.
  🏁 Unauthorized Revocation Test Complete.
----- output end -----
Interesting Scenario: Revoking unauthorized or non-existent links ... ok (806ms)
Interesting Scenario: Managing multiple share links ...
------- output -------

🧪 Running Test: Managing multiple share links...
  - Setup: Created user 'link_master' (019a1457-b67d-7f51-b409-027233676aab)
  ➡️  Action: createShareLink({ owner: '019a1457-b67d-7f51-b409-027233676aab', ttlSeconds: 60 })
  ⬅️  Result: { token: "ca0facb8-b055-435e-90d1-cd6e32012802" }
  ➡️  Action: createShareLink({ owner: '019a1457-b67d-7f51-b409-027233676aab', ttlSeconds: 120 })
  ⬅️  Result: { token: "3833e068-dc70-4306-b98f-fb26e848bd75" }
  ✅  Effect Confirmed: User has two active share links.
  ➡️  Action: revokeShareLink({ owner: '019a1457-b67d-7f51-b409-027233676aab', token: 'ca0facb8-b055-435e-90d1-cd6e32012802' })
  ⬅️  Result: {}
  ✅  Effect Confirmed: First link was revoked, second link remains.
  ➡️  Action: revokeShareLink({ owner: '019a1457-b67d-7f51-b409-027233676aab', token: '3833e068-dc70-4306-b98f-fb26e848bd75' })
  ⬅️  Result: {}
  ✅  Effect Confirmed: All share links have been revoked.
  🏁 Multiple Links Test Complete.
----- output end -----
Interesting Scenario: Managing multiple share links ... ok (1s)

ok | 5 passed | 0 failed (4s)

