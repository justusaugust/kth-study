import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  registerAppResource,
  registerAppTool,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  AssessmentSchema,
  ConceptSchema,
  CourseSessionSchema,
  CourseSchema,
  CourseworkSchema,
  ExplainerSpecSchema,
  PublicQuestionSchema,
  SearchHitSchema,
} from "../domain";
import { createStudyContext, type StudyContext } from "../server/context";
import {
  KTH_STUDY_ICONS,
  EXPLAINER_WIDGET_META,
  EXPLAINER_WIDGET_MIME,
  EXPLAINER_WIDGET_URI,
} from "./resources";
import { callTool } from "./tools";

const ids = z.string().min(1);
const entityTypes = z.enum([
  "course",
  "outcome",
  "lecture",
  "session",
  "coursework",
  "assessment",
  "concept",
  "definition",
  "explainer",
  "example",
  "question",
  "source",
]);
const visualKinds = z.enum([
  "function-plot",
  "number-line",
  "coordinate-plane",
  "systems-diagram",
  "conic-section",
]);
const linkedEntity = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
});
const courseDates = z.object({
  course: CourseSchema,
  assessments: z.array(AssessmentSchema),
  upcomingSessions: z.array(CourseSessionSchema),
  upcomingCoursework: z.array(CourseworkSchema.extend({
    url: z.string(),
    practiceUrl: z.string(),
    lectures: z.array(linkedEntity),
    missingLectureNotes: z.array(z.string()),
  })),
  undatedSessions: z.array(CourseSessionSchema),
  undatedCoursework: z.array(CourseworkSchema),
});
const readOnly = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;
const localMutation = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: false,
  openWorldHint: false,
} as const;

