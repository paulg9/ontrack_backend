import { assert, assertEquals } from "jsr:@std/assert";
import { Db, MongoClient } from "npm:mongodb";
import { testDb } from "@utils/database.ts";
import ExerciseLibraryConcept, {
  type ExerciseLibraryLLMClient,
} from "./ExerciseLibraryConcept.ts";

class StubLLMClient implements ExerciseLibraryLLMClient {
  private responses: string[];

  constructor(responses: string[]) {
    this.responses = [...responses];
  }

  async generateProposal(_prompt: string): Promise<string> {
    if (this.responses.length === 0) {
      throw new Error("Stub LLM has no more responses configured");
    }
    return this.responses.shift()!;
  }
}

let db: Db;
let client: MongoClient;

async function withDb(
  fn: (concept: ExerciseLibraryConcept) => Promise<void>,
  llmClient?: ExerciseLibraryLLMClient,
) {
  const [_db, _client] = await testDb();
  db = _db;
  client = _client;
  try {
    const concept = new ExerciseLibraryConcept(db, llmClient);
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
      actorIsAdmin: true,
    });
    assert("exercise" in add1);

    // Add draft, then update
    const draft = await concept.addExerciseDraft({
      title: "Plank Hold",
      actorIsAdmin: true,
    });
    assert("exercise" in draft);
    const upd = await concept.updateExercise({
      exercise: (draft as any).exercise,
      videoUrl: "https://example.com/plank.mp4",
      cues: "Maintain neutral spine; engage core; breathe steadily.",
      actorIsAdmin: true,
    });
    assert(!("error" in upd));

    // Deprecate first exercise
    const dep = await concept.deprecateExercise({
      exercise: (add1 as any).exercise,
      actorIsAdmin: true,
    });
    assert(!("error" in dep));

    // Browse with and without deprecated
    const all = await concept._listExercises({ includeDeprecated: true });
    assertEquals(all.length, 2);
    const activeOnly = await concept._listExercises({
      includeDeprecated: false,
    });
    assertEquals(activeOnly.length, 1);
    assertEquals(activeOnly[0]._id, (draft as any).exercise);
  });
});

Deno.test("LLM proposal flow: propose, apply, discard", async () => {
  const stub = new StubLLMClient([
    '{"videoUrl":"https://example.com/burpees.mp4","cues":"Explosive full-body; land softly; keep core tight.","confidence_0_1":0.8}',
    '{"videoUrl":null,"cues":"Keep form crisp.","confidence_0_1":0.6}',
  ]);

  await withDb(async (concept) => {
    const { exercise } = (await concept.addExerciseDraft({
      title: "Burpees",
      actorIsAdmin: true,
    })) as { exercise: any };

    // Propose via Gemini (stubbed)
    const prop = await concept.proposeDetails({ exercise, actorIsAdmin: true });
    assert("proposal" in prop);
    assertEquals(prop.details.videoUrl, "https://example.com/burpees.mp4");

    // Apply
    const propId = (prop as any).proposal;
    const applied = await concept.applyDetails({
      proposal: propId,
      actorIsAdmin: true,
    });
    assert(!("error" in applied));

    // Confirm exercise updated
    const [doc] = await concept._getExerciseById({ exercise });
    assertEquals(doc.videoUrl, "https://example.com/burpees.mp4");
    assertEquals(
      doc.cues,
      "Explosive full-body; land softly; keep core tight.",
    );

    // New pending proposal then discard
    const prop2 = await concept.proposeDetails({
      exercise,
      actorIsAdmin: true,
    });
    const discarded = await concept.discardDetails({
      proposal: (prop2 as any).proposal,
      actorIsAdmin: true,
    });
    assert(!("error" in discarded));
    const proposals = await concept._listProposals({});
    const statuses = proposals.map((p) => p.status).sort();
    assertEquals(statuses, ["applied", "discarded"]);
  }, stub);
});

