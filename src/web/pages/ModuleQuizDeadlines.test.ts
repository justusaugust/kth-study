import path from "node:path";
import { expect, it } from "vitest";
import { loadCorpus } from "../../domain/repository";
import { buildDeadlineSchedule } from "./DeadlinesPage";

it("lists all published II1308 quizzes with the sourced completion target, not a Canvas cutoff", async () => {
  const corpus = await loadCorpus(path.resolve("."));
  const quizzes = [...corpus.coursework.values()].filter(item => item.courseId === "course:ii1308" && item.kind === "quiz");
  expect(quizzes).toHaveLength(4);
  const schedule = buildDeadlineSchedule({
    courses: [...corpus.courses.values()], assessments: [], coursework: quizzes,
    sessions: [], sources: [...corpus.sources.values()],
  }, "2026-10-13");
  expect(schedule.groups.map(([date]) => date)).toEqual(["2026-10-30"]);
  expect(schedule.undated).toEqual([]);
  for (const [index, quiz] of quizzes.entries()) {
    expect(quiz.time).toBeUndefined();
    expect(quiz.lastChecked).toBe("2026-10-13");
    expect(quiz.description).toContain("12 questions, at least 10 correct");
    expect(quiz.description).toContain("Multiple attempts");
    expect(quiz.description).toContain("not a Canvas submission cutoff");
    expect(quiz.description).toContain("fki@kth.se");
    const item = schedule.groups[0][1].find(item => item.id === quiz.id)!;
    expect(item.title).toContain("completion target");
    expect(item.links.some(link => link.url.endsWith(`/assignments/${400281 + index}`))).toBe(true);
    expect(item.links.some(link => link.url.endsWith("/discussion_topics/579727"))).toBe(true);
  }
});
