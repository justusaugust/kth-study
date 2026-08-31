import type { ZodType } from "zod";
import {
  ConceptResponseSchema,
  CourseResponseSchema,
  ExplainerResponseSchema,
  FeedbackResponseSchema,
  StudyMutationResponseSchema,
  StudyStateResponseSchema,
  PendingAskSchema,
  PendingAskResponseSchema,
  PendingAsksResponseSchema,
  SearchResponseSchema,
  VisualAtlasResponseSchema,
  type ConceptResponse,
  type CourseResponse,
  type ExplainerResponse,
  type SearchResponse,
  type VisualAtlasResponse,
  type StudyStatus,
  type StudyMutationResponse,
  type StudyStateResponse,
  type PendingAsk,
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

export function postFeedback(
  entityId: string,
  action: "unclear" | "ask_codex" | "revisit_later",
) {
  return request(FeedbackResponseSchema, "/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entityId, action }),
  });
}

export function getStudyState(entityId: string): Promise<StudyStateResponse> {
  return request(StudyStateResponseSchema, `/api/study-state/${encodeURIComponent(entityId)}`);
}

export function setStudyStatus(entityId: string, status: StudyStatus): Promise<StudyMutationResponse> {
  return request(StudyMutationResponseSchema, `/api/study-state/${encodeURIComponent(entityId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export function undoStudyStatus(entityId: string, eventId: string): Promise<StudyMutationResponse> {
  return request(StudyMutationResponseSchema, `/api/study-state/${encodeURIComponent(entityId)}/undo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId }),
  });
}

export async function getPendingAsks(entityId: string): Promise<PendingAsk[]> {
  const response = await request(PendingAsksResponseSchema, `/api/asks?entityId=${encodeURIComponent(entityId)}`);
  return response.asks;
}

export async function createPendingAsk(entityId: string, question: string, sourceUrl: string): Promise<PendingAsk> {
  const response = await request(PendingAskResponseSchema, "/api/asks", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ entityId, question, sourceUrl }),
  });
  return response.ask;
}

export async function cancelPendingAsk(askId: string): Promise<void> {
  const response = await fetch(`/api/asks/${encodeURIComponent(askId)}/cancel`, { method: "POST" });
  if (!response.ok) throw new ApiUnavailableError("Could not cancel the pending question.");
}
