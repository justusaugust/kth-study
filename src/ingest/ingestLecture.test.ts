import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadCorpus } from "../domain/repository";
import { ingestLecture } from "./ingestLecture";

async function snapshotTree(root: string): Promise<Record<string, string>> {
  const snapshot: Record<string, string> = {};
  async function visit(directory: string) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const location = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(location);
      else {
        const relative = path.relative(root, location);
        const content = await fs.readFile(location);
        snapshot[relative] = createHash("sha256").update(content).digest("hex");
      }
    }
  }
  await visit(root);
  return snapshot;
}

describe("ingestLecture", () => {
  it("does not change the corpus when a generated entity is invalid", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "kth-ingest-test-"));
    await fs.cp(path.resolve("tests/fixtures/corpus"), root, { recursive: true });
    const before = await snapshotTree(root);

    await expect(
      ingestLecture({
        root,
        courseCode: "SF1690",
        lectureId: "lecture:sf1690:2026-08-24-01",
        sourceFiles: [path.resolve("tests/fixtures/lecture-source.txt")],
        entities: [{ kind: "concept", id: "invalid id" } as never],
      }),
    ).rejects.toThrow(/validation/i);

    expect(await snapshotTree(root)).toEqual(before);
  });

  it("atomically retains the source, lecture entity, and generated index", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "kth-ingest-ok-"));
    await fs.cp(path.resolve("tests/fixtures/corpus"), root, { recursive: true });

    const result = await ingestLecture({
      root,
      courseCode: "SF1690",
      lectureId: "lecture:sf1690:2026-08-24-01",
      sourceFiles: [path.resolve("tests/fixtures/lecture-source.txt")],
      entities: [
        {
          kind: "lecture",
          id: "lecture:sf1690:2026-08-24-01",
          courseId: "course:sf1690",
          slug: "2026-08-24-01",
          title: "Fixture lecture",
          date: "2026-08-24",
          summary: "A fixture lecture used only to verify ingestion.",
          conceptIds: ["concept:sf1690:quadratic-functions"],
          body: "Fixture content.",
          sourceIds: [],
          relationships: [],
          lastChecked: "2026-08-24",
          confidence: "fixture",
        },
      ],
    });

    expect(result.validationIssueCount).toBe(0);
    expect(result.retainedSourcePaths).toEqual([
      "material/lectures/2026-08-24-01/originals/lecture-source.txt",
    ]);
    await expect(fs.readFile(result.indexPath, "utf8")).resolves.toContain(
      "lecture:sf1690:2026-08-24-01",
    );
    const corpus = await loadCorpus(root);
    expect(corpus.lectures.has("lecture:sf1690:2026-08-24-01")).toBe(true);
  });

  it("ingests definitions and the lecture session with the lecture transaction", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "kth-ingest-linked-"));
    await fs.cp(path.resolve("tests/fixtures/corpus"), root, { recursive: true });

    await ingestLecture({
      root,
      courseCode: "SF1690",
      lectureId: "lecture:sf1690:2026-08-27-03",
      sourceFiles: [path.resolve("tests/fixtures/lecture-source.txt")],
      entities: [
        {
          kind: "lecture",
          id: "lecture:sf1690:2026-08-27-03",
          courseId: "course:sf1690",
          slug: "2026-08-27-03",
          title: "Fixture lecture about functions",
          date: "2026-08-27",
          summary: "A fixture lecture used to verify linked ingestion.",
          conceptIds: ["concept:sf1690:quadratic-functions"],
          sessionId: "session:sf1690:lecture-03",
          body: "Fixture content.",
          sourceIds: [],
          relationships: [],
          lastChecked: "2026-08-27",
          confidence: "fixture",
        },
        {
          kind: "definition",
          id: "definition:sf1690:function",
          courseId: "course:sf1690",
          slug: "function",
          term: "Function",
          statement: "A rule assigning one output to every input in its domain.",
          conceptIds: ["concept:sf1690:quadratic-functions"],
          sourceIds: [],
          relationships: [],
          lastChecked: "2026-08-27",
          confidence: "fixture",
        },
        {
          entityType: "session",
          id: "session:sf1690:lecture-03",
          courseId: "course:sf1690",
          slug: "lecture-03",
          kind: "lecture",
          sequence: 5,
          title: "Lecture 3 · Functions",
          date: "2026-08-27",
          week: 35,
          lectureId: "lecture:sf1690:2026-08-27-03",
          courseworkIds: [],
          sourceIds: [],
          relationships: [],
          lastChecked: "2026-08-27",
          confidence: "fixture",
        },
      ],
    });

    const corpus = await loadCorpus(root);
    expect(corpus.definitions.has("definition:sf1690:function")).toBe(true);
    expect(corpus.sessions.get("session:sf1690:lecture-03")?.lectureId).toBe(
      "lecture:sf1690:2026-08-27-03",
    );
  });

  it("updates an existing planned session instead of creating a duplicate", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "kth-ingest-session-"));
    await fs.cp(path.resolve("tests/fixtures/corpus"), root, { recursive: true });

    await ingestLecture({
      root,
      courseCode: "SF1690",
      lectureId: "lecture:sf1690:2026-08-24-01",
      sourceFiles: [path.resolve("tests/fixtures/lecture-source.txt")],
      entities: [
        {
          kind: "lecture",
          id: "lecture:sf1690:2026-08-24-01",
          courseId: "course:sf1690",
          slug: "2026-08-24-01",
          title: "Fixture lecture",
          date: "2026-08-24",
          summary: "A fixture lecture linked to its planned session.",
          conceptIds: ["concept:sf1690:quadratic-functions"],
          sessionId: "session:sf1690:lecture-01",
          body: "Fixture content.",
          sourceIds: ["source:sf1690:fixture-curriculum"],
          relationships: [],
          lastChecked: "2026-08-27",
          confidence: "fixture",
        },
        {
          entityType: "session",
          id: "session:sf1690:lecture-01",
          courseId: "course:sf1690",
          slug: "lecture-01",
          kind: "lecture",
          sequence: 1,
          title: "Lecture 1 · Linked to its notes",
          date: "2026-08-24",
          week: 35,
          lectureId: "lecture:sf1690:2026-08-24-01",
          courseworkIds: [],
          sourceIds: ["source:sf1690:fixture-curriculum"],
          relationships: [],
          lastChecked: "2026-08-27",
          confidence: "fixture",
        },
      ],
    });

    const corpus = await loadCorpus(root);
    expect(corpus.sessions.size).toBe(2);
    expect(corpus.sessions.get("session:sf1690:lecture-01")).toMatchObject({
      lectureId: "lecture:sf1690:2026-08-24-01",
      title: "Lecture 1 · Linked to its notes",
    });
  });
});
