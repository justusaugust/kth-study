import MiniSearch from "minisearch";
import { entityUrl } from "./ids";
import type { Corpus } from "./repository";
import type { ExplainerSpec, StudyEntity } from "./schemas";

export type SearchEntityType =
  | "course"
  | "outcome"
  | "lecture"
  | "concept"
  | "definition"
  | "explainer"
  | "example"
  | "question"
  | "source";

export interface SearchDocument {
  id: string;
  entityType: SearchEntityType;
  title: string;
  aliases: string[];
  summary: string;
  body: string;
  notation: string[];
  courseCode: string;
  courseId: string;
  outcomeTitles: string[];
  sourceTitles: string[];
  relationshipTitles: string[];
  visualKind?: ExplainerSpec["kind"];
  lectureIds: string[];
  outcomeIds: string[];
  url: string;
  confidence: "verified" | "high" | "medium" | "low";
  sourceLocator?: string;
}

export interface SearchFilters {
  courseId?: string;
  entityTypes?: SearchEntityType[];
  visualKinds?: ExplainerSpec["kind"][];
  lectureIds?: string[];
  outcomeIds?: string[];
}

export interface SearchHit {
  id: string;
  entityType: SearchEntityType;
  title: string;
  summary: string;
  url: string;
  score: number;
  courseId: string;
  visualKind?: ExplainerSpec["kind"];
  sourceLocator?: string;
}

function entities(corpus: Corpus): StudyEntity[] {
  return [
    ...corpus.courses.values(),
    ...corpus.outcomes.values(),
    ...corpus.lectures.values(),
    ...corpus.concepts.values(),
    ...corpus.definitions.values(),
    ...corpus.explainers.values(),
    ...corpus.examples.values(),
    ...corpus.questions.values(),
    ...corpus.sources.values(),
  ];
}

function titleOf(entity: StudyEntity | undefined): string | undefined {
  return entity && "term" in entity ? entity.term : entity?.title;
}

function searchableCourseCode(code: string): string {
  return [code, ...(code.match(/[a-z]+|\d+/gi) ?? [])].join(" ");
}

function isExplainer(entity: StudyEntity): entity is ExplainerSpec {
  return entity.id.startsWith("explainer:");
}

