import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  buildSearchIndex,
  loadCorpus,
  validateCorpus,
  type Corpus,
} from "../domain";

export interface CourseTransaction {
  root: string;
  courseCode: string;
  mutate(stagingCoursePath: string): Promise<void>;
}

export interface TransactionResult {
  corpus: Corpus;
  coursePath: string;
  indexPath: string;
}

export async function findCourseDirectory(
  root: string,
  courseCode: string,
): Promise<string> {
  const coursesRoot = path.join(root, "courses");
  const years = await fs.readdir(coursesRoot, { withFileTypes: true });
  for (const year of years.filter((entry) => entry.isDirectory())) {
    const yearPath = path.join(coursesRoot, year.name);
    const periods = await fs.readdir(yearPath, { withFileTypes: true });
    for (const period of periods.filter((entry) => entry.isDirectory())) {
      const candidate = path.join(yearPath, period.name, courseCode);
      try {
        if ((await fs.stat(candidate)).isDirectory()) return candidate;
      } catch {
        // Continue looking in the next period.
      }
    }
  }
  throw new Error(`Course directory not found for ${courseCode}.`);
}

export async function writeTransaction({
  root,
  courseCode,
  mutate,
}: CourseTransaction): Promise<TransactionResult> {
  const coursePath = await findCourseDirectory(root, courseCode);
  const suffix = randomUUID();
  const stagingPath = `${coursePath}.staging-${suffix}`;
  const backupPath = `${coursePath}.backup-${suffix}`;
  const candidateRoot = await fs.mkdtemp(
    path.join(os.tmpdir(), "kth-corpus-candidate-"),
  );
  let canonicalMoved = false;
  let stagingMoved = false;

  try {
    await fs.cp(coursePath, stagingPath, { recursive: true });
    await mutate(stagingPath);

    await fs.cp(path.join(root, "courses"), path.join(candidateRoot, "courses"), {
      recursive: true,
    });
    const courseRelative = path.relative(path.join(root, "courses"), coursePath);
    const stagingRelative = path.relative(path.join(root, "courses"), stagingPath);
    await fs.rm(path.join(candidateRoot, "courses", stagingRelative), {
      recursive: true,
      force: true,
    });
    await fs.rm(path.join(candidateRoot, "courses", courseRelative), {
      recursive: true,
      force: true,
    });
    await fs.cp(stagingPath, path.join(candidateRoot, "courses", courseRelative), {
      recursive: true,
    });

    const corpus = await loadCorpus(candidateRoot);
    const issues = validateCorpus(corpus);
    if (issues.length > 0) {
      throw new Error(
        `Candidate validation failed: ${issues
          .map((issue) => `${issue.code}: ${issue.message}`)
          .join("; ")}`,
      );
    }
    const index = buildSearchIndex(corpus);
    const generatedDirectory = path.join(stagingPath, ".generated");
    await fs.mkdir(generatedDirectory, { recursive: true });
    await fs.writeFile(
      path.join(generatedDirectory, "search-index.json"),
      `${JSON.stringify(index.toJSON())}\n`,
      "utf8",
    );

    await fs.rename(coursePath, backupPath);
    canonicalMoved = true;
    try {
      await fs.rename(stagingPath, coursePath);
      stagingMoved = true;
    } catch (error) {
      await fs.rename(backupPath, coursePath);
      canonicalMoved = false;
      throw error;
    }
    await fs.rm(backupPath, { recursive: true, force: true });
    canonicalMoved = false;

    return {
      corpus,
      coursePath,
      indexPath: path.join(coursePath, ".generated", "search-index.json"),
    };
  } finally {
    await fs.rm(candidateRoot, { recursive: true, force: true });
    if (!stagingMoved) {
      await fs.rm(stagingPath, { recursive: true, force: true });
    }
    if (canonicalMoved) {
      try {
        await fs.rename(backupPath, coursePath);
      } catch {
        // The original error remains primary; preserve the backup for recovery.
      }
    }
  }
}
