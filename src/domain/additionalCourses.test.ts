import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadCorpus, validateCorpus } from ".";

describe("IE1204 and II1308 course dossiers", () => {
  it("loads both authenticated lecture bundles as linked study material", async () => {
    const corpus = await loadCorpus(path.resolve("."));

    expect(corpus.courses.get("course:ie1204")).toMatchObject({
      title: "Digital Design",
      credits: 7.5,
    });
    expect(corpus.lectures.get("lecture:ie1204:2026-08-25-01")).toMatchObject({
      date: "2026-08-25",
      conceptIds: expect.arrayContaining([
        "concept:ie1204:digital-abstraction",
        "concept:ie1204:positional-number-systems",
      ]),
    });
    expect(corpus.explainers.get("explainer:ie1204:binary-place-value")).toMatchObject({
      kind: "systems-diagram",
      variant: "binary-place-value",
    });
    expect(
      [...corpus.sessions.values()].filter(
        (session) =>
          session.courseId === "course:ie1204" && session.kind === "lecture",
      ),
    ).toHaveLength(15);
    expect(corpus.sessions.get("session:ie1204:lecture-03")).toMatchObject({
      date: "2026-08-31",
      title: "Lecture 3 · Logic levels, CMOS gates, and power",
      lectureId: "lecture:ie1204:2026-08-31-03",
    });
    expect(corpus.lectures.get("lecture:ie1204:2026-08-31-03")?.conceptIds).toEqual(
      expect.arrayContaining([
        "concept:ie1204:cmos-transistor-networks",
        "concept:ie1204:cmos-power-consumption",
      ]),
    );
    expect(corpus.explainers.get("explainer:ie1204:cmos-gate-network")).toMatchObject({
      kind: "systems-diagram",
      variant: "cmos-gates",
    });
    expect(
      [...corpus.coursework.values()].filter(
        (item) =>
          item.courseId === "course:ie1204" && item.kind === "exercise",
      ),
    ).toHaveLength(5);
    expect(corpus.coursework.get("coursework:ie1204:lab-report")).toMatchObject({
      date: "2026-10-12",
      requirement: "required",
      assessmentIds: ["assessment:ie1204:laba"],
    });
    expect(corpus.assessments.get("assessment:ie1204:tena")).toMatchObject({
      date: "2026-10-19",
    });
    expect(corpus.sources.get("source:ie1204:canvas-2026-material-map")).toMatchObject({
      kind: "canvas",
      confidence: "verified",
      lastChecked: "2026-08-30",
    });
    expect(corpus.lectures.get("lecture:ie1204:2026-08-27-02")?.sourceIds).toContain(
      "source:ie1204:lecture-2-recordings",
    );

    expect(corpus.courses.get("course:ii1308")).toMatchObject({
      title: "Introduction to Programming",
      credits: 1.5,
    });
    expect(corpus.lectures.get("lecture:ii1308:2026-08-25-01")).toMatchObject({
      date: "2026-08-25",
      conceptIds: expect.arrayContaining([
        "concept:ii1308:sequence-selection-iteration",
        "concept:ii1308:variables-values-and-types",
      ]),
    });
    expect(corpus.sources.get("source:ii1308:ai-policy")).toMatchObject({
      kind: "canvas",
      confidence: "verified",
    });
    expect(corpus.coursework.get("coursework:ii1308:quiz-a")).toMatchObject({
      requirement: "required",
      assessmentIds: ["assessment:ii1308:lab1"],
    });

    expect(validateCorpus(corpus)).toEqual([]);
  });
});
