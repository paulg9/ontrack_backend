import { Collection, Db } from "npm:mongodb";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import { freshID } from "@utils/database.ts";
import { Empty, ID } from "@utils/types.ts";

// Generic ID types used by this concept
type Exercise = ID;
type Proposal = ID;

const PREFIX = "ExerciseLibrary";

/**
 * a set of Exercises with
 * - title String
 * - videoUrl String (optional)
 * - cues String
 * - deprecated Flag
 */
interface ExerciseDoc {
  _id: Exercise;
  title: string;
  videoUrl?: string;
  cues: string;
  deprecated: boolean;
}

/**
 * a set of DetailProposals with
 * - exercise Exercise
 * - createdAt DateTime (ISO string)
 * - videoUrl String (optional)
 * - cues String
 * - confidence_0_1 Number (0..1)
 * - status Enum {"pending","applied","discarded"}
 */
interface ProposalDoc {
  _id: Proposal;
  exercise: Exercise;
  createdAt: string;
  videoUrl?: string;
  cues: string;
  confidence_0_1: number;
  status: "pending" | "applied" | "discarded";
}

// Validation constants
const MAX_CUES_LENGTH = 400;
const MAX_URL_LENGTH = 2048;

// Module-level helpers (not exposed as HTTP endpoints)
function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateCues(cues: string): string | undefined {
  if (!isNonEmpty(cues)) return "cues must be a non-empty string";
  if (cues.length > MAX_CUES_LENGTH) {
    return `cues must be <= ${MAX_CUES_LENGTH} characters`;
  }
  if (/<\/?[a-z][\s\S]*>/i.test(cues) || /<script/i.test(cues)) {
    return "cues must not contain HTML";
  }
  return undefined;
}

function normalizeUrl(input?: string): { url?: string; error?: string } {
  if (input === undefined) return {};
  const trimmed = input.trim();
  if (trimmed.length === 0) return {};
  if (trimmed.length > MAX_URL_LENGTH) return { error: "videoUrl is too long" };
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return { error: "videoUrl must use http or https" };
    }
    return { url: u.toString() };
  } catch {
    return { error: "videoUrl is not a valid URL" };
  }
}

function createProposalPrompt(exercise: ExerciseDoc): string {
  return `You are an expert exercise coach. Propose missing details for an exercise.
Return ONLY a JSON object with this exact shape:
{
  "videoUrl": optional_string_or_null,
  "cues": string_nonempty,
  "confidence_0_1": number_between_0_and_1
}
Context:
- exerciseId: ${exercise._id}
- title: ${exercise.title}
- current videoUrl: ${exercise.videoUrl ?? "none"}
- current cues: ${exercise.cues || "none"}
Guidelines:
- If unsure about videoUrl, return null for videoUrl.
- Provide concise, safe, actionable cues in 1-3 sentences, no HTML or Markdown.
- Do not include any text outside the JSON object. No backticks, no labels, no explanations.
`;
}

function stripCodeFence(output: string): string {
  const trimmed = output.trim();
  if (trimmed.startsWith("```")) {
    const withoutFence = trimmed.replace(/^```[a-zA-Z]*\s*/, "").replace(
      /```\s*$/,
      "",
    );
    return withoutFence.trim();
  }
  return trimmed;
}

export interface ExerciseLibraryLLMClient {
  generateProposal(prompt: string): Promise<string>;
}

class GeminiLLMClient implements ExerciseLibraryLLMClient {
  constructor(
    private readonly modelId: string = Deno.env.get("GEMINI_MODEL") ??
      "gemini-2.0-flash",
  ) {}

