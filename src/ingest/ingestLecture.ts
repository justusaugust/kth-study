import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  ConceptSchema,
  CourseSchema,
  CourseSessionSchema,
  DefinitionSchema,
  ExampleSchema,
  ExplainerSpecSchema,
  LectureSchema,
  QuestionSchema,
  SourceSchema,
} from "../domain/schemas";
import { writeTransaction } from "./writeTransaction";

type EntityKind =
  | "course"
  | "concept"
  | "definition"
  | "lecture"
  | "session"
  | "explainer"
  | "example"
  | "question"
  | "source";

export interface IngestLectureInput {
  root: string;
  courseCode: string;
  lectureId: string;
  sourceFiles: string[];
  extractedTextFiles?: string[];
  entities: Array<{
    entityType?: EntityKind;
    kind?: unknown;
    [key: string]: unknown;
  }>;
}

export interface IngestResult {
  lectureId: string;
  writtenEntityIds: string[];
  retainedSourcePaths: string[];
  validationIssueCount: 0;
  indexPath: string;
}

interface ValidatedEntity {
  kind: EntityKind;
  data: Record<string, unknown> & { id: string };
}

function validationError(kind: string, issues: string): Error {
  return new Error(`${kind} validation failed: ${issues}`);
}

function validateEntity(entity: IngestLectureInput["entities"][number]): ValidatedEntity {
  const kind =
    entity.entityType ??
    (typeof entity.kind === "string" ? (entity.kind as EntityKind) : undefined);
  const candidate = { ...entity };
  delete candidate.entityType;
  if (!entity.entityType) delete candidate.kind;
  const schema = {
    course: CourseSchema,
    concept: ConceptSchema,
    definition: DefinitionSchema,
    lecture: LectureSchema,
    session: CourseSessionSchema,
    explainer: ExplainerSpecSchema,
    example: ExampleSchema,
    question: QuestionSchema,
    source: SourceSchema,
  }[kind as EntityKind];
  if (!kind || !schema) {
    throw validationError(String(kind), "unsupported entity kind");
  }
  const parsed = schema.safeParse(candidate);
  if (!parsed.success) {
    throw validationError(
      kind,
      parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
        .join("; "),
    );
  }
  return { kind, data: parsed.data as ValidatedEntity["data"] };
}

function lectureSlug(lectureId: string): string {
  const parts = lectureId.split(":");
  if (parts.length !== 3 || parts[0] !== "lecture") {
    throw validationError("lectureId", "expected lecture:<course>:<slug>");
  }
  return parts[2];
}

async function writeMarkdownEntity(file: string, data: ValidatedEntity["data"]) {
  const { body = "", ...frontMatter } = data;
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, matter.stringify(String(body), frontMatter), "utf8");
}

async function upsertSessionEntity(
  coursePath: string,
  entitySlug: string,
  data: ValidatedEntity["data"],
) {
  const directory = path.join(coursePath, "sessions");
  await fs.mkdir(directory, { recursive: true });
  const files = (await fs.readdir(directory)).filter((file) => file.endsWith(".json"));

  for (const file of files) {
    const location = path.join(directory, file);
    const parsed = JSON.parse(await fs.readFile(location, "utf8")) as
      | Array<Record<string, unknown>>
      | { sessions?: Array<Record<string, unknown>> };
    const sessions = Array.isArray(parsed) ? parsed : parsed.sessions;
    if (!sessions) continue;
    const index = sessions.findIndex((session) => session.id === data.id);
    if (index < 0) continue;
    sessions[index] = data;
    const next = Array.isArray(parsed) ? sessions : { ...parsed, sessions };
    await fs.writeFile(location, `${JSON.stringify(next, null, 2)}\n`, "utf8");
    return;
  }

  await fs.writeFile(
    path.join(directory, `${entitySlug}.json`),
    `${JSON.stringify({ sessions: [data] }, null, 2)}\n`,
    "utf8",
  );
}

export async function ingestLecture(
  input: IngestLectureInput,
): Promise<IngestResult> {
  const slug = lectureSlug(input.lectureId);
  const entities = input.entities.map(validateEntity);
  const writtenEntityIds = entities.map((entity) => entity.data.id);
  const retainedSourcePaths: string[] = [];

  const transaction = await writeTransaction({
    root: input.root,
    courseCode: input.courseCode,
    async mutate(coursePath) {
      const lectureDirectory = path.join(
        coursePath,
        "material",
        "lectures",
        slug,
      );
      const originalsDirectory = path.join(lectureDirectory, "originals");
      const extractedDirectory = path.join(lectureDirectory, "extracted");
      await fs.mkdir(originalsDirectory, { recursive: true });
      for (const sourceFile of input.sourceFiles) {
        const destination = path.join(originalsDirectory, path.basename(sourceFile));
        await fs.copyFile(sourceFile, destination);
        retainedSourcePaths.push(
          path.relative(coursePath, destination).split(path.sep).join("/"),
        );
      }
      if (input.extractedTextFiles?.length) {
        await fs.mkdir(extractedDirectory, { recursive: true });
        for (const extractedFile of input.extractedTextFiles) {
          const destination = path.join(
            extractedDirectory,
            path.basename(extractedFile),
          );
          await fs.copyFile(extractedFile, destination);
          retainedSourcePaths.push(
            path.relative(coursePath, destination).split(path.sep).join("/"),
          );
        }
      }

      for (const entity of entities) {
        const entitySlug = String(entity.data.slug ?? entity.data.id.split(":").at(-1));
        if (entity.kind === "course") {
          await fs.writeFile(
            path.join(coursePath, "course.json"),
            `${JSON.stringify(entity.data, null, 2)}\n`,
            "utf8",
          );
        } else if (entity.kind === "concept") {
          await writeMarkdownEntity(
            path.join(coursePath, "concepts", `${entitySlug}.md`),
            entity.data,
          );
        } else if (entity.kind === "definition") {
          const directory = path.join(coursePath, "definitions");
          await fs.mkdir(directory, { recursive: true });
          await fs.writeFile(
            path.join(directory, `${entitySlug}.json`),
            `${JSON.stringify(entity.data, null, 2)}\n`,
            "utf8",
          );
        } else if (entity.kind === "lecture") {
          await fs.mkdir(lectureDirectory, { recursive: true });
          await fs.writeFile(
            path.join(lectureDirectory, "lecture.json"),
            `${JSON.stringify(entity.data, null, 2)}\n`,
            "utf8",
          );
        } else if (entity.kind === "session") {
          await upsertSessionEntity(coursePath, entitySlug, entity.data);
        } else if (entity.kind === "explainer") {
          const directory = path.join(coursePath, "explainers");
          await fs.mkdir(directory, { recursive: true });
          await fs.writeFile(
            path.join(directory, `${entitySlug}.json`),
            `${JSON.stringify(entity.data, null, 2)}\n`,
            "utf8",
          );
        } else if (entity.kind === "example" || entity.kind === "question") {
          await writeMarkdownEntity(
            path.join(coursePath, `${entity.kind}s`, `${entitySlug}.md`),
            entity.data,
          );
        } else if (entity.kind === "source") {
          const directory = path.join(coursePath, "sources");
          await fs.mkdir(directory, { recursive: true });
          await fs.writeFile(
            path.join(directory, `${entitySlug}.json`),
            `${JSON.stringify(entity.data, null, 2)}\n`,
            "utf8",
          );
        }
      }
    },
  });

  return {
    lectureId: input.lectureId,
    writtenEntityIds,
    retainedSourcePaths,
    validationIssueCount: 0,
    indexPath: transaction.indexPath,
  };
}
