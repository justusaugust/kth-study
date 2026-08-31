import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AtlasSelect } from "./AtlasSelect";

const options = [
  { value: "", label: "All courses" },
  { value: "IE1204", label: "IE1204", detail: "Digital Design" },
  { value: "SF1690", label: "SF1690", detail: "Basic Course in Mathematics" },
];

afterEach(cleanup);

function setup(value = "") {
  const onChange = vi.fn();
  render(<AtlasSelect label="Course" value={value} options={options} onChange={onChange} />);
  const trigger = screen.getByRole("combobox");
  return { onChange, trigger };
}

describe("AtlasSelect", () => {
  it("shows the option matching the current value without opening", () => {
    const { trigger } = setup("SF1690");

    expect(trigger).toHaveTextContent(/SF1690.*Basic Course in Mathematics/);
    expect(trigger.querySelector(".atlas-select-value-detail")).toHaveTextContent(
      "Basic Course in Mathematics",
    );
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens on ArrowDown, walks the list, and commits with Enter", () => {
    const { onChange, trigger } = setup();
    trigger.focus();

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    // The list opens on the current value, so one step lands on the second option.
    expect(trigger).toHaveAttribute("aria-activedescendant", screen.getAllByRole("option")[1].id);

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "ArrowUp" });
    fireEvent.keyDown(trigger, { key: "Enter" });

    expect(onChange).toHaveBeenCalledExactlyOnceWith("IE1204");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("jumps to the ends of the list with Home and End", () => {
    const { onChange, trigger } = setup();
    trigger.focus();

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "End" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith("SF1690");

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "Home" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith("");
  });

  it("abandons the pending choice on Escape and returns focus to the trigger", () => {
    const { onChange, trigger } = setup();
    trigger.focus();

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "Escape" });

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes without choosing when the pointer lands outside", () => {
    const { onChange, trigger } = setup();

    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("selects on click and hands focus back to the trigger", () => {
    const { onChange, trigger } = setup();

    fireEvent.click(trigger);
    fireEvent.click(
      screen.getByRole("option", { name: /SF1690.*Basic Course in Mathematics/ }),
    );

    expect(onChange).toHaveBeenCalledExactlyOnceWith("SF1690");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("names the control and marks the chosen option for assistive tech", () => {
    const { trigger } = setup("IE1204");

    expect(screen.getByText("Course").id).toBeTruthy();
    expect(trigger.getAttribute("aria-labelledby")).toContain(screen.getByText("Course").id);

    fireEvent.click(trigger);
    expect(screen.getByRole("option", { name: /IE1204.*Digital Design/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("option", { name: "All courses" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });
});
