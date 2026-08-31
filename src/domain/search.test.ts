import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadCorpus } from "./repository";
import { buildSearchIndex, recentCorpus, searchCorpus } from "./search";

describe("searchCorpus", () => {
  it("keeps recent example summaries complete and safe for math rendering", async () => {
    const corpus = await loadCorpus(path.resolve("."));
    const hits = recentCorpus(corpus, { entityTypes: ["example"] }, 5);
    const allExamples = recentCorpus(corpus, { entityTypes: ["example"] }, 100);

    expect(hits).toHaveLength(5);
    for (const hit of allExamples) {
      expect(hit.summary).not.toContain("$$");
      expect(hit.summary).toMatch(/[.!?]$/);
      expect((hit.summary.match(/(?<!\\)\$/g) ?? []).length % 2).toBe(0);
    }

    expect(allExamples.find((hit) => hit.id === "example:ie1204:binary-to-decimal")?.summary)
      .toBe("Convert $1011010_2$ into decimal by aligning every bit with its power of two.");
    expect(allExamples.find((hit) => hit.id === "example:ie1204:decimal-to-binary")?.summary)
      .toBe("To convert $53_{10}$ to binary, repeatedly divide by two and record the remainder.");
    expect(allExamples.find((hit) => hit.id === "example:ii1308:branch-and-loop")?.summary)
      .toBe("This loop visits every character but selects only non-space characters for output.");

    for (const hit of allExamples) {
      expect(hit.summary).not.toMatch(/```|\|\s*(?:Quotient|Remainder)|\\begin\{/);
    }
  });

  it("omits visualKind for non-visual search hits", async () => {
    const corpus = await loadCorpus(path.resolve("tests/fixtures/corpus"));
    const index = buildSearchIndex(corpus);
    const hits = searchCorpus(index, corpus, "quadratic");

    expect(
      hits.find((hit) => hit.id === "concept:sf1690:quadratic-functions")
        ?.visualKind,
    ).toBeUndefined();
  });

  it("filters search to SF1690 function plots", async () => {
    const corpus = await loadCorpus(path.resolve("tests/fixtures/corpus"));
    const index = buildSearchIndex(corpus);
    const hits = searchCorpus(index, corpus, "quadratic", {
      courseId: "course:sf1690",
      entityTypes: ["explainer"],
      visualKinds: ["function-plot"],
    });

    expect(hits.map((hit) => hit.id)).toEqual([
      "explainer:sf1690:quadratic-coefficients",
    ]);
  });

  it("finds an alphanumeric course by its numeric code", async () => {
    const corpus = await loadCorpus(path.resolve("."));
    const index = buildSearchIndex(corpus);
    const hits = searchCorpus(index, corpus, "1204", {
      entityTypes: ["course"],
    });

    expect(hits.map((hit) => hit.id)).toContain("course:ie1204");
  });
});
