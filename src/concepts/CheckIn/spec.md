## Concept: CheckIn

**Purpose** Record daily completion and simple subjective context

**Principle** Each day the athlete records which plan items were completed and strain (how hard the user pushed themselves) and pain notes

**State**
- a set of CheckIns with
  - owner User
  - date Date
  - completedItems set of PlanItem
  - strain_0_10 Number
  - pain_0_10 Number
  - comment String (optional)

**Actions**
- submit (actor: User, owner: User, date: Date, completed: set of PlanItem, strain_0_10: Number, pain_0_10: Number, comment?: String) : (checkin: CheckIn)
  - requires actor = owner; owner exists; each completed item belongs to owner’s active plan; no check-in exists for (owner, date)
  - effects creates a new CheckIn with provided fields

**Queries**
- _hasCheckIn (owner: User, date: Date) : (has: Boolean)
  - effects returns true if a check-in exists for (owner, date), false otherwise

- amend (actor: User, checkin: CheckIn, completed?: set of PlanItem, strain_0_10?: Number, pain_0_10?: Number, comment?: String)
  - requires checkin exists and belongs to actor
  - effects updates the provided fields on checkin


