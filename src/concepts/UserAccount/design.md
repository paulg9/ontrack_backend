The `User` concept was **renamed to `UserAccount`** to better reflect its role
as a manager of user-related features rather than simply representing a user
entity. The **purpose was refined** to encompass "creation, management, and
personalization of a user's account," aiming to pragmatically consolidate user
identity/authentication, notification preferences, and sharing link
functionalities under a single, broader but cohesive scope. Additionally, the
**state declaration for `Users` was made more explicit** by including
`username String` and `passwordHash String` to clearly support the `register`
action, and `owner User` in `ShareLinks` was clarified for better state
modeling. Share links now have thin queries—`_listShareLinks` for a user's
dashboard and `_resolveShareLink` for anyone holding a token—so generating a
link produces metadata that downstream experiences can actually render. The
actions themselves remained the same, reflecting a strategic decision to bundle
these functionalities into one concept despite the ideal of more granular
separation.
