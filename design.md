Interesting moments:


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
