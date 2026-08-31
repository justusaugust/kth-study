import type { StudyEntity } from "./schemas";

export function entityType(id: string): string {
  return id.slice(0, id.indexOf(":"));
}

export function courseCodeFromId(id: string): string {
  const [, code] = id.split(":");
  if (!code) {
    throw new Error(`Entity ID does not contain a course code: ${id}`);
  }
  return code;
}

export function entityUrl(entity: StudyEntity): string {
  const type = entityType(entity.id);

  if (type === "course" && "code" in entity) {
    return `/courses/${entity.code.toLowerCase()}`;
  }
  if (type === "concept" && "slug" in entity && "courseId" in entity) {
    return `/courses/${courseCodeFromId(entity.courseId)}/concepts/${entity.slug}`;
  }
  if (type === "explainer" && "slug" in entity) {
    return `/visuals/${entity.slug}`;
  }
  if (type === "definition" && "slug" in entity && "courseId" in entity && "conceptIds" in entity) {
    const conceptSlug = entity.conceptIds[0]?.split(":").at(-1) ?? "";
    return `/courses/${courseCodeFromId(entity.courseId)}/concepts/${conceptSlug}#definition-${entity.slug}`;
  }
  if (type === "lecture" && "slug" in entity && "courseId" in entity) {
    return `/courses/${courseCodeFromId(entity.courseId)}/lectures/${entity.slug}`;
  }
  if (type === "assessment" && "slug" in entity && "courseId" in entity) {
    return `/courses/${courseCodeFromId(entity.courseId)}#assessment-${entity.slug}`;
  }
  if (type === "session" && "slug" in entity && "courseId" in entity) {
    return `/courses/${courseCodeFromId(entity.courseId)}#session-${entity.slug}`;
  }
  if (type === "coursework" && "slug" in entity && "courseId" in entity) {
    return `/courses/${courseCodeFromId(entity.courseId)}#coursework-${entity.slug}`;
  }
  if ((type === "example" || type === "question") && "slug" in entity && "courseId" in entity && "conceptIds" in entity) {
    const conceptSlug = entity.conceptIds[0]?.split(":").at(-1) ?? "";
    return `/courses/${courseCodeFromId(entity.courseId)}/concepts/${conceptSlug}#${type}-${entity.slug}`;
  }

  return `/entities/${encodeURIComponent(entity.id)}`;
}
