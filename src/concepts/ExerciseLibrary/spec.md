## Concept: ExerciseLibrary

**Purpose** Provide a catalog of exercises that a plan is allowed to reference

**Principle** Administrators populate a library of named exercises with media and cues; athletes can browse but cannot modify it

**State**
- a set of Exercises with
  - exerciseId String
  - title String
  - videoUrl String
  - cues String
  - recommendedFreq PerWeek
  - deprecated Flag (default false)

**Actions**
- addExercise (exerciseId, title, videoUrl, cues: String, recommendedFreq: PerWeek)
  - requires no exercise exists with exerciseId
  - effects creates a new exercise

- updateExercise (exerciseId: String, fields: Map)
  - requires exercise exists
  - effects updates supplied fields on the exercise

- deprecateExercise (exerciseId: String)
  - requires exercise exists
  - effects sets deprecated := true (existing plans may still reference it)


