---
timestamp: 'Thu Oct 23 2025 00:44:10 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_004410.d2a49360.md]]'
content_id: 89485ddf3503b6ebf18d1566f5937e4537ca7c90e868dfc9601153bf558dc29e
---

# implement CheckIn according to this concept specification:

## Concept: CheckIn

**Purpose** Record daily completion and simple subjective context

**Principle** Each day the athlete records which plan items were completed and strain (how hard the user pushed themselves) and pain notes

**State**

* a set of CheckIns with
  * owner User
  * date Date
  * completedItems set of PlanItem
  * strain\_0\_10 Number
  * pain\_0\_10 Number
  * comment String (optional)

**Actions**

* submit (owner: User, date: Date, completed: set of PlanItem, strain\_0\_10: Number, pain\_0\_10: Number, comment?: String) : (checkin: CheckIn)
  * requires owner exists; each completed item belongs to owner’s active plan; no check-in exists for (owner, date)
  * effects creates a new CheckIn with provided fields

* amend (checkin: CheckIn, completed?: set of PlanItem, strain\_0\_10: Number, pain\_0\_10: Number, comment?: String)
  * requires checkin exists and belongs to its owner
  * effects updates the provided fields on checkin

## use these as context
