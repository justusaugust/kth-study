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
    },
    {
      id: "assessment:sf1690:ten1",
      courseId: "course:sf1690",
      slug: "ten1",
      code: "TEN1",
      title: "Written examination",
      compulsory: true,
      description: "Written examination with no confirmed date.",
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
    },
    {
      id: "coursework:ie1204:quiz-a",
      courseId: "course:ie1204",
      slug: "quiz-a",
      title: "Required quiz",
      requirement: "required",
      description: "Complete the quiz.",
      materials: [],
    },
  ],
} as unknown as DeadlinesResponse;

describe("deadline schedule", () => {
  it("sorts future dates and keeps undated required work visible", () => {
    const schedule = buildDeadlineSchedule(data, "2026-09-01");

    expect(schedule.groups.map(([date]) => date)).toEqual(["2026-09-07", "2026-10-19"]);
    expect(schedule.groups[0][1][0]).toMatchObject({
      title: "Exercise set 1",
      time: "10:00",
      links: [{ title: "Submit in Canvas" }],
    });
    expect(schedule.undated.map((item) => item.title)).toEqual([
      "Required quiz",
      "TEN1 · Written examination",
    ]);
  });
});
