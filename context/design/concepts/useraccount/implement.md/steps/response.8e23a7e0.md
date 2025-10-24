---
timestamp: 'Thu Oct 23 2025 23:38:01 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_233801.33fadee5.md]]'
content_id: 8e23a7e012164bf8a181b703859c950e78128e168af0fae9ea41a646e5b0b106
---

# response:

```typescript
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
    // Check if owner exists
    const existingUser = await this.users.findOne({ _id: owner });
    if (!existingUser) {
      return { error: "Owner user not found" };
    }

    // Generate a random token string (e.g., UUID)
    const shareToken = crypto.randomUUID();

    // Calculate expiry time
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + ttlSeconds);

    // Create a new ShareLink document
    const newShareLinkId = freshID();
    const newShareLink: ShareLinkDoc = {
      _id: newShareLinkId,
      token: shareToken,
      expiry: expiryDate,
      owner: owner,
    };

    // Insert the new ShareLink into the shareLinks collection
    await this.shareLinks.insertOne(newShareLink);

    // Add the new ShareLink's ID to the owner's shareLinks array in the users collection
    await this.users.updateOne(
      { _id: owner },
      { $push: { shareLinks: newShareLinkId } },
    );

    return { token: shareToken };
  }
```
