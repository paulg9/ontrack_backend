
**concept** UserAccount

**purpose** To enable the creation, management, and personalization of a user's account within the application.

**principle** An athlete registers for an account, personalizes their notification reminder time, and can generate or revoke temporary share links to their data, all managed through their account.

**state**

*   a set of Users with
    *   `username String`
    *   `passwordHash String`
    *   `reminderTime TimeOfDay`
    *   `shareLinks set of ShareLink`
*   a set of ShareLinks with
    *   `token String`
    *   `expiry DateTime`
    *   `owner User`

**types**

*   `TimeOfDay` (a string in "HH:mm" format)
*   `DateTime` (an ISO 8601 timestamp)

**actions**

*   `register (username: String, password: String) : (user: User)`
    *   **requires** `username` is not already taken
    *   **effects** creates a new `User`, assigns the provided `username` and `passwordHash` (of the `password`), sets `reminderTime` to a default value (e.g., null), and initializes `shareLinks` as an empty set.

*   `setReminderTime (user: User, time: TimeOfDay)`
    *   **requires** `user` exists
    *   **effects** sets `user.reminderTime := time`

*   `createShareLink (owner: User, ttlSeconds: Number) : (token: String)`
    *   **requires** `owner` exists
    *   **effects** creates a new `ShareLink` with a randomly generated `token`, sets `expiry = now + ttlSeconds`, associates `owner` with the provided `User`, and adds this `ShareLink` to `owner.shareLinks`.

*   `revokeShareLink (owner: User, token: String)`
    *   **requires** a `ShareLink` exists with the given `token` and its `owner` is the provided `owner`
    *   **effects** removes the `ShareLink` with the specified `token` from `owner.shareLinks` and deletes the `ShareLink` itself.