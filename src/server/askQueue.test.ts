import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cancelAsk, createAsk, listPendingAsks } from "./askQueue";

describe("Ask Codex queue", () => {
  it("creates and cancels a durable pending question", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "kth-asks-"));
    const ask = await createAsk(root, {
      entityId: "concept:sf1690:absolute-value",
      question: "Why does the inequality reverse?",
      sourceUrl: "/courses/sf1690/concepts/absolute-value",
    });
    await expect(listPendingAsks(root)).resolves.toMatchObject([{ id: ask.id, status: "pending" }]);
    await cancelAsk(root, ask.id);
    await expect(listPendingAsks(root)).resolves.toEqual([]);
  });
});
