import { actions, Frames, Sync } from "@engine";
import { CheckIn, Requesting, UserAccount } from "@concepts";

const CHECKIN_PATHS = new Set<string>([
  "/CheckIn/submit",
  "/CheckIn/amend",
  "/CheckIn/_getCheckInByOwnerAndDate",
  "/CheckIn/_getCheckInsByOwner",
  "/CheckIn/_getCheckInById",
  "/CheckIn/_hasCheckIn",
]);

const CHECKIN_SHARE_PATHS = new Set<string>([
  "/CheckIn/_getCheckInsByOwner",
]);

export const CheckInRejectInvalidSession: Sync = (
  { request, session, path, error, authedUser: _authedUser },
) => ({
  when: actions(
    [Requesting.request, { path, session }, { request }],
  ),
  where: async (frames) => {
    const original = frames[0];
    const targeted = frames.filter(($) => {
      const currentPath = $[path];
      return typeof currentPath === "string" && CHECKIN_PATHS.has(currentPath);
    });
    if (targeted.length === 0) return new Frames();

    // Manually resolve session to user to avoid union return type issues
    const resolved = new Frames();
    for (const frame of targeted) {
      const token = frame[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token });
      if (Array.isArray(res) && res.length > 0) {
        resolved.push(frame);
      }
    }
    if (resolved.length > 0) return new Frames();

    const base = Object.assign({}, original) as Record<symbol, unknown>;
    base[error] = "unauthenticated";
    return new Frames(base as never);
  },
  then: actions([Requesting.respond, { request, error }]),
});

export const CheckInSubmitRequest: Sync = (
  { request, session, authedUser, owner, actor, date, completedItems, strain_0_10, pain_0_10, comment },
) => ({
  when: actions([
    Requesting.request,
    {
      path: "/CheckIn/submit",
      session,
      date,
      completedItems,
      strain_0_10,
      pain_0_10,
      comment,
    },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const $ of frames) {
      const token = $[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token });
      if (!Array.isArray(res) || res.length === 0) continue;
      const next = Object.assign({}, $) as Record<symbol, unknown>;
      // bind authed user as both owner and actor
      next[authedUser] = res[0].user as unknown as symbol;
      next[owner] = res[0].user as unknown as symbol;
      next[actor] = res[0].user as unknown as symbol;
      out.push(next as never);
    }
    return out;
  },
  then: actions([CheckIn.submit, {
    actor,
    owner,
    date,
    completedItems,
    strain_0_10,
    pain_0_10,
    comment,
  }]),
});

export const CheckInSubmitSuccess: Sync = ({ request, checkin }) => ({
  when: actions(
    [Requesting.request, { path: "/CheckIn/submit" }, { request }],
    [CheckIn.submit, {}, { checkin }],
  ),
  then: actions([Requesting.respond, { request, checkin }]),
});

export const CheckInSubmitError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/CheckIn/submit" }, { request }],
    [CheckIn.submit, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const CheckInAmendRequest: Sync = (
  {
    request,
    session,
    authedUser,
    actor,
    checkin,
    completedItems,
    strain_0_10,
    pain_0_10,
    comment,
  },
) => ({
  when: actions([
    Requesting.request,
    {
      path: "/CheckIn/amend",
      session,
      checkin,
      completedItems,
      strain_0_10,
      pain_0_10,
      comment,
    },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const $ of frames) {
      const token = $[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token });
      if (!Array.isArray(res) || res.length === 0) continue;
      const next = Object.assign({}, $) as Record<symbol, unknown>;
      next[authedUser] = res[0].user as unknown as symbol;
      next[actor] = res[0].user as unknown as symbol;
      out.push(next as never);
    }
    return out;
  },
  then: actions([CheckIn.amend, {
    actor,
    checkin,
    completedItems,
    strain_0_10,
    pain_0_10,
    comment,
  }]),
});

