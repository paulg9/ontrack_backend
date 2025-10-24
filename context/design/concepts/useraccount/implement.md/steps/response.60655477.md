---
timestamp: 'Thu Oct 23 2025 23:37:26 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_233726.9ab75edf.md]]'
content_id: 6065547793213daf1497cdd824fa28b854ae8835d284f9e8ab2814533f31a45a
---

# response:

```typescript
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
    // Check if user exists
    const existingUser = await this.users.findOne({ _id: user });
    if (!existingUser) {
      return { error: "User not found" };
    }

    // Update the user's reminderTime
    await this.users.updateOne(
      { _id: user },
      { $set: { reminderTime: time } },
    );

    return {};
  }
```
