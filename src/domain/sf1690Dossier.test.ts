import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildCourseJourney, loadCorpus, validateCorpus } from ".";

describe("SF1690 course dossier", () => {
  it("preserves the complete verified course-plan structure", async () => {
    const corpus = await loadCorpus(path.resolve("."));
    const courseId = "course:sf1690";
    const sessions = [...corpus.sessions.values()].filter(
      (item) => item.courseId === courseId,
    );
    const coursework = [...corpus.coursework.values()].filter(
      (item) => item.courseId === courseId,
    );
    const assessments = [...corpus.assessments.values()].filter(
      (item) => item.courseId === courseId,
    );

    expect(corpus.courses.get(courseId)).toMatchObject({
      credits: 6,
      language: "English",
      startDate: "2026-08-24",
      endDate: "2026-10-23",
    });
    expect(sessions.filter((item) => item.kind === "lecture")).toHaveLength(16);
    expect(sessions.filter((item) => item.kind === "exercise")).toHaveLength(16);
    expect(sessions.filter((item) => item.kind === "checkpoint")).toHaveLength(3);
    expect(coursework.filter((item) => item.kind === "exercise")).toHaveLength(16);
    expect(coursework.filter((item) => item.kind === "mini-exam")).toHaveLength(3);
    expect(assessments).toEqual([
      expect.objectContaining({
        id: "assessment:sf1690:ten1",
        credits: 6,
        date: "2026-10-20",
        time: "14:00",
      }),
    ]);
    expect(
      corpus.coursework.get("coursework:sf1690:exercise-01")?.materials,
    ).toEqual([
      {
        title: "Calculus",
        section: "P1",
        page: "10",
        exercises: "29, 40, 42, 44, 45",
      },
      {
        title: "Calculus",
        section: "P2",
        page: "16",
        exercises: "12, 14, 16, 20, 24, 26, 30, 35, 39, 40",
      },
    ]);
    expect(
      corpus.lectures.get("lecture:sf1690:2026-08-24-01")?.sessionId,
    ).toBe("session:sf1690:lecture-01");
    expect(validateCorpus(corpus)).toEqual([]);
    expect(
      buildCourseJourney({ sessions, coursework, assessments }),
    ).not.toHaveLength(0);
  });

  it("connects Lecture 4 to its three function constructions", async () => {
    const corpus = await loadCorpus(path.resolve("."));
    const lecture = corpus.lectures.get("lecture:sf1690:2026-08-28-04");

    expect(lecture?.conceptIds).toEqual([
      "concept:sf1690:function-arithmetic-and-domains",
      "concept:sf1690:function-composition",
      "concept:sf1690:piecewise-defined-functions",
    ]);
    expect(
      [...corpus.explainers.values()]
        .filter((explainer) =>
          lecture?.conceptIds.some((conceptId) =>
            explainer.conceptIds.includes(conceptId),
          ),
        )
        .map((explainer) => explainer.id),
    ).toEqual([
      "explainer:sf1690:function-arithmetic-domain-lab",
      "explainer:sf1690:function-composition-pipeline",
      "explainer:sf1690:piecewise-branch-selector",
    ]);
  });
});
