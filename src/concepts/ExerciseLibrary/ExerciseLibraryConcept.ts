import { Collection, Db } from "npm:mongodb";
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
 * - recommendedFreq Number (integer 0..14)
 * - deprecated Flag
 */
interface ExerciseDoc {
  _id: Exercise;
  title: string;
  videoUrl?: string;
  cues: string;
  recommendedFreq: number;
  deprecated: boolean;
}

/**
 * a set of DetailProposals with
 * - exercise Exercise
 * - createdAt DateTime (ISO string)
 * - videoUrl String (optional)
 * - cues String
 * - recommendedFreq Number (integer 0..14)
 * - confidence_0_1 Number (0..1)
 * - status Enum {"pending","applied","discarded"}
 */
interface ProposalDoc {
  _id: Proposal;
  exercise: Exercise;
  createdAt: string;
  videoUrl?: string;
  cues: string;
  recommendedFreq: number;
  confidence_0_1: number;
  status: "pending" | "applied" | "discarded";
}

export default class ExerciseLibraryConcept {
  public readonly exercises: Collection<ExerciseDoc>;
  public readonly detailProposals: Collection<ProposalDoc>;

  private static readonly MAX_CUES_LENGTH = 400;
  private static readonly MAX_URL_LENGTH = 2048;
  private static readonly FREQ_MIN = 0;
  private static readonly FREQ_MAX = 14;

  constructor(db: Db) {
    this.exercises = db.collection<ExerciseDoc>(`${PREFIX}.exercises`);
    this.detailProposals = db.collection<ProposalDoc>(`${PREFIX}.detailProposals`);
  }

  /**
   * addExercise (title: String, videoUrl?: Optional String, cues: String, recommendedFreq: Number, actorIsAdmin: Boolean): (exercise: Exercise)
   *
   * requires actorIsAdmin = true; title non-empty; 0 <= recommendedFreq <= 14 and integer
   * effects creates a new Exercise with deprecated := false; returns its id as exercise
   */
  async addExercise({
    title,
    videoUrl,
    cues,
    recommendedFreq,
    actorIsAdmin,
  }: {
    title: string;
    videoUrl?: string;
    cues: string;
    recommendedFreq: number;
    actorIsAdmin: boolean;
  }): Promise<{ exercise: Exercise } | { error: string }> {
    if (!actorIsAdmin) return { error: "Action requires Administrator" };
    if (!this.isNonEmpty(title)) return { error: "title must be a non-empty string" };
    const cuesCheck = this.validateCues(cues);
    if (cuesCheck) return { error: cuesCheck };
    const freqCheck = this.validateFrequency(recommendedFreq);
    if (freqCheck) return { error: freqCheck };
    const urlResult = this.normalizeUrl(videoUrl);
    if (urlResult.error) return { error: urlResult.error };

    const exerciseId = freshID() as Exercise;
    const doc: ExerciseDoc = {
      _id: exerciseId,
      title: title.trim(),
      videoUrl: urlResult.url,
      cues: cues.trim(),
      recommendedFreq,
      deprecated: false,
    };
    await this.exercises.insertOne(doc);
    return { exercise: exerciseId };
  }

  /**
   * addExerciseDraft (title: String, actorIsAdmin: Boolean): (exercise: Exercise)
   *
   * requires actorIsAdmin = true; title non-empty
   * effects creates a new Exercise with minimal details (videoUrl := empty, cues := empty, recommendedFreq := 0, deprecated := false); returns its id as exercise
   */
  async addExerciseDraft({ title, actorIsAdmin }: { title: string; actorIsAdmin: boolean }): Promise<{ exercise: Exercise } | { error: string }> {
    if (!actorIsAdmin) return { error: "Action requires Administrator" };
    if (!this.isNonEmpty(title)) return { error: "title must be a non-empty string" };
    const exerciseId = freshID() as Exercise;
    const doc: ExerciseDoc = {
      _id: exerciseId,
      title: title.trim(),
      cues: "",
      recommendedFreq: 0,
      deprecated: false,
    };
    await this.exercises.insertOne(doc);
    return { exercise: exerciseId };
  }

