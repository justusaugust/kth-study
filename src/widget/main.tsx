import { useApp, useHostStyles } from "@modelcontextprotocol/ext-apps/react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { z } from "zod";
import {
  ConceptSchema,
  CourseSchema,
  ExplainerSpecSchema,
} from "../domain/schemas";
import { ExplainerRenderer } from "../web/components/ExplainerRenderer";
import "mafs/core.css";
import "../web/styles/tokens.css";
import "../web/styles/app.css";
import "./widget.css";

const WidgetContentSchema = z.object({
  id: z.string(),
  url: z.string(),
  explainer: ExplainerSpecSchema,
  course: CourseSchema.optional(),
  concepts: z.array(ConceptSchema).optional(),
});
type WidgetContent = z.infer<typeof WidgetContentSchema>;

declare global {
  interface Window {
    openai?: { toolOutput?: WidgetContent };
    __MCP_STRUCTURED_CONTENT__?: WidgetContent;
  }
}

function currentContent(): WidgetContent | undefined {
  const parsed = WidgetContentSchema.safeParse(
    window.openai?.toolOutput ?? window.__MCP_STRUCTURED_CONTENT__,
  );
  return parsed.success ? parsed.data : undefined;
}

function Widget() {
  const [content, setContent] = useState(currentContent);
  const { app, error } = useApp({
    appInfo: { name: "KTH Study explainer", version: "0.2.1" },
    capabilities: {},
    strict: true,
    onAppCreated: (createdApp) => {
      createdApp.ontoolresult = (result) => {
        const parsed = WidgetContentSchema.safeParse(result.structuredContent);
        if (parsed.success) setContent(parsed.data);
      };
    },
  });
  useHostStyles(app, app?.getHostContext());

  useEffect(() => {
    function refresh() {
      setContent(currentContent());
    }
    window.addEventListener("openai:set_globals", refresh);
    return () => window.removeEventListener("openai:set_globals", refresh);
  }, []);

  if (!content) {
    return (
      <p className="widget-empty">
        {error ? "The visual could not connect to its host." : "Choose a visual in KTH Study."}
      </p>
    );
  }

  const fullUrl = new URL(content.url, "http://127.0.0.1:4318").href;

  return (
    <main className="widget-shell">
      <p className="widget-eyebrow">
        {content.course?.code ?? "KTH Study"} · {content.explainer.kind}
      </p>
      <h1>{content.explainer.title}</h1>
      <p className="widget-summary">{content.explainer.accessibleSummary}</p>
      <ExplainerRenderer spec={content.explainer} mode="full" />
      <footer>
        {content.concepts?.map((concept) => (
          <span key={concept.id}>{concept.title}</span>
        ))}
        <a
          href={fullUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => {
            if (!app) return;
            event.preventDefault();
            void app.openLink({ url: fullUrl });
          }}
        >
          Open full study page
        </a>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Widget />);
