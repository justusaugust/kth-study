import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getStudyState, setStudyStatus, undoStudyStatus } from "./studyState";

describe("study state", () => {
  it("persists one current status and can undo the latest change", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "kth-study-state-"));
    const entityId = "concept:sf1690:absolute-value";

    await expect(getStudyState(root, entityId)).resolves.toMatchObject({ status: "clear" });
    const unclear = await setStudyStatus(root, entityId, "unclear");
    expect(unclear).toMatchObject({ previous: "clear", current: "unclear" });
    const revisit = await setStudyStatus(root, entityId, "revisit_later");
    expect(revisit).toMatchObject({ previous: "unclear", current: "revisit_later" });
    await expect(getStudyState(root, entityId)).resolves.toMatchObject({ status: "revisit_later" });

    await expect(undoStudyStatus(root, entityId, revisit.eventId)).resolves.toMatchObject({
      previous: "revisit_later",
      current: "unclear",
    });
    await expect(getStudyState(root, entityId)).resolves.toMatchObject({ status: "unclear" });
    await expect(undoStudyStatus(root, entityId, revisit.eventId)).rejects.toThrow("already undone");
  });

  it("selecting the active status clears it", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "kth-study-toggle-"));
    const entityId = "concept:sf1690:real-numbers-and-lines";
    await setStudyStatus(root, entityId, "revisit_later");
    await expect(setStudyStatus(root, entityId, "revisit_later")).resolves.toMatchObject({
      previous: "revisit_later",
      current: "clear",
    });
  });
});
