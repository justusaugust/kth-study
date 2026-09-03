import { z } from "zod";

export const EntityIdSchema = z
  .string()
  .regex(
    /^(course|outcome|lecture|concept|definition|explainer|example|question|source|assessment|session|coursework):[a-z0-9:-]+$/,
  );

export const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const ConfidenceSchema = z.enum([
  "verified",
  "supported",
  "inferred",
  "fixture",
]);
export const LastCheckedSchema = z.preprocess(
  (value) =>
    value instanceof Date ? value.toISOString().slice(0, 10) : value,
  z.string().date(),
);

export const RelationshipSchema = z.object({
  type: z.enum([
    "requires",
    "teaches",
    "visualises",
    "appears_in",
    "assesses",
    "continues_to",
    "supports",
    "prepares_for",
  ]),
  from: EntityIdSchema,
  to: EntityIdSchema,
});

const TraceabilitySchema = z.object({
  sourceIds: z.array(EntityIdSchema).default([]),
  lastChecked: LastCheckedSchema,
  confidence: ConfidenceSchema,
});

const RelationalSchema = z.object({
  relationships: z.array(RelationshipSchema).default([]),
});

const CourseLinkSchema = z.object({
  kind: z.enum(["kth", "canvas", "course-memo", "schedule"]),
  label: z.string().min(1),
  url: z.string().url(),
  sourceId: EntityIdSchema.optional(),
});

export const CourseSchema = z
  .object({
    id: EntityIdSchema,
    code: z.string().regex(/^[A-Z]{2}\d{4}$/),
    slug: SlugSchema,
    title: z.string().min(1),
    academicYear: z.string().min(1),
    period: z.string().min(1),
    summary: z.string().min(1),
    credits: z.number().positive(),
    language: z.string().min(1).optional(),
    startDate: z.string().date().optional(),
    endDate: z.string().date().optional(),
    links: z.array(CourseLinkSchema).default([]),
    outcomeIds: z.array(EntityIdSchema).default([]),
    conceptIds: z.array(EntityIdSchema).default([]),
  })
  .extend(TraceabilitySchema.shape)
  .extend(RelationalSchema.shape);

export const CurriculumOutcomeSchema = z
  .object({
    id: EntityIdSchema,
    courseId: EntityIdSchema,
    slug: SlugSchema,
    title: z.string().min(1),
    description: z.string().min(1),
  })
  .extend(TraceabilitySchema.shape)
  .extend(RelationalSchema.shape);

export const LectureSchema = z
  .object({
    id: EntityIdSchema,
    courseId: EntityIdSchema,
    slug: SlugSchema,
    title: z.string().min(1),
    date: z.string().date(),
    summary: z.string().min(1),
    conceptIds: z.array(EntityIdSchema).default([]),
    sessionId: EntityIdSchema.optional(),
    body: z.string().default(""),
  })
  .extend(TraceabilitySchema.shape)
  .extend(RelationalSchema.shape);

export const ConceptSchema = z
  .object({
    id: EntityIdSchema,
    courseId: EntityIdSchema,
    slug: SlugSchema,
    title: z.string().min(1),
    summary: z.string().min(1),
    centralInsight: z.string().min(1).optional(),
    commonMistake: z.string().min(1).optional(),
    verifyPrompt: z.string().min(1).optional(),
    outcomeIds: z.array(EntityIdSchema),
    lectureIds: z.array(EntityIdSchema),
    evidenceStatus: z.enum(["curriculum", "supplemental", "lecture"]).optional(),
    body: z.string(),
  })
  .extend(TraceabilitySchema.shape)
  .extend(RelationalSchema.shape);

export const DefinitionSchema = z
  .object({
    id: EntityIdSchema,
    courseId: EntityIdSchema,
    slug: SlugSchema,
    term: z.string().min(1),
    statement: z.string().min(1),
    notation: z.string().min(1).optional(),
    interpretation: z.string().min(1).optional(),
    conceptIds: z.array(EntityIdSchema).min(1),
  })
  .extend(TraceabilitySchema.shape)
  .extend(RelationalSchema.shape)
  .transform((definition) => ({ ...definition, title: definition.term }));

const ContentItemShape = {
  id: EntityIdSchema,
  courseId: EntityIdSchema,
  slug: SlugSchema,
  title: z.string().min(1),
  conceptIds: z.array(EntityIdSchema).default([]),
  body: z.string().default(""),
};

export const ExampleSchema = z
  .object(ContentItemShape)
  .extend(TraceabilitySchema.shape)
  .extend(RelationalSchema.shape);