function excerptMarkdown(markdown: string, maxLength = 180): string {
  const blocks = markdown.replace(/\r\n?/g, "\n").trim().split(/\n\s*\n/);
  const proseBlock = blocks.find((block) => !/^\s*(?:```|~~~|\$\$|\|)/.test(block));
  const normalized = (proseBlock ?? blocks[0] ?? "")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*(?:[-*+] |\d+[.)] )/gm, "")
    .replace(/\$\$([\s\S]*?)\$\$/g, (_match, expression: string) =>
      `$${expression.trim()}$`,
    )
    .replace(/\s+/g, " ")
    .trim();

  function finish(excerpt: string): string {
    if (/[:;]$/.test(excerpt)) return `${excerpt.slice(0, -1)}.`;
    if (/[.!?…]$/.test(excerpt)) return excerpt;
    return `${excerpt}.`;
  }

  if (normalized.length <= maxLength) return finish(normalized);

  const sentenceEnds: number[] = [];
  let inMath = false;
  let lastSafeSpace = -1;

  for (let index = 0; index < normalized.length; index += 1) {
    const character = normalized[index];
    const escaped = index > 0 && normalized[index - 1] === "\\";
    if (character === "$" && !escaped) {
      inMath = !inMath;
      continue;
    }
    if (inMath) continue;
    if (/\s/.test(character) && index <= maxLength) lastSafeSpace = index;
    if (
      /[.!?]/.test(character) &&
      (index === normalized.length - 1 || /\s/.test(normalized[index + 1]))
    ) {
      sentenceEnds.push(index + 1);
      if (index + 1 > maxLength) break;
    }
  }

  const withinLimit = sentenceEnds.filter((end) => end <= maxLength).at(-1);
  if (withinLimit) return finish(normalized.slice(0, withinLimit));
  if (sentenceEnds.length) return finish(normalized.slice(0, sentenceEnds[0]));

  const cutoff = lastSafeSpace > 0 ? lastSafeSpace : maxLength;
  return `${normalized.slice(0, cutoff).trimEnd()}…`;
}

function summaryOf(entity: StudyEntity): string {
  if ("summary" in entity) return entity.summary;
  if ("description" in entity) return entity.description;
  if ("caption" in entity) return entity.caption;
  if ("statement" in entity) return entity.statement;
  if ("body" in entity) return excerptMarkdown(entity.body);
  if ("extractedText" in entity) return entity.extractedText?.slice(0, 320) ?? "";
  return "";
}

function confidenceOf(entity: StudyEntity): SearchDocument["confidence"] {
  return {
    verified: "verified",
    supported: "high",
    inferred: "medium",
    fixture: "low",
  }[entity.confidence] as SearchDocument["confidence"];
}

function toDocument(
  entity: StudyEntity,
  corpus: Corpus,
  all: Map<string, StudyEntity>,
): SearchDocument {
  const entityType = entity.id.split(":", 1)[0] as SearchEntityType;
  const courseId = "courseId" in entity ? entity.courseId : entity.id;
  const course = corpus.courses.get(courseId);
  const relationshipIds = corpus.relationships
    .filter((edge) => edge.from === entity.id || edge.to === entity.id)
    .map((edge) => (edge.from === entity.id ? edge.to : edge.from));
  const sourceIds = "sourceIds" in entity ? entity.sourceIds : [];
  const outcomeIds = "outcomeIds" in entity ? entity.outcomeIds : [];
  const lectureIds = "lectureIds" in entity ? entity.lectureIds : [];

  return {
    id: entity.id,
    entityType,
    title: "term" in entity ? entity.term : entity.title,
    aliases: [],
    summary: summaryOf(entity),
    body:
      ("body" in entity ? entity.body : "") ||
      ("statement" in entity ? `${entity.statement} ${entity.interpretation ?? ""}` : "") ||
      ("extractedText" in entity ? entity.extractedText ?? "" : ""),
    notation: "notation" in entity && entity.notation ? [entity.notation] : [],
    courseCode: searchableCourseCode(course?.code ?? ""),
    courseId,
    outcomeTitles: outcomeIds
      .map((id) => titleOf(corpus.outcomes.get(id)))
      .filter((title): title is string => Boolean(title)),
    sourceTitles: sourceIds
      .map((id) => titleOf(corpus.sources.get(id)))
      .filter((title): title is string => Boolean(title)),
    relationshipTitles: relationshipIds
      .map((id) => titleOf(all.get(id)))
      .filter((title): title is string => Boolean(title)),
    visualKind: isExplainer(entity) ? entity.kind : undefined,
    lectureIds,
    outcomeIds,
    url: entityUrl(entity),
    confidence: confidenceOf(entity),
    sourceLocator: "locator" in entity ? entity.locator : undefined,
  };
}

export function buildSearchIndex(corpus: Corpus): MiniSearch<SearchDocument> {
  const all = new Map(entities(corpus).map((entity) => [entity.id, entity]));
  const index = new MiniSearch<SearchDocument>({
    fields: [
      "title",
      "aliases",
      "summary",
      "body",
      "notation",
      "courseCode",
      "outcomeTitles",
      "sourceTitles",
      "relationshipTitles",
    ],
    storeFields: [
      "id",
      "entityType",
      "title",
      "summary",
      "url",
      "courseId",
      "visualKind",
      "lectureIds",
      "outcomeIds",
      "sourceLocator",
    ],
    extractField(document, fieldName) {
      const value = document[fieldName as keyof SearchDocument];
      return Array.isArray(value) ? value.join(" ") : String(value ?? "");
    },
  });
  index.addAll(entities(corpus).map((entity) => toDocument(entity, corpus, all)));
  return index;
}

function matchesFilters(entity: StudyEntity, filters: SearchFilters): boolean {
  const type = entity.id.split(":", 1)[0] as SearchEntityType;
  const courseId = "courseId" in entity ? entity.courseId : entity.id;
  if (filters.courseId && courseId !== filters.courseId) return false;
  if (filters.entityTypes && !filters.entityTypes.includes(type)) return false;
  if (
    filters.visualKinds &&
    (!isExplainer(entity) || !filters.visualKinds.includes(entity.kind))
  ) return false;
  if (
    filters.lectureIds &&
    (!("lectureIds" in entity) || !filters.lectureIds.some((id) => entity.lectureIds.includes(id)))
  ) return false;
  if (
    filters.outcomeIds &&
    (!("outcomeIds" in entity) || !filters.outcomeIds.some((id) => entity.outcomeIds.includes(id)))
  ) return false;
  return true;
}

function recencyOf(entity: StudyEntity): string {
  if ("date" in entity && entity.date) return entity.date;
  if ("lastChecked" in entity) return entity.lastChecked;
  return "";
}

export function recentCorpus(
  corpus: Corpus,
  filters: SearchFilters = {},
  limit = 5,
): SearchHit[] {
  const all = new Map(entities(corpus).map((entity) => [entity.id, entity]));
  return entities(corpus)
    .filter((entity) => matchesFilters(entity, filters))
    .sort((a, b) => recencyOf(b).localeCompare(recencyOf(a)))
    .slice(0, limit)
    .map((entity) => {
      const document = toDocument(entity, corpus, all);
      return {
        id: document.id,
        entityType: document.entityType,
        title: document.title,
        summary: document.summary,
        url: document.url,
        score: 0,
        courseId: document.courseId,
        visualKind: document.visualKind,
        sourceLocator: document.sourceLocator,
      };
    });
}

export function searchCorpus(
  index: MiniSearch<SearchDocument>,
  _corpus: Corpus,
  query: string,
  filters: SearchFilters = {},
): SearchHit[] {
  return index
    .search(query, {
      prefix: true,
      fuzzy: query.trim().length >= 4 ? 0.2 : false,
    })
    .filter((result) => {
      if (filters.courseId && result.courseId !== filters.courseId) return false;
      if (filters.entityTypes && !filters.entityTypes.includes(result.entityType)) return false;
      if (
        filters.visualKinds &&
        (!result.visualKind || !filters.visualKinds.includes(result.visualKind))
      ) return false;
      if (
        filters.lectureIds &&
        !filters.lectureIds.some((id) => result.lectureIds?.includes(id))
      ) return false;
      if (
        filters.outcomeIds &&
        !filters.outcomeIds.some((id) => result.outcomeIds?.includes(id))
      ) return false;
      return true;
    })
    .map((result) => ({
      id: result.id,
      entityType: result.entityType,
      title: result.title,
      summary: result.summary,
      url: result.url,
      score: result.score,
      courseId: result.courseId,
      visualKind: result.visualKind || undefined,
      sourceLocator: result.sourceLocator,
    }));
}
