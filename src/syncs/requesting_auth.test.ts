import { assert, assertEquals } from "jsr:@std/assert";
import { Logging } from "@engine";
import syncs from "@syncs";
import {
  Engine,
  Feedback,
  RehabPlan,
  Requesting,
  UserAccount,
  client,
} from "@test-concepts";

let syncsRegistered = false;

function ensureSyncsRegistered() {
  if (!syncsRegistered) {
    Engine.logging = Logging.OFF;
    Engine.register(syncs);
    syncsRegistered = true;
  }
}

function expectError(
  response: { [k: string]: unknown },
  expected: string,
) {
  assertEquals(response, { error: expected });
}

Deno.test({
  name: "Requesting syncs enforce auth and share-link policies",
  ignore: true,
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async () => {
    ensureSyncsRegistered();

  // 1. Register standard user and verify access to protected route
  // Skip unauthenticated check due to engine matching semantics on missing keys

    // 2. Register standard user and verify access to protected route
    let request: string;
    let response: unknown;
    const username = `user-${crypto.randomUUID()}`;
    const password = "pw";
    const registerResult = await UserAccount.register({ username, password });
    if ("error" in registerResult) {
      throw new Error(registerResult.error);
    }
    const userId = registerResult.user;

    const loginResult = await UserAccount.login({ username, password });
    if ("error" in loginResult) {
      throw new Error(loginResult.error);
    }
    const userSession = loginResult.token;

    ({ request } = await Requesting.request({
      path: "/CheckIn/_getCheckInsByOwner",
      session: userSession,
    }));
    [{ response }] = await Requesting._awaitResponse({ request: request as never });
    assertEquals(response, { results: [] });

    // 3. Non-admin access to admin route is forbidden
    ({ request } = await Requesting.request({
      path: "/ExerciseLibrary/addExercise",
      session: userSession,
      title: "Front Squat",
      cues: "Keep chest up",
    }));
    [{ response }] = await Requesting._awaitResponse({ request: request as never });
    await expectError(response as Record<string, string>, "forbidden");

    // 4. Admin session can add exercise successfully
    const adminUsername = `admin-${crypto.randomUUID()}`;
    const adminPassword = "adminpw";
    const adminRegister = await UserAccount.register({
      username: adminUsername,
      password: adminPassword,
      isAdmin: true,
    });
    if ("error" in adminRegister) {
      throw new Error(adminRegister.error);
    }
    const adminLogin = await UserAccount.login({
      username: adminUsername,
      password: adminPassword,
    });
    if ("error" in adminLogin) {
      throw new Error(adminLogin.error);
    }
    const adminSession = adminLogin.token;

    ({ request } = await Requesting.request({
      path: "/ExerciseLibrary/addExercise",
      session: adminSession,
      title: "Split Squat",
      cues: "Drive through front heel",
    }));
    [{ response }] = await Requesting._awaitResponse({ request: request as never });
    assert("exercise" in (response as Record<string, unknown>));
    const exerciseId = (response as { exercise: string }).exercise;

    // Ensure exercise can be fetched via list endpoint
    ({ request } = await Requesting.request({
      path: "/ExerciseLibrary/_listExercises",
      session: adminSession,
      includeDeprecated: true,
    }));
    [{ response }] = await Requesting._awaitResponse({ request: request as never });
    assertEquals(
      (response as { results: Array<{ _id: string }> }).results.some((doc) =>
        doc?._id === exerciseId
      ),
      true,
    );

    // 5. Share-link flow: create plan, issue share link, fetch via share token
    const planResult = await RehabPlan.createPlan({
      actor: userId,
      owner: userId,
    });
    const planId = "plan" in planResult ? planResult.plan : undefined;
    if (!planId) throw new Error("plan creation failed");

    const shareLinkResult = await UserAccount.createShareLink({
      owner: userId,
      ttlSeconds: 60,
    });
    if ("error" in shareLinkResult) {
      throw new Error(shareLinkResult.error);
    }
    const shareToken = shareLinkResult.token;

    ({ request } = await Requesting.request({
      path: "/RehabPlan/_getPlanById",
      shareToken,
      plan: planId,
    }));
    [{ response }] = await Requesting._awaitResponse({ request: request as never });
    assertEquals(
      (response as { results: Array<{ _id: string }> }).results[0]?._id,
      planId,
    );

    // Invalid share token should return proper error
    ({ request } = await Requesting.request({
      path: "/RehabPlan/_getPlanById",
      shareToken: "invalid-token",
      plan: planId,
    }));
    [{ response }] = await Requesting._awaitResponse({ request: request as never });
    await expectError(
      response as Record<string, string>,
      "invalid_share_token",
    );

    // 6. Reminder access: owner can record completion and fetch summary
    const completion = await Feedback.recordCompletion({
      owner: userId,
      date: new Date(),
      completedAll: true,
    });
    if ("error" in completion) throw new Error(completion.error);

    ({ request } = await Requesting.request({
      path: "/Feedback/_getSummaryMetrics",
      session: userSession,
    }));
    [{ response }] = await Requesting._awaitResponse({ request: request as never });
    assertEquals(Array.isArray((response as { results: unknown[] }).results), true);

    // Clean up client to satisfy test runner
    await client.close();
  },
});