export const QuestionSchema = z
  .object({
    ...ContentItemShape,
    answer: z.string().optional(),
  })
  .extend(TraceabilitySchema.shape)
  .extend(RelationalSchema.shape);

export const SourceSchema = z.object({
  id: EntityIdSchema,
  courseId: EntityIdSchema,
  title: z.string().min(1),
  kind: z.enum([
    "curriculum",
    "course-memo",
    "lecture-material",
    "schedule",
    "canvas",
    "book",
    "fixture",
  ]),
  url: z.string().url().optional(),
  originalPath: z.string().min(1).optional(),
  extractedTextPath: z.string().min(1).optional(),
  extractedText: z.string().optional(),
  locator: z.string().min(1).optional(),
  lastChecked: LastCheckedSchema,
  confidence: ConfidenceSchema,
});

export const AssessmentSchema = z
  .object({
    id: EntityIdSchema,
    courseId: EntityIdSchema,
    slug: SlugSchema,
    code: z.string().min(1),
    title: z.string().min(1),
    kind: z.enum([
      "written-exam",
      "digital-exam",
      "laboratory",
      "project",
      "assignment",
      "other",
    ]),
    credits: z.number().positive(),
    compulsory: z.boolean(),
    date: z.string().date().optional(),
    time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    description: z.string().min(1),
    outcomeIds: z.array(EntityIdSchema).default([]),
    conceptIds: z.array(EntityIdSchema).default([]),
  })
  .extend(TraceabilitySchema.shape)
  .extend(RelationalSchema.shape);

export const CourseSessionSchema = z
  .object({
    id: EntityIdSchema,
    courseId: EntityIdSchema,
    slug: SlugSchema,
    kind: z.enum([
      "lecture",
      "exercise",
      "laboratory",
      "seminar",
      "checkpoint",
      "review",
    ]),
    sequence: z.number().nonnegative(),
    title: z.string().min(1),
    date: z.string().date().optional(),
    time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    location: z.string().min(1).optional(),
    week: z.number().int().min(1).max(53).optional(),
    lectureId: EntityIdSchema.optional(),
    courseworkIds: z.array(EntityIdSchema).default([]),
    agenda: z.array(z.string().min(1)).optional(),
    recap: z.string().min(1).optional(),
  })
  .extend(TraceabilitySchema.shape)
  .extend(RelationalSchema.shape);

const MaterialReferenceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url().optional(),
  section: z.string().min(1).optional(),
  page: z.string().min(1).optional(),
  exercises: z.string().min(1).optional(),
});

export const CourseworkSchema = z
  .object({
    id: EntityIdSchema,
    courseId: EntityIdSchema,
    slug: SlugSchema,
    kind: z.enum([
      "exercise",
      "reading",
      "laboratory",
      "assignment",
      "quiz",
      "mini-exam",
      "review",
    ]),
    sequence: z.number().nonnegative(),
    title: z.string().min(1),
    date: z.string().date().optional(),
    time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    week: z.number().int().min(1).max(53).optional(),
    requirement: z.enum(["required", "recommended", "scheduled", "optional"]),
    description: z.string().min(1),
    materials: z.array(MaterialReferenceSchema).default([]),
    sessionIds: z.array(EntityIdSchema).default([]),
    lectureIds: z.array(EntityIdSchema).default([]),
    conceptIds: z.array(EntityIdSchema).default([]),
    assessmentIds: z.array(EntityIdSchema).default([]),
  })
  .extend(TraceabilitySchema.shape)
  .extend(RelationalSchema.shape);

export const FunctionPlotExplainerSchema = z.object({
  id: EntityIdSchema,
  atlasOrder: z.number().int().positive(),
  kind: z.literal("function-plot"),
  courseId: EntityIdSchema,
  slug: SlugSchema,
  conceptIds: z.array(EntityIdSchema).min(1),
  sessionIds: z.array(EntityIdSchema).optional(),
  title: z.string().min(1),
  caption: z.string().min(1),
  accessibleSummary: z.string().min(1),
  functions: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        family: z.literal("quadratic"),
        coefficients: z.object({
          a: z.number(),
          b: z.number(),
          c: z.number(),
        }),
        color: z.enum(["blue", "amber", "graphite"]),
      }),
    )
    .min(1),
  controls: z.array(
    z.object({
      coefficient: z.enum(["a", "b", "c"]),
      min: z.number(),
      max: z.number(),
      step: z.number().positive(),
    }),
  ),
  sourceIds: z.array(EntityIdSchema),
  evidenceStatus: z.enum(["curriculum", "supplemental", "lecture"]).optional(),
  relationships: z.array(RelationshipSchema).default([]),
  lastChecked: LastCheckedSchema,
  confidence: ConfidenceSchema,
});

