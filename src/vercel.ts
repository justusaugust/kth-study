import { promises as fs } from "node:fs";
import path from "node:path";
import { createApp } from "./server/app";
import { createStudyContext } from "./server/context";

const root = process.cwd();
const [context, widgetHtml] = await Promise.all([
  createStudyContext(root, { loadExtractedText: false }),
  fs.readFile(
    path.join(root, "plugins/kth-study/mcp/study-explainer-widget.html"),
    "utf8",
  ),
]);
const app = createApp(context, widgetHtml, {
  publicOrigin: "https://kth-study.vercel.app",
  verificationToken: process.env.OPENAI_APPS_CHALLENGE,
});

export default (request: Request) => {
  const url = new URL(request.url);
  const requestPath = url.searchParams.get("_path");
  if (!requestPath) return new Response("Not found", { status: 404 });
  url.pathname = requestPath;
  url.searchParams.delete("_path");
  return app.fetch(new Request(url, request));
};
