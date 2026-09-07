import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { QuestionSchema } from "../../domain";
import { PracticePrompt } from "./PracticePrompt";
import { LabNotes } from "../pages/LabPage";
import { readLocalNotes } from "../useLocalNotes";

const question = QuestionSchema.parse({ id: "question:sf1690:test", courseId: "course:sf1690", slug: "test", title: "A question", body: "Find the root.", answer: "Set the expression to zero.", hints: ["Look for a factor."], lastChecked: "2026-09-07", confidence: "supported" });
afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks(); });

it("starts paper-first and restores optional reasoning, mistake and revisit choice", () => {
  const view = render(<PracticePrompt question={question} />);
  expect(screen.queryByLabelText("Work it out")).not.toBeInTheDocument();
  expect(screen.getByText("Optional mistake note").parentElement).not.toHaveAttribute("open");
  fireEvent.click(screen.getByRole("button", { name: "Write your reasoning" }));
  fireEvent.change(screen.getByLabelText("Work it out"), { target: { value: "My working" } });
  fireEvent.click(screen.getByLabelText("Revisit this question"));
  fireEvent.change(screen.getByLabelText("What would you do differently next time?"), { target: { value: "Check the domain" } });
  view.unmount();
  render(<PracticePrompt question={question} />);
  expect(screen.getByLabelText("Revisit this question")).toBeChecked();
  expect(screen.getByLabelText("What would you do differently next time?")).toHaveValue("Check the domain");
  fireEvent.click(screen.getByRole("button", { name: "Write your reasoning" }));
  expect(screen.getByLabelText("Work it out")).toHaveValue("My working");
  fireEvent.click(screen.getByRole("button", { name: "Show a hint" }));
  expect(screen.getByText("Look for a factor.")).toBeVisible();
});

it("does not turn generic concept text into a question hint", () => {
  render(<PracticePrompt question={{ ...question, hints: [] }} />);
  expect(screen.queryByRole("button", { name: "Show a hint" })).not.toBeInTheDocument();
});

it("keeps lab notes separate by session and warns if saving fails", () => {
  const view = render(<LabNotes labId="session:ie1204:lab1" />);
  fireEvent.change(screen.getByLabelText("What you tested"), { target: { value: "All four inputs" } });
  view.unmount();
  render(<LabNotes labId="session:ie1204:lab2" />);
  expect(screen.getByLabelText("What you tested")).toHaveValue("");
  vi.spyOn(localStorage, "setItem").mockImplementation(() => { throw new Error("Unavailable"); });
  fireEvent.change(screen.getByLabelText("Next action"), { target: { value: "Check wiring" } });
  expect(screen.getByRole("status")).toHaveTextContent("storage is unavailable");
  expect(screen.getByLabelText("Next action")).toHaveValue("Check wiring");
});

it("ignores malformed local data", () => {
  localStorage.setItem("broken", "{");
  localStorage.setItem("wrong", "[1,2]");
  expect(readLocalNotes("broken")).toEqual({});
  expect(readLocalNotes("wrong")).toEqual({});
});
