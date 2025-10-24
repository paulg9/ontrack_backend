---
timestamp: 'Thu Oct 23 2025 23:44:12 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_234412.ee39ea36.md]]'
content_id: 989f0ee2f509feb4d7ef13d7de0f230857e8a1bcad8950c35815e3829a40a766
---

# trace:

This trace demonstrates the operational principle of the `UserAccount` concept: "An athlete registers for an account, personalizes their notification reminder time, and can generate or revoke temporary share links to their data, all managed through their account."

**Initial State:**

* `Users` collection is empty.
* `ShareLinks` collection is empty.

**1. Action: `register`**
An athlete signs up for a new account.

* **Call:** `register({ username: 'athlete1', password: 'password123' })`
* **Returns:** `{ user: '...' }` (a new unique ID, let's call it `user123`)
* **State Change:**
  * A new `User` document is created with:
    * `_id: user123`
    * `username: 'athlete1'`
    * `passwordHash: 'password123'` (note: unhashed in this implementation)
    * `reminderTime: null`
    * `shareLinks: []`

**2. Action: `setReminderTime`**
The athlete personalizes their account by setting a daily reminder time.

* **Call:** `setReminderTime({ user: user123, time: '08:00' })`
* **Returns:** `{}` (success)
* **State Change:**
  * The `User` document for `user123` is updated:
    * `reminderTime` is now `'08:00'`.

**3. Action: `createShareLink`**
The athlete wants to share their data temporarily with a coach and generates a share link.

* **Call:** `createShareLink({ owner: user123, ttlSeconds: 3600 })`
* **Returns:** `{ token: '...' }` (a new unique token, let's call it `tokenABC`)
* **State Change:**
  * A new `ShareLink` document is created with:
    * `_id: ...` (a new unique ID, let's call it `link456`)
    * `token: tokenABC`
    * `expiry: <current time + 1 hour>`
    * `owner: user123`
  * The `User` document for `user123` is updated:
    * `shareLinks` is now `[link456]`.

**4. Action: `revokeShareLink`**
After the coach has viewed the data, the athlete revokes access.

* **Call:** `revokeShareLink({ owner: user123, token: tokenABC })`
* **Returns:** `{}` (success)
* **State Change:**
  * The `ShareLink` document with `_id: link456` (and `token: tokenABC`) is deleted from the `ShareLinks` collection.
  * The `User` document for `user123` is updated:
    * `shareLinks` is now `[]`.

**Final State:**

* `Users` collection contains the document for `athlete1` (`user123`), with their reminder time set and an empty `shareLinks` array.
* `ShareLinks` collection is empty.

This sequence successfully models the lifecycle of a user managing their account settings and data sharing capabilities as described in the principle.
