import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadCorpus, validateCorpus } from ".";

describe("Autumn 2026 period 2", () => {
  it("loads both courses, first lessons, and sourced ProgGame milestones", async () => {
    const corpus = await loadCorpus(path.resolve("."));
    for (const code of ["id1022", "sf1684"]) {
      expect(corpus.courses.get(`course:${code}`)).toMatchObject({
        period: "P2", credits: 7.5, startDate: "2026-10-26",
      });
      const lessons = [...corpus.lectures.values()].filter((item) => item.courseId === `course:${code}`);
      expect(lessons).toHaveLength(code === "id1022" ? 2 : 3);
      for (const lesson of lessons) {
        expect(corpus.sessions.get(lesson.sessionId!)?.lectureId).toBe(lesson.id);
        expect(lesson.sourceIds).toContain(`source:${code}:lecture-plan`);
      }
    }
    expect(corpus.coursework.get("coursework:id1022:proggame-module-1")).toMatchObject({
      date: "2026-10-30", time: "09:00", requirement: "required",
      materials: expect.arrayContaining([expect.objectContaining({ url: "https://proggame.eecs.kth.se/" })]),
    });
    expect(corpus.coursework.get("coursework:id1022:exam-signup")).toMatchObject({
      date: "2026-12-09", time: "16:00", assessmentIds: ["assessment:id1022:dat1"],
    });
    expect(corpus.assessments.get("assessment:id1022:dat1")?.date).toBeUndefined();
    expect(corpus.assessments.get("assessment:sf1684:ten1")?.date).toBeUndefined();
    expect(validateCorpus(corpus)).toEqual([]);
  });
});
