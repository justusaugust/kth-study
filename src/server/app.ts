import path from "node:path";
import { serveStatic } from "@hono/node-server/serve-static";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  ConceptResponseSchema,
  CourseResponseSchema,
  DeadlinesResponseSchema,
  ExplainerResponseSchema,
  SearchResponseSchema,
  VisualAtlasResponseSchema,
  buildCourseJourney,
  entityUrl,
  recentCorpus,
  searchCorpus,
  type SearchEntityType,
  type Source,
  type StudyEntity,
} from "../domain";
import { createKthStudyServer } from "../mcp/server";
import { appendFeedback, FeedbackSchema } from "./feedback";
import { getStudyState, setStudyStatus, StudyStatusSchema, undoStudyStatus } from "./studyState";
import { cancelAsk, createAsk, listPendingAsks } from "./askQueue";
import type { StudyContext } from "./context";

const entityTypes: SearchEntityType[] = [
  "course",
  "outcome",
  "lecture",
  "concept",
  "definition",
  "explainer",
  "example",
  "question",
  "source",
];

function allEntities(context: StudyContext): Map<string, StudyEntity> {
  const { corpus } = context;
  const entities = new Map<string, StudyEntity>();
  for (const map of [
    corpus.courses,
    corpus.assessments,
    corpus.sessions,
    corpus.coursework,
    corpus.outcomes,
    corpus.lectures,
    corpus.concepts,
    corpus.definitions,
    corpus.explainers,
    corpus.examples,
    corpus.questions,
    corpus.sources,
  ]) {
    for (const [id, entity] of map) entities.set(id, entity);
  }
  return entities;
}

function error(code: string, message: string) {
  return { error: { code, message } };
}

function publicSource(source: Source) {
  const { originalPath: _original, extractedTextPath: _sidecar, extractedText: _text, ...safe } = source;
  return safe;
}

