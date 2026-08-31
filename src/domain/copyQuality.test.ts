import path from "node:path";
import katex from "katex";
import { describe, expect, it } from "vitest";
import { loadCorpus } from "./repository";

function normalizeCopy(value: string): string {
  return value
    .replace(/[`*_#>|$\\{}()[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase();
}

describe("student-facing copy", () => {
  it("keeps every student-facing math fragment parseable", async () => {
    const corpus = await loadCorpus(path.resolve("."));
    const fields = [
      ...[...corpus.lectures.values()].flatMap((item) => [item.summary, item.body ?? ""]),
      ...[...corpus.concepts.values()].flatMap((item) => [
        item.summary,
        item.centralInsight ?? "",
        item.commonMistake ?? "",
        item.verifyPrompt ?? "",
        item.body,
      ]),
      ...[...corpus.definitions.values()].flatMap((item) => [
        item.statement,
        item.notation ?? "",
        item.interpretation ?? "",
      ]),
      ...[...corpus.examples.values()].map((item) => item.body),
      ...[...corpus.questions.values()].flatMap((item) => [item.body, item.answer]),
    ].map((field) => field ?? "");
    const failures: string[] = [];

    for (const field of fields) {
      let remaining = field.replace(/\$\$([\s\S]*?)\$\$/g, (_match, expression: string) => {
        try {
          katex.renderToString(expression.trim(), { throwOnError: true, displayMode: true });
        } catch (error) {
          failures.push(String(error));
        }
        return "";
      });
      remaining = remaining.replace(/(?<!\\)\$([^$]+?)(?<!\\)\$/g, (_match, expression: string) => {
        try {
          katex.renderToString(expression.trim(), { throwOnError: true });
        } catch (error) {
          failures.push(String(error));
        }
        return "";
      });
      if (/(?<!\\)\$/.test(remaining)) failures.push(`Unpaired math delimiter in: ${remaining}`);
    }

    expect(failures).toEqual([]);
  });

  it("keeps source-audit notes out of lecture and concept teaching copy", async () => {
    const corpus = await loadCorpus(path.resolve("."));
    const auditLanguage =
      /study engine|authenticated canvas|classroom photographs?|verified against|normalized transcription|reconstructed from|no lecture upload|source note|these notes preserve|deck then focused|scheduled session covered|reusable conceptual layer|uploaded deck|lecture source sequence|retained as supported lecture material|supplemental until lecture material/i;

    const leaks = [
      ...[...corpus.lectures.values()].flatMap((lecture) => [
        [lecture.id, "summary", lecture.summary],
        [lecture.id, "body", lecture.body ?? ""],
      ]),
      ...[...corpus.concepts.values()].flatMap((concept) => [
        [concept.id, "summary", concept.summary],
        [concept.id, "centralInsight", concept.centralInsight ?? ""],
        [concept.id, "body", concept.body],
      ]),
    ].filter(([, , value]) => auditLanguage.test(value));

    expect(leaks).toEqual([]);
  });

  it("does not reuse an identical substantive description", async () => {
    const corpus = await loadCorpus(path.resolve("."));
    const descriptions = [
      ...[...corpus.lectures.values()].flatMap((item) => [
        [item.id, "summary", item.summary],
        [item.id, "body", item.body ?? ""],
      ]),
      ...[...corpus.concepts.values()].flatMap((item) => [
        [item.id, "summary", item.summary],
        [item.id, "centralInsight", item.centralInsight ?? ""],
        [item.id, "body", item.body],
      ]),
      ...[...corpus.definitions.values()].flatMap((item) => [
        [item.id, "statement", item.statement],
        [item.id, "interpretation", item.interpretation ?? ""],
      ]),
      ...[...corpus.examples.values()].map((item) => [item.id, "body", item.body]),
      ...[...corpus.questions.values()].map((item) => [item.id, "body", item.body]),
      ...[...corpus.explainers.values()].flatMap((item) => [
        [item.id, "caption", item.caption],
        [item.id, "accessibleSummary", item.accessibleSummary],
      ]),
    ]
      .map(([id, field, value]) => ({
        id,
        field,
        value: normalizeCopy(value ?? ""),
      }))
      .filter(({ value }) => value.length >= 40);

    const firstUse = new Map<string, string>();
    const duplicates: string[] = [];
    for (const { id, field, value } of descriptions) {
      const label = `${id}.${field}`;
      const existing = firstUse.get(value);
      if (existing) duplicates.push(`${existing} = ${label}`);
      else firstUse.set(value, label);
    }

    expect(duplicates).toEqual([]);
  });

  it("gives the quadratic guide a mechanism rather than repeating its summary", async () => {
    const corpus = await loadCorpus(path.resolve("."));
    const concept = corpus.concepts.get("concept:sf1690:quadratic-functions");

    expect(concept?.centralInsight).toContain("Completing the square");
    expect(normalizeCopy(concept?.centralInsight ?? "")).not.toBe(
      normalizeCopy(concept?.summary ?? ""),
    );
  });
});
