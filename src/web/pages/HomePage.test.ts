import { describe, expect, it } from "vitest";
import type { DeadlinesResponse } from "../../domain/api";
import { buildWeekView } from "./HomePage";

const data = {
  courses: [{ id: "course:ie1204", code: "IE1204", title: "Digital Design" }],
  sessions: [{
    id: "session:ie1204:lecture-05",
    courseId: "course:ie1204",
    slug: "lecture-05",
    kind: "lecture",
    title: "Lecture 5 · Boolean algebra",
    date: "2026-09-01",
    lectureId: "lecture:ie1204:2026-09-01-05",
  }],
  coursework: [{
    id: "coursework:ie1204:exercise-01",
    courseId: "course:ie1204",
    slug: "exercise-01",
    kind: "exercise",
    title: "Exercise set 1",
    date: "2026-09-07",
    time: "10:00",
  }],
  assessments: [],
  sources: [],
} as unknown as DeadlinesResponse;

describe("current week", () => {
  it("builds Monday through Sunday and links authored lectures directly", () => {
    const days = buildWeekView(data, "2026-09-02");

    expect(days.map((day) => day.date)).toEqual([
      "2026-08-31", "2026-09-01", "2026-09-02", "2026-09-03",
      "2026-09-04", "2026-09-05", "2026-09-06",
    ]);
    expect(days[1].entries[0]).toMatchObject({
      title: "Lecture 5 · Boolean algebra",
      url: "/courses/ie1204/lectures/2026-09-01-05",
    });
    expect(days.flatMap((day) => day.entries).some((item) => item.title === "Exercise set 1")).toBe(false);
  });
});
