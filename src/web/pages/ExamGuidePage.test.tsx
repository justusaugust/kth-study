import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import type { ConceptResponse } from "../../domain/api";
import { getConcept } from "../api";
import { ExamGuidePage } from "./ExamGuidePage";

vi.mock("../api", () => ({ getConcept: vi.fn() }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });

it("renders the authored review without inventing a lecture date or forcing a visual", async () => {
  vi.mocked(getConcept).mockResolvedValue({
    course: { code: "SF1690" },
    concept: { title: "Lecture 16 — course review", summary: "Revisit the methods.", body: "## Functions\n\n[Practice](/practice?course=sf1690)" },
    sources: [],
  } as unknown as ConceptResponse);
  render(<MemoryRouter initialEntries={["/courses/sf1690/concepts/course-review"]}><Routes><Route path="/courses/:courseCode/concepts/course-review" element={<ExamGuidePage guideSlug="course-review" />} /></Routes></MemoryRouter>);
  expect(await screen.findByRole("heading", { name: "Lecture 16 — course review" })).toBeVisible();
  expect(getConcept).toHaveBeenCalledWith("sf1690", "course-review");
  expect(screen.getByText("Authored revision · Session date unconfirmed")).toBeVisible();
  expect(screen.getByRole("link", { name: "Exam guide" })).toHaveAttribute("href", "/courses/sf1690/exam");
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});

it("keeps missing review content recoverable through the owning course", async () => {
  vi.mocked(getConcept).mockRejectedValue(new Error("Missing guide"));
  render(<MemoryRouter><ExamGuidePage guideSlug="course-review" /></MemoryRouter>);
  expect(await screen.findByRole("heading", { name: "Course review unavailable" })).toBeVisible();
  expect(screen.getByRole("link", { name: "Open course" })).toBeVisible();
});
