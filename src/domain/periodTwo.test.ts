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
      expect(lessons).toHaveLength(13);
      for (const lesson of lessons) {
        expect(corpus.sessions.get(lesson.sessionId!)?.lectureId).toBe(lesson.id);
        expect(lesson.sourceIds).toContain(`source:${code}:lecture-plan`);
      }
    }
    expect(corpus.coursework.get("coursework:id1022:proggame-module-1")).toMatchObject({
      date: "2026-11-06", time: "09:00", requirement: "required", lastChecked: "2026-11-09",
      materials: expect.arrayContaining([expect.objectContaining({ url: "https://proggame.eecs.kth.se/" })]),
    });
    expect(corpus.lectures.get("lecture:id1022:2026-10-26-01")?.body).toContain("**6 November at 09:00**");
    expect(corpus.sessions.get("session:id1022:lecture-03")?.date).toBe("2026-10-30");
    expect(corpus.coursework.get("coursework:id1022:exam-signup")).toMatchObject({
      date: "2026-12-09", time: "16:00", assessmentIds: ["assessment:id1022:dat1"],
    });
    expect(corpus.assessments.get("assessment:id1022:dat1")?.date).toBeUndefined();
    expect(corpus.coursework.get("coursework:id1022:easter-egg-catch-up")).toMatchObject({
      date: "2026-11-10", week: 46, requirement: "scheduled", lastChecked: "2026-11-09",
      sessionIds: ["session:id1022:lecture-08"],
      sourceIds: expect.arrayContaining(["source:id1022:week-46-announcement"]),
    });
    expect(corpus.coursework.get("coursework:id1022:easter-egg-catch-up")?.time).toBeUndefined();
    expect(corpus.coursework.get("coursework:id1022:easter-egg-second-retake")).toMatchObject({
      requirement: "scheduled", lastChecked: "2026-11-22",
    });
    expect(corpus.coursework.get("coursework:id1022:easter-egg-second-retake")?.date).toBeUndefined();
    expect(corpus.sessions.get("session:id1022:lecture-08")).toMatchObject({
      date: "2026-11-10", time: "15:00", endTime: "17:00",
      sourceIds: expect.arrayContaining(["source:id1022:week-46-announcement"]),
    });
    expect(corpus.sessions.get("session:id1022:lecture-07")).toMatchObject({ date: "2026-11-09", time: "10:00", endTime: "12:00" });
    expect(corpus.sessions.get("session:id1022:lecture-09")).toMatchObject({ date: "2026-11-13", time: "15:00", endTime: "17:00" });
    for (const slug of ["input-and-branching", "rhythm-and-timing", "canvas-graphics", "graphics-layout-and-grids", "easter-eggs-and-catch-up"]) {
      expect(corpus.concepts.has(`concept:id1022:${slug}`)).toBe(true);
      expect(corpus.courses.get("course:id1022")?.conceptIds).toContain(`concept:id1022:${slug}`);
      expect(corpus.coursework.get("coursework:id1022:essentials-study-route")?.conceptIds).toContain(`concept:id1022:${slug}`);
    }

    expect(corpus.assessments.get("assessment:sf1684:ten1")).toMatchObject({date: "2027-01-08", time: "14:00"});
    expect(corpus.sessions.get("session:sf1684:lecture-04")).toMatchObject({date: "2026-11-03", time: "13:00"});
    expect(corpus.sessions.get("session:sf1684:seminar-01")).toMatchObject({date: "2026-11-02", time: "15:00"});
    expect(corpus.coursework.get("coursework:sf1684:seminar-test-01")).toMatchObject({
      requirement: "optional", date: "2026-11-02", time: "15:00",
      lectureIds: expect.arrayContaining(["lecture:sf1684:2026-10-26-01"]),
    });
    expect(corpus.lectures.get("lecture:id1022:2026-10-30-03")?.sourceIds).toContain("source:id1022:lecture-3-slides");
    expect(corpus.lectures.get("lecture:id1022:2026-11-02-04")?.sourceIds).toContain("source:id1022:lecture-4-slides");
    for (let module = 1; module <= 7; module++) {
      expect(corpus.coursework.has(`coursework:sf1684:module-${module}-reading`)).toBe(true);
      expect(corpus.sources.get(`source:sf1684:module-${module}-reading-guide`)?.url).toMatch(/canvas\.kth\.se/);
    }
    expect([...corpus.sessions.values()].filter(item => item.courseId === "course:sf1684" && item.kind === "lecture")).toHaveLength(21);
    expect([...corpus.sessions.values()].filter(item => item.courseId === "course:id1022" && item.kind === "lecture")).toHaveLength(21);
    expect(corpus.coursework.get("coursework:sf1684:seminar-test-03")).toMatchObject({ date: "2026-11-23", sessionIds: expect.arrayContaining(["session:sf1684:seminar-04"]) });
    expect(corpus.coursework.get("coursework:sf1684:seminar-test-03")?.time).toBeUndefined();
    const module3 = corpus.coursework.get("coursework:sf1684:seminar-test-03")!;
    const module4 = corpus.coursework.get("coursework:sf1684:seminar-test-04")!;
    expect(module3.lectureIds).toEqual(["lecture:sf1684:2026-11-10-07", "lecture:sf1684:2026-11-11-08", "lecture:sf1684:2026-11-12-09"]);
    expect(module4).toMatchObject({
      date: "2026-11-23",
      time: "15:00",
      lectureIds: ["lecture:sf1684:2026-11-17-10", "lecture:sf1684:2026-11-18-11", "lecture:sf1684:2026-11-19-12"],
    });
    expect(module4.conceptIds).toContain("concept:sf1684:eigenvalues-and-eigenspaces");
    expect(module3.conceptIds).not.toContain("concept:sf1684:eigenvalues-and-eigenspaces");
    expect(corpus.coursework.get("coursework:id1022:easter-egg-nov25")).toMatchObject({
      date: "2026-11-25",
      requirement: "optional",
      sessionIds: ["session:id1022:lecture-14"],
    });
    expect(corpus.coursework.get("coursework:id1022:proggame-module-3")).toMatchObject({ date: "2026-11-18", time: "09:00" });
    for (const slug of ["recursion-and-data-structures", "algebraic-data-types-and-trees", "types-and-parametric-polymorphism", "objects-methods-and-events"]) {
      expect(corpus.courses.get("course:id1022")?.conceptIds).toContain(`concept:id1022:${slug}`);
      expect([...corpus.questions.values()].some(q => q.conceptIds.includes(`concept:id1022:${slug}`))).toBe(true);
    }
    expect(validateCorpus(corpus)).toEqual([]);
  });
});
