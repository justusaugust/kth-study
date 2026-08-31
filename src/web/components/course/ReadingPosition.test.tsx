import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReadingPosition } from "./ReadingPosition";

afterEach(cleanup);

const sections = [
  { id: "course-passport", label: "Course passport" },
  { id: "week-ledger", label: "Week ledger" },
  { id: "course-sources", label: "Sources" },
];

function mountAnchors() {
  for (const id of [...sections.map((section) => section.id), "ledger-week-35"]) {
    const element = document.createElement("section");
    element.id = id;
    if (id === "ledger-week-35") {
      element.append(document.createElement("h3"));
    }
    document.body.append(element);
  }
}

beforeEach(() => {
  document.body.innerHTML = "";
  mountAnchors();
  Element.prototype.scrollIntoView = vi.fn();
});

describe("ReadingPosition", () => {
  it("collapses to a borderless active-section label", () => {
    render(<ReadingPosition sections={sections} currentWeek={35} />);

    const toggle = document.querySelector(
      ".reading-position__toggle",
    ) as HTMLButtonElement;
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveTextContent("Course passport");
    expect(document.querySelector(".reading-position__track")).toBeNull();
  });

  it("expands into section navigation with the current week as one destination", () => {
    render(<ReadingPosition sections={sections} currentWeek={35} />);

    fireEvent.click(
      document.querySelector(".reading-position__toggle") as HTMLButtonElement,
    );
    expect(
      document.querySelector(".reading-position__panel[data-open]"),
    ).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "This week · 35" }));
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    expect(
      document.querySelector(".reading-position__panel[data-open]"),
    ).toBeNull();
  });

  it("closes on Escape and returns focus to the toggle", () => {
    render(<ReadingPosition sections={sections} />);

    const toggle = document.querySelector(
      ".reading-position__toggle",
    ) as HTMLButtonElement;
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.queryByRole("button", { name: /This week/ }),
    ).not.toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("closes when pointing outside the instrument", () => {
    render(<ReadingPosition sections={sections} />);

    const toggle = document.querySelector(
      ".reading-position__toggle",
    ) as HTMLButtonElement;
    fireEvent.click(toggle);
    fireEvent.pointerDown(document.body);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
