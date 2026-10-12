import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DeadlinesResponse } from "../../domain/api";
import { getDeadlines } from "../api";
import { HomePage } from "./HomePage";

vi.mock("../api", async (original) => ({ ...await original<typeof import("../api")>(), getDeadlines: vi.fn() }));
vi.mock("../format", async (original) => ({ ...await original<typeof import("../format")>(), currentStudyDate: () => "2026-10-13" }));

afterEach(() => { cleanup(); vi.clearAllMocks(); });

const data = {
  courses: [
    { id: "course:ie1204", code: "IE1204", title: "Digital Design" },
    { id: "course:sf1690", code: "SF1690", title: "Mathematics" },
  ],
  assessments: [
    { id: "assessment:ie1204:tena", courseId: "course:ie1204", slug: "tena", title: "Written exam", kind: "written-exam", date: "2026-10-19" },
    { id: "assessment:sf1690:ten1", courseId: "course:sf1690", slug: "ten1", title: "Written exam", kind: "written-exam", date: "2026-10-20" },
  ],
  sessions: [], coursework: [], sources: [],
} as unknown as DeadlinesResponse;

describe("homepage revision focus", () => {
  it("places working guide links before the schedule without removing search", async () => {
    vi.mocked(getDeadlines).mockResolvedValue(data);
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(await screen.findByRole("heading", { level: 1, name: "Exam preparation" })).toBeVisible();
    const guide = screen.getByRole("link", { name: /Digital Design/ });
    expect(guide).toHaveAttribute("href", "/courses/ie1204/exam");
    expect(screen.getByRole("link", { name: /Mathematics/ })).toHaveAttribute("href", "/courses/sf1690/exam");
    expect(guide.compareDocumentPosition(screen.getByRole("heading", { name: "Schedule" })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("searchbox", { name: "Search course material" })).toBeVisible();
  });
  it("returns to the weekly heading when no upcoming exams remain", async () => {
    vi.mocked(getDeadlines).mockResolvedValue({ ...data, assessments: [] });
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(await screen.findByRole("heading", { level: 1, name: "This week" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Revision guides" })).not.toBeInTheDocument();
  });
});
