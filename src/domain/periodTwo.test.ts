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
      expect(lessons).toHaveLength(code === "id1022" ? 4 : 3);
      for (const lesson of lessons) {
        expect(corpus.sessions.get(lesson.sessionId!)?.lectureId).toBe(lesson.id);
        expect(lesson.sourceIds).toContain(`source:${code}:lecture-plan`);
      }
    }
    expect(corpus.coursework.get("coursework:id1022:proggame-module-1")).toMatchObject({
      date: "2026-11-06", time: "09:00", requirement: "required", lastChecked: "2026-11-02",
      materials: expect.arrayContaining([expect.objectContaining({ url: "https://proggame.eecs.kth.se/" })]),
    });
    expect(corpus.lectures.get("lecture:id1022:2026-10-26-01")?.body).toContain("**6 November at 09:00**");
    expect(corpus.sessions.get("session:id1022:lecture-03")?.date).toBe("2026-10-30");
    expect(corpus.coursework.get("coursework:id1022:exam-signup")).toMatchObject({
      date: "2026-12-09", time: "16:00", assessmentIds: ["assessment:id1022:dat1"],
    });
    expect(corpus.assessments.get("assessment:id1022:dat1")?.date).toBeUndefined();
    expect(corpus.assessments.get("assessment:sf1684:ten1")).toMatchObject({date: "2027-01-08", time: "14:00"});
    expect(corpus.sessions.get("session:sf1684:lecture-04")).toMatchObject({date: "2026-11-03", time: "13:00"});
    expect(corpus.sessions.get("session:sf1684:seminar-01")).toMatchObject({date: "2026-11-02", time: "15:00"});
    expect(corpus.coursework.get("coursework:sf1684:seminar-test-01")).toMatchObject({
      requirement: "optional", date: "2026-11-02", time: "15:00",
      lectureIds: expect.arrayContaining(["lecture:sf1684:2026-10-26-01"]),
    });
    expect(corpus.lectures.get("lecture:id1022:2026-10-30-03")?.sourceIds).toContain("source:id1022:lecture-3-slides");
    expect(corpus.lectures.get("lecture:id1022:2026-11-02-04")?.body).toContain("Slides were not linked");
    for (let module = 1; module <= 7; module++) {
      expect(corpus.coursework.has(`coursework:sf1684:module-${module}-reading`)).toBe(true);
      expect(corpus.sources.get(`source:sf1684:module-${module}-reading-guide`)?.url).toMatch(/canvas\.kth\.se/);
    }
    expect([...corpus.sessions.values()].filter(item => item.courseId === "course:sf1684" && item.kind === "lecture")).toHaveLength(21);
    expect([...corpus.sessions.values()].filter(item => item.courseId === "course:id1022" && item.kind === "lecture")).toHaveLength(21);
    expect(validateCorpus(corpus)).toEqual([]);
  });
});
