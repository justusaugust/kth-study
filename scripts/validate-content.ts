import path from "node:path";
import { loadCorpus, validateCorpus, validateLectureCoverage } from "../src/domain";
import { argument, runCli } from "./cli";
import { currentStudyDate } from "../src/web/format";

await runCli(async () => {
  const root = path.resolve(argument("root", "."));
  const corpus = await loadCorpus(root);
  const coverage = validateLectureCoverage(corpus, currentStudyDate());
  const warnings = coverage.filter((issue) => issue.severity === "warning");
  const issues = [...validateCorpus(corpus), ...coverage.filter((issue) => issue.severity !== "warning")];
  if (issues.length > 0) {
    throw new Error(`Content validation failed with ${issues.length} issue(s):\n${issues.map((issue) => `- ${issue.message}`).join("\n")}`);
  }
  return {
    status: "valid",
    issues: 0,
    coverage: warnings.length ? "incomplete-date-evidence" : "dated-records-checked",
    warnings,
    counts: {
      courses: corpus.courses.size,
      assessments: corpus.assessments.size,
      sessions: corpus.sessions.size,
      coursework: corpus.coursework.size,
      outcomes: corpus.outcomes.size,
      lectures: corpus.lectures.size,
      concepts: corpus.concepts.size,
      definitions: corpus.definitions.size,
      explainers: corpus.explainers.size,
      sources: corpus.sources.size,
      missingPastLectures: 0,
    },
  };
});
