import type { SearchResponse } from "../domain/api";

export type SearchHit = SearchResponse["results"][number];
export type UserSearchType =
  | "course"
  | "lecture"
  | "concept"
  | "definition"
  | "example"
  | "question"
  | "explainer";

export const SEARCH_FILTERS: ReadonlyArray<{
  label: string;
  type: UserSearchType | null;
}> = [
  { label: "All", type: null },
  { label: "Courses", type: "course" },
  { label: "Lectures", type: "lecture" },
  { label: "Concepts", type: "concept" },
  { label: "Definitions", type: "definition" },
  { label: "Worked examples", type: "example" },
  { label: "Questions", type: "question" },
  { label: "Visuals", type: "explainer" },
];

const USER_SEARCH_TYPES = new Set<UserSearchType>(
  SEARCH_FILTERS.flatMap(({ type }) => (type ? [type] : [])),
);

export function isUserSearchType(value: string | null): value is UserSearchType {
  return value !== null && USER_SEARCH_TYPES.has(value as UserSearchType);
}

export function userFacingResults(
  results: SearchHit[],
  activeType: UserSearchType | null,
): SearchHit[] {
  return results.filter(
    (hit) =>
      isUserSearchType(hit.entityType) &&
      (activeType === null || hit.entityType === activeType),
  );
}

export function searchTypeLabel(type: SearchHit["entityType"]): string {
  switch (type) {
    case "course": return "Course";
    case "lecture": return "Lecture";
    case "concept": return "Concept";
    case "definition": return "Definition";
    case "example": return "Worked example";
    case "question": return "Question";
    case "explainer": return "Visual";
    default: return type;
  }
}

export function searchPageUrl(query: string, type: UserSearchType | null): string {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (type) params.set("type", type);
  const serialized = params.toString();
  return serialized ? `/search?${serialized}` : "/search";
}

export function visualAtlasUrl(query = ""): string {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  const serialized = params.toString();
  return serialized ? `/visuals?${serialized}` : "/visuals";
}