const DiagramExplainerBase = {
  id: EntityIdSchema,
  atlasOrder: z.number().int().positive(),
  courseId: EntityIdSchema,
  slug: SlugSchema,
  conceptIds: z.array(EntityIdSchema).min(1),
  sessionIds: z.array(EntityIdSchema).optional(),
  title: z.string().min(1),
  caption: z.string().min(1),
  accessibleSummary: z.string().min(1),
  sourceIds: z.array(EntityIdSchema),
  evidenceStatus: z.enum(["curriculum", "supplemental", "lecture"]).optional(),
  relationships: z.array(RelationshipSchema).default([]),
  lastChecked: LastCheckedSchema,
  confidence: ConfidenceSchema,
};

export const NumberLineExplainerSchema = z.object({
  ...DiagramExplainerBase,
  kind: z.literal("number-line"),
  variant: z.enum(["interval", "absolute-value"]),
});

export const CoordinatePlaneExplainerSchema = z.object({
  ...DiagramExplainerBase,
  kind: z.literal("coordinate-plane"),
  variant: z.enum(["distance-circle", "slope"]),
});

export const SystemsDiagramExplainerSchema = z.object({
  ...DiagramExplainerBase,
  kind: z.literal("systems-diagram"),
  variant: z.enum([
    "binary-place-value",
    "logic-levels",
    "control-structures",
    "variable-binding",
    "twos-complement",
    "fixed-width-adder",
    "logic-gates",
    "cmos-gates",
    "cmos-power",
    "breadboard-wiring",
    "lab-workflow",
    "function-machine",
    "vertical-line-test",
    "function-symmetry",
    "function-arithmetic",
    "function-composition",
    "piecewise-function",
  ]),
});

export const ConicSectionExplainerSchema = z.object({
  ...DiagramExplainerBase,
  kind: z.literal("conic-section"),
  variant: z.enum(["parabola-focus-directrix", "ellipse-distance-sum"]),
});

export const ExplainerSpecSchema = z.discriminatedUnion("kind", [
  FunctionPlotExplainerSchema,
  NumberLineExplainerSchema,
  CoordinatePlaneExplainerSchema,
  SystemsDiagramExplainerSchema,
  ConicSectionExplainerSchema,
]);

export const CurriculumOutcomesFileSchema = z.union([
  z.array(CurriculumOutcomeSchema),
  z.object({ outcomes: z.array(CurriculumOutcomeSchema) }).transform((value) =>
    value.outcomes,
  ),
]);

export const AssessmentsFileSchema = z.union([
  z.array(AssessmentSchema),
  z.object({ assessments: z.array(AssessmentSchema) }).transform((value) =>
    value.assessments,
  ),
]);

export const CourseSessionsFileSchema = z.union([
  z.array(CourseSessionSchema),
  z.object({ sessions: z.array(CourseSessionSchema) }).transform((value) =>
    value.sessions,
  ),
]);

export const CourseworkFileSchema = z.union([
  z.array(CourseworkSchema),
  z.object({ coursework: z.array(CourseworkSchema) }).transform((value) =>
    value.coursework,
  ),
]);

export type EntityId = z.infer<typeof EntityIdSchema>;
export type Relationship = z.infer<typeof RelationshipSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type CurriculumOutcome = z.infer<typeof CurriculumOutcomeSchema>;
export type Lecture = z.infer<typeof LectureSchema>;
export type Concept = z.infer<typeof ConceptSchema>;
export type Definition = z.infer<typeof DefinitionSchema>;
export type ExplainerSpec = z.infer<typeof ExplainerSpecSchema>;
export type FunctionPlotExplainer = z.infer<typeof FunctionPlotExplainerSchema>;
export type NumberLineExplainer = z.infer<typeof NumberLineExplainerSchema>;
export type CoordinatePlaneExplainer = z.infer<typeof CoordinatePlaneExplainerSchema>;
export type SystemsDiagramExplainer = z.infer<typeof SystemsDiagramExplainerSchema>;
export type ConicSectionExplainer = z.infer<typeof ConicSectionExplainerSchema>;
export type Example = z.infer<typeof ExampleSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type Assessment = z.infer<typeof AssessmentSchema>;
export type CourseSession = z.infer<typeof CourseSessionSchema>;
export type Coursework = z.infer<typeof CourseworkSchema>;
export type StudyEntity =
  | Course
  | CurriculumOutcome
  | Lecture
  | Concept
  | Definition
  | ExplainerSpec
  | Example
  | Question
  | Source
  | Assessment
  | CourseSession
  | Coursework;
