import { actions, Frames, Sync } from "@engine";
import { Feedback, Requesting, UserAccount } from "@concepts";

const OWNER_PATHS = new Set<string>([
  "/Feedback/recordCompletion",
  "/Feedback/_getSummaryMetrics",
  "/Feedback/_hasSentReminderToday",
  "/Feedback/_listMessages",
]);

const ADMIN_PATHS = new Set<string>([
  "/Feedback/recompute",
  "/Feedback/recordMessage",
  "/Feedback/sendReminder",
]);

const FEEDBACK_SHARE_PATHS = new Set<string>([
  "/Feedback/_getSummaryMetrics",
]);

export const FeedbackRejectInvalidSession: Sync = (
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
        (OWNER_PATHS.has(currentPath) || ADMIN_PATHS.has(currentPath));
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

export const FeedbackRejectNonAdmin: Sync = (
  { request, session, path, error, user: _user, isAdmin: _isAdmin },
) => ({
  when: actions(
    [Requesting.request, { path, session }, { request }],
  ),
  where: async (frames) => {
    const original = frames[0];
    const targeted = frames.filter(($) => {
      const currentPath = $[path];
      return typeof currentPath === "string" && ADMIN_PATHS.has(currentPath);
    });
    if (targeted.length === 0) return new Frames();

    let anyForbidden = false;
    for (const frame of targeted) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      const ok = Array.isArray(adminRes) && adminRes[0]?.isAdmin === true;
      if (!ok) {
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

export const FeedbackRejectInvalidCompletionDate: Sync = (
  { request, date, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/Feedback/recordCompletion", date }, {
      request,
    }],
  ),
  where: (frames) => {
    const invalid = frames.filter(($) => {
      const raw = $[date];
      const parsed = new Date(String(raw));
      return Number.isNaN(parsed.getTime());
    });
    if (invalid.length === 0) return new Frames();
    const base = Object.assign({}, invalid[0]) as Record<symbol, unknown>;
    base[error] = "invalid_date";
    return new Frames(base as never);
  },
  then: actions([Requesting.respond, { request, error }]),
});

export const FeedbackRecordCompletionRequest: Sync = (
  { request, session, user, date, dateObj, completedAll },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Feedback/recordCompletion", session, date, completedAll },
    { request },
  ]),
  where: async (frames) => {
    const mapped = new Frames();
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
    for (const frame of authed) {
      const raw = frame[date];
      const parsed = new Date(String(raw));
      if (Number.isNaN(parsed.getTime())) continue;
      const next = Object.assign({}, frame) as Record<symbol, unknown>;
      next[dateObj] = parsed;
      mapped.push(next as never);
    }
    return mapped;
  },
  then: actions([Feedback.recordCompletion, {
    owner: user,
    date: dateObj,
    completedAll,
  }]),
});

export const FeedbackRecordCompletionSuccess: Sync = (
  { request, summaryId, streakCount, completion7d },
) => ({
  when: actions(
    [Requesting.request, { path: "/Feedback/recordCompletion" }, {
      request,
    }],
    [Feedback.recordCompletion, {}, { summaryId, streakCount, completion7d }],
  ),
  then: actions([
    Requesting.respond,
    { request, summaryId, streakCount, completion7d },
  ]),
});

export const FeedbackRecordCompletionError: Sync = (
  { request, error },
) => ({
  when: actions(
    [Requesting.request, { path: "/Feedback/recordCompletion" }, {
      request,
    }],
    [Feedback.recordCompletion, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const FeedbackRecomputeRequest: Sync = (
  {
    request,
    session,
    user,
    isAdmin,
    owner,
    today,
    todayDate,
    newStreakCount,
    newCompletion7d,
  },
) => ({
  when: actions([
    Requesting.request,
    {
      path: "/Feedback/recompute",
      session,
      owner,
      today,
      newStreakCount,
      newCompletion7d,
    },
    { request },
  ]),
  where: async (frames) => {
    const allowed = new Frames();
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
      if (Array.isArray(adminRes) && adminRes[0]?.isAdmin === true) {
        const next = Object.assign({}, frame) as Record<symbol, unknown>;
        next[user] = userRes[0].user as unknown as symbol;
        allowed.push(next as never);
      }
    }
    const mapped = new Frames();
    for (const frame of allowed) {
      const parsed = new Date(String(frame[today]));
      if (Number.isNaN(parsed.getTime())) continue;
      const next = Object.assign({}, frame) as Record<symbol, unknown>;
      next[todayDate] = parsed;
      mapped.push(next as never);
    }
    return mapped;
  },
  then: actions([Feedback.recompute, {
    owner,
    today: todayDate,
    newStreakCount,
    newCompletion7d,
  }]),
});

export const FeedbackRecomputeSuccess: Sync = (
  { request, summaryId, newStreakCount, newCompletion7d },
) => ({
  when: actions(
    [Requesting.request, { path: "/Feedback/recompute" }, { request }],
    [Feedback.recompute, {}, { summaryId, newStreakCount, newCompletion7d }],
  ),
  then: actions([
    Requesting.respond,
    { request, summaryId, newStreakCount, newCompletion7d },
  ]),
});

export const FeedbackRecomputeError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Feedback/recompute" }, { request }],
    [Feedback.recompute, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const FeedbackRecordMessageRequest: Sync = (
  { request, session, user, isAdmin, owner, kind, text },
) => ({
  when: actions([
    Requesting.request,
    {
      path: "/Feedback/recordMessage",
      session,
      owner,
      kind,
      text,
    },
    { request },
  ]),
  where: async (frames) => {
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
    return allowed;
  },
  then: actions([Feedback.recordMessage, { owner, kind, text }]),
});

export const FeedbackRecordMessageSuccess: Sync = (
  { request, messageId },
) => ({
  when: actions(
    [Requesting.request, { path: "/Feedback/recordMessage" }, { request }],
    [Feedback.recordMessage, {}, { messageId }],
  ),
  then: actions([Requesting.respond, { request, messageId }]),
});

export const FeedbackRecordMessageError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Feedback/recordMessage" }, { request }],
    [Feedback.recordMessage, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const FeedbackSendReminderRequest: Sync = (
  { request, session, user, isAdmin, owner },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Feedback/sendReminder", session, owner },
    { request },
  ]),
  where: async (frames) => {
    const ownerAllowed = new Frames();
    let adminOk = false;
    for (const frame of frames) {
      const tok = frame[session] as unknown as string;
      const userRes = await UserAccount._getUserByToken({ token: tok });
      if (!Array.isArray(userRes) || userRes.length === 0) continue;
      const isOwner = userRes[0].user === frame[owner];
      if (isOwner) ownerAllowed.push(frame);
      if (!adminOk) {
        const adminRes = await UserAccount._isAdmin({ user: userRes[0].user });
        adminOk = Array.isArray(adminRes) && adminRes[0]?.isAdmin === true;
      }
    }
    if (ownerAllowed.length === 0 && !adminOk) {
      return new Frames();
    }
    return ownerAllowed.length > 0 ? ownerAllowed : frames;
  },
  then: actions([Feedback.sendReminder, { owner }]),
});

export const FeedbackSendReminderSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Feedback/sendReminder" }, { request }],
    [Feedback.sendReminder, {}, {}],
  ),
  then: actions([Requesting.respond, { request }]),
});

