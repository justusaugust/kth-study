import { z } from "zod";
import {
  AssessmentSchema,
  ConceptSchema,
  CourseSessionSchema,
  CourseSchema,
  CourseworkSchema,
  CurriculumOutcomeSchema,
  DefinitionSchema,
  ExampleSchema,
  ExplainerSpecSchema,
  LectureSchema,
  QuestionSchema,
  SourceSchema,
} from "./schemas";

export const SearchHitSchema = z.object({
  id: z.string(),
  entityType: z.enum([
    "course",
    "outcome",
    "lecture",
    "concept",
    "definition",
    "explainer",
    "example",
    "question",
    "source",
  ]),
  title: z.string(),
  summary: z.string(),
  url: z.string(),
  score: z.number(),
  courseId: z.string(),
  visualKind: z.enum(["function-plot", "number-line", "coordinate-plane", "systems-diagram", "conic-section"]).optional(),
  sourceLocator: z.string().optional(),
});

export const SearchResponseSchema = z.object({
  query: z.string(),
  results: z.array(SearchHitSchema),
});

export const PublicSourceSchema = SourceSchema.omit({
  originalPath: true,
  extractedTextPath: true,
  extractedText: true,
});

export const PublicQuestionSchema = QuestionSchema.omit({ answer: true });

export const CourseJourneyItemSchema = z.object({
  entityId: z.string(),
  entityType: z.enum(["session", "coursework", "assessment"]),
  kind: z.string(),
  title: z.string(),
  url: z.string(),
  date: z.string().date().optional(),
  week: z.number().int().optional(),
  sequence: z.number(),
});

export const CourseJourneyGroupSchema = z.object({
  key: z.string(),
  label: z.string(),
  week: z.number().int().optional(),
  items: z.array(CourseJourneyItemSchema),
});

export const CourseResponseSchema = z.object({
  course: CourseSchema,
  outcomes: z.array(CurriculumOutcomeSchema),
  lectures: z.array(LectureSchema),
  concepts: z.array(ConceptSchema),
  explainers: z.array(ExplainerSpecSchema),
  definitions: z.array(DefinitionSchema).default([]),
  examples: z.array(ExampleSchema).default([]),
  questions: z.array(QuestionSchema).default([]),
  assessments: z.array(AssessmentSchema),
  sessions: z.array(CourseSessionSchema),
  coursework: z.array(CourseworkSchema),
  journey: z.array(CourseJourneyGroupSchema),
  sources: z.array(PublicSourceSchema),
});

export const ConceptResponseSchema = z.object({
  concept: ConceptSchema,
  course: CourseSchema,
  outcomes: z.array(CurriculumOutcomeSchema),
  lectures: z.array(LectureSchema),
  explainers: z.array(ExplainerSpecSchema),
  definitions: z.array(DefinitionSchema).default([]),
  prerequisites: z.array(z.string()),
  nextConcepts: z.array(z.string()),
  sources: z.array(PublicSourceSchema),
  examples: z.array(ExampleSchema),
  questions: z.array(QuestionSchema),
});

export const ExplainerResponseSchema = z.object({
  explainer: ExplainerSpecSchema,
  course: CourseSchema,
  concepts: z.array(ConceptSchema),
  sources: z.array(PublicSourceSchema),
});

export const VisualAtlasItemSchema = z.object({
  figureNumber: z.number().int().positive(),
  courseCode: z.string().regex(/^[A-Z]{2}\d{4}$/),
  courseTitle: z.string().min(1),
  explainer: ExplainerSpecSchema,
});

export const VisualAtlasResponseSchema = z.object({
  items: z.array(VisualAtlasItemSchema),
});

export const DeadlinesResponseSchema = z.object({
  courses: z.array(CourseSchema),
  assessments: z.array(AssessmentSchema),
  coursework: z.array(CourseworkSchema),
});

export const FeedbackResponseSchema = z.object({
  feedback: z.object({
    entityId: z.string(),
    action: z.enum(["unclear", "ask_codex", "revisit_later"]),
    createdAt: z.string().datetime(),
  }),
});

export const StudyStatusSchema = z.enum(["clear", "unclear", "revisit_later"]);
export const StudyStateResponseSchema = z.object({
  entityId: z.string(),
  status: StudyStatusSchema,
  lastEventId: z.string().uuid().optional(),
});
export const StudyMutationResponseSchema = z.object({
  previous: StudyStatusSchema,
  current: StudyStatusSchema,
  eventId: z.string().uuid(),
});
export const PendingAskSchema = z.object({
  id: z.string().uuid(),
  kind: z.literal("created"),
  entityId: z.string(),
  question: z.string(),
  sourceUrl: z.string(),
  createdAt: z.string().datetime(),
  status: z.literal("pending"),
});
export const PendingAsksResponseSchema = z.object({ asks: z.array(PendingAskSchema) });
export const PendingAskResponseSchema = z.object({ ask: PendingAskSchema });

export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type CourseResponse = z.infer<typeof CourseResponseSchema>;
export type ConceptResponse = z.infer<typeof ConceptResponseSchema>;
export type ExplainerResponse = z.infer<typeof ExplainerResponseSchema>;
export type VisualAtlasResponse = z.infer<typeof VisualAtlasResponseSchema>;
export type DeadlinesResponse = z.infer<typeof DeadlinesResponseSchema>;
export type StudyStatus = z.infer<typeof StudyStatusSchema>;
export type StudyStateResponse = z.infer<typeof StudyStateResponseSchema>;
export type StudyMutationResponse = z.infer<typeof StudyMutationResponseSchema>;
export type PendingAsk = z.infer<typeof PendingAskSchema>;
