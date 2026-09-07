import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { createStudyContext } from "../server/context";
import { callTool } from "./tools";

describe("KTH Study MCP tools", () => {
  it("links mini-exams to their covered lectures and scoped practice without claiming full coverage", async () => {
    const context = await createStudyContext(path.resolve("."));
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-09-07T12:00:00Z"));
      const result = await callTool(context, "get_course_dates", { courseCode: "SF1690" }, "https://kth-study.vercel.app");
      expect(result.structuredContent).toMatchObject({ courses: [expect.objectContaining({
        upcomingCoursework: expect.arrayContaining([expect.objectContaining({
          slug: "mini-exam-01",
          practiceUrl: "https://kth-study.vercel.app/practice?course=sf1690&work=mini-exam-01",
          lectures: expect.arrayContaining([expect.objectContaining({ url: expect.stringContaining("/courses/sf1690/lectures/") })]),
        })]),
      })] });
      expect(result.content[0].text).toContain("not guaranteed exam coverage");
      const work = [...context.corpus.coursework.values()].find((item) => item.slug === "mini-exam-01")!;
      work.lectureIds.push("lecture:sf1690:missing");
      const incomplete = await callTool(context, "get_course_dates", { courseCode: "SF1690" });
      expect(incomplete.content[0].text).toContain("Lecture notes not available: lecture:sf1690:missing");
    } finally {
      vi.useRealTimers();
    }
  });

  it("returns lecture navigation for concepts and rejects unknown quiz concepts", async () => {
    const context = await createStudyContext(path.resolve("."));
    const result = await callTool(context, "explain_concept", { id: "concept:ie1204:logic-gates-and-truth-tables" });
    expect(result.structuredContent).toMatchObject({ lectures: expect.arrayContaining([expect.objectContaining({ url: expect.stringContaining("/lectures/") })]) });
    await expect(callTool(context, "quiz_me", { conceptId: "concept:sf1690:missing" })).rejects.toThrow("Unknown concept ID");
    const quiz = await callTool(context, "quiz_me", { conceptId: "concept:sf1690:quadratic-functions" });
    expect(JSON.stringify(quiz.structuredContent)).not.toContain('"answer":');
    const unlinked = await callTool(context, "explain_concept", { id: "concept:sf1690:quadratic-functions" });
    expect(unlinked.structuredContent).toMatchObject({ lectures: [] });
  });

  it("uses request-time Stockholm dates and distinguishes loaded data from verified evidence", async () => {
    const context = await createStudyContext(path.resolve("tests/fixtures/corpus"));
    context.refreshedAt = "2026-08-01T00:00:00.000Z";
    const session = context.corpus.sessions.get("session:sf1690:lecture-01")!;
    session.date = "2026-09-08";
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-09-07T22:30:00Z"));
      const result = await callTool(context, "get_course_dates", { courseCode: "SF1690" });
      expect(result.structuredContent).toMatchObject({ asOfDate: "2026-09-08", corpusLoadedAt: context.refreshedAt, courses: [{ upcomingSessions: [expect.objectContaining({ id: session.id })] }] });
      expect(result.content[0].text).toContain("not an official-source verification time");
      vi.setSystemTime(new Date("2026-09-08T22:30:00Z"));
      const nextDay = await callTool(context, "get_course_dates", { courseCode: "SF1690" });
      expect(nextDay.structuredContent).toMatchObject({ asOfDate: "2026-09-09", courses: [{ upcomingSessions: [] }] });
    } finally {
      vi.useRealTimers();
    }
  });
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
    expect(result.content[0]).not.toMatchObject({
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
      text: expect.stringMatching(/Key definitions:[\s\S]*Logic gate/),
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
        resourceUri: "ui://widget/kth-study-explainer-0.2.2.html",
        visibility: ["model"],
      },
      "openai/outputTemplate": "ui://widget/kth-study-explainer-0.2.2.html",
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

});
