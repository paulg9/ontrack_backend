---
timestamp: 'Thu Oct 23 2025 21:55:14 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_215514.59aa0062.md]]'
content_id: 4bc3edfd53878d708d933ca32ee087d792af09e2792de9b3c56c45ce3ea5d390
---

# response:

That's an excellent question, and it directly touches upon one of the core principles of Concept Design: how data is exposed via action arguments and results.

According to the provided documentation and the refactoring guidelines, specifically:

> **Composite objects.** Make sure that all of the arguments and results of your actions are either primitive values (strings, numbers, etc) or object identifiers (actually document identifiers in MongoDB). Composite objects should be used only inside concept implementations and never exposed.

**Therefore, it is better to pass `perWeek`, `sets`, and `reps` as individual `Integer` arguments, rather than creating a new composite type that enumerates all three.**

Let's break down why:

1. **Adherence to the Rule:** The rule is explicit: action arguments and results should be primitive values (like `Integer`) or object identifiers (like `Plan`, `User`, `Exercise`). A new type like `PlanItemDetails` that bundles `perWeek`, `sets`, and `reps` would be a "composite object" in this context and should not be exposed in the action signature.

2. **Maintaining Independence:** If `RehabPlan` were to accept a `PlanItemDetails` object, any concept or synchronization that calls `addPlanItem` would need to understand the internal structure of `PlanItemDetails`. This creates a coupling between the `RehabPlan` concept's internal data structure (how it groups these three integers) and its external API. By passing individual primitives, `RehabPlan` remains more independent; the caller only needs to know that it needs to provide three integer values for these specific purposes.

3. **API Clarity and Consistency:** Concept design emphasizes atomic actions and explicit arguments. Listing the individual primitives makes the API clear about exactly what pieces of information are being provided to define an exercise's frequency and intensity.

4. **Simpler Syncs and Implementation:** Syncs would directly refer to `targetFreq: Integer`, `sets: Integer`, `reps: Integer`. In an implementation, this typically maps cleanly to individual fields in a request object (e.g., a JSON payload), avoiding the need to map nested custom objects for external callers.

**Your current `addPlanItem` signature is correct and aligns with the guidelines:**

```
addPlanItem (plan: Plan, exercise: Exercise, perWeek: Integer, sets: Integer, reps: Integer, notes: String)
```

This passes all the necessary details as individual, primitive arguments, respecting the modularity and independence principles of Concept Design.
