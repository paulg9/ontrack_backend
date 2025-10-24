---
timestamp: 'Thu Oct 23 2025 22:27:20 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_222720.47aae83c.md]]'
content_id: 65e802f06629e97bca66fd1e1fffa43d931339d337450e3d4adbf188c209835c
---

# response:

```typescript
  /**
   * removePlanItem (plan: Plan, exercise: Exercise)
   *
   * **requires** plan exists and an item for exercise exists
   *
   * **effects** removes that PlanItem
   *
   * @param params An object containing the plan ID and the exercise ID of the item to remove.
   * @returns A Promise resolving to an Empty object on success,
   *          or an object with an 'error' string if the operation fails.
   */
  async removePlanItem({ plan, exercise }: { plan: Plan; exercise: Exercise }): Promise<Empty | { error: string }> {
    try {
      // Precondition 1: Verify the 'plan' exists.
      const existingPlan = await this.plans.findOne({ _id: plan });
      if (!existingPlan) {
        console.warn(`[RehabPlanConcept] Plan ${plan} not found for removal of item ${exercise}.`);
        return { error: `Plan ${plan} not found.` };
      }

      // Precondition 2: Verify that a PlanItem for the given 'exercise' exists within that plan's 'items' array.
      const existingPlanItem = existingPlan.items.find(item => item.exercise === exercise);
      if (!existingPlanItem) {
        console.warn(`[RehabPlanConcept] Plan ${plan} does not contain an item for exercise ${exercise}.`);
        return { error: `Exercise ${exercise} not found in plan ${plan}.` };
      }

      // Effect: Use an update operation ($pull) to remove the PlanItem from the 'items' array.
      const result = await this.plans.updateOne(
        { _id: plan },
        { $pull: { items: { exercise: exercise } } }
      );

      if (result.matchedCount === 0) {
        // This case should ideally be caught by the initial findOne, but acts as a safeguard.
        console.error(`[RehabPlanConcept] Plan ${plan} not found during update to remove item.`);
        return { error: `Plan ${plan} not found.` };
      }
      if (result.modifiedCount === 0) {
        // This indicates the document was found, but the update didn't change anything.
        // Given the precondition check, this scenario is less likely but good to guard against.
        console.warn(`[RehabPlanConcept] Plan ${plan} was found but not modified to remove item ${exercise}.`);
        return { error: `Failed to remove item ${exercise} from plan ${plan}. No modification occurred.` };
      }

      console.log(`[RehabPlanConcept] Removed item ${exercise} from plan ${plan}.`);
      return {}; // Return an empty object on success.
    } catch (e) {
      console.error(`[RehabPlanConcept] Error removing plan item ${exercise} from plan ${plan}:`, e);
      return { error: `An unexpected error occurred: ${e.message}` };
    }
  }
```
