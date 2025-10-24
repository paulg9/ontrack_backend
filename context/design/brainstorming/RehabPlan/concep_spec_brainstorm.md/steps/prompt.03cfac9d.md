---
timestamp: 'Thu Oct 23 2025 21:51:42 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_215142.1e02b6b0.md]]'
content_id: 03cfac9d636ac17d05f92cc8d07a36813db9f95cb62074c64adad0eef176f326
---

# prompt: I changed PlanItem to have perWeek, sets, and reps, (all integers). This would make it clearer so the athlete knows how many times a week, how many sets of how many reps they need to do. I also implemented the other suggestions.

## Concept: RehabPlan \[User, Exercise]

**Purpose** Define the athlete’s routine as a selection of exercises and target frequencies

**Principle** An athlete creates a plan by selecting exercises from the library and setting target sets and reps; the plan enumerates plan items that can be logged each day

**State**

* a set of Plans with
  * owner User
  * archived Boolean (default false)
  * items set of PlanItem
* a set of PlanItems with
  * exercise Exercise
  * perWeek Integer
  * sets Integer
  * reps Integer
  * notes String

**Actions**

* createPlan (owner: User) : (plan: Plan)
  * requires owner exists and has no active (non-archived) plan
  * effects creates a plan with empty items

* addPlanItem (plan: Plan, exercise: Exercise, targetFreq: PerWeek, notes: String)
  * requires plan exists; exercise exists and deprecated = false
  * effects adds a new PlanItem to plan.items

* removePlanItem (plan: Plan, exercise: Exercise)
  * requires plan exists and an item for exercise exists
  * effects removes that PlanItem

* archivePlan (plan: Plan)
  * requires plan exists
  * effects sets archived := true (not shown in daily view)
