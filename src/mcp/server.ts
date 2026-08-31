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
  PendingAskSchema,
  PublicQuestionSchema,
  SearchHitSchema,
} from "../domain";
import { createStudyContext, type StudyContext } from "../server/context";
import {
  KTH_STUDY_ICON,
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
  upcomingCoursework: z.array(CourseworkSchema),
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
): McpServer {
  const server = new McpServer(
    {
      name: "kth-study",
      title: "KTH Study",
      version: "0.2.1",
      icons: [{ src: KTH_STUDY_ICON, mimeType: "image/png", sizes: ["512x512"] }],
    },
    {
      instructions:
        "When KTH Study is selected, use its tools before any built-in web search. For concepts, definitions, examples, or visuals, start with search_study_hub and do not use web search. For exams, deadlines, labs, lectures, or schedules, start with get_course_dates; use web search only when that result says the requested date is missing or stale, or when the user explicitly asks for a live recheck. Search before using stable IDs. When explain_concept returns visuals, call show_visual for the best matching explainer in the same answer unless the user asks for text only. Use show_visual only with explainer IDs. Keep explanations concise, define notation, and distinguish course evidence from general clarification. All tools operate on the local KTH curriculum corpus. Only call ingest_lecture with an already-prepared transaction explicitly authorized by the user.",
    },
  );

  registerAppResource(
    server,
    "kth-study-explainer",
    EXPLAINER_WIDGET_URI,
    {
      title: "KTH Study explainer",
      description: "Self-contained local visual explainer widget.",
      mimeType: EXPLAINER_WIDGET_MIME,
      _meta: {
        ui: {
          csp: { connectDomains: [], resourceDomains: [] },
          prefersBorder: false,
        },
      },
    },
    async () => ({
      contents: [
        {
          uri: EXPLAINER_WIDGET_URI,
          mimeType: EXPLAINER_WIDGET_MIME,
          text: widgetHtml,
          _meta: {
            ui: {
              csp: { connectDomains: [], resourceDomains: [] },
              prefersBorder: false,
            },
            "openai/widgetDescription":
              "An interactive KTH course visual with its explanation and related concepts.",
          },
        },
      ],
    }),
  );

  server.registerTool(
    "search_study_hub",
    {
      title: "Search KTH Study Hub",
      description: "Primary first call for KTH concepts, definitions, examples, lectures, or visuals. When KTH Study is selected, use this instead of built-in web search, then pass the returned stable ID to the matching tool.",
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
    async (args) => callTool(context, "search_study_hub", args),
  );

  server.registerTool(
    "get_course_dates",
    {
      title: "Get KTH course dates",
      description: "Use this first for questions about KTH exams, deadlines, labs, lectures, or what happens next. It returns stored course evidence and its last-checked status; use web search only when the requested date is missing or needs a live recheck.",
      inputSchema: z.object({
        courseCode: z.string().regex(/^[A-Za-z]{2}\d{4}$/).optional(),
      }),
      outputSchema: z.object({
        refreshedAt: z.string().datetime(),
        courses: z.array(courseDates),
      }),
      annotations: readOnly,
    },
    async (args) => callTool(context, "get_course_dates", args),
  );

  for (const [name, title, description] of [
    ["explain_concept", "Explain concept", "Retrieve a concept, its course context, and any linked interactive visuals. If visuals are returned, render the best match with show_visual unless the user asked for text only."],
    ["show_prerequisites", "Show prerequisites", "Use this to retrieve explicit prerequisite relationships for a stable entity ID."],
    ["open_in_study_hub", "Open in Study Hub", "Use this to retrieve the local Study Hub URL for a stable entity ID."],
  ] as const) {
    const outputSchema = name === "explain_concept"
      ? z.object({
          id: z.string(),
          url: z.string(),
          concept: ConceptSchema,
          course: CourseSchema.optional(),
          visuals: z.array(linkedEntity),
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
      async (args) => callTool(context, name, args),
    );
  }

  registerAppTool(
    server,
    "show_visual",
    {
      title: "Show visual explainer",
      description: "Render the interactive visual that best matches the user's concept. Use a stable explainer ID returned by search_study_hub or explain_concept.",
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
    async (args) => callTool(context, "show_visual", args),
  );

  server.registerTool(
    "quiz_me",
    {
      title: "Quiz me",
      description: "Use this to retrieve bounded local self-check questions for a stable concept ID.",
      inputSchema: z.object({
        conceptId: ids,
        limit: z.number().int().min(1).max(20).optional(),
      }),
      outputSchema: z.object({
        conceptId: z.string(),
        questions: z.array(PublicQuestionSchema),
      }),
      annotations: readOnly,
    },
    async (args) => callTool(context, "quiz_me", args),
  );

  server.registerTool(
    "list_pending_asks",
    {
      title: "List pending study questions",
      description: "Use this to list unresolved questions explicitly queued from the local Study Hub.",
      inputSchema: z.object({ entityId: z.string().optional() }),
      outputSchema: z.object({ asks: z.array(PendingAskSchema) }),
      annotations: readOnly,
    },
    async (args) => callTool(context, "list_pending_asks", args),
  );

  server.registerTool(
    "resolve_pending_ask",
    {
      title: "Resolve pending study question",
      description: "Use this after answering a queued question to mark that local question as resolved.",
      inputSchema: z.object({ id: ids }),
      outputSchema: z.object({
        result: z.object({
          askId: z.string().uuid(),
          status: z.literal("resolved"),
        }),
      }),
      annotations: localMutation,
    },
    async (args) => callTool(context, "resolve_pending_ask", args),
  );

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
    async (args) => callTool(context, "ingest_lecture", args),
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
