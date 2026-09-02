import path from "node:path";
import { loadCorpus, validateCorpus, validateLectureCoverage } from "../src/domain";
import { argument, runCli } from "./cli";

await runCli(async () => {
  const root = path.resolve(argument("root", "."));
  const corpus = await loadCorpus(root);
  const today = new Date().toISOString().slice(0, 10);
  const issues = [...validateCorpus(corpus), ...validateLectureCoverage(corpus, today)];
  if (issues.length > 0) {
    throw new Error(`Content validation failed with ${issues.length} issue(s):\n${issues.map((issue) => `- ${issue.message}`).join("\n")}`);
  }
  return {
    status: "valid",
    issues: 0,
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
