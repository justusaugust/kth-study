import type { ZodType } from "zod";
import {
  ConceptResponseSchema,
  CourseResponseSchema,
  DeadlinesResponseSchema,
  ExplainerResponseSchema,
  SearchResponseSchema,
  VisualAtlasResponseSchema,
  type ConceptResponse,
  type CourseResponse,
  type DeadlinesResponse,
  type ExplainerResponse,
  type SearchResponse,
  type VisualAtlasResponse,
} from "../domain/api";

export class ApiUnavailableError extends Error {}
export class MissingEntityError extends Error {}
export class InvalidContentError extends Error {}

async function request<T>(
  schema: ZodType<T>,
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(endpoint, init);
  } catch (error) {
    throw new ApiUnavailableError(`Study API unavailable: ${String(error)}`);
  }
  if (response.status === 404) {
    throw new MissingEntityError("The requested study item was not found.");
  }
  if (!response.ok) {
    throw new ApiUnavailableError(`Study API returned ${response.status}.`);
  }
  const parsed = schema.safeParse(await response.json());
  if (!parsed.success) {
    throw new InvalidContentError("The Study API returned invalid content.");
  }
  return parsed.data;
}

export function search(params: URLSearchParams): Promise<SearchResponse> {
  return request(SearchResponseSchema, `/api/search?${params.toString()}`);
}

export function getVisualAtlas(): Promise<VisualAtlasResponse> {
  return request(VisualAtlasResponseSchema, "/api/visuals");
}

export function getDeadlines(): Promise<DeadlinesResponse> {
  return request(DeadlinesResponseSchema, "/api/deadlines");
}

export function getCourse(courseCode: string): Promise<CourseResponse> {
  return request(CourseResponseSchema, `/api/courses/${courseCode}`);
}

export function getConcept(
  courseCode: string,
  conceptSlug: string,
): Promise<ConceptResponse> {
  return request(
    ConceptResponseSchema,
    `/api/concepts/${encodeURIComponent(`concept:${courseCode.toLowerCase()}:${conceptSlug}`)}`,
  );
}

export function getExplainer(visualSlug: string): Promise<ExplainerResponse> {
  return request(
    ExplainerResponseSchema,
    `/api/explainers/${encodeURIComponent(visualSlug)}`,
  );
}
