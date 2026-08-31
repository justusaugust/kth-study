import { promises as fs } from "node:fs";
import {
  entityUrl,
  searchCorpus,
  type SearchEntityType,
  type StudyEntity,
} from "../domain";
import { ingestLecture, type IngestLectureInput } from "../ingest/ingestLecture";
import type { StudyContext } from "../server/context";
import { listPendingAsks, resolveAsk } from "../server/askQueue";
import { EXPLAINER_WIDGET_META } from "./resources";

function entityMap(context: StudyContext): Map<string, StudyEntity> {
  const entities = new Map<string, StudyEntity>();
  for (const map of [
    context.corpus.courses,
    context.corpus.assessments,
    context.corpus.sessions,
    context.corpus.coursework,
    context.corpus.outcomes,
    context.corpus.lectures,
    context.corpus.concepts,
    context.corpus.explainers,
    context.corpus.examples,
    context.corpus.questions,
    context.corpus.sources,
  ]) {
    for (const [id, entity] of map) entities.set(id, entity);
  }
  return entities;
}

function textResult(
  message: string,
  structuredContent: Record<string, unknown>,
  meta?: Record<string, unknown>,
) {
  return {
    content: [{ type: "text" as const, text: message }],
    structuredContent,
    ...(meta ? { _meta: meta } : {}),
  };
}

function stringArgument(args: Record<string, unknown>, name: string): string {
  const value = args[name];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${name} must be a non-empty string.`);
  }
  return value;
}

export async function callTool(
  context: StudyContext,
  name: string,
  args: Record<string, unknown>,
) {
  const entities = entityMap(context);

  if (name === "search_study_hub") {
    const query = stringArgument(args, "query");
    const limit = Math.min(Math.max(Number(args.limit ?? 20), 1), 50);
    const results = searchCorpus(context.search, context.corpus, query, {
      courseId: typeof args.courseId === "string" ? args.courseId : undefined,
      entityTypes: Array.isArray(args.entityTypes)
        ? (args.entityTypes as SearchEntityType[])
        : undefined,
      visualKinds: Array.isArray(args.visualKinds)
        ? (args.visualKinds as ("function-plot" | "number-line" | "coordinate-plane" | "systems-diagram" | "conic-section")[])
        : undefined,
    }).slice(0, limit);
    return textResult(`Found ${results.length} study item(s).`, { query, results });
  }

  if (name === "get_course_dates") {
    const requestedCode = typeof args.courseCode === "string"
      ? args.courseCode.toUpperCase()
      : undefined;
    const courses = [...context.corpus.courses.values()].filter(
      (course) => !requestedCode || course.code === requestedCode,
    );
    if (requestedCode && courses.length === 0) {
      throw new Error(`Unknown course code: ${requestedCode}`);
    }
    const today = context.refreshedAt.slice(0, 10);
    const result = courses.map((course) => ({
      course,
      assessments: [...context.corpus.assessments.values()].filter(
        (assessment) => assessment.courseId === course.id,
      ),
      upcomingSessions: [...context.corpus.sessions.values()]
        .filter((session) => session.courseId === course.id && session.date && session.date >= today)
        .sort((left, right) => left.date!.localeCompare(right.date!))
        .slice(0, 12),
      upcomingCoursework: [...context.corpus.coursework.values()]
        .filter((item) => item.courseId === course.id && item.date && item.date >= today)
        .sort((left, right) => left.date!.localeCompare(right.date!))
        .slice(0, 12),
    }));
    const assessmentSummary = result.flatMap(({ course, assessments }) =>
      assessments.map((assessment) =>
        `${course.code} ${assessment.code}: ${assessment.date ?? "date not stored"} (last checked ${assessment.lastChecked}, ${assessment.confidence})`,
      ),
    );
    return textResult(
      assessmentSummary.length
        ? assessmentSummary.join("\n")
        : "No assessments are stored for the selected course(s).",
      { refreshedAt: context.refreshedAt, courses: result },
    );
  }

  if (name === "explain_concept") {
    const id = stringArgument(args, "id");
    const concept = context.corpus.concepts.get(id);
    if (!concept) throw new Error(`Unknown concept ID: ${id}`);
    const visuals = [...context.corpus.explainers.values()]
      .filter((explainer) => explainer.conceptIds.includes(id))
      .map((explainer) => ({
        id: explainer.id,
        title: explainer.title,
        url: entityUrl(explainer),
      }));
    const visualInstruction = visuals[0]
      ? ` Interactive visual available: call show_visual with ${visuals[0].id}.`
      : "";
    return textResult(`${concept.summary}${visualInstruction}`, {
      id,
      url: entityUrl(concept),
      concept,
      course: context.corpus.courses.get(concept.courseId),
      visuals,
    });
  }

  if (name === "show_visual") {
    const id = stringArgument(args, "id");
    const explainer = context.corpus.explainers.get(id);
    if (!explainer) throw new Error(`Unknown explainer ID: ${id}`);
    return textResult(
      explainer.accessibleSummary,
      {
        id,
        url: entityUrl(explainer),
        explainer,
        course: context.corpus.courses.get(explainer.courseId),
        concepts: explainer.conceptIds
          .map((conceptId) => context.corpus.concepts.get(conceptId))
          .filter(Boolean),
      },
      EXPLAINER_WIDGET_META,
    );
  }

  if (name === "show_prerequisites") {
    const id = stringArgument(args, "id");
    if (!entities.has(id)) throw new Error(`Unknown entity ID: ${id}`);
    const prerequisiteIds = context.graph.neighbors(id, "requires", "out");
    const prerequisites = prerequisiteIds
      .map((entityId) => entities.get(entityId))
      .filter((entity): entity is StudyEntity => Boolean(entity))
      .map((entity) => ({ id: entity.id, title: entity.title, url: entityUrl(entity) }));
    return textResult(`Found ${prerequisites.length} prerequisite(s).`, {
      id,
      prerequisites,
    });
  }

  if (name === "quiz_me") {
    const conceptId = stringArgument(args, "conceptId");
    const limit = Math.min(Math.max(Number(args.limit ?? 5), 1), 20);
    const questions = [...context.corpus.questions.values()]
      .filter((question) => question.conceptIds.includes(conceptId))
      .slice(0, limit)
      .map(({ answer: _answer, ...question }) => question);
    return textResult(`Prepared ${questions.length} question(s).`, {
      conceptId,
      questions,
    });
  }

  if (name === "open_in_study_hub") {
    const id = stringArgument(args, "id");
    const entity = entities.get(id);
    if (!entity) throw new Error(`Unknown entity ID: ${id}`);
    const url = `http://127.0.0.1:4318${entityUrl(entity)}`;
    return textResult(url, { id, url });
  }

  if (name === "list_pending_asks") {
    const asks = await listPendingAsks(context.root, typeof args.entityId === "string" ? args.entityId : undefined);
    return textResult(`Found ${asks.length} pending question(s).`, { asks });
  }

  if (name === "resolve_pending_ask") {
    const id = stringArgument(args, "id");
    const result = await resolveAsk(context.root, id);
    return textResult("Pending question resolved.", { result });
  }

  if (name === "ingest_lecture") {
    const inputPath = stringArgument(args, "inputPath");
    const input = JSON.parse(await fs.readFile(inputPath, "utf8")) as Omit<
      IngestLectureInput,
      "root"
    >;
    const result = await ingestLecture({ ...input, root: context.root });
    return textResult(`Ingested ${result.lectureId}.`, { result });
  }

  throw new Error(`Unknown KTH Study tool: ${name}`);
}
