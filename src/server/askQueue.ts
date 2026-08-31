import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { EntityIdSchema } from "../domain";

const AskEventSchema = z.discriminatedUnion("kind", [
  z.object({ id: z.string().uuid(), kind: z.literal("created"), entityId: EntityIdSchema, question: z.string().trim().min(1), sourceUrl: z.string().min(1), createdAt: z.string().datetime() }),
  z.object({ id: z.string().uuid(), kind: z.enum(["cancelled", "resolved"]), askId: z.string().uuid(), createdAt: z.string().datetime() }),
]);
type AskEvent = z.infer<typeof AskEventSchema>;

async function events(root: string): Promise<AskEvent[]> {
  try {
    const text = await fs.readFile(path.join(root, "notes/study-asks.jsonl"), "utf8");
    return text.split("\n").filter(Boolean).map((line) => AskEventSchema.parse(JSON.parse(line)));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function append(root: string, event: AskEvent) {
  await fs.mkdir(path.join(root, "notes"), { recursive: true });
  await fs.appendFile(path.join(root, "notes/study-asks.jsonl"), `${JSON.stringify(event)}\n`, "utf8");
}

export async function listPendingAsks(root: string, entityId?: string) {
  const log = await events(root);
  const terminal = new Map(log.filter((event) => event.kind !== "created").map((event) => [event.askId, event.kind]));
  return log.filter((event): event is Extract<AskEvent, { kind: "created" }> => event.kind === "created")
    .filter((event) => !terminal.has(event.id) && (!entityId || event.entityId === entityId))
    .map((event) => ({ ...event, status: "pending" as const }));
}

export async function createAsk(root: string, input: { entityId: string; question: string; sourceUrl: string }) {
  const event = AskEventSchema.parse({ id: randomUUID(), kind: "created", ...input, createdAt: new Date().toISOString() });
  await append(root, event);
  return { ...event, status: "pending" as const };
}

async function finish(root: string, askId: string, kind: "cancelled" | "resolved") {
  const pending = await listPendingAsks(root);
  if (!pending.some((ask) => ask.id === askId)) throw new Error("Pending ask not found.");
  const event = AskEventSchema.parse({ id: randomUUID(), kind, askId, createdAt: new Date().toISOString() });
  await append(root, event);
  return { askId, status: kind };
}

export const cancelAsk = (root: string, askId: string) => finish(root, askId, "cancelled");
export const resolveAsk = (root: string, askId: string) => finish(root, askId, "resolved");
