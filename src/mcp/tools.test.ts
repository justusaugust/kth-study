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
      text: expect.stringMatching(/SF1690 TEN1[\s\S]*2026-10-20 at 14:00[\s\S]*last checked 2026-09-21/),
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
        resourceUri: "ui://widget/kth-study-explainer-0.2.4.html",
        visibility: ["model"],
      },
      "openai/outputTemplate": "ui://widget/kth-study-explainer-0.2.4.html",
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

  describe("submitted review scenarios", () => {
    it("finds a logic-gate explanation and its truth-table widget", async () => {
      const context = await createStudyContext(path.resolve("."));
      const search = await callTool(context, "search_study_hub", { query: "logic gate", limit: 5 });
      expect(search.structuredContent).toMatchObject({ results: expect.arrayContaining([
        expect.objectContaining({ id: "concept:ie1204:logic-gates-and-truth-tables" }),
      ]) });
      const explanation = await callTool(context, "explain_concept", { id: "concept:ie1204:logic-gates-and-truth-tables" });
      expect(explanation.content[0].text).toContain("truth table");
      expect(explanation.structuredContent).toMatchObject({ visuals: expect.arrayContaining([
        expect.objectContaining({ id: "explainer:ie1204:logic-gate-truth-table" }),
      ]) });
      const visual = await callTool(context, "show_visual", { id: "explainer:ie1204:logic-gate-truth-table" });
      expect(visual.structuredContent).toMatchObject({ explainer: { variant: "logic-gates" } });
    });

    it("returns upcoming work for all courses in date order with evidence freshness", async () => {
      const context = await createStudyContext(path.resolve("."));
      vi.useFakeTimers();
      try {
        vi.setSystemTime(new Date("2026-09-16T12:00:00Z"));
        const result = await callTool(context, "get_course_dates", {});
        const courses = result.structuredContent.courses as Array<{
          course: { code: string };
          upcomingCoursework: Array<{ date: string; lastChecked: string; confidence: string; sourceIds: string[] }>;
        }>;
        expect(courses.map(({ course }) => course.code).sort()).toEqual(["IE1204", "II1308", "SF1690"]);
        expect(courses.flatMap((course) => course.upcomingCoursework).length).toBeGreaterThan(0);
        for (const course of courses) {
          const dates = course.upcomingCoursework.map((item) => item.date);
          expect(dates).toEqual([...dates].sort());
          for (const item of course.upcomingCoursework) {
            expect(item.date >= "2026-09-16").toBe(true);
            expect(item.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            expect(item.confidence).toBeTruthy();
            expect(item.sourceIds.length).toBeGreaterThan(0);
          }
        }
        expect(result.content[0].text).toContain("not an official-source verification time");
        expect(result.content[0].text).toContain("source last checked");
      } finally {
        vi.useRealTimers();
      }
    });

    it("finds the signed-register visual for a four-bit two's-complement request", async () => {
      const context = await createStudyContext(path.resolve("."));
      const search = await callTool(context, "search_study_hub", { query: "two's complement 4 bit", limit: 5 });
      expect(search.structuredContent).toMatchObject({ results: expect.arrayContaining([
        expect.objectContaining({ id: "explainer:ie1204:twos-complement-register" }),
      ]) });
      const visual = await callTool(context, "show_visual", { id: "explainer:ie1204:twos-complement-register" });
      expect(visual.structuredContent).toMatchObject({
        explainer: { variant: "twos-complement" },
        concepts: expect.arrayContaining([expect.objectContaining({ id: "concept:ie1204:signed-integer-encodings" })]),
      });
    });

    it("returns the explicit CMOS power prerequisite without inventing extra dependencies", async () => {
      const context = await createStudyContext(path.resolve("."));
      const result = await callTool(context, "show_prerequisites", { id: "concept:ie1204:cmos-power-consumption" });
      expect(result.structuredContent).toEqual({
        id: "concept:ie1204:cmos-power-consumption",
        prerequisites: [{
          id: "concept:ie1204:cmos-transistor-networks",
          title: "CMOS transistor networks",
          url: "/courses/ie1204/concepts/cmos-transistor-networks",
        }],
      });
    });

    it("retrieves SF1690 domain-and-range questions without exposing stored answers", async () => {
      const context = await createStudyContext(path.resolve("."));
      const conceptId = "concept:sf1690:functions-domain-and-range";
      const search = await callTool(context, "search_study_hub", { query: "functions domain range", limit: 5 });
      expect(search.structuredContent).toMatchObject({ results: expect.arrayContaining([
        expect.objectContaining({ id: conceptId }),
      ]) });
      const result = await callTool(context, "quiz_me", { conceptId, limit: 2 });
      const questions = result.structuredContent.questions as Array<{ id: string; body: string }>;
      expect(questions).toHaveLength(2);
      for (const question of questions) {
        expect(question.body).toBeTruthy();
        expect(question).not.toHaveProperty("answer");
        const stored = context.corpus.questions.get(question.id)!;
        expect(stored.conceptIds).toContain(conceptId);
        expect(stored.answer).toBeTruthy();
        expect(JSON.stringify(result)).not.toContain(JSON.stringify(stored.answer));
      }
    });
  });
});
