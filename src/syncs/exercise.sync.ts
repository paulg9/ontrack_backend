import { actions, Frames, Sync } from "@engine";
import { ExerciseLibrary, Requesting, UserAccount } from "@concepts";

const SESSION_REQUIRED_PATHS = new Set<string>([
  "/ExerciseLibrary/addExercise",
  "/ExerciseLibrary/addExerciseDraft",
  "/ExerciseLibrary/updateExercise",
  "/ExerciseLibrary/deprecateExercise",
  "/ExerciseLibrary/proposeDetails",
  "/ExerciseLibrary/applyDetails",
  "/ExerciseLibrary/discardDetails",
  "/ExerciseLibrary/_getExerciseById",
  "/ExerciseLibrary/_listExercises",
  "/ExerciseLibrary/_listProposals",
  "/ExerciseLibrary/_getProposalsForExercise",
]);

const ADMIN_REQUIRED_PATHS = new Set<string>([
  "/ExerciseLibrary/addExercise",
  "/ExerciseLibrary/addExerciseDraft",
  "/ExerciseLibrary/updateExercise",
  "/ExerciseLibrary/deprecateExercise",
  "/ExerciseLibrary/proposeDetails",
  "/ExerciseLibrary/applyDetails",
  "/ExerciseLibrary/discardDetails",
  "/ExerciseLibrary/_listProposals",
  "/ExerciseLibrary/_getProposalsForExercise",
]);

export const ExerciseLibraryRejectInvalidSession: Sync = (
  { request, session, path, error, user: _user },
) => ({
  when: actions(
    [Requesting.request, { path, session }, { request }],
  ),
  where: async (frames) => {
    const original = frames[0];
    const targeted = frames.filter(($) => {
      const currentPath = $[path];
      return typeof currentPath === "string" &&
        SESSION_REQUIRED_PATHS.has(currentPath);
    });
    if (targeted.length === 0) return new Frames();

    for (const frame of targeted) {
      const tok = frame[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token: tok });
      if (Array.isArray(res) && res.length > 0) return new Frames();
    }

    const base = Object.assign({}, original) as Record<symbol, unknown>;
    base[error] = "unauthenticated";
    return new Frames(base as never);
  },
  then: actions([Requesting.respond, { request, error }]),
});

export const ExerciseLibraryRejectNonAdmin: Sync = (
  { request, session, path, error, user: _user, isAdmin: _isAdmin },
) => ({
  when: actions(
    [Requesting.request, { path, session }, { request }],
  ),
  where: async (frames) => {
    const original = frames[0];
    const targeted = frames.filter(($) => {
      const currentPath = $[path];
      return typeof currentPath === "string" &&
        ADMIN_REQUIRED_PATHS.has(currentPath);
    });
    if (targeted.length === 0) return new Frames();

    let anyForbidden = false;
    for (const frame of targeted) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      const isOk = Array.isArray(adminRes) && adminRes[0]?.isAdmin === true;
      if (!isOk) {
        anyForbidden = true;
        break;
      }
    }
    if (!anyForbidden) return new Frames();

    const base = Object.assign({}, original) as Record<symbol, unknown>;
    base[error] = "forbidden";
    return new Frames(base as never);
  },
  then: actions([Requesting.respond, { request, error }]),
});

export const ExerciseLibrarySetLLMClientUnavailable: Sync = (
  { request },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ExerciseLibrary/setLLMClientForTesting" },
    { request },
  ]),
  then: actions([
    Requesting.respond,
    {
      request,
      error: "setLLMClientForTesting is not exposed via the public API",
    },
  ]),
});

export const ExerciseLibraryAddExerciseRequest: Sync = (
  { request, session, user: _user, isAdmin: _isAdmin, title, videoUrl, cues },
) => ({
  when: actions([
    Requesting.request,
    {
      path: "/ExerciseLibrary/addExercise",
      session,
      title,
      videoUrl,
      cues,
    },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      if (Array.isArray(adminRes) && adminRes[0]?.isAdmin === true) {
        out.push(frame);
      }
    }
    return out;
  },
  then: actions([ExerciseLibrary.addExercise, {
    title,
    videoUrl,
    cues,
    actorIsAdmin: true,
  }]),
});

export const ExerciseLibraryAddExerciseSuccess: Sync = (
  { request, exercise },
) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/addExercise" }, {
      request,
    }],
    [ExerciseLibrary.addExercise, {}, { exercise }],
  ),
  then: actions([Requesting.respond, { request, exercise }]),
});

export const ExerciseLibraryAddExerciseError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/addExercise" }, {
      request,
    }],
    [ExerciseLibrary.addExercise, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const ExerciseLibraryAddExerciseDraftRequest: Sync = (
  { request, session, user: _user, isAdmin: _isAdmin, title },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ExerciseLibrary/addExerciseDraft", session, title },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      if (Array.isArray(adminRes) && adminRes[0]?.isAdmin === true) {
        out.push(frame);
      }
    }
    return out;
  },
  then: actions([ExerciseLibrary.addExerciseDraft, {
    title,
    actorIsAdmin: true,
  }]),
});

