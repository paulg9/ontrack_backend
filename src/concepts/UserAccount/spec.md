
**concept** UserAccount

**purpose** To enable the creation, management, and personalization of a user's account within the application.

**principle** An athlete registers for an account, personalizes their notification reminder time, and can generate or revoke temporary share links to their data, all managed through their account.

**state**

*   a set of Users with
    *   `username String`
    *   `passwordHash String`
    *   `reminderTime TimeOfDay`
    *   `shareLinks set of ShareLink`
    *   `isAdmin Boolean` // default false
*   a set of ShareLinks with
    *   `token String`
    *   `expiry DateTime`
    *   `owner User`
*   a set of Sessions with
    *   `user User`
    *   `token String`
    *   `createdAt DateTime`
    *   `expiry DateTime`

**types**

*   `TimeOfDay` (a string in "HH:mm" format)
*   `DateTime` (an ISO 8601 timestamp)

**actions**

*   `register (username: String, password: String, isAdmin?: Boolean) : (user: User)`
    *   **requires** `username` is not already taken
    *   **effects** creates a new `User`, assigns the provided `username` and `passwordHash` (of the `password`), sets `reminderTime` to a default value (e.g., null), initializes `shareLinks` as an empty set, and sets `isAdmin := isAdmin` (default false).

*   `setReminderTime (user: User, time: TimeOfDay)`
    *   **requires** `user` exists
    *   **effects** sets `user.reminderTime := time`

*   `createShareLink (owner: User, ttlSeconds: Number) : (token: String)`
    *   **requires** `owner` exists
    *   **effects** creates a new `ShareLink` with a randomly generated `token`, sets `expiry = now + ttlSeconds`, associates `owner` with the provided `User`, and adds this `ShareLink` to `owner.shareLinks`.


*   `revokeShareLink (owner: User, token: String)`
    *   **requires** a `ShareLink` exists with the given `token` and its `owner` is the provided `owner`
    *   **effects** removes the `ShareLink` with the specified `token` from `owner.shareLinks` and deletes the `ShareLink` itself.

*   `login (username: String, password: String) : (token: String)`
    *   **requires** a `User` exists with `username` and `passwordHash` matching the provided `password`
    *   **effects** creates a new `Session` with a randomly generated `token`, sets `createdAt := now` and `expiry := now + 12h`, and returns `token`

*   `logout (token: String)`
    *   **requires** a `Session` exists with `token`
    *   **effects** deletes the `Session`

**queries**

*   `_getUserByToken (token: String) : (user: User)`
    *   **effects** returns the `user` associated with an active session `token` if it exists

*   `_isSignedIn (token: String) : (signedIn: Boolean)`
    *   **effects** returns `signedIn := true` if an active (non-expired) session exists for `token`, otherwise `signedIn := false`

*   `_isAdmin (user: User) : (isAdmin: Boolean)`
    *   **requires** `user` exists
    *   **effects** returns whether `user.isAdmin`