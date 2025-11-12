import { actions, Frames, Sync } from "@engine";
import { RehabPlan, Requesting, UserAccount } from "@concepts";

const REHAB_PLAN_PATHS = new Set<string>([
  "/RehabPlan/createPlan",
  "/RehabPlan/addPlanItem",
  "/RehabPlan/removePlanItem",
  "/RehabPlan/archivePlan",
  "/RehabPlan/_getActivePlanByOwner",
  "/RehabPlan/_getPlanById",
]);

const REHAB_PLAN_SHARE_PATHS = new Set<string>([
  "/RehabPlan/_getPlanById",
]);

export const RehabPlanRejectInvalidSession: Sync = (
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
        REHAB_PLAN_PATHS.has(currentPath);
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

export const RehabPlanCreatePlanRequest: Sync = (
  { request, session, user },
) => ({
  when: actions([
    Requesting.request,
    { path: "/RehabPlan/createPlan", session },
    { request },
  ]),
  where: async (frames) => {
    const authed = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token: tok });
      if (Array.isArray(res) && res.length > 0) {
        const next = Object.assign({}, frame) as Record<symbol, unknown>;
        next[user] = res[0].user as unknown as symbol;
        authed.push(next as never);
      }
    }
    if (authed.length === 0) return authed;

    const existing = await authed.query(
      RehabPlan._getActivePlanByOwner,
      { owner: user },
      { plan: Symbol("existingPlan") },
    );

    if (existing.length > 0) {
      return new Frames();
    }

    return authed;
  },
  then: actions([RehabPlan.createPlan, { actor: user, owner: user }]),
});

export const RehabPlanCreatePlanSuccess: Sync = ({ request, plan }) => ({
  when: actions(
    [Requesting.request, { path: "/RehabPlan/createPlan" }, { request }],
    [RehabPlan.createPlan, {}, { plan }],
  ),
  then: actions([Requesting.respond, { request, plan }]),
});

export const RehabPlanCreatePlanError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/RehabPlan/createPlan" }, { request }],
    [RehabPlan.createPlan, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const RehabPlanCreatePlanAlreadyExists: Sync = (
  { request, session, user, existingPlanDoc, plan },
) => ({
  when: actions([
    Requesting.request,
    { path: "/RehabPlan/createPlan", session },
    { request },
  ]),
  where: async (frames) => {
    const authed = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token: tok });
      if (Array.isArray(res) && res.length > 0) {
        const next = Object.assign({}, frame) as Record<symbol, unknown>;
        next[user] = res[0].user as unknown as symbol;
        authed.push(next as never);
      }
    }
    if (authed.length === 0) return new Frames();

    frames = await authed.query(
      RehabPlan._getActivePlanByOwner,
      { owner: user },
      { plan: existingPlanDoc },
    );
    if (frames.length === 0) return new Frames();

    return frames.map(($) => {
      const doc = $[existingPlanDoc] as { _id: string };
      const next = Object.assign({}, $) as Record<symbol, unknown>;
      next[plan] = doc?._id;
      return next as never;
    });
  },
  then: actions([Requesting.respond, { request, plan }]),
});

