import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadCorpus } from "./repository";

describe("loadCorpus", () => {
  it("loads course, outcome, concept, definition, and explainer entities", async () => {
    const corpus = await loadCorpus(path.resolve("tests/fixtures/corpus"));

    expect(corpus.courses.get("course:sf1690")?.title).toBe(
      "Basic Course in Mathematics",
    );
    expect(
      corpus.concepts.get("concept:sf1690:quadratic-functions")?.summary,
    ).toBe(
      "A quadratic function has a graph whose shape is controlled by three coefficients.",
    );
    expect(
      corpus.explainers.get("explainer:sf1690:quadratic-coefficients")?.kind,
    ).toBe("function-plot");
    expect(corpus.definitions.get("definition:sf1690:quadratic-function")?.term).toBe(
      "Quadratic function",
    );
    expect(corpus.courses.get("course:sf1690")).toMatchObject({
      credits: 6,
      language: "English",
    });
    expect(corpus.assessments.get("assessment:sf1690:ten1")).toMatchObject({
      code: "TEN1",
      credits: 6,
      kind: "written-exam",
    });
    expect(corpus.sessions.get("session:sf1690:lecture-01")).toMatchObject({
      kind: "lecture",
      week: 35,
      sequence: 1,
    });
    expect(corpus.coursework.get("coursework:sf1690:exercise-01")).toMatchObject({
      kind: "exercise",
      sessionIds: ["session:sf1690:exercise-01"],
    });
  });

  it("refuses an unknown explainer kind and identifies its file", async () => {
    const temporaryRoot = await fs.mkdtemp(
      path.join(os.tmpdir(), "kth-corpus-invalid-"),
    );
    const fixtureRoot = path.resolve("tests/fixtures/corpus");
    await fs.cp(fixtureRoot, temporaryRoot, { recursive: true });

    const explainerPath = path.join(
      temporaryRoot,
      "courses/2026-27/P1/SF1690/explainers/quadratic-coefficients.json",
    );
    const explainer = JSON.parse(await fs.readFile(explainerPath, "utf8"));
    explainer.kind = "unknown";
    await fs.writeFile(explainerPath, JSON.stringify(explainer));

    await expect(loadCorpus(temporaryRoot)).rejects.toThrow(
      /quadratic-coefficients\.json.*kind/i,
    );
  });

  it("can load a public corpus without private extracted source text", async () => {
    const temporaryRoot = await fs.mkdtemp(
      path.join(os.tmpdir(), "kth-corpus-public-"),
    );
    await fs.cp(path.resolve("tests/fixtures/corpus"), temporaryRoot, {
      recursive: true,
    });

    const sourcePath = path.join(
      temporaryRoot,
      "courses/2026-27/P1/SF1690/sources/curriculum.json",
    );
    const source = JSON.parse(await fs.readFile(sourcePath, "utf8"));
    source.extractedTextPath = "private-source.txt";
    await fs.writeFile(sourcePath, JSON.stringify(source));

    const corpus = await loadCorpus(temporaryRoot, {
      loadExtractedText: false,
    });

    expect(
      corpus.sources.get("source:sf1690:fixture-curriculum")?.extractedText,
    ).toBeUndefined();
  });
});
