import type { Corpus } from "./repository";
import type { Relationship, StudyEntity } from "./schemas";

export interface CurriculumGraph {
  neighbors(
    id: string,
    type?: Relationship["type"],
    direction?: "out" | "in" | "both",
  ): string[];
  shortestPrerequisitePath(from: string, to: string): string[] | null;
}

export interface ValidationIssue {
  code:
    | "duplicate-id"
    | "dangling-source"
    | "dangling-target"
    | "prerequisite-cycle"
    | "missing-course"
    | "assessment-credit-overflow"
    | "invalid-course-date-range"
    | "duplicate-atlas-order"
    | "missing-past-lecture"
    | "dangling-coursework-reference"
    | "dangling-session-reference"
    | "dangling-assessment-reference";
  entityId?: string;
  message: string;
}

export function validateLectureCoverage(corpus: Corpus, today: string): ValidationIssue[] {
  return [...corpus.sessions.values()]
    .filter((session) =>
      session.kind === "lecture" &&
      session.date !== undefined &&
      session.date < today &&
      session.lectureId === undefined
    )
    .map((session) => ({
      code: "missing-past-lecture" as const,
      entityId: session.id,
      message: `${session.id} happened on ${session.date} but has no lecture record; add lectureId or correct the session kind`,
    }));
}

function allEntities(corpus: Corpus): Map<string, StudyEntity> {
  return new Map(
    [
      ...corpus.courses,
      ...corpus.assessments,
      ...corpus.sessions,
      ...corpus.coursework,
      ...corpus.outcomes,
      ...corpus.lectures,
      ...corpus.concepts,
      ...corpus.definitions,
      ...corpus.explainers,
      ...corpus.examples,
      ...corpus.questions,
      ...corpus.sources,
    ].map(([id, entity]) => [id, entity]),
  );
}

export function buildGraph(corpus: Corpus): CurriculumGraph {
  const outgoing = new Map<string, Relationship[]>();
  const incoming = new Map<string, Relationship[]>();

  for (const relationship of corpus.relationships) {
    outgoing.set(relationship.from, [
      ...(outgoing.get(relationship.from) ?? []),
      relationship,
    ]);
    incoming.set(relationship.to, [
      ...(incoming.get(relationship.to) ?? []),
      relationship,
    ]);
  }

  function related(
    id: string,
    type: Relationship["type"] | undefined,
    direction: "out" | "in" | "both",
  ): string[] {
    const ids: string[] = [];
    if (direction === "out" || direction === "both") {
      ids.push(
        ...(outgoing.get(id) ?? [])
          .filter((edge) => !type || edge.type === type)
          .map((edge) => edge.to),
      );
    }
    if (direction === "in" || direction === "both") {
      ids.push(
        ...(incoming.get(id) ?? [])
          .filter((edge) => !type || edge.type === type)
          .map((edge) => edge.from),
      );
    }
    return [...new Set(ids)];
  }

  return {
    neighbors(id, type, direction = "out") {
      return related(id, type, direction);
    },
    shortestPrerequisitePath(from, to) {
      const queue: string[][] = [[from]];
      const visited = new Set([from]);
      while (queue.length > 0) {
        const path = queue.shift()!;
        const current = path.at(-1)!;
        if (current === to) return path;
        for (const next of related(current, "requires", "out")) {
          if (!visited.has(next)) {
            visited.add(next);
            queue.push([...path, next]);
          }
        }
      }
      return null;
    },
  };
}