Deno.test("Validation: bad URL, HTML cues, malformed confidence", async () => {
  const longCues = "safe ".repeat(101);
  const stub = new StubLLMClient([
    '{"videoUrl":"ftp://x","cues":"<b>Strong</b> core","confidence_0_1":0.9}',
    '{"videoUrl":null,"cues":"Neutral spine.","confidence_0_1":"bad"}',
    '{"videoUrl":null,"cues":"Controlled movement.","confidence_0_1":1.7}',
    JSON.stringify({
      videoUrl: null,
      cues: longCues,
      confidence_0_1: 0.9,
    }),
  ]);

  await withDb(async (concept) => {
    const { exercise } = (await concept.addExerciseDraft({
      title: "Edge",
      actorIsAdmin: true,
    })) as { exercise: any };

    // Bad URL + HTML cues
    let res = await concept.proposeDetails({ exercise, actorIsAdmin: true });
    assert("error" in res);

    // Non-numeric confidence
    res = await concept.proposeDetails({ exercise, actorIsAdmin: true });
    assert("error" in res);

    // Out of bounds confidence
    res = await concept.proposeDetails({ exercise, actorIsAdmin: true });
    assert("error" in res);

    // Long cues
    res = await concept.proposeDetails({ exercise, actorIsAdmin: true });
    assert("error" in res);
  }, stub);
});

Deno.test("Update semantics: clear videoUrl and partial updates", async () => {
  await withDb(async (concept) => {
    const add = await concept.addExercise({
      title: "Jumping Jacks",
      videoUrl: "https://example.com/jj.mp4",
      cues: "Spread arms and legs; rhythmical.",
      actorIsAdmin: true,
    });
    const exercise = (add as any).exercise;

    // Clear video URL using null
    let upd = await concept.updateExercise({
      exercise,
      videoUrl: null,
      actorIsAdmin: true,
    });
    assert(!("error" in upd));
    let [doc] = await concept._getExerciseById({ exercise });
    assertEquals(doc.videoUrl, undefined);

    // Title change
    upd = await concept.updateExercise({
      exercise,
      title: "Jumping Jacks v2",
      actorIsAdmin: true,
    });
    assert(!("error" in upd));
    [doc] = await concept._getExerciseById({ exercise });
    assertEquals(doc.title, "Jumping Jacks v2");
  });
});

Deno.test("Errors on non-existent resources", async () => {
  await withDb(async (concept) => {
    const fakeExercise = "exercise:fake" as any;
    const fakeProposal = "proposal:fake" as any;

    const upd = await concept.updateExercise({
      exercise: fakeExercise,
      title: "X",
      actorIsAdmin: true,
    });
    assert("error" in upd);

    const dep = await concept.deprecateExercise({
      exercise: fakeExercise,
      actorIsAdmin: true,
    });
    assert("error" in dep);

    const app = await concept.applyDetails({
      proposal: fakeProposal,
      actorIsAdmin: true,
    });
    assert("error" in app);

    const dis = await concept.discardDetails({
      proposal: fakeProposal,
      actorIsAdmin: true,
    });
    assert("error" in dis);
  });
});

Deno.test("Admin gating: mutations require actorIsAdmin", async () => {
  await withDb(async (concept) => {
    // addExerciseDraft without admin
    const draftFail = await concept.addExerciseDraft({
      title: "X",
      actorIsAdmin: false,
    });
    assert("error" in draftFail);

    // addExercise without admin
    const addFail = await concept.addExercise({
      title: "A",
      cues: "C",
      actorIsAdmin: false,
    });
    assert("error" in addFail);

    // create a valid draft as admin
    const draftOk = await concept.addExerciseDraft({
      title: "Y",
      actorIsAdmin: true,
    });
    assert("exercise" in draftOk);

    // update without admin
    const updFail = await concept.updateExercise({
      exercise: (draftOk as any).exercise,
      title: "Z",
      actorIsAdmin: false,
    });
    assert("error" in updFail);

    // proposeDetails without admin
    const propFail = await concept.proposeDetails({
      exercise: (draftOk as any).exercise,
      actorIsAdmin: false,
    });
    assert("error" in propFail);
  });
});
