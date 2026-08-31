import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { EntityIdSchema } from "../domain";

export const FeedbackSchema = z.object({
  entityId: EntityIdSchema,
  action: z.enum(["unclear", "ask_codex", "revisit_later"]),
});

export type Feedback = z.infer<typeof FeedbackSchema>;

export async function appendFeedback(
  root: string,
  feedback: Feedback,
): Promise<{ entityId: string; action: Feedback["action"]; createdAt: string }> {
  const event = { ...feedback, createdAt: new Date().toISOString() };
  const notesDirectory = path.join(root, "notes");
  await fs.mkdir(notesDirectory, { recursive: true });
  const handle = await fs.open(
    path.join(notesDirectory, "study-feedback.jsonl"),
    "a",
  );
  try {
    await handle.appendFile(`${JSON.stringify(event)}\n`, "utf8");
  } finally {
    await handle.close();
  }
  return event;
}