export const FeedbackSendReminderError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Feedback/sendReminder" }, { request }],
    [Feedback.sendReminder, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

export const FeedbackGetSummaryMetricsQuery: Sync = (
  { request, session, user, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Feedback/_getSummaryMetrics", session },
    { request },
  ]),
  where: async (frames) => {
    const original = frames[0];
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
    if (authed.length === 0) {
      const base = Object.assign({}, original) as Record<symbol, unknown>;
      base[results] = [];
      return new Frames(base as never);
    }
    const output = new Frames();

    for (const frame of authed) {
      const ownerId = frame[user] as unknown as never;
      const metrics = await Feedback._getSummaryMetrics({ owner: ownerId });
      const base = Object.assign({}, frame) as Record<symbol, unknown>;
      if (Array.isArray(metrics)) {
        base[results] = metrics;
      } else if (
        metrics && typeof metrics === "object" && "error" in metrics
      ) {
        base[results] = [];
      }
      output.push(base as never);
    }

    return output;
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const FeedbackHasSentReminderQuery: Sync = (
  { request, session, user, date, dateObj, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Feedback/_hasSentReminderToday", session, date },
    { request },
  ]),
  where: async (frames) => {
    const original = frames[0];
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
    if (authed.length === 0) {
      const base = Object.assign({}, original) as Record<symbol, unknown>;
      base[results] = [];
      return new Frames(base as never);
    }
    const output = new Frames();

    for (const frame of authed) {
      const parsed = new Date(String(frame[date]));
      if (Number.isNaN(parsed.getTime())) continue;
      const ownerId = frame[user] as unknown as never;
      const reminderResult = await Feedback._hasSentReminderToday({
        owner: ownerId,
        date: parsed,
      });
      const base = Object.assign({}, frame) as Record<symbol, unknown>;
      if (Array.isArray(reminderResult)) {
        base[results] = reminderResult;
      } else if (
        reminderResult && typeof reminderResult === "object" &&
        "error" in reminderResult
      ) {
        base[results] = [{ sent: false }];
      }
      base[dateObj] = parsed;
      output.push(base as never);
    }

    return output;
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const FeedbackListMessagesQuery: Sync = (
  { request, session, user, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Feedback/_listMessages", session },
    { request },
  ]),
  where: async (frames) => {
    const original = frames[0];
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
    if (authed.length === 0) {
      const base = Object.assign({}, original) as Record<symbol, unknown>;
      base[results] = [];
      return new Frames(base as never);
    }
    const output = new Frames();

    for (const frame of authed) {
      const ownerId = frame[user] as unknown as never;
      const messages = await Feedback._listMessages({ owner: ownerId });
      const base = Object.assign({}, frame) as Record<symbol, unknown>;
      base[results] = messages;
      output.push(base as never);
    }

    return output;
  },
  then: actions([Requesting.respond, { request, results }]),
});

export const FeedbackRejectInvalidShareLink: Sync = (
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
        FEEDBACK_SHARE_PATHS.has(currentPath) &&
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

export const FeedbackGetSummaryMetricsShareLink: Sync = (
  { request, shareToken, linkInfo, owner, results },
) => ({
  when: actions([
    Requesting.request,
    { path: "/Feedback/_getSummaryMetrics", shareToken },
    { request },
  ]),
  where: async (frames) => {
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

    const output = new Frames();

    for (const frame of frames) {
      const ownerId = frame[owner] as unknown as never;
      const metrics = await Feedback._getSummaryMetrics({ owner: ownerId });
      const base = Object.assign({}, frame) as Record<symbol, unknown>;
      if (Array.isArray(metrics)) {
        base[results] = metrics;
      } else if (
        metrics && typeof metrics === "object" && "error" in metrics
      ) {
        base[results] = [];
      }
      output.push(base as never);
    }

    return output;
  },
  then: actions([Requesting.respond, { request, results }]),
});

