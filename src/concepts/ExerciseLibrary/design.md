# ExerciseLibrary — Changes from previous AI-augmented implementation/spec

## What changed and why

- Modularity and signatures
  - Switched from a Node/TS in-memory class with multi-arg methods to a Deno +
    MongoDB concept class whose actions take a single dictionary argument and
    return a dictionary (or `{error}`), aligning with the assignment rules.
  - Introduced underscore-prefixed queries that always return arrays to support
    testing and state inspection.

- Persistence model
  - Replaced in-memory `Map` state with MongoDB collections:
    `ExerciseLibrary.exercises` and `ExerciseLibrary.detailProposals`.
  - Adopted branded `ID` (`_id`) for both Exercises and Proposals, generated via
    `freshID()`; removed the externally supplied `exerciseId` field.

- AI proposal flow
  - `proposeDetails` now mirrors the original AI-augmented design: the concept
    composes the fixed Gemini prompt from the current exercise data, calls
    Gemini using `GEMINI_API_KEY`, and stores the resulting JSON as a pending
    proposal, returning the normalized details alongside the proposal id.
  - The runtime implementation uses Google's official `@google/generative-ai`
    client (model defaults to `gemini-2.0-flash`). Tests inject a stubbed
    `ExerciseLibraryLLMClient`, so no manual `llmText` overrides are needed
    anywhere.
  - Kept the proposal records and explicit apply/discard actions. No exercise
    changes occur until `applyDetails`.

- Validation and guardrails
  - Maintained and clarified validators from the prior version: safe cues (no
    HTML, max length 400) and URL normalization (http/https, length ≤ 2048).
  - Removed the `recommendedFreq` field entirely so intensity/frequency is owned
    by `RehabPlan`; proposals now focus on media cues plus confidence only.
  - Tightened return-shape consistency: normal errors return `{error: string}`
    rather than throw; only truly exceptional scenarios would throw (none
    expected here).

- Spec alignment
  - Expanded the spec to include `DetailProposals`, `proposeDetails`,
    `applyDetails`, and `discardDetails` to match the prior AI-augmented
    behavior.
  - Updated action signatures to concept style (dictionary args/results) and
    added queries for testing: `_listExercises`, `_getExerciseById`,
    `_listProposals`, `_getProposalsForExercise`.

## Notable divergences from the previous assignment

- Role checks were removed from the implementation (previously used
  `Role = 'Administrator' | 'Athlete'`). Enforcing roles would couple concepts;
  instead, role enforcement belongs to a separate concept or the app layer. The
  spec still assumes admin-only mutation in the product design, but this concept
  remains self-contained.
- IDs are system-generated. Previously, `exerciseId` was provided by the caller;
  now `_id` is generated. If human-friendly slugs are needed later, they can be
  an additional field, not the primary key.
- The concept expects `GEMINI_API_KEY` in its environment when running in "real"
  mode; when absent it returns a clear error so environments without the key
  (e.g., tests) can inject a stub LLM client when constructing the concept.

## Residual risks and future work

- Proposal JSON format: the concept validates and rejects unexpected shapes, but
  upstream prompt engineering (in a future LLM wrapper concept) should ensure
  the JSON schema contract.
- Soft deletion: deprecation hides exercises from new selections; queries expose
  an `includeDeprecated` flag to support both views. If hard deletion or
  versioning is needed, add an explicit archival action.

## Testing notes

- Added a principle test (populate, update, deprecate, browse) and variants
  (proposal apply/discard, validation edge cases, update semantics, non-existent
  resource errors) using `testDb()` with the Deno test framework.
