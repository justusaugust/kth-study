import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ZodType } from "zod";
import {
  AssessmentsFileSchema,
  CourseSessionsFileSchema,
  CourseworkFileSchema,
  ConceptSchema,
  DefinitionSchema,
  CourseSchema,
  CurriculumOutcomesFileSchema,
  ExampleSchema,
  ExplainerSpecSchema,
  LectureSchema,
  QuestionSchema,
  SourceSchema,
  type Assessment,
  type Concept,
  type Course,
  type CourseSession,
  type Coursework,
  type Definition,
  type CurriculumOutcome,
  type Example,
  type ExplainerSpec,
  type Lecture,
  type Question,
  type Relationship,
  type Source,
  type StudyEntity,
} from "./schemas";

export interface Corpus {
  courses: Map<string, Course>;
  assessments: Map<string, Assessment>;
  sessions: Map<string, CourseSession>;
  coursework: Map<string, Coursework>;
  outcomes: Map<string, CurriculumOutcome>;
  lectures: Map<string, Lecture>;
  concepts: Map<string, Concept>;
  definitions: Map<string, Definition>;
  explainers: Map<string, ExplainerSpec>;
  examples: Map<string, Example>;
  questions: Map<string, Question>;
  sources: Map<string, Source>;
  relationships: Relationship[];
}

export interface LoadCorpusOptions {
  loadExtractedText?: boolean;
}

type EntityMap = Map<string, StudyEntity>;

async function filesBelow(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const location = path.join(directory, entry.name);
      return entry.isDirectory() ? filesBelow(location) : [location];
    }),
  );
  return files.flat().sort();
}

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

function parseFile<T>(schema: ZodType<T>, value: unknown, file: string): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid content in ${file}: ${issues}`);
  }
  return result.data;
}

async function readMarkdown<T>(schema: ZodType<T>, file: string): Promise<T> {
  const parsed = matter(await fs.readFile(file, "utf8"));
  return parseFile(schema, { ...parsed.data, body: parsed.content.trim() }, file);
}

function insert<T extends StudyEntity>(
  map: Map<string, T>,
  allEntities: EntityMap,
  entity: T,
  file: string,
): void {
  if (allEntities.has(entity.id)) {
    throw new Error(`Duplicate entity ID ${entity.id} in ${file}`);
  }
  map.set(entity.id, entity);
  allEntities.set(entity.id, entity);
}

export async function loadCorpus(
  root: string,
  { loadExtractedText = true }: LoadCorpusOptions = {},
): Promise<Corpus> {
  const corpus: Corpus = {
    courses: new Map(),
    assessments: new Map(),
    sessions: new Map(),
    coursework: new Map(),
    outcomes: new Map(),
    lectures: new Map(),
    concepts: new Map(),
    definitions: new Map(),
    explainers: new Map(),
    examples: new Map(),
    questions: new Map(),
    sources: new Map(),
    relationships: [],
  };
  const allEntities: EntityMap = new Map();
  const coursesRoot = path.join(root, "courses");
  const files = await filesBelow(coursesRoot);

  for (const file of files) {
    const relative = path.relative(coursesRoot, file).split(path.sep).join("/");
    let entities: StudyEntity[] = [];

    if (/^[^/]+\/[^/]+\/[^/]+\/course\.json$/.test(relative)) {
      entities = [parseFile(CourseSchema, await readJson(file), file)];
    } else if (/\/curriculum\/outcomes\.json$/.test(relative)) {
      entities = parseFile(
        CurriculumOutcomesFileSchema,
        await readJson(file),
        file,
      );
    } else if (/\/assessments\/[^/]+\.json$/.test(relative)) {
      entities = parseFile(AssessmentsFileSchema, await readJson(file), file);
    } else if (/\/sessions\/[^/]+\.json$/.test(relative)) {
      entities = parseFile(CourseSessionsFileSchema, await readJson(file), file);
    } else if (/\/coursework\/[^/]+\.json$/.test(relative)) {
      entities = parseFile(CourseworkFileSchema, await readJson(file), file);
    } else if (/\/concepts\/[^/]+\.md$/.test(relative)) {
      entities = [await readMarkdown(ConceptSchema, file)];
    } else if (/\/definitions\/[^/]+\.json$/.test(relative)) {
      entities = [parseFile(DefinitionSchema, await readJson(file), file)];
    } else if (/\/lectures\/[^/]+\.md$/.test(relative)) {
      entities = [await readMarkdown(LectureSchema, file)];
    } else if (/\/material\/lectures\/[^/]+\/lecture\.json$/.test(relative)) {
      entities = [parseFile(LectureSchema, await readJson(file), file)];
    } else if (/\/explainers\/[^/]+\.json$/.test(relative)) {
      entities = [parseFile(ExplainerSpecSchema, await readJson(file), file)];
    } else if (/\/examples\/[^/]+\.md$/.test(relative)) {
      entities = [await readMarkdown(ExampleSchema, file)];
    } else if (/\/questions\/[^/]+\.md$/.test(relative)) {
      entities = [await readMarkdown(QuestionSchema, file)];
    } else if (/\/sources\/[^/]+\.json$/.test(relative)) {
      const source = parseFile(SourceSchema, await readJson(file), file);
      if (source.extractedTextPath && loadExtractedText) {
        const sidecar = path.resolve(path.dirname(file), source.extractedTextPath);
        try {
          source.extractedText = await fs.readFile(sidecar, "utf8");
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            throw new Error(
              `Could not read extracted text for ${file} at ${sidecar}: ${String(error)}`,
            );
          }
        }
      }
      entities = [source];
    }

    for (const entity of entities) {
      const type = entity.id.split(":", 1)[0];
      if (type === "course") insert(corpus.courses, allEntities, entity as Course, file);
      if (type === "assessment") insert(corpus.assessments, allEntities, entity as Assessment, file);
      if (type === "session") insert(corpus.sessions, allEntities, entity as CourseSession, file);
      if (type === "coursework") insert(corpus.coursework, allEntities, entity as Coursework, file);
      if (type === "outcome") insert(corpus.outcomes, allEntities, entity as CurriculumOutcome, file);
      if (type === "lecture") insert(corpus.lectures, allEntities, entity as Lecture, file);
      if (type === "concept") insert(corpus.concepts, allEntities, entity as Concept, file);
      if (type === "definition") insert(corpus.definitions, allEntities, entity as Definition, file);
      if (type === "explainer") insert(corpus.explainers, allEntities, entity as ExplainerSpec, file);
      if (type === "example") insert(corpus.examples, allEntities, entity as Example, file);
      if (type === "question") insert(corpus.questions, allEntities, entity as Question, file);
      if (type === "source") insert(corpus.sources, allEntities, entity as Source, file);
      if ("relationships" in entity) {
        corpus.relationships.push(...entity.relationships);
      }
    }
  }

  return corpus;
}