export function validateCorpus(corpus: Corpus): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const entities = allEntities(corpus);

  for (const relationship of corpus.relationships) {
    if (!entities.has(relationship.from)) {
      issues.push({
        code: "dangling-source",
        entityId: relationship.from,
        message: `Relationship source does not exist: ${relationship.from}`,
      });
    }
    if (!entities.has(relationship.to)) {
      issues.push({
        code: "dangling-target",
        entityId: relationship.to,
        message: `Relationship target does not exist: ${relationship.to}`,
      });
    }
  }

  for (const [id, entity] of entities) {
    if ("courseId" in entity && !corpus.courses.has(entity.courseId)) {
      issues.push({
        code: "missing-course",
        entityId: id,
        message: `${id} belongs to missing course ${entity.courseId}`,
      });
    }
    if ("sourceIds" in entity) {
      for (const sourceId of entity.sourceIds) {
        const source = corpus.sources.get(sourceId);
        if (!source || ("courseId" in entity && source.courseId !== entity.courseId)) {
          issues.push({
            code: "dangling-source",
            entityId: id,
            message: `${id} references missing or cross-course source ${sourceId}`,
          });
        }
      }
    }
  }

  const atlasNumbers = new Map<number, string>();
  for (const explainer of corpus.explainers.values()) {
    const existing = atlasNumbers.get(explainer.atlasOrder);
    if (existing) {
      issues.push({
        code: "duplicate-atlas-order",
        entityId: explainer.id,
        message: `${explainer.id} and ${existing} both use Fig. ${String(explainer.atlasOrder).padStart(2, "0")}`,
      });
    } else {
      atlasNumbers.set(explainer.atlasOrder, explainer.id);
    }
  }

  for (const course of corpus.courses.values()) {
    if (course.startDate && course.endDate && course.startDate > course.endDate) {
      issues.push({
        code: "invalid-course-date-range",
        entityId: course.id,
        message: `${course.id} starts after it ends`,
      });
    }
    for (const link of course.links) {
      if (link.sourceId && corpus.sources.get(link.sourceId)?.courseId !== course.id) {
        issues.push({
          code: "dangling-source",
          entityId: course.id,
          message: `${course.id} link references missing or cross-course source ${link.sourceId}`,
        });
      }
    }
    const assessmentCredits = [...corpus.assessments.values()]
      .filter((assessment) => assessment.courseId === course.id)
      .reduce((total, assessment) => total + assessment.credits, 0);
    if (assessmentCredits > course.credits) {
      issues.push({
        code: "assessment-credit-overflow",
        entityId: course.id,
        message: `${course.id} allocates ${assessmentCredits} assessment credits for a ${course.credits}-credit course`,
      });
    }
  }

  function sameCourseReference(
    ownerId: string,
    courseId: string,
    targetId: string,
    target: { courseId: string } | undefined,
    code: ValidationIssue["code"],
  ) {
    if (!target || target.courseId !== courseId) {
      issues.push({
        code,
        entityId: ownerId,
        message: `${ownerId} references missing or cross-course entity ${targetId}`,
      });
    }
  }

  for (const session of corpus.sessions.values()) {
    for (const courseworkId of session.courseworkIds) {
      sameCourseReference(
        session.id,
        session.courseId,
        courseworkId,
        corpus.coursework.get(courseworkId),
        "dangling-coursework-reference",
      );
    }
    if (session.lectureId) {
      sameCourseReference(
        session.id,
        session.courseId,
        session.lectureId,
        corpus.lectures.get(session.lectureId),
        "dangling-target",
      );
    }
  }

  for (const item of corpus.coursework.values()) {
    for (const sessionId of item.sessionIds) {
      sameCourseReference(
        item.id,
        item.courseId,
        sessionId,
        corpus.sessions.get(sessionId),
        "dangling-session-reference",
      );
    }
    for (const lectureId of item.lectureIds) {
      sameCourseReference(item.id, item.courseId, lectureId, corpus.lectures.get(lectureId), "dangling-target");
    }
    for (const conceptId of item.conceptIds) {
      sameCourseReference(item.id, item.courseId, conceptId, corpus.concepts.get(conceptId), "dangling-target");
    }
    for (const assessmentId of item.assessmentIds) {
      sameCourseReference(
        item.id,
        item.courseId,
        assessmentId,
        corpus.assessments.get(assessmentId),
        "dangling-assessment-reference",
      );
    }
  }

  for (const assessment of corpus.assessments.values()) {
    for (const outcomeId of assessment.outcomeIds) {
      sameCourseReference(assessment.id, assessment.courseId, outcomeId, corpus.outcomes.get(outcomeId), "dangling-target");
    }
    for (const conceptId of assessment.conceptIds) {
      sameCourseReference(assessment.id, assessment.courseId, conceptId, corpus.concepts.get(conceptId), "dangling-target");
    }
  }

  const prerequisiteGraph = new Map<string, string[]>();
  for (const edge of corpus.relationships) {
    if (edge.type === "requires" && entities.has(edge.from) && entities.has(edge.to)) {
      prerequisiteGraph.set(edge.from, [
        ...(prerequisiteGraph.get(edge.from) ?? []),
        edge.to,
      ]);
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  let cycleReported = false;
  function visit(id: string): boolean {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const next of prerequisiteGraph.get(id) ?? []) {
      if (visit(next)) return true;
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  }

  for (const id of prerequisiteGraph.keys()) {
    if (visit(id)) {
      cycleReported = true;
      break;
    }
  }
  if (cycleReported) {
    issues.push({
      code: "prerequisite-cycle",
      message: "The requires relationships contain a prerequisite cycle.",
    });
  }

  return issues;
}
