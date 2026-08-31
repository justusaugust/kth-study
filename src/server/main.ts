import { promises as fs } from "node:fs";
import { serve } from "@hono/node-server";
import path from "node:path";
import { createApp } from "./app";
import { createStudyContext } from "./context";

function argument(name: string, fallback: string): string {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const root = path.resolve(argument("root", "."));
const port = Number.parseInt(argument("port", "4318"), 10);
if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("Port must be an integer between 1 and 65535.");
}

const [context, widgetHtml] = await Promise.all([
  createStudyContext(root),
  fs.readFile(
    path.join(root, "plugins/kth-study/mcp/study-explainer-widget.html"),
    "utf8",
  ),
]);
const app = createApp(context, widgetHtml);
serve({ fetch: app.fetch, hostname: "127.0.0.1", port });

const counts = {
  courses: context.corpus.courses.size,
  assessments: context.corpus.assessments.size,
  sessions: context.corpus.sessions.size,
  coursework: context.corpus.coursework.size,
  outcomes: context.corpus.outcomes.size,
  lectures: context.corpus.lectures.size,
  concepts: context.corpus.concepts.size,
  explainers: context.corpus.explainers.size,
};
console.log(`Study API listening at http://127.0.0.1:${port}`);
console.log(`Validated entities: ${JSON.stringify(counts)}`);