  /**
   * updateExercise (exercise: Exercise, title?: String, videoUrl?: Optional String, cues?: String, recommendedFreq?: Number, actorIsAdmin: Boolean): ()
   *
   * requires actorIsAdmin = true; exercise exists
   * effects updates supplied optional fields on the exercise
   */
  async updateExercise({
    exercise,
    title,
    videoUrl,
    cues,
    recommendedFreq,
    actorIsAdmin,
  }: {
    exercise: Exercise;
    title?: string;
    videoUrl?: string | null;
    cues?: string;
    recommendedFreq?: number;
    actorIsAdmin?: boolean;
  }): Promise<Empty | { error: string }> {
    if (!actorIsAdmin) return { error: "Action requires Administrator" };
    const existing = await this.exercises.findOne({ _id: exercise });
    if (!existing) return { error: `exercise ${exercise} does not exist` };

    const update: { $set: Partial<Omit<ExerciseDoc, "_id">>; $unset?: { videoUrl?: "" } } = { $set: {} };

    if (title !== undefined) {
      if (!this.isNonEmpty(title)) return { error: "title must be a non-empty string" };
      update.$set.title = title.trim();
    }
    if (videoUrl !== undefined) {
      const urlResult = this.normalizeUrl(videoUrl === null ? "" : videoUrl);
      if (urlResult.error) return { error: urlResult.error };
      if (urlResult.url) {
        update.$set.videoUrl = urlResult.url;
      } else {
        update.$unset = { videoUrl: "" };
      }
    }
    if (cues !== undefined) {
      const cuesCheck = this.validateCues(cues);
      if (cuesCheck) return { error: cuesCheck };
      update.$set.cues = cues.trim();
    }
    if (recommendedFreq !== undefined) {
      const freqCheck = this.validateFrequency(recommendedFreq);
      if (freqCheck) return { error: freqCheck };
      update.$set.recommendedFreq = recommendedFreq;
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
  async deprecateExercise({ exercise, actorIsAdmin }: { exercise: Exercise; actorIsAdmin: boolean }): Promise<Empty | { error: string }> {
    if (!actorIsAdmin) return { error: "Action requires Administrator" };
    const res = await this.exercises.updateOne({ _id: exercise }, { $set: { deprecated: true } });
    if (res.matchedCount === 0) return { error: `exercise ${exercise} does not exist` };
    return {};
  }

  /**
   * proposeDetails (exercise: Exercise, llmText: String, actorIsAdmin: Boolean): (proposal: DetailProposal)
   *
   * requires actorIsAdmin = true; exercise exists; llmText is a JSON object with optional videoUrl, cues, recommendedFreq, confidence_0_1
   * effects parses llmText; validates fields; records a DetailProposal with status := "pending"; returns proposal id
   */
  async proposeDetails({
    exercise,
    llmText,
    actorIsAdmin,
  }: {
    exercise: Exercise;
    llmText: string;
    actorIsAdmin: boolean;
  }): Promise<{ proposal: Proposal } | { error: string }> {
    if (!actorIsAdmin) return { error: "Action requires Administrator" };
    const existing = await this.exercises.findOne({ _id: exercise });
    if (!existing) return { error: `exercise ${exercise} does not exist` };

    // Extract first JSON object from llmText
    const match = llmText.match(/\{[\s\S]*\}/);
    if (!match) return { error: "no JSON object found in llmText" };

    let parsed: any;
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      return { error: "invalid JSON in llmText" };
    }

    const cuesVal = typeof parsed.cues === "string" ? parsed.cues : "";
    const cuesCheck = this.validateCues(cuesVal);
    if (cuesCheck) return { error: cuesCheck };

    const freqVal = typeof parsed.recommendedFreq === "number" ? parsed.recommendedFreq : NaN;
    const freqCheck = this.validateFrequency(freqVal);
    if (freqCheck) return { error: freqCheck };

    const conf = typeof parsed.confidence_0_1 === "number" ? parsed.confidence_0_1 : 0;
    if (!(conf >= 0 && conf <= 1)) return { error: "confidence_0_1 must be between 0 and 1" };

    const urlNorm = this.normalizeUrl(typeof parsed.videoUrl === "string" ? parsed.videoUrl : undefined);
    if (urlNorm.error) return { error: urlNorm.error };

    const proposalId = freshID() as Proposal;
    const doc: ProposalDoc = {
      _id: proposalId,
      exercise,
      createdAt: new Date().toISOString(),
      videoUrl: urlNorm.url,
      cues: cuesVal.trim(),
      recommendedFreq: freqVal,
      confidence_0_1: conf,
      status: "pending",
    };
    await this.detailProposals.insertOne(doc);
    return { proposal: proposalId };
  }

  /**
   * applyDetails (proposal: DetailProposal, actorIsAdmin: Boolean): ()
   *
   * requires actorIsAdmin = true; a pending proposal exists
   * effects merges proposal fields into exercise and marks proposal as applied
   */
  async applyDetails({ proposal, actorIsAdmin }: { proposal: Proposal; actorIsAdmin: boolean }): Promise<Empty | { error: string }> {
    if (!actorIsAdmin) return { error: "Action requires Administrator" };
    const prop = await this.detailProposals.findOne({ _id: proposal });
    if (!prop) return { error: `proposal ${proposal} does not exist` };
    if (prop.status !== "pending") return { error: `proposal ${proposal} is not pending` };

    const exercise = await this.exercises.findOne({ _id: prop.exercise });
    if (!exercise) return { error: `exercise ${prop.exercise} does not exist` };

    const update: { $set: Partial<Omit<ExerciseDoc, "_id">> } = { $set: {} };
    if (prop.videoUrl !== undefined && prop.videoUrl.trim().length > 0) update.$set.videoUrl = prop.videoUrl;
    update.$set.cues = prop.cues;
    update.$set.recommendedFreq = prop.recommendedFreq;
    await this.exercises.updateOne({ _id: prop.exercise }, update);

    await this.detailProposals.updateOne({ _id: proposal }, { $set: { status: "applied" } });
    return {};
  }

  /**
   * discardDetails (proposal: DetailProposal, actorIsAdmin: Boolean): ()
   *
   * requires actorIsAdmin = true; a pending proposal exists
   * effects sets proposal.status := "discarded"
   */
  async discardDetails({ proposal, actorIsAdmin }: { proposal: Proposal; actorIsAdmin: boolean }): Promise<Empty | { error: string }> {
    if (!actorIsAdmin) return { error: "Action requires Administrator" };
    const prop = await this.detailProposals.findOne({ _id: proposal });
    if (!prop) return { error: `proposal ${proposal} does not exist` };
    if (prop.status !== "pending") return { error: `proposal ${proposal} is not pending` };
    await this.detailProposals.updateOne({ _id: proposal }, { $set: { status: "discarded" } });
    return {};
  }

  // QUERIES

  /**
   * _getExerciseById (exercise: Exercise): (exercise: ExerciseDoc)
   */
  async _getExerciseById({ exercise }: { exercise: Exercise }): Promise<ExerciseDoc[]> {
    const doc = await this.exercises.findOne({ _id: exercise });
    return doc ? [doc] : [];
  }

  /**
   * _listExercises (includeDeprecated?: Flag): (exercise: ExerciseDoc)
   */
  async _listExercises({ includeDeprecated = true }: { includeDeprecated?: boolean }): Promise<ExerciseDoc[]> {
    const filter = includeDeprecated ? {} : { deprecated: { $ne: true } } as any;
    return this.exercises.find(filter).toArray();
  }

  /**
   * _listProposals (status?: String): (proposal: ProposalDoc)
   */
  async _listProposals({ status }: { status?: "pending" | "applied" | "discarded" }): Promise<ProposalDoc[]> {
    const filter = status ? { status } : {};
    return this.detailProposals.find(filter).toArray();
  }

  /**
   * _getProposalsForExercise (exercise: Exercise): (proposal: ProposalDoc)
   */
  async _getProposalsForExercise({ exercise }: { exercise: Exercise }): Promise<ProposalDoc[]> {
    return this.detailProposals.find({ exercise }).toArray();
  }

  // Validation helpers
  private isNonEmpty(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
  }

  private validateCues(cues: string): string | undefined {
    if (!this.isNonEmpty(cues)) return "cues must be a non-empty string";
    if (cues.length > ExerciseLibraryConcept.MAX_CUES_LENGTH) {
      return `cues must be <= ${ExerciseLibraryConcept.MAX_CUES_LENGTH} characters`;
    }
    if (/<\/?[a-z][\s\S]*>/i.test(cues) || /<script/i.test(cues)) {
      return "cues must not contain HTML";
    }
    return undefined;
  }

  private validateFrequency(value: number): string | undefined {
    if (!Number.isFinite(value)) return "recommendedFreq must be a finite number";
    if (!Number.isInteger(value)) return "recommendedFreq must be an integer";
    if (value < ExerciseLibraryConcept.FREQ_MIN || value > ExerciseLibraryConcept.FREQ_MAX) {
      return `recommendedFreq must be between ${ExerciseLibraryConcept.FREQ_MIN} and ${ExerciseLibraryConcept.FREQ_MAX}`;
    }
    return undefined;
  }

  private normalizeUrl(input?: string): { url?: string; error?: string } {
    if (input === undefined) return {};
    const trimmed = input.trim();
    if (trimmed.length === 0) return {};
    if (trimmed.length > ExerciseLibraryConcept.MAX_URL_LENGTH) return { error: "videoUrl is too long" };
    try {
      const u = new URL(trimmed);
      if (u.protocol !== "http:" && u.protocol !== "https:") return { error: "videoUrl must use http or https" };
      return { url: u.toString() };
    } catch {
      return { error: "videoUrl is not a valid URL" };
    }
  }
}



