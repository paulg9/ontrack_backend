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
- submit (owner: User, date: Date, completed: set of PlanItem, strain_0_10: Number, pain_0_10: Number, comment?: String) : (checkin: CheckIn)
  - requires owner exists; each completed item belongs to owner’s active plan; no check-in exists for (owner, date)
  - effects creates a new CheckIn with provided fields

- amend (checkin: CheckIn, completed?: set of PlanItem, strain_0_10?: Number, pain_0_10?: Number, comment?: String)
  - requires checkin exists and belongs to its owner
  - effects updates the provided fields on checkin


