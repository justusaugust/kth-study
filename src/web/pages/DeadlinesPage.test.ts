import { describe, expect, it } from "vitest";
import type { DeadlinesResponse } from "../../domain/api";
import { buildDeadlineSchedule } from "./DeadlinesPage";

const data = {
  courses: [
    { id: "course:ie1204", code: "IE1204", title: "Digital Design" },
    { id: "course:sf1690", code: "SF1690", title: "Basic Course in Mathematics" },
  ],
  assessments: [
    {
      id: "assessment:ie1204:tena",
      courseId: "course:ie1204",
      slug: "tena",
      code: "TENA",
      title: "Written examination",
      date: "2026-10-19",
      compulsory: true,
      description: "Written examination.",
      sourceIds: ["source:ie1204:canvas"],
      lastChecked: "2026-09-01",
      confidence: "verified",
    },
    {
      id: "assessment:sf1690:ten1",
      courseId: "course:sf1690",
      slug: "ten1",
      code: "TEN1",
      title: "Written examination",
      compulsory: true,
      description: "Written examination with no confirmed date.",
      sourceIds: [],
      lastChecked: "2026-09-01",
      confidence: "supported",
    },
  ],
  coursework: [
    {
      id: "coursework:ie1204:exercise-01",
      courseId: "course:ie1204",
      slug: "exercise-01",
      title: "Exercise set 1",
      date: "2026-09-07",
      time: "10:00",
      requirement: "recommended",
      description: "Upload the solutions.",
      materials: [{ title: "Submit in Canvas", url: "https://canvas.example/1" }],
      sourceIds: ["source:ie1204:canvas"],
      lastChecked: "2026-09-01",
      confidence: "verified",
    },
    {
      id: "coursework:ie1204:quiz-a",
      courseId: "course:ie1204",
      slug: "quiz-a",
      title: "Required quiz",
      requirement: "required",
      description: "Complete the quiz.",
      materials: [],
      sourceIds: [],
      lastChecked: "2026-09-01",
      confidence: "verified",
    },
  ],
  sessions: [],
  sources: [{
    id: "source:ie1204:canvas",
    courseId: "course:ie1204",
    title: "Canvas course room",
    kind: "fixture",
    url: "https://canvas.example/course",
    lastChecked: "2026-09-01",
    confidence: "fixture",
  }],
} as unknown as DeadlinesResponse;

describe("deadline schedule", () => {
  it("sorts future dates and keeps undated required work visible", () => {
    const schedule = buildDeadlineSchedule(data, "2026-09-01");

    expect(schedule.groups.map(([date]) => date)).toEqual(["2026-09-07", "2026-10-19"]);
    expect(schedule.groups[0][1][0]).toMatchObject({
      title: "Exercise set 1",
      time: "10:00",
      links: [
        { title: "Submit in Canvas" },
        { title: "Canvas course room" },
      ],
      lastChecked: "2026-09-01",
    });
    expect(schedule.undated.map((item) => item.title)).toEqual([
      "Required quiz",
      "TEN1 · Written examination",
    ]);
  });

  it("includes dated mini-exams with links to their covered lectures", () => {
    const miniExamData = {
      ...data,
      coursework: [{
        id: "coursework:sf1690:mini-exam-01", courseId: "course:sf1690", slug: "mini-exam-01",
        title: "Mini-exam · Lectures 1–4", date: "2026-09-11", time: "15:00",
        requirement: "scheduled", description: "First half of Exercise session 7.", materials: [],
        sessionIds: ["session:sf1690:checkpoint-01", "session:sf1690:lecture-01"], sourceIds: [],
        lastChecked: "2026-09-03", confidence: "verified",
      }],
      sessions: [{
        id: "session:sf1690:lecture-01", courseId: "course:sf1690", slug: "lecture-01", kind: "lecture",
        title: "Lecture 1 · Real numbers", lectureId: "lecture:sf1690:2026-08-24-01",
      }],
    } as unknown as DeadlinesResponse;

    const schedule = buildDeadlineSchedule(miniExamData, "2026-09-01");

    expect(schedule.groups[0]).toMatchObject(["2026-09-11", [{
      title: "Mini-exam · Lectures 1–4",
      studyLinks: [{ title: "Lecture 1 · Real numbers", url: "/courses/sf1690/lectures/2026-08-24-01" }],
    }]]);
  });
});
