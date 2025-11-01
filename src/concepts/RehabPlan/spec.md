## Concept: RehabPlan [User, Exercise]

**Purpose** Define the athlete’s routine as a selection of exercises and target frequencies

**Principle** An athlete creates a plan by selecting exercises from the library and setting target sets and reps; the plan enumerates plan items that can be logged each day

**State**
- a set of Plans with
  - owner User
  - archived Boolean (default false)
  - items set of PlanItem
- a set of PlanItems with
  - exercise Exercise
  - perWeek Integer
  - sets Integer
  - reps Integer
  - notes String

**Actions**
- createPlan (actor: User, owner: User) : (plan: Plan)
  - requires actor = owner; owner exists and has no active (non-archived) plan
  - effects creates a plan with empty items

- addPlanItem (actor: User, plan: Plan, exercise: Exercise, perWeek: Integer, sets: Integer, reps: Integer, notes: String)
  - requires plan exists; plan.owner = actor; exercise exists and deprecated = false
  - effects adds a new PlanItem to plan.items

- removePlanItem (actor: User, plan: Plan, exercise: Exercise)
  - requires plan exists; plan.owner = actor; and an item for exercise exists
  - effects removes that PlanItem

- archivePlan (actor: User, plan: Plan)
  - requires plan exists; plan.owner = actor
  - effects sets archived := true (not shown in daily view)

**Queries**
- _getActivePlanByOwner (owner: User) : (plan: Plan)
  - effects returns the active (non-archived) plan for owner with its items

- _getPlanById (plan: Plan) : (plan: Plan)
  - effects returns the plan document for the given id


