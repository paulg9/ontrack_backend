import { assert, assertEquals } from "jsr:@std/assert";
import { Db, MongoClient } from "npm:mongodb";
import { testDb } from "@utils/database.ts";
import ExerciseLibraryConcept from "./ExerciseLibraryConcept.ts";

let db: Db;
let client: MongoClient;

async function withDb(fn: (concept: ExerciseLibraryConcept) => Promise<void>) {
  const [_db, _client] = await testDb();
  db = _db;
  client = _client;
  try {
    const concept = new ExerciseLibraryConcept(db);
    await fn(concept);
  } finally {
    await client.close();
  }
}

Deno.test("ExerciseLibrary principle: populate, browse, and deprecate", async () => {
  await withDb(async (concept) => {
    // Add full exercise
    const add1 = await concept.addExercise({
      title: "Push-ups",
      videoUrl: "https://example.com/pushups.mp4",
      cues: "Body straight, lower until chest nearly touches floor.",
      recommendedFreq: 3,
      actorIsAdmin: true,
    });
    assert("exercise" in add1);

    // Add draft, then update
    const draft = await concept.addExerciseDraft({ title: "Plank Hold", actorIsAdmin: true });
    assert("exercise" in draft);
    const upd = await concept.updateExercise({
      exercise: (draft as any).exercise,
      videoUrl: "https://example.com/plank.mp4",
      cues: "Maintain neutral spine; engage core; breathe steadily.",
      recommendedFreq: 5,
      actorIsAdmin: true,
    });
    assert(!("error" in upd));

    // Deprecate first exercise
    const dep = await concept.deprecateExercise({ exercise: (add1 as any).exercise, actorIsAdmin: true });
    assert(!("error" in dep));

    // Browse with and without deprecated
    const all = await concept._listExercises({ includeDeprecated: true });
    assertEquals(all.length, 2);
    const activeOnly = await concept._listExercises({ includeDeprecated: false });
    assertEquals(activeOnly.length, 1);
    assertEquals(activeOnly[0]._id, (draft as any).exercise);
  });
});

Deno.test("LLM proposal flow: propose, apply, discard", async () => {
  await withDb(async (concept) => {
    const { exercise } = (await concept.addExerciseDraft({ title: "Burpees", actorIsAdmin: true })) as { exercise: any };

    // Propose via llmText JSON
    const llmText = '{"videoUrl":"https://example.com/burpees.mp4","cues":"Explosive full-body; land softly; keep core tight.","recommendedFreq":4,"confidence_0_1":0.8}';
    const prop = await concept.proposeDetails({ exercise, llmText, actorIsAdmin: true });
    assert("proposal" in prop);

    // Apply
    const propId = (prop as any).proposal;
    const applied = await concept.applyDetails({ proposal: propId, actorIsAdmin: true });
    assert(!("error" in applied));

    // Confirm exercise updated
    const [doc] = await concept._getExerciseById({ exercise });
    assertEquals(doc.videoUrl, "https://example.com/burpees.mp4");
    assertEquals(doc.cues, "Explosive full-body; land softly; keep core tight.");
    assertEquals(doc.recommendedFreq, 4);

    // New pending proposal then discard
    const prop2 = await concept.proposeDetails({
      exercise,
      llmText: '{"videoUrl":null,"cues":"Keep form crisp.","recommendedFreq":3,"confidence_0_1":0.6}',
      actorIsAdmin: true,
    });
    const discarded = await concept.discardDetails({ proposal: (prop2 as any).proposal, actorIsAdmin: true });
    assert(!("error" in discarded));
    const proposals = await concept._listProposals({});
    const statuses = proposals.map((p) => p.status).sort();
    assertEquals(statuses, ["applied", "discarded"]);
  });
});

