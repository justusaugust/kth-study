import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadCorpus } from "./repository";
import { entityUrl } from "./ids";
import { buildSearchIndex, searchCorpus } from "./search";

describe("exam preparation and final lecture coverage", () => {
  it("offers an undated authored Lecture 16 review with real topic and practice destinations", async () => {
    const corpus = await loadCorpus(path.resolve("."));
    const review = corpus.concepts.get("concept:sf1690:course-review")!;
    const session = corpus.sessions.get("session:sf1690:lecture-16")!;
    expect(review.evidenceStatus).toBe("supplemental");
    expect(review.lectureIds).toEqual([]);
    expect(corpus.courses.get("course:sf1690")?.conceptIds).toContain(review.id);
    expect(session.date).toBeUndefined();
    expect(entityUrl(session)).toBe(entityUrl(review));
    expect(review.body).toContain("/practice?course=sf1690");
    expect(review.body).toContain("not a record of what was said in class");
    const links = [...review.body.matchAll(/\]\((\/courses\/sf1690\/concepts\/[a-z0-9-]+(?:#[a-z0-9-]+)?)\)/g)];
    expect(links.length).toBeGreaterThan(35);
    for (const [, url] of links) {
      const [page, anchor] = url.split("#");
      expect(corpus.concepts.has(`concept:sf1690:${page.split("/").at(-1)}`), url).toBe(true);
      if (anchor) {
        const type = anchor.startsWith("question-") ? "question" : "example";
        const entity = (type === "question" ? corpus.questions : corpus.examples).get(`${type}:sf1690:${anchor.slice(type.length + 1)}`)!;
        expect(entity, url).toBeDefined();
        expect(entityUrl(entity), url).toBe(url);
      }
    }
    expect(searchCorpus(buildSearchIndex(corpus), corpus, "Lecture 16 course review", { courseId: review.courseId }).some(hit => hit.id === review.id)).toBe(true);
  });

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
