import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadCorpus } from "./repository";
import { validateCorpus } from "./graph";

async function loadFixtureCorpus() {
  return loadCorpus(path.resolve("tests/fixtures/corpus"));
}

describe("validateCorpus", () => {
  it("reports dangling relationships", async () => {
    const corpus = await loadFixtureCorpus();
    corpus.relationships.push({
      type: "requires",
      from: "concept:sf1690:quadratic-functions",
      to: "concept:sf1690:missing",
    });

    expect(validateCorpus(corpus)).toContainEqual(
      expect.objectContaining({ code: "dangling-target" }),
    );
  });

  it("reports prerequisite cycles", async () => {
    const corpus = await loadFixtureCorpus();
    corpus.relationships.push(
      {
        type: "requires",
        from: "concept:sf1690:quadratic-functions",
        to: "outcome:sf1690:model-functions",
      },
      {
        type: "requires",
        from: "outcome:sf1690:model-functions",
        to: "concept:sf1690:quadratic-functions",
      },
    );

    expect(validateCorpus(corpus)).toContainEqual(
      expect.objectContaining({ code: "prerequisite-cycle" }),
    );
  });

  it("reports assessment credits beyond the course total", async () => {
    const corpus = await loadFixtureCorpus();
    corpus.assessments.get("assessment:sf1690:ten1")!.credits = 7;

    expect(validateCorpus(corpus)).toContainEqual(
      expect.objectContaining({ code: "assessment-credit-overflow" }),
    );
  });

  it("reports an inverted course date range", async () => {
    const corpus = await loadFixtureCorpus();
    const course = corpus.courses.get("course:sf1690")!;
    course.startDate = "2026-10-01";
    course.endDate = "2026-09-01";

    expect(validateCorpus(corpus)).toContainEqual(
      expect.objectContaining({ code: "invalid-course-date-range" }),
    );
  });

  it("reports missing linked coursework", async () => {
    const corpus = await loadFixtureCorpus();
    corpus.sessions
      .get("session:sf1690:exercise-01")!
      .courseworkIds.push("coursework:sf1690:missing");

    expect(validateCorpus(corpus)).toContainEqual(
      expect.objectContaining({ code: "dangling-coursework-reference" }),
    );
  });

  it("reports a missing structured course-link source", async () => {
    const corpus = await loadFixtureCorpus();
    corpus.courses.get("course:sf1690")!.links.push({
      kind: "kth",
      label: "Missing source",
      url: "https://example.com/course",
      sourceId: "source:sf1690:missing",
    });

    expect(validateCorpus(corpus)).toContainEqual(
      expect.objectContaining({ code: "dangling-source" }),
    );
  });

  it("reports duplicate stable atlas numbers", async () => {
    const corpus = await loadFixtureCorpus();
    corpus.explainers.get("explainer:sf1690:parabola-focus-directrix")!.atlasOrder = 1;

    expect(validateCorpus(corpus)).toContainEqual(
      expect.objectContaining({ code: "duplicate-atlas-order" }),
    );
  });
});
