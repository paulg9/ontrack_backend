---
timestamp: 'Thu Oct 23 2025 01:58:16 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_015816.f59f2278.md]]'
content_id: 76655a7c7d99427151f00c32249d1c07da451c4bd8e8a248ef17cbea51e1e4a4
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

* amend (checkin: CheckIn, completed?: set of PlanItem, strain\_0\_10?: Number, pain\_0\_10?: Number, comment?: String)
  * requires checkin exists and belongs to its owner
  * effects updates the provided fields on checkin

## use these as context
