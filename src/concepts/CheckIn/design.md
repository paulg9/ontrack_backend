I didn't change anything about this concept, the feedback I recieved was good.

# Interesting moments

## Optional params

[@original-implementation](../../../design/concepts/checkin/implementation.md)

The LLM implemented my ammend function with optional strain and pain parameters (lines 119-120 above), but they were required in my spec. This made me realize they probably should be optional as the purpose is to change an existing checkin, and a user may want to keep these the same. I like the way it corrected that for me, but it could potentially be concerning that it did not follow directions as the implementation does not match the spec.However, in this case, I changed the spec to match the implementation afte rgiving it some thought. 

## re-assigning a const

gemini flash gave me code that made a const ID, didnt use it, then a few lines later tried to re-assign it