export const RehabPlanAddItemRequest: Sync = (
  { request, session, user, plan, exercise, perWeek, sets, reps, notes },
) => ({
  when: actions([
    Requesting.request,
    {
      path: "/RehabPlan/addPlanItem",
      session,
      plan,
      exercise,
      perWeek,
      sets,
      reps,
      notes,
    },
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
  then: actions([RehabPlan.addPlanItem, {
    actor: user,
    plan,
    exercise,
    perWeek,
    sets,
    reps,
    notes,
  }]),
});

export const RehabPlanAddItemSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/RehabPlan/addPlanItem" }, { request }],
    [RehabPlan.addPlanItem, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const RehabPlanAddItemError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/RehabPlan/addPlanItem" }, { request }],
    [RehabPlan.addPlanItem, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const RehabPlanRemoveItemRequest: Sync = (
  { request, session, user, plan, exercise },
) => ({
  when: actions([
    Requesting.request,
    { path: "/RehabPlan/removePlanItem", session, plan, exercise },
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
  then: actions([RehabPlan.removePlanItem, { actor: user, plan, exercise }]),
});

export const RehabPlanRemoveItemSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/RehabPlan/removePlanItem" }, { request }],
    [RehabPlan.removePlanItem, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const RehabPlanRemoveItemError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/RehabPlan/removePlanItem" }, { request }],
    [RehabPlan.removePlanItem, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const RehabPlanArchiveRequest: Sync = (
  { request, session, user, plan },
) => ({
  when: actions([
    Requesting.request,
    { path: "/RehabPlan/archivePlan", session, plan },
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
  then: actions([RehabPlan.archivePlan, { actor: user, plan }]),
});

export const RehabPlanArchiveSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/RehabPlan/archivePlan" }, { request }],
    [RehabPlan.archivePlan, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const RehabPlanArchiveError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/RehabPlan/archivePlan" }, { request }],
    [RehabPlan.archivePlan, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const RehabPlanGetActivePlanQuery: Sync = (
  { request, session, user, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/RehabPlan/_getActivePlanByOwner", session },
    { request },
  ]),
  where: async (frames) => {
    const authed = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token: tok });
      if (Array.isArray(res) && res.length > 0) {
        const next = Object.assign({}, frame) as Record<symbol, unknown>;
        next[user] = res[0].user as unknown as symbol;
        authed.push(next as never);
      }
    }
    if (authed.length === 0) return new Frames();

    const output = new Frames();
    for (const frame of authed) {
      const ownerId = frame[user] as unknown;
      const docs = await RehabPlan._getActivePlanByOwner({ owner: ownerId as never });
      const base = Object.assign({}, frame) as Record<symbol, unknown>;
      base[results] = Array.isArray(docs) ? docs : [];
      output.push(base as never);
    }
    return output;
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const RehabPlanGetByIdQuery: Sync = (
  { request, session, user, plan, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/RehabPlan/_getPlanById", session, plan },
    { request },
  ]),
  where: async (frames) => {
    const authed = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const res = await UserAccount._getUserByToken({ token: tok });
      if (Array.isArray(res) && res.length > 0) {
        const next = Object.assign({}, frame) as Record<symbol, unknown>;
        next[user] = res[0].user as unknown as symbol;
        authed.push(next as never);
      }
    }
    if (authed.length === 0) return new Frames();

    const output = new Frames();
    for (const frame of authed) {
      const planId = frame[plan];
      const docs = await RehabPlan._getPlanById({ plan: planId as never });
      const ownerId = frame[user];
      const filtered = (Array.isArray(docs) ? docs : []).filter((d) => {
        const anyDoc = d as unknown as { owner?: unknown };
        return anyDoc?.owner === ownerId;
      });
      const base = Object.assign({}, frame) as Record<symbol, unknown>;
      base[results] = filtered;
      output.push(base as never);
    }
    return output;
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const RehabPlanRejectInvalidShareLink: Sync = (
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
        REHAB_PLAN_SHARE_PATHS.has(currentPath) &&
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

export const RehabPlanGetByIdShareLink: Sync = (
  { request, shareToken, linkInfo, plan, planDoc, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/RehabPlan/_getPlanById", shareToken, plan },
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

    frames = await frames.query(
      RehabPlan._getPlanById,
      { plan },
      { plan: planDoc },
    );
    frames = frames.filter(($) => {
      const info = $[linkInfo] as { owner?: unknown } | undefined;
      const current = $[planDoc] as { owner?: unknown } | undefined;
      return info && current && info.owner === current.owner;
    });

    const base = Object.assign({}, original) as Record<symbol, unknown>;
    base[results] = frames.map(($) => $[planDoc]);
    return new Frames(base as never);
  },
  then: actions([Requesting.respond, { request, results }]),
});

