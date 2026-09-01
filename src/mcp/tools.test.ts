import path from "node:path";
import os from "node:os";
import { promises as fs } from "node:fs";
import { describe, expect, it } from "vitest";
import { createStudyContext } from "../server/context";
import { callTool } from "./tools";

describe("KTH Study MCP tools", () => {
  it("routes concept explanations to their interactive visuals", async () => {
    const context = await createStudyContext(
      path.resolve("tests/fixtures/corpus"),
    );
    const result = await callTool(context, "explain_concept", {
      id: "concept:sf1690:quadratic-functions",
    });

    expect(result.structuredContent).toMatchObject({
      visuals: expect.arrayContaining([
        expect.objectContaining({
          id: "explainer:sf1690:quadratic-coefficients",
          url: "/visuals/quadratic-coefficients",
        }),
      ]),
    });
    expect(result.content[0]).toMatchObject({
      text: expect.stringContaining("call show_visual"),
    });
  });

  it("returns stored assessment evidence before a live schedule lookup", async () => {
    const context = await createStudyContext(
      path.resolve("tests/fixtures/corpus"),
    );
    const result = await callTool(context, "get_course_dates", {
      courseCode: "sf1690",
    });

    expect(result.structuredContent).toMatchObject({
      courses: [{
        course: { code: "SF1690" },
        assessments: [{ code: "TEN1", lastChecked: "2026-08-24" }],
      }],
    });
    expect(result.content[0]).toMatchObject({
      text: expect.stringContaining("date not stored"),
    });
  });

  it("returns answer-ready grounded results for representative ChatGPT prompts", async () => {
    const context = await createStudyContext(path.resolve("."));
    const search = await callTool(context, "search_study_hub", {
      query: "what is a logic gate",
      limit: 5,
    }, "https://kth-study.vercel.app");
    const dates = await callTool(context, "get_course_dates", {
      courseCode: "SF1690",
    }, "https://kth-study.vercel.app");
    const concept = await callTool(context, "explain_concept", {
      id: "concept:ie1204:logic-gates-and-truth-tables",
    }, "https://kth-study.vercel.app");

    expect(search.content[0]).toMatchObject({
      text: expect.stringContaining("call explain_concept with concept:ie1204:logic-gates-and-truth-tables"),
    });
    expect(dates.content[0]).toMatchObject({
      text: expect.stringMatching(/SF1690 TEN1[\s\S]*2026-10-20 at 14:00[\s\S]*last checked 2026-09-01/),
    });
    expect(concept.content[0]).toMatchObject({
      text: expect.stringMatching(/Key definitions:[\s\S]*Logic gate[\s\S]*call show_visual/),
    });
  });

  it("returns stable web and widget metadata for show_visual", async () => {
    const context = await createStudyContext(
      path.resolve("tests/fixtures/corpus"),
    );
    const result = await callTool(context, "show_visual", {
      id: "explainer:sf1690:quadratic-coefficients",
    });

    expect(result.structuredContent).toMatchObject({
      id: "explainer:sf1690:quadratic-coefficients",
      url: "/visuals/quadratic-coefficients",
    });
    expect(result._meta).toMatchObject({
      ui: {
        resourceUri: "ui://widget/kth-study-explainer-0.2.1.html",
        visibility: ["model"],
      },
      "openai/outputTemplate": "ui://widget/kth-study-explainer-0.2.1.html",
    });
  });

  it("resolves a concept ID to its linked visual", async () => {
    const context = await createStudyContext(
      path.resolve("tests/fixtures/corpus"),
    );
    const result = await callTool(context, "show_visual", {
      id: "concept:sf1690:quadratic-functions",
    });

    expect(result.structuredContent).toMatchObject({
      id: "explainer:sf1690:parabola-focus-directrix",
      url: "/visuals/parabola-focus-directrix",
    });
  });

  it("lists pending browser questions for Codex", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "kth-mcp-asks-"));
    await fs.cp(path.resolve("tests/fixtures/corpus"), root, { recursive: true });
    const context = await createStudyContext(root);
    const { createAsk } = await import("../server/askQueue");
    await createAsk(context.root, {
      entityId: "concept:sf1690:quadratic-functions",
      question: "Why does a change the opening?",
      sourceUrl: "/courses/sf1690/concepts/quadratic-functions",
    });
    const result = await callTool(context, "list_pending_asks", {});
    expect(result.structuredContent).toMatchObject({ asks: [{ question: "Why does a change the opening?" }] });
  });
});