export function createApp(
  context: StudyContext,
  widgetHtml = "<!doctype html><title>KTH Study</title>",
): Hono {
  const app = new Hono();
  const entities = allEntities(context);

  app.all("/mcp", async (c) => {
    const transport = new WebStandardStreamableHTTPServerTransport({
      enableJsonResponse: true,
    });
    await createKthStudyServer(context, widgetHtml).connect(transport);
    return transport.handleRequest(c.req.raw);
  });

  app.use(
    "/api/*",
    cors({ origin: ["http://127.0.0.1:5173", "http://localhost:5173"] }),
  );

  app.get("/api/health", (c) =>
    c.json({
      status: "ok",
      refreshedAt: context.refreshedAt,
      counts: {
        courses: context.corpus.courses.size,
        assessments: context.corpus.assessments.size,
        sessions: context.corpus.sessions.size,
        coursework: context.corpus.coursework.size,
        outcomes: context.corpus.outcomes.size,
        lectures: context.corpus.lectures.size,
        concepts: context.corpus.concepts.size,
        definitions: context.corpus.definitions.size,
        explainers: context.corpus.explainers.size,
        examples: context.corpus.examples.size,
        questions: context.corpus.questions.size,
        sources: context.corpus.sources.size,
      },
    }),
  );

  app.get("/api/search", (c) => {
    const query = c.req.query("q")?.trim() ?? "";
    const type = c.req.query("type") as SearchEntityType | undefined;
    const visualKind = c.req.query("visualKind");
    const courseCode = c.req.query("course")?.toUpperCase();

    if (type && !entityTypes.includes(type)) {
      return c.json(error("invalid_filter", `Unknown entity type: ${type}`), 400);
    }
    if (visualKind && !["function-plot", "number-line", "coordinate-plane", "systems-diagram", "conic-section"].includes(visualKind)) {
      return c.json(
        error("invalid_filter", `Unknown visual kind: ${visualKind}`),
        400,
      );
    }
    const course = courseCode
      ? [...context.corpus.courses.values()].find(
          (candidate) => candidate.code === courseCode,
        )
      : undefined;
    if (courseCode && !course) {
      return c.json(error("invalid_filter", `Unknown course: ${courseCode}`), 400);
    }

    const filters = {
      courseId: course?.id,
      entityTypes: type
        ? [type]
        : query
          ? undefined
          : ["course", "lecture", "concept", "definition", "explainer", "example", "question"] satisfies SearchEntityType[],
      visualKinds: visualKind ? [visualKind as "function-plot" | "number-line" | "coordinate-plane" | "systems-diagram" | "conic-section"] : undefined,
    };
    const results = query
      ? searchCorpus(context.search, context.corpus, query, filters)
      : recentCorpus(context.corpus, filters, 5);
    return c.json(SearchResponseSchema.parse({ query, results }));
  });

  app.get("/api/visuals", (c) => {
    const items = [...context.corpus.explainers.values()]
      .sort((left, right) => left.atlasOrder - right.atlasOrder)
      .map((explainer) => {
        const course = context.corpus.courses.get(explainer.courseId)!;
        return {
          figureNumber: explainer.atlasOrder,
          courseCode: course.code,
          courseTitle: course.title,
          explainer,
        };
      });
    return c.json(VisualAtlasResponseSchema.parse({ items }));
  });

  app.get("/api/deadlines", (c) =>
    c.json(DeadlinesResponseSchema.parse({
      courses: [...context.corpus.courses.values()].sort((left, right) =>
        left.code.localeCompare(right.code),
      ),
      assessments: [...context.corpus.assessments.values()],
      coursework: [...context.corpus.coursework.values()],
    })),
  );

  app.get("/api/courses/:courseCode", (c) => {
    const code = c.req.param("courseCode").toUpperCase();
    const course = [...context.corpus.courses.values()].find(
      (candidate) => candidate.code === code,
    );
    if (!course) return c.json(error("not_found", "Course not found."), 404);
    const outcomes = [...context.corpus.outcomes.values()].filter(
      (outcome) => outcome.courseId === course.id,
    );
    const lectures = [...context.corpus.lectures.values()].filter(
      (lecture) => lecture.courseId === course.id,
    );
    const concepts = course.conceptIds
      .map((id) => context.corpus.concepts.get(id))
      .filter((concept) => concept !== undefined);
    const explainers = [...context.corpus.explainers.values()].filter(
      (explainer) => explainer.courseId === course.id,
    );
    const definitions = [...context.corpus.definitions.values()].filter(
      (definition) => definition.courseId === course.id,
    );
    const examples = [...context.corpus.examples.values()].filter(
      (example) => example.courseId === course.id,
    );
    const questions = [...context.corpus.questions.values()].filter(
      (question) => question.courseId === course.id,
    );
    const assessments = [...context.corpus.assessments.values()].filter(
      (assessment) => assessment.courseId === course.id,
    );
    const sessions = [...context.corpus.sessions.values()]
      .filter((session) => session.courseId === course.id)
      .sort((left, right) => left.sequence - right.sequence);
    const coursework = [...context.corpus.coursework.values()]
      .filter((item) => item.courseId === course.id)
      .sort((left, right) => left.sequence - right.sequence);
    const sourceIds = new Set([
      ...course.sourceIds,
      ...course.links.flatMap((link) => (link.sourceId ? [link.sourceId] : [])),
      ...outcomes.flatMap((outcome) => outcome.sourceIds),
      ...lectures.flatMap((lecture) => lecture.sourceIds),
      ...concepts.flatMap((concept) => concept.sourceIds),
      ...explainers.flatMap((explainer) => explainer.sourceIds),
      ...definitions.flatMap((definition) => definition.sourceIds),
      ...examples.flatMap((example) => example.sourceIds),
      ...questions.flatMap((question) => question.sourceIds),
      ...assessments.flatMap((assessment) => assessment.sourceIds),
      ...sessions.flatMap((session) => session.sourceIds),
      ...coursework.flatMap((item) => item.sourceIds),
    ]);
    return c.json(CourseResponseSchema.parse({
      course,
      outcomes,
      lectures,
      concepts,
      explainers,
      definitions,
      examples,
      questions,
      assessments,
      sessions,
      coursework,
      journey: buildCourseJourney({ sessions, coursework, assessments }),
      sources: [...sourceIds]
        .map((id) => context.corpus.sources.get(id))
        .filter((source) => source !== undefined)
        .map(publicSource),
    }));
  });

  app.get("/api/concepts/:entityId", (c) => {
    const concept = context.corpus.concepts.get(c.req.param("entityId"));
    if (!concept) return c.json(error("not_found", "Concept not found."), 404);
    const course = context.corpus.courses.get(concept.courseId);
    return c.json(ConceptResponseSchema.parse({
      concept,
      course: course!,
      outcomes: concept.outcomeIds
        .map((id) => context.corpus.outcomes.get(id))
        .filter(Boolean),
      lectures: concept.lectureIds
        .map((id) => context.corpus.lectures.get(id))
        .filter(Boolean),
      explainers: [...context.corpus.explainers.values()].filter((explainer) =>
        explainer.conceptIds.includes(concept.id),
      ),
      definitions: [...context.corpus.definitions.values()].filter((definition) =>
        definition.conceptIds.includes(concept.id),
      ),
      prerequisites: context.graph.neighbors(concept.id, "requires", "out"),
      nextConcepts: context.graph.neighbors(concept.id, "continues_to", "out"),
      sources: concept.sourceIds
        .map((id) => context.corpus.sources.get(id))
        .filter((source) => source !== undefined)
        .map(publicSource),
      examples: [...context.corpus.examples.values()].filter((example) =>
        example.conceptIds.includes(concept.id),
      ),
      questions: [...context.corpus.questions.values()].filter((question) =>
        question.conceptIds.includes(concept.id),
      ),
    }));
  });

  app.get("/api/explainers/:entityId", (c) => {
    const requested = c.req.param("entityId");
    const explainer =
      context.corpus.explainers.get(requested) ??
      [...context.corpus.explainers.values()].find(
        (candidate) => candidate.slug === requested,
      );
    if (!explainer) return c.json(error("not_found", "Explainer not found."), 404);
    return c.json(ExplainerResponseSchema.parse({
      explainer,
      course: context.corpus.courses.get(explainer.courseId)!,
      concepts: explainer.conceptIds
        .map((id) => context.corpus.concepts.get(id))
        .filter(Boolean),
      sources: explainer.sourceIds
        .map((id) => context.corpus.sources.get(id))
        .filter((source) => source !== undefined)
        .map(publicSource),
    }));
  });

  app.get("/api/entities/:entityId/neighbors", (c) => {
    const id = c.req.param("entityId");
    if (!entities.has(id)) return c.json(error("not_found", "Entity not found."), 404);
    const relationship = c.req.query("relationship") as
      | Parameters<StudyContext["graph"]["neighbors"]>[1]
      | undefined;
    const direction = c.req.query("direction") as
      | "out"
      | "in"
      | "both"
      | undefined;
    const validRelationships = [
      "requires",
      "teaches",
      "visualises",
      "appears_in",
      "assesses",
      "continues_to",
      "supports",
    ];
    if (relationship && !validRelationships.includes(relationship)) {
      return c.json(error("invalid_filter", "Unknown relationship type."), 400);
    }
    if (direction && !["out", "in", "both"].includes(direction)) {
      return c.json(error("invalid_filter", "Unknown graph direction."), 400);
    }
    const neighbors = context.graph
      .neighbors(id, relationship, direction)
      .map((neighborId) => entities.get(neighborId))
      .filter((entity): entity is StudyEntity => entity !== undefined)
      .map((entity) => ({ id: entity.id, title: entity.title, url: entityUrl(entity) }));
    return c.json({ entityId: id, neighbors });
  });

  app.post("/api/feedback", async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json(error("invalid_body", "Feedback must be valid JSON."), 400);
    }
    const parsed = FeedbackSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(error("invalid_body", "Feedback did not match the schema."), 400);
    }
    if (!entities.has(parsed.data.entityId)) {
      return c.json(error("not_found", "Feedback entity not found."), 404);
    }
    const event = await appendFeedback(context.root, parsed.data);
    return c.json({ feedback: event }, 201);
  });

  app.get("/api/study-state/:entityId", async (c) => {
    const entityId = c.req.param("entityId");
    if (!entities.has(entityId)) return c.json(error("not_found", "Study entity not found."), 404);
    return c.json(await getStudyState(context.root, entityId));
  });

  app.put("/api/study-state/:entityId", async (c) => {
    const entityId = c.req.param("entityId");
    if (!entities.has(entityId)) return c.json(error("not_found", "Study entity not found."), 404);
    const parsed = StudyStatusSchema.safeParse((await c.req.json().catch(() => ({})) as { status?: unknown }).status);
    if (!parsed.success) return c.json(error("invalid_body", "Unknown study status."), 400);
    return c.json(await setStudyStatus(context.root, entityId, parsed.data));
  });

  app.post("/api/study-state/:entityId/undo", async (c) => {
    const entityId = c.req.param("entityId");
    const body = await c.req.json().catch(() => ({})) as { eventId?: unknown };
    if (typeof body.eventId !== "string") return c.json(error("invalid_body", "Undo requires an event ID."), 400);
    try {
      return c.json(await undoStudyStatus(context.root, entityId, body.eventId));
    } catch (cause) {
      return c.json(error("invalid_transition", cause instanceof Error ? cause.message : "Undo failed."), 409);
    }
  });

  app.get("/api/asks", async (c) => {
    return c.json({ asks: await listPendingAsks(context.root, c.req.query("entityId")) });
  });

  app.post("/api/asks", async (c) => {
    const body = await c.req.json().catch(() => ({})) as Record<string, unknown>;
    if (typeof body.entityId !== "string" || !entities.has(body.entityId)) return c.json(error("not_found", "Ask entity not found."), 404);
    if (typeof body.question !== "string" || !body.question.trim() || typeof body.sourceUrl !== "string") return c.json(error("invalid_body", "A question and source URL are required."), 400);
    return c.json({ ask: await createAsk(context.root, { entityId: body.entityId, question: body.question, sourceUrl: body.sourceUrl }) }, 201);
  });

  app.post("/api/asks/:askId/cancel", async (c) => {
    try { return c.json(await cancelAsk(context.root, c.req.param("askId"))); }
    catch { return c.json(error("not_found", "Pending ask not found."), 404); }
  });

  app.get("/.well-known/*", (c) => c.body(null, 404));

  const builtApp = path.join(context.root, "dist");
  app.use("/assets/*", serveStatic({ root: builtApp }));
  app.get("*", serveStatic({ path: path.join(builtApp, "index.html") }));

  app.notFound((c) => c.json(error("not_found", "Route not found."), 404));
  return app;
}