export const ExerciseLibraryAddExerciseDraftSuccess: Sync = (
  { request, exercise },
) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/addExerciseDraft" }, {
      request,
    }],
    [ExerciseLibrary.addExerciseDraft, {}, { exercise }],
  ),
  then: actions([Requesting.respond, { request, exercise }]),
});

export const ExerciseLibraryAddExerciseDraftError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/addExerciseDraft" }, {
      request,
    }],
    [ExerciseLibrary.addExerciseDraft, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const ExerciseLibraryUpdateExerciseRequest: Sync = (
  {
    request,
    session,
    user: _user,
    isAdmin: _isAdmin,
    exercise,
    title,
    videoUrl,
    cues,
  },
) => ({
  when: actions([
    Requesting.request,
    {
      path: "/ExerciseLibrary/updateExercise",
      session,
      exercise,
      title,
      videoUrl,
      cues,
    },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      if (Array.isArray(adminRes) && adminRes[0]?.isAdmin === true) {
        out.push(frame);
      }
    }
    return out;
  },
  then: actions([ExerciseLibrary.updateExercise, {
    exercise,
    title,
    videoUrl,
    cues,
    actorIsAdmin: true,
  }]),
});

export const ExerciseLibraryUpdateExerciseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/updateExercise" }, {
      request,
    }],
    [ExerciseLibrary.updateExercise, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const ExerciseLibraryUpdateExerciseError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/updateExercise" }, {
      request,
    }],
    [ExerciseLibrary.updateExercise, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const ExerciseLibraryDeprecateExerciseRequest: Sync = (
  { request, session, user: _user, isAdmin: _isAdmin, exercise },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ExerciseLibrary/deprecateExercise", session, exercise },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      if (Array.isArray(adminRes) && adminRes[0]?.isAdmin === true) {
        out.push(frame);
      }
    }
    return out;
  },
  then: actions([ExerciseLibrary.deprecateExercise, {
    exercise,
    actorIsAdmin: true,
  }]),
});

export const ExerciseLibraryDeprecateExerciseSuccess: Sync = (
  { request },
) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/deprecateExercise" }, {
      request,
    }],
    [ExerciseLibrary.deprecateExercise, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const ExerciseLibraryDeprecateExerciseError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/deprecateExercise" }, {
      request,
    }],
    [ExerciseLibrary.deprecateExercise, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const ExerciseLibraryProposeDetailsRequest: Sync = (
  { request, session, user: _user, isAdmin: _isAdmin, exercise },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ExerciseLibrary/proposeDetails", session, exercise },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      if (Array.isArray(adminRes) && adminRes[0]?.isAdmin === true) {
        out.push(frame);
      }
    }
    return out;
  },
  then: actions([ExerciseLibrary.proposeDetails, {
    exercise,
    actorIsAdmin: true,
  }]),
});

export const ExerciseLibraryProposeDetailsSuccess: Sync = (
  { request, proposal, details },
) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/proposeDetails" }, {
      request,
    }],
    [ExerciseLibrary.proposeDetails, {}, { proposal, details }],
  ),
  then: actions([Requesting.respond, { request, proposal, details }]),
});

export const ExerciseLibraryProposeDetailsError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/proposeDetails" }, {
      request,
    }],
    [ExerciseLibrary.proposeDetails, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const ExerciseLibraryApplyDetailsRequest: Sync = (
  { request, session, user: _user, isAdmin: _isAdmin, proposal },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ExerciseLibrary/applyDetails", session, proposal },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      if (Array.isArray(adminRes) && adminRes[0]?.isAdmin === true) {
        out.push(frame);
      }
    }
    return out;
  },
  then: actions([ExerciseLibrary.applyDetails, {
    proposal,
    actorIsAdmin: true,
  }]),
});

export const ExerciseLibraryApplyDetailsRequestById: Sync = (
  { request, session, user: _user, isAdmin: _isAdmin, proposalId, proposal },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ExerciseLibrary/applyDetails", session, proposalId },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      if (Array.isArray(adminRes) && adminRes[0]?.isAdmin === true) {
        const next = Object.assign({}, frame) as Record<symbol, unknown>;
        next[proposal] = frame[proposalId] as unknown as symbol;
        out.push(next as never);
      }
    }
    return out;
  },
  then: actions([ExerciseLibrary.applyDetails, {
    proposal,
    actorIsAdmin: true,
  }]),
});

export const ExerciseLibraryApplyDetailsSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/applyDetails" }, {
      request,
    }],
    [ExerciseLibrary.applyDetails, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const ExerciseLibraryApplyDetailsError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/applyDetails" }, {
      request,
    }],
    [ExerciseLibrary.applyDetails, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const ExerciseLibraryDiscardDetailsRequest: Sync = (
  { request, session, user: _user, isAdmin: _isAdmin, proposal },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ExerciseLibrary/discardDetails", session, proposal },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      if (Array.isArray(adminRes) && adminRes[0]?.isAdmin === true) {
        out.push(frame);
      }
    }
    return out;
  },
  then: actions([ExerciseLibrary.discardDetails, {
    proposal,
    actorIsAdmin: true,
  }]),
});

