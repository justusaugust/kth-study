import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cancelPendingAsk,
  createPendingAsk,
  getPendingAsks,
  getStudyState,
  setStudyStatus,
  undoStudyStatus,
} from "../api";
import { StudyActions } from "./StudyActions";

vi.mock("../api", () => ({
  cancelPendingAsk: vi.fn(),
  createPendingAsk: vi.fn(),
  getPendingAsks: vi.fn(),
  getStudyState: vi.fn(),
  setStudyStatus: vi.fn(),
  undoStudyStatus: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("StudyActions", () => {
  it("marks, undoes, queues, and cancels without losing the current state", async () => {
    vi.mocked(getStudyState).mockResolvedValue({
      entityId: "concept:sf1690:absolute-value",
      status: "clear",
    });
    vi.mocked(getPendingAsks).mockResolvedValue([]);
    vi.mocked(setStudyStatus).mockResolvedValue({
      previous: "clear",
      current: "unclear",
      eventId: "53bc1137-0362-4274-9826-b35ef2723e50",
    });
    vi.mocked(undoStudyStatus).mockResolvedValue({
      previous: "unclear",
      current: "clear",
      eventId: "2b80cc31-d3b2-4079-ae58-f0c934cb40c1",
    });
    vi.mocked(createPendingAsk).mockResolvedValue({
      id: "9db66302-6b7a-4b2e-96a2-b29887ad4d2d",
      kind: "created",
      entityId: "concept:sf1690:absolute-value",
      question: "Why does the sign change?",
      sourceUrl: "/courses/sf1690/concepts/absolute-value",
      createdAt: "2026-08-30T12:00:00.000Z",
      status: "pending",
    });
    vi.mocked(cancelPendingAsk).mockResolvedValue();

    render(
      <StudyActions
        entityId="concept:sf1690:absolute-value"
        sourceUrl="/courses/sf1690/concepts/absolute-value"
      />,
    );

    const unclear = screen.getByRole("button", { name: "Unclear" });
    fireEvent.click(unclear);
    expect(await screen.findByText("Marked as unclear.")).toBeVisible();
    expect(unclear).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(await screen.findByText("Previous study mark restored.")).toBeVisible();
    expect(unclear).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(screen.getByRole("button", { name: "Ask Codex" }));
    fireEvent.change(screen.getByRole("textbox", { name: "What should Codex explain?" }), {
      target: { value: "Why does the sign change?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Queue question" }));
    expect(await screen.findByText("Question queued for Codex.")).toBeVisible();
    expect(screen.getByText("Why does the sign change?")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Cancel question" }));
    expect(await screen.findByText("Pending question cancelled.")).toBeVisible();
    expect(screen.queryByText("Why does the sign change?")).not.toBeInTheDocument();
  });

  it("keeps a queued question visible and explains when cancellation fails", async () => {
    vi.mocked(getStudyState).mockResolvedValue({
      entityId: "concept:sf1690:absolute-value",
      status: "clear",
    });
    vi.mocked(getPendingAsks).mockResolvedValue([
      {
        id: "9db66302-6b7a-4b2e-96a2-b29887ad4d2d",
        kind: "created",
        entityId: "concept:sf1690:absolute-value",
        question: "Why does the sign change?",
        sourceUrl: "/courses/sf1690/concepts/absolute-value",
        createdAt: "2026-08-30T12:00:00.000Z",
        status: "pending",
      },
    ]);
    vi.mocked(cancelPendingAsk).mockRejectedValue(new Error("offline"));
    vi.mocked(createPendingAsk).mockRejectedValue(new Error("unused"));
    vi.mocked(setStudyStatus).mockRejectedValue(new Error("unused"));
    vi.mocked(undoStudyStatus).mockRejectedValue(new Error("unused"));

    render(
      <StudyActions
        entityId="concept:sf1690:absolute-value"
        sourceUrl="/courses/sf1690/concepts/absolute-value"
      />,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Cancel question" }));

    expect(await screen.findByText("Unable to cancel the question. Try again.")).toBeVisible();
    expect(screen.getByText("Why does the sign change?")).toBeVisible();
  });
});
