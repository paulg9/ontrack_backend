---
timestamp: 'Thu Oct 23 2025 23:38:39 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_233839.885d2b1e.md]]'
content_id: e6bc54a5a2d27fe2d2f5704507a48b310e6276355eb7bcd4501e2b5effa35416
---

# response:

```typescript
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
    // 1. Find the ShareLink by token
    const shareLinkToRevoke = await this.shareLinks.findOne({ token: token });

    // Check if the share link exists
    if (!shareLinkToRevoke) {
      return { error: "ShareLink not found" };
    }

    // Check if the owner matches the provided owner
    if (shareLinkToRevoke.owner !== owner) {
      return { error: "ShareLink does not belong to the specified owner" };
    }

    // 2. Remove the ShareLink's ID from the owner's shareLinks array
    await this.users.updateOne(
      { _id: owner },
      { $pull: { shareLinks: shareLinkToRevoke._id } },
    );

    // 3. Delete the ShareLink document from the shareLinks collection
    await this.shareLinks.deleteOne({ _id: shareLinkToRevoke._id });

    return {};
  }
```