export const ExerciseLibraryDiscardDetailsRequestById: Sync = (
  { request, session, user: _user, isAdmin: _isAdmin, proposalId, proposal },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ExerciseLibrary/discardDetails", session, proposalId },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      if (Array.isArray(adminRes) && adminRes[0]?.isAdmin === true) {
        const next = Object.assign({}, frame) as Record<symbol, unknown>;
        next[proposal] = frame[proposalId] as unknown as symbol;
        out.push(next as never);
      }
    }
    return out;
  },
  then: actions([ExerciseLibrary.discardDetails, {
    proposal,
    actorIsAdmin: true,
  }]),
});

export const ExerciseLibraryDiscardDetailsSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/discardDetails" }, {
      request,
    }],
    [ExerciseLibrary.discardDetails, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const ExerciseLibraryDiscardDetailsError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/discardDetails" }, {
      request,
    }],
    [ExerciseLibrary.discardDetails, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const ExerciseLibraryGetExerciseByIdQuery: Sync = (
  { request, session, user: _user, exercise, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ExerciseLibrary/_getExerciseById", session, exercise },
    { request },
  ]),
  where: async (frames) => {
    const original = frames[0];
    const authed = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token: tok });
      if (Array.isArray(res) && res.length > 0) authed.push(frame);
    }
    if (authed.length === 0) {
      const base = Object.assign({}, original) as Record<symbol, unknown>;
      base[results] = [];
      return new Frames(base as never);
    }
    const output = new Frames();

    for (const frame of authed) {
      const exerciseId = frame[exercise] as unknown as never;
      const docs = await ExerciseLibrary._getExerciseById({ exercise: exerciseId });
      const base = Object.assign({}, frame) as Record<symbol, unknown>;
      base[results] = docs;
      output.push(base as never);
    }

    return output;
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const ExerciseLibraryListExercisesQuery: Sync = (
  { request, session, user: _user, includeDeprecated, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ExerciseLibrary/_listExercises", session, includeDeprecated },
    { request },
  ]),
  where: async (frames) => {
    const original = frames[0];
    const authed = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token: tok });
      if (Array.isArray(res) && res.length > 0) authed.push(frame);
    }
    if (authed.length === 0) {
      const base = Object.assign({}, original) as Record<symbol, unknown>;
      base[results] = [];
      return new Frames(base as never);
    }
    const output = new Frames();

    for (const frame of authed) {
      const includeFlag = frame[includeDeprecated] as unknown;
      const docs = await ExerciseLibrary._listExercises({
        includeDeprecated: includeFlag === undefined ? true : Boolean(includeFlag),
      });
      const base = Object.assign({}, frame) as Record<symbol, unknown>;
      base[results] = docs;
      output.push(base as never);
    }

    return output;
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const ExerciseLibraryListProposalsQuery: Sync = (
  { request, session, user: _user, isAdmin: _isAdmin, status, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/ExerciseLibrary/_listProposals", session },
    { request },
  ]),
  where: async (frames) => {
    const _original = frames[0];
    const allowed = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      if (Array.isArray(adminRes) && adminRes[0]?.isAdmin === true) {
        allowed.push(frame);
      }
    }
    if (allowed.length === 0) {
      return new Frames();
    }
    const output = new Frames();

    for (const frame of allowed) {
      const statusFilter = frame[status] as unknown as never;
      const proposals = await ExerciseLibrary._listProposals({
        status: statusFilter,
      });
      const base = Object.assign({}, frame) as Record<symbol, unknown>;
      base[results] = proposals;
      output.push(base as never);
    }

    return output;
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const ExerciseLibraryGetProposalsForExerciseQuery: Sync = (
  { request, session, user: _user, isAdmin: _isAdmin, exercise, results },
) => ({
  when: actions([
    Requesting.request,
    {
      path: "/ExerciseLibrary/_getProposalsForExercise",
      session,
      exercise,
    },
    { request },
  ]),
  where: async (frames) => {
    const _original = frames[0];
    const allowed = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      if (Array.isArray(adminRes) && adminRes[0]?.isAdmin === true) {
        allowed.push(frame);
      }
    }
    if (allowed.length === 0) {
      return new Frames();
    }
    const output = new Frames();

    for (const frame of allowed) {
      const exerciseId = frame[exercise] as unknown as never;
      const proposals = await ExerciseLibrary._getProposalsForExercise({
        exercise: exerciseId,
      });
      const base = Object.assign({}, frame) as Record<symbol, unknown>;
      base[results] = proposals;
      output.push(base as never);
    }

    return output;
  },
  then: actions([Requesting.respond, { request, results }]),
});

