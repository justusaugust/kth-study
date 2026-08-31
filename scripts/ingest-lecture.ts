import { promises as fs } from "node:fs";
import path from "node:path";
import { ingestLecture, type IngestLectureInput } from "../src/ingest/ingestLecture";
import { argument, runCli } from "./cli";

await runCli(async () => {
  const root = path.resolve(argument("root", "."));
  const courseCode = argument("course").toUpperCase();
  const inputPath = path.resolve(argument("input"));
  const input = JSON.parse(await fs.readFile(inputPath, "utf8")) as Omit<
    IngestLectureInput,
    "root" | "courseCode"
  >;
  return ingestLecture({ ...input, root, courseCode });
});
