# Whats New
- ExerciseLibrary
  - Admin-gated mutations (actorIsAdmin required for add/update/deprecate/propose/apply/discard).
  - AI augmentation restored: proposeDetails always calls Gemini using server key; removed user overrides.
  - Switched to Google’s official @google/generative-ai SDK; added testable LLM client stub.
  - Proposal response now returns details to the UI immediately; exercise remains unchanged until apply.
  - Removed recommendedFreq from the library (frequency now belongs in RehabPlan plan items).
  - Safer applyDetails: null videoUrl clears the field; robust JSON/code-fence parsing and validation.

- UserAccount
  - register supports isAdmin (default false); login/logout/_isSignedIn implemented.
  - Share Links made useful: added queries
    - _listShareLinks (owner) → [{ shareLink, token, expiry, expired }]
    - _resolveShareLink (token) → [{ owner, ownerUsername, expiresAt, expired }]

- CheckIn
  - Authorization added: submit/amend require actor = owner.
  - Query _hasCheckIn(owner, date) added for reminder flows.

- RehabPlan
  - Owner authorization enforced on createPlan/addPlanItem/removePlanItem/archivePlan.
  - Queries added: _getActivePlanByOwner and _getPlanById.

- Feedback
  - Added _listMessages(owner) to inspect reminders/motivations.
  - New recordCompletion(owner, date, completedAll) action auto-updates streaks and 7‑day completion window.
  - Summary state extended with lastCompletedDate and recentCompletedDates.

- Server & Platform
  - CORS enabled via Hono middleware for frontend integration.
  - deno.json task now loads .env automatically (--env-file=.env) for GEMINI_API_KEY/GEMINI_MODEL.
  - Dynamic endpoint loader excludes internal helper functions from public API.

- API & Docs
  - design/api/backend.api.md updated for all changes above, including ExerciseLibrary.proposeDetails shape and new UserAccount/Feedback endpoints.

- Tests
  - Comprehensive updates across concepts: admin gating, owner checks, LLM stubbed flows, proposal apply/discard, share-link listing/resolution, and feedback streak progression. All tests pass.

# Interesting moments:


## Optional params

[@original-implementation](../../../design/concepts/checkin/implementation.md)

The LLM implemented my ammend function with optional strain and pain parameters (lines 119-120 above), but they were required in my spec. This made me realize they probably should be optional as the purpose is to change an existing checkin, and a user may want to keep these the same. I like the way it corrected that for me, but it could potentially be concerning that it did not follow directions as the implementation does not match the spec.However, in this case, I changed the spec to match the implementation afte rgiving it some thought. 

## re-assigning a const
gemini flash gave me code that made a const ID, didnt use it, then a few lines later tried to re-assign it
[Comprehensive CheckIn concept test suite →](context/design/concepts/checkin/test.md/steps/response.4d78370b.md)


## testing 
2.5 pro gave each test area its own deno.test, 2.5 flash gave them all as one deno.test with multiple steps
[See test suite and methodology ↗](context/design/concepts/feedback/test.md/steps/response.ee41c1c0.md)


## outline
I asked for an outline of my RehabPlan class with the prompt: "make an outline for my RehabPlan concept implementation according to my specification", and I did not get what I was looking for, I got an almost completed implementation. I asked again in a new file (with the same context as before) with the prompt: "I would like an outline of a implementation for RehabPlan from the given specification. Don't implement any functions yet, but give a skeleton of the class with good documentation and docstrings for any functions I need." This time, I got exactly what I was looking for, skeleton code of my concept with clear TODO comments of what I needed to implement. It was interesting to see how a more detailed prompt gave me much better results
[Implementation outline for RehabPlan →](context/design/brainstorming/RehabPlan/implementation_outline.md/steps/response.ef94f105.md)



## too much
I asked to implement 1 function, and it did, but gave me back the entire code; seems like a waste of output tokens. It did this twice.
[CreatePlan action implementation example →](context/design/concepts/RehabPlan/implementation.md/steps/response.86fcae83.md)
