import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { EntityIdSchema } from "../domain";

export const StudyStatusSchema = z.enum(["clear", "unclear", "revisit_later"]);
export type StudyStatus = z.infer<typeof StudyStatusSchema>;

const StudyStatusEventSchema = z.object({
  id: z.string().uuid(),
  kind: z.literal("study_status"),
  entityId: EntityIdSchema,
  previous: StudyStatusSchema,
  current: StudyStatusSchema,
  createdAt: z.string().datetime(),
  undoOf: z.string().uuid().optional(),
});

type StudyStatusEvent = z.infer<typeof StudyStatusEventSchema>;

async function readEvents(root: string): Promise<StudyStatusEvent[]> {
  try {
    const text = await fs.readFile(path.join(root, "notes/study-feedback.jsonl"), "utf8");
    return text.split("\n").filter(Boolean).flatMap((line) => {
      try {
        const parsed = StudyStatusEventSchema.safeParse(JSON.parse(line));
        return parsed.success ? [parsed.data] : [];
      } catch {
        return [];
      }
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function appendEvent(root: string, event: StudyStatusEvent) {
  const directory = path.join(root, "notes");
  await fs.mkdir(directory, { recursive: true });
  await fs.appendFile(path.join(directory, "study-feedback.jsonl"), `${JSON.stringify(event)}\n`, "utf8");
}

export async function getStudyState(root: string, entityId: string) {
  const events = (await readEvents(root)).filter((event) => event.entityId === entityId);
  return {
    entityId,
    status: events.at(-1)?.current ?? "clear" as StudyStatus,
    lastEventId: events.at(-1)?.id,
  };
}

export async function setStudyStatus(root: string, entityId: string, requested: StudyStatus) {
  const state = await getStudyState(root, entityId);
  const current = requested !== "clear" && requested === state.status ? "clear" : requested;
  const event = StudyStatusEventSchema.parse({
    id: randomUUID(),
    kind: "study_status",
    entityId,
    previous: state.status,
    current,
    createdAt: new Date().toISOString(),
  });
  await appendEvent(root, event);
  return { previous: event.previous, current: event.current, eventId: event.id };
}

export async function undoStudyStatus(root: string, entityId: string, eventId: string) {
  const events = await readEvents(root);
  const target = events.find((event) => event.id === eventId && event.entityId === entityId);
  if (!target) throw new Error("Study-state event not found.");
  if (events.some((event) => event.undoOf === eventId)) throw new Error("Study-state event already undone.");
  const state = await getStudyState(root, entityId);
  if (state.lastEventId !== eventId) throw new Error("Only the latest study-state change can be undone.");
  const event = StudyStatusEventSchema.parse({
    id: randomUUID(),
    kind: "study_status",
    entityId,
    previous: state.status,
    current: target.previous,
    createdAt: new Date().toISOString(),
    undoOf: eventId,
  });
  await appendEvent(root, event);
  return { previous: event.previous, current: event.current, eventId: event.id };
}