export const CheckInAmendSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/CheckIn/amend" }, { request }],
    [CheckIn.amend, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const CheckInAmendError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/CheckIn/amend" }, { request }],
    [CheckIn.amend, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const CheckInGetByOwnerAndDate: Sync = (
  { request, session, authedUser, owner, date, checkin, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/CheckIn/_getCheckInByOwnerAndDate", session, date },
    { request },
  ]),
  where: async (frames) => {
    const original = frames[0];
    const withUser = new Frames();
    for (const $ of frames) {
      const token = $[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token });
      if (!Array.isArray(res) || res.length === 0) continue;
      const next = Object.assign({}, $) as Record<symbol, unknown>;
      const u = res[0].user as unknown as symbol;
      next[authedUser] = u;
      next[owner] = u;
      withUser.push(next as never);
    }
    if (withUser.length === 0) return new Frames();
    frames = await frames.query(
      CheckIn._getCheckInByOwnerAndDate,
      { owner, date },
      { checkin },
    );
    if (frames.length === 0) {
      const base = Object.assign({}, original) as Record<symbol, unknown>;
      base[results] = [];
      return new Frames(base as never);
    }
    return frames.collectAs([checkin], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const CheckInGetByOwner: Sync = (
  { request, session, authedUser, owner, checkin, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/CheckIn/_getCheckInsByOwner", session },
    { request },
  ]),
  where: async (frames) => {
    const original = frames[0];
    const bound = new Frames();
    for (const $ of frames) {
      const token = $[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token });
      if (!Array.isArray(res) || res.length === 0) continue;
      const next = Object.assign({}, $) as Record<symbol, unknown>;
      const u = res[0].user as unknown as symbol;
      next[authedUser] = u;
      next[owner] = u;
      bound.push(next as never);
    }
    if (bound.length === 0) return new Frames();
    frames = await frames.query(
      CheckIn._getCheckInsByOwner,
      { owner },
      { checkin },
    );
    if (frames.length === 0) {
      const base = Object.assign({}, original) as Record<symbol, unknown>;
      base[results] = [];
      return new Frames(base as never);
    }
    return frames.collectAs([checkin], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const CheckInGetById: Sync = (
  { request, session, authedUser, checkin, checkinDoc, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/CheckIn/_getCheckInById", session, checkin },
    { request },
  ]),
  where: async (frames) => {
    const original = frames[0];
    const bound = new Frames();
    for (const $ of frames) {
      const token = $[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token });
      if (!Array.isArray(res) || res.length === 0) continue;
      const next = Object.assign({}, $) as Record<symbol, unknown>;
      next[authedUser] = res[0].user as unknown as symbol;
      bound.push(next as never);
    }
    if (bound.length === 0) return new Frames();
    frames = await frames.query(
      CheckIn._getCheckInById,
      { checkin },
      { doc: checkinDoc },
    );
    frames = frames.filter(($) => {
      const doc = $[checkinDoc] as { owner?: unknown };
      return doc && doc.owner === (bound[0] as Record<symbol, unknown>)[authedUser];
    });
    if (frames.length === 0) {
      const base = Object.assign({}, original) as Record<symbol, unknown>;
      base[results] = [];
      return new Frames(base as never);
    }
    return frames.collectAs([checkinDoc], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const CheckInHasCheckIn: Sync = (
  { request, session, authedUser, owner, date, has, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/CheckIn/_hasCheckIn", session, date },
    { request },
  ]),
  where: async (frames) => {
    const original = frames[0];
    const bound = new Frames();
    for (const $ of frames) {
      const token = $[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token });
      if (!Array.isArray(res) || res.length === 0) continue;
      const next = Object.assign({}, $) as Record<symbol, unknown>;
      const u = res[0].user as unknown as symbol;
      next[authedUser] = u;
      next[owner] = u;
      bound.push(next as never);
    }
    if (bound.length === 0) return new Frames();
    frames = await frames.query(
      CheckIn._hasCheckIn,
      { owner, date },
      { has },
    );
    if (frames.length === 0) {
      const base = Object.assign({}, original) as Record<symbol, unknown>;
      base[results] = [];
      return new Frames(base as never);
    }
    return frames.collectAs([has], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const CheckInRejectInvalidShareLink: Sync = (
  { request, path, shareToken, error, linkInfo },
) => ({
  when: actions(
    [Requesting.request, { path, shareToken }, { request }],
  ),
  where: async (frames) => {
    const targeted = frames.filter(($) => {
      const currentPath = $[path];
      const token = $[shareToken];
      return typeof currentPath === "string" &&
        CHECKIN_SHARE_PATHS.has(currentPath) &&
        typeof token === "string" &&
        token.length > 0;
    });
    if (targeted.length === 0) return new Frames();

    const resolved = await targeted.query(
      UserAccount._resolveShareLink,
      { token: shareToken },
      { link: linkInfo },
    );
    const valid = resolved.filter(($) => {
      const info = $[linkInfo] as { expired?: boolean } | undefined;
      return info && info.expired === false;
    });
    if (valid.length > 0) return new Frames();

    const base = Object.assign({}, targeted[0]) as Record<symbol, unknown>;
    const info = resolved[0]?.[linkInfo] as { expired?: boolean } | undefined;
    base[error] = info?.expired ? "share_link_expired" : "invalid_share_token";
    return new Frames(base as never);
  },
  then: actions([Requesting.respond, { request, error }]),
});

export const CheckInGetByOwnerShareLink: Sync = (
  { request, shareToken, linkInfo, owner, checkin, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/CheckIn/_getCheckInsByOwner", shareToken },
    { request },
  ]),
  where: async (frames) => {
    const original = frames[0];
    frames = await frames.query(
      UserAccount._resolveShareLink,
      { token: shareToken },
      { link: linkInfo },
    );
    frames = frames.filter(($) => {
      const info = $[linkInfo] as { expired?: boolean } | undefined;
      return info && info.expired === false;
    });
    if (frames.length === 0) return new Frames();

    frames = frames.map(($) => {
      const next = Object.assign({}, $) as Record<symbol, unknown>;
      const info = $[linkInfo] as { owner?: unknown } | undefined;
      if (info && info.owner) {
        next[owner] = info.owner;
      }
      return next as never;
    });

    frames = await frames.query(
      CheckIn._getCheckInsByOwner,
      { owner },
      { checkin },
    );
    if (frames.length === 0) {
      const base = Object.assign({}, original) as Record<symbol, unknown>;
      base[results] = [];
      return new Frames(base as never);
    }
    return frames.collectAs([checkin], results);
  },
  then: actions([Requesting.respond, { request, results }]),
});

