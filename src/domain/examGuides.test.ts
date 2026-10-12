import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadCorpus } from "./repository";
import { entityUrl } from "./ids";
import { buildSearchIndex, searchCorpus } from "./search";

describe("exam preparation and final lecture coverage", () => {
  it("exposes both guides through the shared searchable corpus", async () => {
    const corpus = await loadCorpus(path.resolve("."));
    const index = buildSearchIndex(corpus);
    for (const code of ["sf1690", "ie1204"]) {
      const guide = corpus.concepts.get(`concept:${code}:exam-revision-guide`)!;
      expect(guide).toBeDefined();
      expect(entityUrl(guide)).toBe(`/courses/${code}/exam`);
      expect(guide.body).toContain(`/practice?course=${code}`);
      expect(guide.body).toContain("checked");
      expect(searchCorpus(index, corpus, "exam study guide", { courseId: guide.courseId }).some(hit => hit.id === guide.id && hit.url === entityUrl(guide))).toBe(true);
      for (const match of guide.body.matchAll(/\]\(\/courses\/([a-z0-9]+)\/concepts\/([a-z0-9-]+)\)/g)) {
        expect(corpus.concepts.has(`concept:${match[1]}:${match[2]}`), match[0]).toBe(true);
      }
    }
  });

  it("links every remaining IE1204 lecture to teaching and paper practice", async () => {
    const corpus = await loadCorpus(path.resolve("."));
    for (const [number, date] of [[13, "2026-10-06"], [14, "2026-10-08"]] as const) {
      const id = `lecture:ie1204:${date}-${number}`;
      expect(corpus.sessions.get(`session:ie1204:lecture-${number}`)?.lectureId).toBe(id);
      const lecture = corpus.lectures.get(id)!;
      expect(lecture.conceptIds.length).toBeGreaterThanOrEqual(2);
      for (const conceptId of lecture.conceptIds) {
        expect(corpus.courses.get("course:ie1204")?.conceptIds).toContain(conceptId);
        expect(corpus.concepts.get(conceptId)?.body.length).toBeGreaterThan(1000);
        expect([...corpus.questions.values()].some(question => question.conceptIds.includes(conceptId))).toBe(true);
      }
    }
  });
});
