import { promises as fs } from "node:fs";
import path from "node:path";
import { buildSearchIndex, loadCorpus, validateCorpus } from "../src/domain";
import { findCourseDirectory } from "../src/ingest/writeTransaction";
import { argument, runCli } from "./cli";

await runCli(async () => {
  const root = path.resolve(argument("root", "."));
  const corpus = await loadCorpus(root);
  const issues = validateCorpus(corpus);
  if (issues.length > 0) {
    throw new Error(`Index refused: corpus has ${issues.length} validation issue(s).`);
  }
  const serialized = `${JSON.stringify(buildSearchIndex(corpus).toJSON())}\n`;
  const paths: string[] = [];
  for (const course of corpus.courses.values()) {
    const coursePath = await findCourseDirectory(root, course.code);
    const generated = path.join(coursePath, ".generated");
    await fs.mkdir(generated, { recursive: true });
    const temporary = path.join(generated, `search-index.${process.pid}.tmp`);
    const destination = path.join(generated, "search-index.json");
    await fs.writeFile(temporary, serialized, "utf8");
    await fs.rename(temporary, destination);
    paths.push(path.relative(root, destination).split(path.sep).join("/"));
  }
  return { status: "indexed", documents: corpus.courses.size, paths };
});
