changed:
- Added `actor` authorization to all actions (`createPlan`, `addPlanItem`, `removePlanItem`, `archivePlan`) requiring plan owner.
- Added queries `_getActivePlanByOwner` and `_getPlanById` to support UI/data access without breaking concept independence.
- sets, reps, per week to be numbers, rather than a composite tpe


interesting moment:
I asked for an outline of my RehabPlan class with the prompt: "make an outline for my RehabPlan concept implementation according to my specification", and I did not get what I was looking for, I got an almost completed implementation. I asked again in a new file (with the same context as before) with the prompt: "I would like an outline of a implementation for RehabPlan from the given specification. Don't implement any functions yet, but give a skeleton of the class with good documentation and docstrings for any functions I need." This time, I got exactly what I was looking for, skeleton code of my concept with clear TODO comments of what I needed to implement. It was interesting to see how a more detailed prompt gave me much better results



I asked to implement 1 function, and it did, but gave me back the entire code; seems like a waste of output tokens. It did this twice.