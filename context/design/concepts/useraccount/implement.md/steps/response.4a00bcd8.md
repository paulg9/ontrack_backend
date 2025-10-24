---
timestamp: 'Thu Oct 23 2025 23:36:28 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_233628.c19eee6b.md]]'
content_id: 4a00bcd89232cd3b945cec1ad6d7e812956bac03e625d93f342153795cf34ba7
---

# response:

```typescript
import { Collection, Db, ObjectId } from "npm:mongodb";
import { Empty, ID, TimeOfDay } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Declare collection prefix, use concept name
const PREFIX = "UserAccount" + ".";

// Generic types of this concept
type User = ID;
type ShareLink = ID;

/**
 * a set of Users with
 *   username String
 *   passwordHash String
 *   reminderTime TimeOfDay
 *   shareLinks set of ShareLink
 */
interface UserDoc {
  _id: User;
  username: string;
  passwordHash: string; // Storing hash, not raw password
  reminderTime: TimeOfDay | null;
  shareLinks: ShareLink[];
}

/**
 * a set of ShareLinks with
 *   token String
 *   expiry DateTime
 *   owner User
 */
interface ShareLinkDoc {
  _id: ShareLink; // The actual ID of the ShareLink object
  token: string; // The token string used for access
  expiry: Date;
  owner: User;
}

export default class UserAccountConcept {
  users: Collection<UserDoc>;
  shareLinks: Collection<ShareLinkDoc>;

  constructor(private readonly db: Db) {
    this.users = this.db.collection(PREFIX + "users");
    this.shareLinks = this.db.collection(PREFIX + "shareLinks");
  }

  /**
   * register (username: String, password: String) : (user: User)
   *
   * **requires** `username` is not already taken
   *
   * **effects** creates a new `User`, assigns the provided `username` and `passwordHash` (of the `password`),
   * sets `reminderTime` to a default value (e.g., null), and initializes `shareLinks` as an empty set.
   */
  async register(
    { username, password }: { username: string; password: string },
  ): Promise<{ user: User } | { error: string }> {
    // Check if username already exists
    const existingUser = await this.users.findOne({ username });
    if (existingUser) {
      return { error: "Username already taken" };
    }

    // Simulate password hashing (in a real app, use a strong hashing library like bcrypt)
    const passwordHash = password; // Placeholder for actual hash

    const newUserId = freshID();
    const newUser: UserDoc = {
      _id: newUserId,
      username: username,
      passwordHash: passwordHash,
      reminderTime: null, // Default value
      shareLinks: [], // Initialize as empty set
    };

    await this.users.insertOne(newUser);

    return { user: newUserId };
  }

  /**
   * setReminderTime (user: User, time: TimeOfDay)
   *
   * **requires** `user` exists
   *
   * **effects** sets `user.reminderTime := time`
   */
  async setReminderTime(
    { user, time }: { user: User; time: TimeOfDay },
  ): Promise<Empty | { error: string }> {
    // todo: implement setReminderTime
    return {};
  }

  /**
   * createShareLink (owner: User, ttlSeconds: Number) : (token: String)
   *
   * **requires** `owner` exists
   *
   * **effects** creates a new `ShareLink` with a randomly generated `token`,
   * sets `expiry = now + ttlSeconds`, associates `owner` with the provided `User`,
   * and adds this `ShareLink` to `owner.shareLinks`.
   */
  async createShareLink(
    { owner, ttlSeconds }: { owner: User; ttlSeconds: number },
  ): Promise<{ token: string } | { error: string }> {
    // todo: implement createShareLink
    return { token: "todo-token" };
  }

  /**
   * revokeShareLink (owner: User, token: String)
   *
   * **requires** a `ShareLink` exists with the given `token` and its `owner` is the provided `owner`
   *
   * **effects** removes the `ShareLink` with the specified `token` from `owner.shareLinks` and deletes the `ShareLink` itself.
   */
  async revokeShareLink(
    { owner, token }: { owner: User; token: string },
  ): Promise<Empty | { error: string }> {
    // todo: implement revokeShareLink
    return {};
  }
}
```
