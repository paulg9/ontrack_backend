## Concept: ExerciseLibrary

**Purpose** Provide a catalog of exercises that a plan is allowed to reference

**Principle** Administrators populate a library of named exercises with media
and cues. Athletes can browse but cannot modify it. Administrators may request
AI-proposed details for an exercise and then explicitly apply or discard those
proposals; no changes occur to the exercise without an explicit apply.

**State**

- a set of Exercises with
  - a title String
  - an optional videoUrl String
  - a cues String
  - a recommendedFreq Number // sessions per week (integer 0..14)
  - a deprecated Flag // default false

- a set of DetailProposals with
  - an exercise Exercise
  - a createdAt DateTime
  - an optional videoUrl String
  - a cues String
  - a recommendedFreq Number // integer 0..14
  - a confidence_0_1 Number // 0..1
  - a status Enum {"pending","applied","discarded"}

invariants

- every DetailProposal.exercise references an existing Exercise
- every DetailProposal has status in {pending, applied, discarded}

**Actions**

- addExercise (title: String, videoUrl?: Optional String, cues: String,
  recommendedFreq: Number, actorIsAdmin: Boolean): (exercise: Exercise)
  - requires actorIsAdmin = true; title non-empty; 0 <= recommendedFreq <= 14
    and integer
  - effects creates a new Exercise with deprecated := false; returns its id as
    exercise

- addExerciseDraft (title: String, actorIsAdmin: Boolean): (exercise: Exercise)
  - requires actorIsAdmin = true; title non-empty
  - effects creates a new Exercise with minimal details (videoUrl := empty, cues
    := empty, recommendedFreq := 0, deprecated := false); returns its id as
    exercise

- updateExercise (exercise: Exercise, title?: String, videoUrl?: Optional
  String, cues?: String, recommendedFreq?: Number, actorIsAdmin: Boolean): ()
  - requires actorIsAdmin = true; exercise exists
  - effects updates supplied optional fields on the exercise

- deprecateExercise (exercise: Exercise, actorIsAdmin: Boolean): ()
  - requires actorIsAdmin = true; exercise exists
  - effects sets deprecated := true (existing plans may still reference it; new
    selections should exclude it)

- proposeDetails (exercise: Exercise, actorIsAdmin: Boolean): (proposal:
  DetailProposal, details: {videoUrl?: Optional String, cues: String,
  recommendedFreq: Number, confidence_0_1: Number})
  - requires actorIsAdmin = true; exercise exists; the environment variable
    `GEMINI_API_KEY` is configured
  - effects composes a fixed prompt from the current exercise fields, calls
    Gemini to obtain a JSON proposal, validates fields, records a DetailProposal
    with status := "pending" without modifying the exercise, and returns the
    proposal id alongside the normalized details for immediate use by the caller

- applyDetails (proposal: DetailProposal, actorIsAdmin: Boolean): ()
  - requires actorIsAdmin = true; a pending DetailProposal exists with id =
    proposal
  - effects updates the referenced exercise with any fields present in the
    proposal:
    - if proposal.videoUrl is present and non-empty, set exercise.videoUrl :=
      proposal.videoUrl
    - set exercise.cues := proposal.cues
    - set exercise.recommendedFreq := proposal.recommendedFreq
    - set proposal.status := "applied"

- discardDetails (proposal: DetailProposal, actorIsAdmin: Boolean): ()
  - requires actorIsAdmin = true; a pending DetailProposal exists with id =
    proposal
  - effects sets proposal.status := "discarded" with no change to the exercise

**Queries**

- _getExerciseById (exercise: Exercise): (exercise: {title: String, videoUrl?:
  Optional String, cues: String, recommendedFreq: Number, deprecated: Flag})
- _listExercises (includeDeprecated?: Flag): (exercise: {exercise: Exercise,
  title: String, videoUrl?: Optional String, cues: String, recommendedFreq:
  Number, deprecated: Flag})
- _listProposals (status?: String): (proposal: {proposal: DetailProposal,
  exercise: Exercise, createdAt: DateTime, videoUrl?: Optional String, cues:
  String, recommendedFreq: Number, confidence_0_1: Number, status: String})
