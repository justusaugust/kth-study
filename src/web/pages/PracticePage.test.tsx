import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { QuestionSchema } from "../../domain";
import type { CourseResponse } from "../../domain/api";
import { getCourse, search } from "../api";
import { PracticePage } from "./PracticePage";

vi.mock("../api", () => ({ getCourse: vi.fn(), search: vi.fn() }));
afterEach(() => { cleanup(); localStorage.clear(); vi.resetAllMocks(); });

it("loads existing self-checks and filters the locally marked revisit queue", async () => {
  const question = QuestionSchema.parse({ id: "question:sf1690:test", courseId: "course:sf1690", slug: "test", title: "Root question", body: "Find a root", lastChecked: "2026-09-07", confidence: "supported" });
  vi.mocked(search).mockResolvedValue({ query: "", results: [{ id: "course:sf1690", entityType: "course", title: "Math", summary: "", url: "/courses/sf1690", score: 1, courseId: "course:sf1690" }] });
  vi.mocked(getCourse).mockResolvedValue({ course: { id: "course:sf1690", code: "SF1690" }, questions: [question] } as CourseResponse);
  render(<MemoryRouter><PracticePage /></MemoryRouter>);
  expect(await screen.findByRole("heading", { name: "Root question" })).toBeVisible();
  fireEvent.click(screen.getByLabelText("Revisit queue"));
  expect(screen.getByText(/No questions marked/)).toBeVisible();
  fireEvent.click(screen.getByLabelText("Revisit queue"));
  fireEvent.click(screen.getByLabelText("Revisit this question"));
  fireEvent.click(screen.getByLabelText("Revisit queue"));
  expect(screen.getByRole("heading", { name: "Root question" })).toBeVisible();
});

it("reports loading failure instead of an empty practice bank", async () => {
  vi.mocked(search).mockRejectedValue(new Error("Offline"));
  render(<MemoryRouter><PracticePage /></MemoryRouter>);
  expect(await screen.findByRole("alert")).toHaveTextContent("could not load");
});

it("pages without wrapping and resets the set when a custom course option is selected", async () => {
  vi.mocked(search).mockResolvedValue({ query: "", results: [{ id: "course:sf1690" }] } as never);
  vi.mocked(getCourse).mockResolvedValue({ course: { id: "course:sf1690", code: "SF1690" }, questions: Array.from({ length: 7 }, (_, index) => QuestionSchema.parse({ id: `question:sf1690:q${index}`, courseId: "course:sf1690", slug: `q${index}`, title: `Question ${index + 1}`, body: "Try it", lastChecked: "2026-09-07", confidence: "supported" })) } as CourseResponse);
  render(<MemoryRouter><PracticePage /></MemoryRouter>);
  expect(await screen.findByText("1–5")).toBeVisible();
  expect(screen.getByRole("button", { name: "Previous question set" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: /Next set/ }));
  expect(screen.getByText("6–7")).toBeVisible();
  expect(screen.queryByRole("heading", { name: "Question 1" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Next set/ })).toBeDisabled();
  fireEvent.click(screen.getByRole("combobox"));
  fireEvent.click(screen.getByRole("option", { name: "SF1690" }));
  expect(screen.getByText("1–5")).toBeVisible();
});

function mockStudyPack() {
  const question = (slug: string, conceptId: string) => QuestionSchema.parse({ id: `question:sf1690:${slug}`, courseId: "course:sf1690", slug, title: slug, body: "Work it out", conceptIds: [conceptId], lastChecked: "2026-09-07", confidence: "supported" });
  vi.mocked(search).mockResolvedValue({ query: "", results: [{ id: "course:sf1690", entityType: "course", title: "Math", summary: "", url: "/courses/sf1690", score: 1, courseId: "course:sf1690" }] });
  vi.mocked(getCourse).mockResolvedValue({
    course: { id: "course:sf1690", code: "SF1690" },
    questions: [question("covered-question", "concept:sf1690:roots"), question("direct-topic", "concept:sf1690:lines"), question("unrelated-question", "concept:sf1690:circles")],
    coursework: [{ slug: "mini-exam-01", title: "Mini-exam 1", description: "Lectures 1 and 2", conceptIds: ["concept:sf1690:lines"], lectureIds: [], sessionIds: ["session:sf1690:lecture-01", "session:sf1690:lecture-02"] }],
    sessions: [{ id: "session:sf1690:lecture-01", kind: "lecture", title: "Lecture 1", lectureId: "lecture:sf1690:lecture-01" }, { id: "session:sf1690:lecture-02", kind: "lecture", title: "Lecture 2" }],
    lectures: [{ id: "lecture:sf1690:lecture-01", slug: "lecture-01", title: "Lecture 1", conceptIds: ["concept:sf1690:roots"] }],
  } as unknown as CourseResponse);
}

it("limits a study pack to mapped topics and covered lectures, showing missing notes", async () => {
  mockStudyPack();
  render(<MemoryRouter initialEntries={["/practice?course=sf1690&work=mini-exam-01"]}><PracticePage /></MemoryRouter>);
  expect(await screen.findByRole("heading", { name: "Mini-exam 1", level: 1 })).toBeVisible();
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("link", { name: "SF1690 lectures" })).toHaveAttribute("href", "/courses/sf1690#course-lectures");
  expect(screen.queryByText("SF1690 · Course outline")).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "covered-question" })).toBeVisible();
  expect(screen.getByRole("heading", { name: "direct-topic" })).toBeVisible();
  expect(screen.queryByRole("heading", { name: "unrelated-question" })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Lecture 1" })).toHaveAttribute("href", "/courses/sf1690/lectures/lecture-01");
  expect(screen.getByText(/Some covered lecture notes/)).toHaveTextContent("Lecture 2");
});

it("does not silently replace an unknown study pack with all questions", async () => {
  mockStudyPack();
  render(<MemoryRouter initialEntries={["/practice?course=sf1690&work=missing"]}><PracticePage /></MemoryRouter>);
  expect(await screen.findByRole("alert")).toHaveTextContent("Study pack not found");
  expect(screen.queryByRole("heading", { name: "unrelated-question" })).not.toBeInTheDocument();
});
