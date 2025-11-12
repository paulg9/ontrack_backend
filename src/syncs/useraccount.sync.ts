import { actions, Frames, Sync } from "@engine";
import { Requesting, UserAccount } from "@concepts";

const SESSION_REQUIRED_PATHS = new Set<string>([
  "/UserAccount/logout",
  "/UserAccount/setReminderTime",
  "/UserAccount/createShareLink",
  "/UserAccount/revokeShareLink",
  "/UserAccount/_isAdmin",
  "/UserAccount/_listShareLinks",
]);

export const UserAccountRejectInvalidSession: Sync = (
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

export const UserAccountLogoutRequest: Sync = ({ request, session }) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAccount/logout", session },
    { request },
  ]),
  then: actions([UserAccount.logout, { token: session }]),
});

export const UserAccountLogoutSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAccount/logout" }, { request }],
    [UserAccount.logout, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const UserAccountLogoutError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAccount/logout" }, { request }],
    [UserAccount.logout, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const UserAccountSetReminderTimeRequest: Sync = (
  { request, session, user, time },
) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAccount/setReminderTime", session, time },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(res) || res.length === 0) continue;
      const next = Object.assign({}, frame) as Record<symbol, unknown>;
      next[user] = res[0].user as unknown as symbol;
      out.push(next as never);
    }
    return out;
  },
  then: actions([UserAccount.setReminderTime, { user, time }]),
});

export const UserAccountSetReminderTimeSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAccount/setReminderTime" }, {
      request,
    }],
    [UserAccount.setReminderTime, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const UserAccountSetReminderTimeError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/UserAccount/setReminderTime" }, {
      request,
    }],
    [UserAccount.setReminderTime, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const UserAccountCreateShareLinkRequest: Sync = (
  { request, session, user, ttlSeconds },
) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAccount/createShareLink", session, ttlSeconds },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(res) || res.length === 0) continue;
      const next = Object.assign({}, frame) as Record<symbol, unknown>;
      next[user] = res[0].user as unknown as symbol;
      out.push(next as never);
    }
    return out;
  },
  then: actions([UserAccount.createShareLink, { owner: user, ttlSeconds }]),
});

export const UserAccountCreateShareLinkSuccess: Sync = (
  { request, token },
) => ({
  when: actions(
    [Requesting.request, { path: "/UserAccount/createShareLink" }, {
      request,
    }],
    [UserAccount.createShareLink, {}, { token }],
  ),
  then: actions([Requesting.respond, { request, token }]),
});

export const UserAccountCreateShareLinkError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/UserAccount/createShareLink" }, {
      request,
    }],
    [UserAccount.createShareLink, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const UserAccountRevokeShareLinkRequest: Sync = (
  { request, session, user, token },
) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAccount/revokeShareLink", session, token },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(res) || res.length === 0) continue;
      const next = Object.assign({}, frame) as Record<symbol, unknown>;
      next[user] = res[0].user as unknown as symbol;
      out.push(next as never);
    }
    return out;
  },
  then: actions([UserAccount.revokeShareLink, { owner: user, token }]),
});

export const UserAccountRevokeShareLinkSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAccount/revokeShareLink" }, {
      request,
    }],
    [UserAccount.revokeShareLink, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const UserAccountRevokeShareLinkError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/UserAccount/revokeShareLink" }, {
      request,
    }],
    [UserAccount.revokeShareLink, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const UserAccountGetUserByTokenQuery: Sync = (
  { request, session, user: _user, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAccount/_getUserByToken", session },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token: tok });
      const base = Object.assign({}, frame) as Record<symbol, unknown>;
      base[results] = Array.isArray(res) ? res : [];
      out.push(base as never);
    }
    return out;
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const UserAccountIsSignedInQuery: Sync = (
  { request, session, signedIn: _signedIn, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAccount/_isSignedIn", session },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const res = await UserAccount._isSignedIn({ token: tok });
      const base = Object.assign({}, frame) as Record<symbol, unknown>;
      base[results] = Array.isArray(res) ? res : [];
      out.push(base as never);
    }
    return out;
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const UserAccountIsAdminQuery: Sync = (
  { request, session, user: _user, isAdmin: _isAdmin, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAccount/_isAdmin", session },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      const base = Object.assign({}, frame) as Record<symbol, unknown>;
      base[results] = Array.isArray(adminRes)
        ? adminRes.map((r) => ({ isAdmin: r.isAdmin }))
        : [];
      out.push(base as never);
    }
    return out;
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const UserAccountListShareLinksQuery: Sync = (
  { request, session, user: _user, entry: _entry, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAccount/_listShareLinks", session },
    { request },
  ]),
  where: async (frames) => {
    const out = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const list = await UserAccount._listShareLinks({
        owner: userRes[0].user,
      });
      const base = Object.assign({}, frame) as Record<symbol, unknown>;
      base[results] = Array.isArray(list) ? list : [];
      out.push(base as never);
    }
    return out;
  },
  then: actions([Requesting.respond, { request, results }]),
});