Deno.test("Validation: bad URL, HTML cues, out-of-range and non-integer freq", async () => {
  await withDb(async (concept) => {
    const { exercise } = (await concept.addExerciseDraft({ title: "Edge", actorIsAdmin: true })) as { exercise: any };

    // Bad URL + HTML cues
    let res = await concept.proposeDetails({
      exercise,
      llmText: '{"videoUrl":"ftp://x","cues":"<b>Strong</b> core","recommendedFreq":3,"confidence_0_1":0.9}',
      actorIsAdmin: true,
    });
    assert("error" in res);

    // Out-of-range freq
    res = await concept.proposeDetails({
      exercise,
      llmText: '{"videoUrl":null,"cues":"Neutral spine.","recommendedFreq":20,"confidence_0_1":0.7}',
      actorIsAdmin: true,
    });
    assert("error" in res);

    // Non-integer freq
    res = await concept.proposeDetails({
      exercise,
      llmText: '{"videoUrl":null,"cues":"Controlled movement.","recommendedFreq":2.5,"confidence_0_1":0.8}',
      actorIsAdmin: true,
    });
    assert("error" in res);

    // Long cues
    const longCues = "safe ".repeat(101);
    res = await concept.proposeDetails({
      exercise,
      llmText: JSON.stringify({ videoUrl: null, cues: longCues, recommendedFreq: 3, confidence_0_1: 0.9 }),
      actorIsAdmin: true,
    });
    assert("error" in res);
  });
});

Deno.test("Update semantics: clear videoUrl and partial updates", async () => {
  await withDb(async (concept) => {
    const add = await concept.addExercise({
      title: "Jumping Jacks",
      videoUrl: "https://example.com/jj.mp4",
      cues: "Spread arms and legs; rhythmical.",
      recommendedFreq: 3,
      actorIsAdmin: true,
    });
    const exercise = (add as any).exercise;

    // Clear video URL using null
    let upd = await concept.updateExercise({ exercise, videoUrl: null, actorIsAdmin: true });
    assert(!("error" in upd));
    let [doc] = await concept._getExerciseById({ exercise });
    assertEquals(doc.videoUrl, undefined);

    // Title change and freq
    upd = await concept.updateExercise({ exercise, title: "Jumping Jacks v2", recommendedFreq: 4, actorIsAdmin: true });
    assert(!("error" in upd));
    [doc] = await concept._getExerciseById({ exercise });
    assertEquals(doc.title, "Jumping Jacks v2");
    assertEquals(doc.recommendedFreq, 4);
  });
});

Deno.test("Errors on non-existent resources", async () => {
  await withDb(async (concept) => {
    const fakeExercise = "exercise:fake" as any;
    const fakeProposal = "proposal:fake" as any;

    const upd = await concept.updateExercise({ exercise: fakeExercise, title: "X", actorIsAdmin: true });
    assert("error" in upd);

    const dep = await concept.deprecateExercise({ exercise: fakeExercise, actorIsAdmin: true });
    assert("error" in dep);

    const app = await concept.applyDetails({ proposal: fakeProposal, actorIsAdmin: true });
    assert("error" in app);

    const dis = await concept.discardDetails({ proposal: fakeProposal, actorIsAdmin: true });
    assert("error" in dis);
  });
});

Deno.test("Admin gating: mutations require actorIsAdmin", async () => {
  await withDb(async (concept) => {
    // addExerciseDraft without admin
    const draftFail = await concept.addExerciseDraft({ title: "X", actorIsAdmin: false });
    assert("error" in draftFail);

    // addExercise without admin
    const addFail = await concept.addExercise({ title: "A", cues: "C", recommendedFreq: 1, actorIsAdmin: false });
    assert("error" in addFail);

    // create a valid draft as admin
    const draftOk = await concept.addExerciseDraft({ title: "Y", actorIsAdmin: true });
    assert("exercise" in draftOk);

    // update without admin
    const updFail = await concept.updateExercise({ exercise: (draftOk as any).exercise, title: "Z", actorIsAdmin: false });
    assert("error" in updFail);

    // proposeDetails without admin
    const propFail = await concept.proposeDetails({ exercise: (draftOk as any).exercise, llmText: '{"cues":"ok","recommendedFreq":1,"confidence_0_1":0.5}', actorIsAdmin: false });
    assert("error" in propFail);
  });
});