  async generateProposal(prompt: string): Promise<string> {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not configured on the server.");
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: this.modelId,
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.2,
        },
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      if (!text || text.trim().length === 0) {
        throw new Error("Gemini returned an empty response.");
      }
      return text;
    } catch (err) {
      throw new Error(
        `Gemini request failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  }
}

export default class ExerciseLibraryConcept {
  public readonly exercises: Collection<ExerciseDoc>;
  public readonly detailProposals: Collection<ProposalDoc>;
  private llmClient: ExerciseLibraryLLMClient;

  constructor(db: Db, llmClient?: ExerciseLibraryLLMClient) {
    this.exercises = db.collection<ExerciseDoc>(`${PREFIX}.exercises`);
    this.detailProposals = db.collection<ProposalDoc>(
      `${PREFIX}.detailProposals`,
    );
    this.llmClient = llmClient ?? new GeminiLLMClient();
  }

  /**
   * Test helper to inject a stubbed LLM client.
   */
  setLLMClientForTesting(llmClient: ExerciseLibraryLLMClient) {
    this.llmClient = llmClient;
  }

  /**
   * addExercise (title: String, videoUrl?: Optional String, cues: String, actorIsAdmin: Boolean): (exercise: Exercise)
   *
   * requires actorIsAdmin = true; title non-empty
   * effects creates a new Exercise with deprecated := false; returns its id as exercise
   */
  async addExercise({
    title,
    videoUrl,
    cues,
    actorIsAdmin,
  }: {
    title: string;
    videoUrl?: string;
    cues: string;
    actorIsAdmin: boolean;
  }): Promise<{ exercise: Exercise } | { error: string }> {
    if (!actorIsAdmin) return { error: "Action requires Administrator" };
    if (!isNonEmpty(title)) {
      return { error: "title must be a non-empty string" };
    }
    const cuesCheck = validateCues(cues);
    if (cuesCheck) return { error: cuesCheck };
    const urlResult = normalizeUrl(videoUrl);
    if (urlResult.error) return { error: urlResult.error };

    const exerciseId = freshID() as Exercise;
    const doc: ExerciseDoc = {
      _id: exerciseId,
      title: title.trim(),
      videoUrl: urlResult.url,
      cues: cues.trim(),
      deprecated: false,
    };
    await this.exercises.insertOne(doc);
    return { exercise: exerciseId };
  }

  /**
   * addExerciseDraft (title: String, actorIsAdmin: Boolean): (exercise: Exercise)
   *
   * requires actorIsAdmin = true; title non-empty
   * effects creates a new Exercise with minimal details (videoUrl := empty, cues := empty, deprecated := false); returns its id as exercise
   */
  async addExerciseDraft(
    { title, actorIsAdmin }: { title: string; actorIsAdmin: boolean },
  ): Promise<{ exercise: Exercise } | { error: string }> {
    if (!actorIsAdmin) return { error: "Action requires Administrator" };
    if (!isNonEmpty(title)) {
      return { error: "title must be a non-empty string" };
    }
    const exerciseId = freshID() as Exercise;
    const doc: ExerciseDoc = {
      _id: exerciseId,
      title: title.trim(),
      cues: "",
      deprecated: false,
    };
    await this.exercises.insertOne(doc);
    return { exercise: exerciseId };
  }

  /**
   * updateExercise (exercise: Exercise, title?: String, videoUrl?: Optional String, cues?: String, actorIsAdmin: Boolean): ()
   *
   * requires actorIsAdmin = true; exercise exists
   * effects updates supplied optional fields on the exercise
   */
  async updateExercise({
    exercise,
    title,
    videoUrl,
    cues,
    actorIsAdmin,
  }: {
    exercise: Exercise;
    title?: string;
    videoUrl?: string | null;
    cues?: string;
    actorIsAdmin?: boolean;
  }): Promise<Empty | { error: string }> {
    if (!actorIsAdmin) return { error: "Action requires Administrator" };
    const existing = await this.exercises.findOne({ _id: exercise });
    if (!existing) return { error: `exercise ${exercise} does not exist` };

    const update: {
      $set: Partial<Omit<ExerciseDoc, "_id">>;
      $unset?: { videoUrl?: "" };
    } = { $set: {} };

    if (title !== undefined) {
      if (!isNonEmpty(title)) {
        return { error: "title must be a non-empty string" };
      }
      update.$set.title = title.trim();
    }
    if (videoUrl !== undefined) {
      const urlResult = normalizeUrl(videoUrl === null ? "" : videoUrl);
      if (urlResult.error) return { error: urlResult.error };
      if (urlResult.url) {
        update.$set.videoUrl = urlResult.url;
      } else {
        update.$unset = { videoUrl: "" };
      }
    }
    if (cues !== undefined) {
      const cuesCheck = validateCues(cues);
      if (cuesCheck) return { error: cuesCheck };
      update.$set.cues = cues.trim();
    }

    if (Object.keys(update.$set).length === 0 && !update.$unset) return {};

    const finalUpdate: any = {};
    if (Object.keys(update.$set).length > 0) finalUpdate.$set = update.$set;
    if (update.$unset) finalUpdate.$unset = update.$unset;
    await this.exercises.updateOne({ _id: exercise }, finalUpdate);
    return {};
  }

  /**
   * deprecateExercise (exercise: Exercise, actorIsAdmin: Boolean): ()
   *
   * requires actorIsAdmin = true; exercise exists
   * effects sets deprecated := true
   */
  async deprecateExercise(
    { exercise, actorIsAdmin }: { exercise: Exercise; actorIsAdmin: boolean },
  ): Promise<Empty | { error: string }> {
    if (!actorIsAdmin) return { error: "Action requires Administrator" };
    const res = await this.exercises.updateOne({ _id: exercise }, {
      $set: { deprecated: true },
    });
    if (res.matchedCount === 0) {
      return { error: `exercise ${exercise} does not exist` };
    }
    return {};
  }

  /**
   * proposeDetails (exercise: Exercise, actorIsAdmin: Boolean): (proposal: DetailProposal)
   *
   * requires actorIsAdmin = true; exercise exists; environment variable GEMINI_API_KEY must be configured
   * effects generates detail JSON via Gemini, validates fields, records a pending DetailProposal, and returns the proposal id plus the normalized details
   */
  async proposeDetails({
    exercise,
    actorIsAdmin,
  }: {
    exercise: Exercise;
    actorIsAdmin: boolean;
  }): Promise<
    {
      proposal: Proposal;
      details: {
        videoUrl: string | null;
        cues: string;
        confidence_0_1: number;
      };
    } | { error: string }
  > {
    if (!actorIsAdmin) return { error: "Action requires Administrator" };
    const existing = await this.exercises.findOne({ _id: exercise });
    if (!existing) return { error: `exercise ${exercise} does not exist` };

    let llmResponse: string;
    try {
      const prompt = createProposalPrompt(existing);
      llmResponse = await this.llmClient.generateProposal(prompt);
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }

    const cleaned = stripCodeFence(llmResponse);
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("Gemini output missing JSON:", llmResponse);
      return { error: "Gemini response did not contain a JSON object." };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      console.error("Gemini output invalid JSON:", match[0]);
      return { error: "Gemini response did not contain valid JSON." };
    }

    let cuesVal = "";
    if (typeof parsed.cues === "string") {
      cuesVal = parsed.cues;
    } else if (Array.isArray(parsed.cues)) {
      cuesVal = parsed.cues.join(" ");
    }
    const cuesCheck = validateCues(cuesVal);
    if (cuesCheck) return { error: cuesCheck };

    const confRaw = typeof parsed.confidence_0_1 === "number"
      ? parsed.confidence_0_1
      : Number(parsed.confidence_0_1 ?? Number.NaN);
    if (!Number.isFinite(confRaw)) {
      return { error: "confidence_0_1 must be a number" };
    }
    if (confRaw < 0 || confRaw > 1) {
      return { error: "confidence_0_1 must be between 0 and 1" };
    }
    const conf = confRaw;

    const urlNorm = normalizeUrl(
      typeof parsed.videoUrl === "string" ? parsed.videoUrl : undefined,
    );
    if (urlNorm.error) return { error: urlNorm.error };

    const proposalId = freshID() as Proposal;
    const doc: ProposalDoc = {
      _id: proposalId,
      exercise,
      createdAt: new Date().toISOString(),
      videoUrl: urlNorm.url,
      cues: cuesVal.trim(),
      confidence_0_1: conf,
      status: "pending",
    };
    await this.detailProposals.insertOne(doc);
    return {
      proposal: proposalId,
      details: {
        videoUrl: doc.videoUrl ?? null,
        cues: doc.cues,
        confidence_0_1: doc.confidence_0_1,
      },
    };
  }

  /**
   * applyDetails (proposal: DetailProposal, actorIsAdmin: Boolean): ()
   *
   * requires actorIsAdmin = true; a pending proposal exists
   * effects merges proposal fields into exercise and marks proposal as applied
   */
  async applyDetails(
    { proposal, actorIsAdmin }: { proposal: Proposal; actorIsAdmin: boolean },
  ): Promise<Empty | { error: string }> {
    if (!actorIsAdmin) return { error: "Action requires Administrator" };
    const prop = await this.detailProposals.findOne({ _id: proposal });
    if (!prop) return { error: `proposal ${proposal} does not exist` };
    if (prop.status !== "pending") {
      return { error: `proposal ${proposal} is not pending` };
    }

    const exercise = await this.exercises.findOne({ _id: prop.exercise });
    if (!exercise) return { error: `exercise ${prop.exercise} does not exist` };

    const update: {
      $set: Partial<Omit<ExerciseDoc, "_id">>;
      $unset?: { videoUrl?: "" };
    } = { $set: {} };

    const proposalVideoUrl = prop.videoUrl ?? null;
    if (
      typeof proposalVideoUrl === "string" && proposalVideoUrl.trim().length > 0
    ) {
      update.$set.videoUrl = proposalVideoUrl;
    } else if (proposalVideoUrl === null) {
      update.$unset = { videoUrl: "" };
    }
    update.$set.cues = prop.cues;
    await this.exercises.updateOne({ _id: prop.exercise }, update);

    await this.detailProposals.updateOne({ _id: proposal }, {
      $set: { status: "applied" },
    });
    return {};
  }

  /**
   * discardDetails (proposal: DetailProposal, actorIsAdmin: Boolean): ()
   *
   * requires actorIsAdmin = true; a pending proposal exists
   * effects sets proposal.status := "discarded"
   */
  async discardDetails(
    { proposal, actorIsAdmin }: { proposal: Proposal; actorIsAdmin: boolean },
  ): Promise<Empty | { error: string }> {
    if (!actorIsAdmin) return { error: "Action requires Administrator" };
    const prop = await this.detailProposals.findOne({ _id: proposal });
    if (!prop) return { error: `proposal ${proposal} does not exist` };
    if (prop.status !== "pending") {
      return { error: `proposal ${proposal} is not pending` };
    }
    await this.detailProposals.updateOne({ _id: proposal }, {
      $set: { status: "discarded" },
    });
    return {};
  }

  // QUERIES

  /**
   * _getExerciseById (exercise: Exercise): (exercise: ExerciseDoc)
   */
  async _getExerciseById(
    { exercise }: { exercise: Exercise },
  ): Promise<ExerciseDoc[]> {
    const doc = await this.exercises.findOne({ _id: exercise });
    return doc ? [doc] : [];
  }

  /**
   * _listExercises (includeDeprecated?: Flag): (exercise: ExerciseDoc)
   */
  async _listExercises(
    { includeDeprecated = true }: { includeDeprecated?: boolean },
  ): Promise<ExerciseDoc[]> {
    const filter = includeDeprecated
      ? {}
      : { deprecated: { $ne: true } } as any;
    return this.exercises.find(filter).toArray();
  }

  /**
   * _listProposals (status?: String): (proposal: ProposalDoc)
   */
  async _listProposals(
    { status }: { status?: "pending" | "applied" | "discarded" },
  ): Promise<ProposalDoc[]> {
    const filter = status ? { status } : {};
    return this.detailProposals.find(filter).toArray();
  }

  /**
   * _getProposalsForExercise (exercise: Exercise): (proposal: ProposalDoc)
   */
  async _getProposalsForExercise(
    { exercise }: { exercise: Exercise },
  ): Promise<ProposalDoc[]> {
    return this.detailProposals.find({ exercise }).toArray();
  }
}
