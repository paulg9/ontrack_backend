---
timestamp: 'Thu Oct 23 2025 22:48:06 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251023_224806.ecefc4d4.md]]'
content_id: fcc3de6e03331331a014d5874ae5203478759b0bcf4a627d19abe53b6f04502b
---

# prompt: review how well my RehabPlan specification fits the provided docs, as well as this blurb from the assignment instructions:

<refactoring concepts>
Refactoring your concepts. Until now, you have been defining concepts in the abstract. In this assignment, as you implement and test your concepts, they will become more concrete and you will more easily be able to see any flaws. You should therefore take this opportunity to refactor your concepts as you see fit, taking into account feedback you received on the design assignment, and evolving them as you work. You should pay particular attention to correcting these common flaws:

Composite objects. Make sure that all of the arguments and results of your actions are either primitive values (strings, numbers, etc) or object identifiers (actually document identifiers in MongoDB). Composite objects should be used only inside concept implementations and never exposed.
Conflation of concerns. Make sure that your concepts separate concerns, and that each one embodies only one concern and does not conflate multiple, unrelated concerns. You may want to review the lectures on modularity if you are not confident that you understand this idea.
Data structures. A concept that is nothing more than a data structure without any interesting behavior is suspect, and is usually a sign that the data structure should have been incorporated into another concept.
Dependencies. Make sure that your concepts are fully independent. There should be no function calls between concepts, and no reference in one concept to the database state of another concept.
\</refactoring concepts>