export function createKthStudyServer(
  context: StudyContext,
  widgetHtml: string,
  publicOrigin?: string,
): McpServer {
  const widgetDomain = publicOrigin ?? "https://kth-study.vercel.app";
  const invoke = (name: string, args: Record<string, unknown>) =>
    callTool(context, name, args, publicOrigin);
  const server = new McpServer(
    {
      name: "kth-study",
      title: "KTH Study",
      version: "0.2.6",
      icons: KTH_STUDY_ICONS,
    },
    {
      instructions:
        "This study plugin cannot log in to Canvas or Ladok, collect credentials, submit assignments, or register for exams. Explain that limitation for account-action requests; offer study guidance instead. For course quizzes, use search_study_hub then quiz_me, not a generated quiz. Present only returned authored questions, preserving their wording and count; withhold solutions until an attempt or explicit request. If fewer questions exist, say so rather than inventing extras. " +
        "For concepts, definitions, examples, or visuals, start with search_study_hub and do not use web search. Use explain_concept for text-first explanations. Call show_visual with a returned explainer ID when the user asks to see, demonstrate, or interact with a concept; prefer the authored visual over a generated replacement, but do not force visuals into every explanation. For exams, deadlines, labs, lectures, or schedules, start with get_course_dates; use web search only for missing or stale dates or an explicit live recheck. Search before using stable IDs. Keep explanations concise, define notation, and distinguish stored course evidence from general clarification. Unrelated requests are outside this plugin's scope." +
        (publicOrigin ? " All available tools are read-only." : " Only call ingest_lecture with an already-prepared local transaction explicitly authorized by the user."),
    },
  );

  // Published hosts retain template URIs. Keep these until old connections are retired.
  for (const uri of [EXPLAINER_WIDGET_URI, ...["0.2.1", "0.2.2", "0.2.3", "0.2.4"].map(version => `ui://widget/kth-study-explainer-${version}.html`)]) {
    registerAppResource(
      server,
      uri,
      uri,
      {
        title: "KTH Study explainer",
        description: "Self-contained local visual explainer widget.",
        mimeType: EXPLAINER_WIDGET_MIME,
        _meta: {
          ui: {
            csp: { connectDomains: [], resourceDomains: [] },
            domain: widgetDomain,
            prefersBorder: false,
          },
        },
      },
      async () => ({
        contents: [
          {
            uri,
            mimeType: EXPLAINER_WIDGET_MIME,
            text: widgetHtml,
            _meta: {
              ui: {
                csp: { connectDomains: [], resourceDomains: [] },
                domain: widgetDomain,
                prefersBorder: false,
              },
              "openai/widgetDescription":
                "An interactive KTH course visual with its explanation and related concepts.",
            },
          },
        ],
      }),
    );
  }

  server.registerTool(
    "search_study_hub",
    {
      title: "Search KTH Study Hub",
      description: "Use this first for course concepts, definitions, examples, lectures, visuals, or quiz practice. For quiz requests, find the concept ID then call quiz_me for authored questions instead of generating a quiz. Otherwise pass the returned stable ID to the matching study tool. This plugin cannot access Canvas/Ladok accounts, submit work, or register for exams.",
      inputSchema: z.object({
        query: z.string().min(1),
        courseId: z.string().optional(),
        entityTypes: z.array(entityTypes).optional(),
        visualKinds: z.array(visualKinds).optional(),
        limit: z.number().int().min(1).max(50).optional(),
      }),
      outputSchema: z.object({
        query: z.string(),
        results: z.array(SearchHitSchema),
      }),
      annotations: readOnly,
    },
    async (args) => invoke("search_study_hub", args),
  );

  server.registerTool(
    "get_course_dates",
    {
      title: "Get KTH course dates",
      description: "Use this first for KTH exams, deadlines, labs, lecture dates, or what happens next. Returns stored evidence, last-checked dates, and upcoming coursework study-pack links with covered lectures and missing-note warnings. Practice is topic-matched, not guaranteed exam coverage. Use official sources for missing dates or live rechecks.",
      inputSchema: z.object({
        courseCode: z.string().regex(/^[A-Za-z]{2}\d{4}$/).optional(),
      }),
      outputSchema: z.object({
        corpusLoadedAt: z.string().datetime(),
        asOfDate: z.string().date(),
        courses: z.array(courseDates),
      }),
      annotations: readOnly,
    },
    async (args) => invoke("get_course_dates", args),
  );

  for (const [name, title, description] of [
    ["explain_concept", "Explain concept", "Retrieve a concept, its course context, lecture-note links, and available interactive visuals. Use returned lecture links when the user wants to study further. Return a text explanation by default; render a visual only when requested or clearly useful."],
    ["show_prerequisites", "Show prerequisites", "Use this to retrieve explicit prerequisite relationships for a stable entity ID."],
    ["open_in_study_hub", "Open in Study Hub", "Use this to retrieve the Study Hub URL for a stable entity ID."],
  ] as const) {
    const outputSchema = name === "explain_concept"
      ? z.object({
          id: z.string(),
          url: z.string(),
          concept: ConceptSchema,
          course: CourseSchema.optional(),
          visuals: z.array(linkedEntity),
          lectures: z.array(linkedEntity),
        })
      : name === "show_prerequisites"
        ? z.object({ id: z.string(), prerequisites: z.array(linkedEntity) })
        : z.object({ id: z.string(), url: z.string() });
    server.registerTool(
      name,
      {
        title,
        description,
        inputSchema: z.object({ id: ids }),
        outputSchema,
        annotations: readOnly,
      },
      async (args) => invoke(name, args),
    );
  }

  registerAppTool(
    server,
    "show_visual",
    {
      title: "Show visual explainer",
      description: "Render KTH Study's authored interactive visual for requests to show, demonstrate, or interact with a course concept. Prefer this over generating a replacement visual. Use a stable explainer ID returned by search_study_hub or explain_concept.",
      inputSchema: z.object({ id: ids }),
      outputSchema: z.object({
        id: z.string(),
        url: z.string(),
        explainer: ExplainerSpecSchema,
        course: CourseSchema.optional(),
        concepts: z.array(ConceptSchema),
      }),
      annotations: readOnly,
      _meta: EXPLAINER_WIDGET_META,
    },
    async (args) => invoke("show_visual", args),
  );

  server.registerTool(
    "quiz_me",
    {
      title: "Quiz me",
      description: "Use this when the user asks to be quizzed or practise a course topic. Search for the concept ID first. Returns authored self-check questions, not generated questions. Present only those returned, preserving wording and count; do not substitute a built-in generated quiz or add questions to reach the limit. Keep solutions hidden until an attempt or explicit request. If none are returned, explain the gap.",
      inputSchema: z.object({
        conceptId: ids,
        limit: z.number().int().min(1).max(20).optional().describe("Maximum authored questions to return, not a target count; fewer may exist."),
      }),
      outputSchema: z.object({
        conceptId: z.string(),
        questions: z.array(PublicQuestionSchema),
      }),
      annotations: readOnly,
    },
    async (args) => invoke("quiz_me", args),
  );

  if (publicOrigin) return server;

  server.registerTool(
    "ingest_lecture",
    {
      title: "Ingest prepared lecture",
      description:
        "Use this only to atomically ingest an explicitly authorized, already-prepared local JSON transaction; it never submits to KTH.",
      inputSchema: z.object({ inputPath: z.string().min(1) }),
      outputSchema: z.object({
        result: z.object({
          lectureId: z.string(),
          writtenEntityIds: z.array(z.string()),
          retainedSourcePaths: z.array(z.string()),
          validationIssueCount: z.literal(0),
          indexPath: z.string(),
        }),
      }),
      annotations: { ...localMutation, destructiveHint: true },
    },
    async (args) => invoke("ingest_lecture", args),
  );

  return server;
}

function argument(name: string, fallback: string): string {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

async function startStdio() {
  const root = path.resolve(argument("root", process.cwd()));
  const ownDirectory = path.dirname(fileURLToPath(import.meta.url));
  const widgetPath = path.join(ownDirectory, "study-explainer-widget.html");
  const [context, widgetHtml] = await Promise.all([
    createStudyContext(root),
    fs.readFile(widgetPath, "utf8"),
  ]);
  const server = createKthStudyServer(context, widgetHtml);
  await server.connect(new StdioServerTransport());
}

if (process.argv.includes("--stdio")) {
  startStdio().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
