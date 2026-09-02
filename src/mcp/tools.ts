import { promises as fs } from "node:fs";
import {
  entityUrl,
  searchCorpus,
  type SearchEntityType,
  type StudyEntity,
} from "../domain";
import { ingestLecture, type IngestLectureInput } from "../ingest/ingestLecture";
import type { StudyContext } from "../server/context";
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

function sourceSummary(context: StudyContext, sourceIds: string[]): string {
  const sources = sourceIds
    .map((id) => context.corpus.sources.get(id))
    .filter((source) => source !== undefined)
    .map((source) => `${source.title}${source.url ? ` (${source.url})` : ""}`);
  return sources.length ? ` Sources: ${sources.join("; ")}.` : "";
}

function nextAction(result: { id: string; entityType: SearchEntityType }): string {
  if (result.entityType === "concept") return `Next: call explain_concept with ${result.id}.`;
  if (result.entityType === "explainer") return `Next: call show_visual with ${result.id}.`;
  return `Stable ID: ${result.id}.`;
}

export async function callTool(
  context: StudyContext,
  name: string,
  args: Record<string, unknown>,
  publicOrigin?: string,
) {
  const entities = entityMap(context);
  const url = (path: string) => publicOrigin ? new URL(path, publicOrigin).href : path;

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
    }).slice(0, limit).map((result) => ({ ...result, url: url(result.url) }));
    const summary = results.length
      ? [
          "Best matches from the KTH Study corpus:",
          ...results.slice(0, 8).map((result, index) =>
            `${index + 1}. [${result.entityType}] ${result.title} — ${result.summary} ${nextAction(result)}`,
          ),
        ].join("\n")
      : `No KTH Study material matched “${query}”.`;
    return textResult(summary, { query, results });
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
        `${course.code} ${assessment.code} — ${assessment.title}: ${assessment.date ?? "date not stored"}${assessment.time ? ` at ${assessment.time}` : ""}. ${assessment.description} Evidence: ${assessment.confidence}, last checked ${assessment.lastChecked}.${sourceSummary(context, assessment.sourceIds)}`,
      ),
    );
    const courseworkSummary = result.flatMap(({ course, upcomingCoursework }) =>
      upcomingCoursework.map((item) => {
        const links = item.materials
          .filter((material) => material.url)
          .map((material) => `${material.title}: ${material.url}`);
        return `${course.code} — ${item.title}: ${item.date}${item.time ? ` at ${item.time}` : ""} (${item.requirement}). ${item.description}${links.length ? ` Links: ${links.join("; ")}.` : ""} Evidence: ${item.confidence}, last checked ${item.lastChecked}.${sourceSummary(context, item.sourceIds)}`;
      }),
    );
    const sessionSummary = result.flatMap(({ course, upcomingSessions }) =>
      upcomingSessions.map((session) =>
        `${course.code} — ${session.title}: ${session.date} (${session.kind}). Evidence: ${session.confidence}, last checked ${session.lastChecked}.${sourceSummary(context, session.sourceIds)}`,
      ),
    );
    const sections = [
      assessmentSummary.length ? `Assessments:\n${assessmentSummary.join("\n")}` : "No assessments are stored for the selected course(s).",
      courseworkSummary.length ? `Upcoming coursework:\n${courseworkSummary.join("\n")}` : "No dated upcoming coursework is stored for the selected course(s).",
      sessionSummary.length ? `Upcoming sessions:\n${sessionSummary.join("\n")}` : "No dated upcoming sessions are stored for the selected course(s).",
    ];
    return textResult(
      `KTH Study date evidence refreshed ${context.refreshedAt}.\n\n${sections.join("\n\n")}`,
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
        url: url(entityUrl(explainer)),
      }));
    const definitions = [...context.corpus.definitions.values()]
      .filter((definition) => definition.conceptIds.includes(id))
      .map((definition) =>
        `${definition.term}${definition.notation ? ` (${definition.notation})` : ""}: ${definition.statement}${definition.interpretation ? ` ${definition.interpretation}` : ""}`,
      );
    const explanation = [
      concept.summary,
      concept.centralInsight ? `Central insight: ${concept.centralInsight}` : "",
      definitions.length ? `Key definitions:\n${definitions.join("\n")}` : "",
      concept.commonMistake ? `Common mistake: ${concept.commonMistake}` : "",
      `Evidence: ${concept.confidence}, last checked ${concept.lastChecked}.${sourceSummary(context, concept.sourceIds)}`,
    ].filter(Boolean).join("\n\n");
    return textResult(explanation, {
      id,
      url: url(entityUrl(concept)),
      concept,
      course: context.corpus.courses.get(concept.courseId),
      visuals,
    });
  }

  if (name === "show_visual") {
    const id = stringArgument(args, "id");
    const explainer = context.corpus.explainers.get(id) ??
      [...context.corpus.explainers.values()].find((candidate) =>
        context.corpus.concepts.has(id) && candidate.conceptIds.includes(id)
      );
    if (!explainer) throw new Error(`Unknown explainer ID: ${id}`);
    return textResult(
      explainer.accessibleSummary,
      {
        id: explainer.id,
        url: url(entityUrl(explainer)),
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
      .map((entity) => ({ id: entity.id, title: entity.title, url: url(entityUrl(entity)) }));
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
    const target = publicOrigin
      ? url(entityUrl(entity))
      : `http://127.0.0.1:4318${entityUrl(entity)}`;
    return textResult(target, { id, url: target });
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
